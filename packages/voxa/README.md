# voxa

로컬 음성 엔진 — **보이스 클로닝 · 노이즈 제거 · 품질 지표**를 한 라이브러리로.
앱·프레임워크에 독립적인 **완결형 패키지**라, 어떤 제품에도 그대로 붙일 수 있다.
(Apple Silicon 우선 — mlx 기반 클로닝; 타 OS에서는 노이즈 제거·지표만 활성)

## 왜 별도 패키지인가

- **자기완결**: 자신이 쓰는 의존성(numpy·torch·mlx·librosa…)과 **모델(rnnoise·dnsmos)**을
  스스로 들고 다닌다. 경로도 패키지 기준(`__file__`)이라 **어디에 설치돼도 작동**한다.
- **앱을 모른다**: flask·CLI·MCP 같은 앱 계층을 import하지 않는다. 경계는
  `tests/test_architecture.py`가 CI에서 강제한다.
- **재사용**: Vocast 앱은 이 엔진을 path 의존성으로 가져다 쓸 뿐이다. 다른 제품도 동일.

## 관심사별 구조

```
voxa/
├── media/      audio(ffmpeg 래퍼) · ffbin(바이너리 리졸버)
├── denoise/    denoise 파이프라인 + dfn·resynth 워커
├── clone/      clone 파이프라인 + tts 워커
├── analysis/   metrics(SIM/CER/MOS/VCS 게이트) · prosody(운율/PNS)
└── models/     rnnoise-sh.rnnn · dnsmos onnx (동봉)
```

## 공개 API (예)

```python
from voxa.denoise import run_denoise           # 파일 노이즈 제거
from voxa.clone import clone_voice, clone_available   # 보이스 클로닝
from voxa.analysis.metrics import check_gates   # 품질 게이트
```

## 설치 / 테스트

```bash
# 다른 프로젝트에 붙이기 (모노레포 밖이면 경로/버전으로)
uv pip install -e packages/voxa            # 또는  voxa[eval] (DNSMOS·CER 평가까지)

# 엔진 단독 테스트
cd packages/voxa && uv run --extra eval pytest -q
```

DFN·재합성(resemble-enhance) 엔진은 의존성 충돌 때문에 전용 venv로 분리 설치한다
(`packaging/scripts/install_dfn.sh`, `install_resynth.sh`) — 없으면 RNNoise로 폴백.
