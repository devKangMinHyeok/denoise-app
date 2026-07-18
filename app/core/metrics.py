"""품질 평가 지표 모듈.

결과물 평가지표 3종:
- SIM : 화자 유사도 (0~1). 스피커 임베딩 코사인. 참조 목소리와 같은 사람처럼 들리는가.
- CER : 글자 오류율 (%). Whisper 받아쓰기를 대본과 대조. 발음이 뭉개지면 올라감.
- MOS : DNSMOS OVRL (1~5). 오디오 자연스러움.

북극성 지표 (North Star): VCS (Voice Clone Score, 0~100)
  VCS = 100 × (0.5·min(SIM/SIM_HUMAN, 1) + 0.3·(1−min(CER,100)/100) + 0.2·MOS/5)
  - SIM_HUMAN = 0.909 : "본인 육성끼리 비교했을 때의 유사도" 실측 기준선.
    → SIM 항이 1.0이라는 건 '본인이 딴 날 말한 것만큼 같은 목소리'라는 뜻.
  - 하나의 숫자로 릴리스 간 품질 추이를 추적한다. 참고용 현재 수준: 약 91점.

합격 게이트 (CI에서 이 기준 미달이면 실패):
  SIM ≥ 0.85, CER ≤ 3%, MOS ≥ 3.0, VCS ≥ 85
  (CI는 빠른 0.6B 모델 + 합성 픽스처 목소리로 돌므로 실사용 수치보다 보수적으로 잡음)
"""
import math
import os
import re
import urllib.request

from . import DNSMOS_MODEL

SIM_HUMAN_BASELINE = 0.909

GATES = {"sim": 0.85, "cer": 3.0, "mos": 3.0, "vcs": 85.0,
         "pns": 82.0}  # 운율 북극성 (평균). 항목별 최저는 PNS_ITEM_MIN.
PNS_ITEM_MIN = 78.0  # 테스트 항목 하나라도 이 밑이면 실패

DNSMOS_URL = ("https://github.com/microsoft/DNS-Challenge/raw/master/"
              "DNSMOS/DNSMOS/sig_bak_ovr.onnx")

_p_ovr = [-0.06766283, 1.11546468, 0.04602535]
_p_sig = [-0.08397278, 1.22083953, 0.0052439]
_p_bak = [-0.13166888, 1.60915514, -0.39604546]


def _poly(c, x):
    return c[0] * x * x + c[1] * x + c[2]


def normalize_ko(text):
    """한국어 CER용 정규화: 공백·문장부호 제거, 소문자화."""
    return re.sub(r"[^\w]", "", text, flags=re.UNICODE).lower()


def ensure_dnsmos_model():
    if not os.path.exists(DNSMOS_MODEL):
        os.makedirs(os.path.dirname(DNSMOS_MODEL), exist_ok=True)
        urllib.request.urlretrieve(DNSMOS_URL, DNSMOS_MODEL)
    return DNSMOS_MODEL


def speaker_similarity(ref_wav, gen_wav):
    """SIM: 스피커 임베딩(목소리 지문) 코사인 유사도."""
    import numpy as np
    from resemblyzer import VoiceEncoder, preprocess_wav
    enc = VoiceEncoder(verbose=False)
    a = enc.embed_utterance(preprocess_wav(ref_wav))
    b = enc.embed_utterance(preprocess_wav(gen_wav))
    return float(np.dot(a, b))


def char_error_rate(script_text, gen_wav, whisper_repo=None):
    """CER(%): Whisper 받아쓰기를 대본과 대조."""
    import jiwer
    from . import mlx_transcribe
    from .clone import WHISPER
    hyp = mlx_transcribe(
        gen_wav, path_or_hf_repo=whisper_repo or WHISPER, language="ko")["text"]
    return jiwer.cer(normalize_ko(script_text), normalize_ko(hyp)) * 100, hyp


def dnsmos(wav_path):
    """DNSMOS P.835 → (SIG, BAK, OVRL)."""
    import librosa
    import numpy as np
    import onnxruntime as ort
    sess = ort.InferenceSession(ensure_dnsmos_model(),
                                providers=["CPUExecutionProvider"])
    sr = 16_000
    audio, _ = librosa.load(wav_path, sr=sr, mono=True)
    seg_len = int(9.01 * sr)
    if len(audio) < seg_len:
        audio = np.tile(audio, math.ceil(seg_len / len(audio)))[:seg_len]
    num_hops = int(np.floor(len(audio) / sr) - 9.01) + 1
    name = sess.get_inputs()[0].name
    sigs, baks, ovrs = [], [], []
    for i in range(max(num_hops, 1)):
        seg = audio[int(i * sr): int(i * sr) + seg_len]
        if len(seg) < seg_len:
            break
        raw = sess.run(None, {name: seg.astype(np.float32)[np.newaxis, :]})[0][0]
        sigs.append(_poly(_p_sig, raw[0]))
        baks.append(_poly(_p_bak, raw[1]))
        ovrs.append(_poly(_p_ovr, raw[2]))
    return (float(np.mean(sigs)), float(np.mean(baks)), float(np.mean(ovrs)))


def voice_clone_score(sim, cer, mos):
    """북극성 지표 VCS (0~100). 순수 함수 — 유닛 테스트 대상."""
    sim_term = min(sim / SIM_HUMAN_BASELINE, 1.0)
    cer_term = 1.0 - min(max(cer, 0.0), 100.0) / 100.0
    mos_term = min(max(mos, 1.0), 5.0) / 5.0
    return 100.0 * (0.5 * sim_term + 0.3 * cer_term + 0.2 * mos_term)


def check_gates(scores, gates=GATES):
    """게이트 판정. scores: {'sim','cer','mos','vcs'[,'pns']} → (통과, 실패목록)."""
    failures = []
    if scores["sim"] < gates["sim"]:
        failures.append(f"SIM {scores['sim']:.3f} < {gates['sim']}")
    if scores["cer"] > gates["cer"]:
        failures.append(f"CER {scores['cer']:.1f}% > {gates['cer']}%")
    if scores["mos"] < gates["mos"]:
        failures.append(f"MOS {scores['mos']:.2f} < {gates['mos']}")
    if scores["vcs"] < gates["vcs"]:
        failures.append(f"VCS {scores['vcs']:.1f} < {gates['vcs']}")
    if "pns" in scores and scores["pns"] < gates["pns"]:
        failures.append(f"PNS {scores['pns']:.1f} < {gates['pns']}")
    return (not failures), failures


def evaluate_clone(ref_wav, script_text, gen_wav, natural_wav=None):
    """생성물 종합 평가 → 지표 dict (북극성 VCS·PNS 포함).

    natural_wav: 운율 기준이 될 화자의 자연 발화 (없으면 ref_wav 사용).
    """
    from .prosody import evaluate_prosody
    sim = speaker_similarity(ref_wav, gen_wav)
    cer, hyp = char_error_rate(script_text, gen_wav)
    sig, bak, ovrl = dnsmos(gen_wav)
    vcs = voice_clone_score(sim, cer, ovrl)
    pro = evaluate_prosody(natural_wav or ref_wav, gen_wav, script=script_text)
    return {"sim": sim, "cer": cer, "sig": sig, "mos": ovrl,
            "vcs": vcs, "pns": pro["pns"], "utmos": pro["utmos"],
            "bpa": pro["bpa"], "prosody_match": pro["match"],
            "transcript": hyp.strip()}
