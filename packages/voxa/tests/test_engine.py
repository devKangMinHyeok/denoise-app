"""voxa 엔진 단위 테스트 — 앱 없이 라이브러리만으로 검증 (모델 다운로드 없음).

`cd packages/voxa && uv run --extra eval pytest` 로 독립 실행된다.
"""
import pytest

from voxa.analysis.metrics import (GATES, SIM_HUMAN_BASELINE, check_gates,
                                   normalize_ko, voice_clone_score)
from voxa.analysis.prosody import (band_score, cliff_score, dynamics_score,
                                   prosody_naturalness_score, word_drop_score)
from voxa.denoise import build_audio_filter
from voxa.media.audio import audio_codec_args, normalize_gain_db


# ---- 노이즈 제거 필터 체인 ----

def test_filter_chain_basic():
    af = build_audio_filter()
    assert af.startswith("aformat=channel_layouts=mono")
    assert "arnndn=m=" in af


def test_filter_chain_boost():
    assert build_audio_filter(boost=13).endswith(",volume=13dB")


def test_codec_args():
    assert audio_codec_args(".wav") == ["-c:a", "pcm_s16le"]
    assert audio_codec_args(".mov") == ["-c:a", "aac", "-b:a", "192k"]


def test_normalize_gain_peak_ceiling():
    assert normalize_gain_db(-30.0, -1.5) == pytest.approx(0.0)


# ---- 품질 지표 (VCS 북극성) ----

def test_vcs_perfect_score():
    assert voice_clone_score(SIM_HUMAN_BASELINE, 0.0, 5.0) == pytest.approx(100.0)


def test_vcs_monotonic_in_cer():
    assert voice_clone_score(0.9, 0.0, 3.5) > voice_clone_score(0.9, 10.0, 3.5)


def test_normalize_ko_strips_punct():
    assert normalize_ko("안녕하세요, 반갑습니다!") == "안녕하세요반갑습니다"


def test_gates_reject_low_pns():
    ok, failures = check_gates({"sim": 0.92, "cer": 0.0, "mos": 3.5,
                                "vcs": 92.0, "pns": 70.0})
    assert not ok and any("PNS" in f for f in failures)


# ---- 운율 (PNS 구성요소) ----

def test_pns_perfect():
    assert prosody_naturalness_score(
        5.0, {"f0": 1, "pause": 1, "rhythm": 1}) == pytest.approx(100.0)


def test_band_score_penalizes_both_ways():
    assert band_score(3.0, 1.0) < 0.5
    assert band_score(0.0, 1.0) == 0.0


def test_dynamics_asymmetric():
    assert dynamics_score(0.65, 1.0) < dynamics_score(1.5, 1.0) == 1.0


def test_cliff_and_word_drop_catch_defects():
    assert cliff_score(-17.0, -7.8) < 0.9        # 끝음 급락 감점
    assert word_drop_score([0.2, 0.3, 2.7, 3.8, 0.7]) < 0.6  # 어미 낙하 감점
    assert word_drop_score([]) == 1.0            # 데이터 없으면 만점
