"""앱 계층 아키텍처 경계 테스트 — 계층 규칙을 CI에서 강제한다.

규칙: 앱 계층(cli/denoise.py, voice/clone_say.py, api/server.py)은
ffmpeg/모델을 직접 만지지 않는다 — subprocess 금지, voxa 엔진 호출만.

(엔진 자체의 완결성·순수성 검사는 packages/voxa/tests/test_architecture.py 소관.)
"""
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

APP_LAYER = ["cli/denoise.py", "voice/clone_say.py", "api/server.py",
             "api/profiles.py", "api/dnjobs.py"]


def read(rel):
    with open(os.path.join(ROOT, rel), encoding="utf-8") as f:
        return f.read()


def test_app_layer_never_touches_subprocess_or_ffmpeg():
    for rel in APP_LAYER:
        src = read(rel)
        assert "import subprocess" not in src, f"{rel}: 앱 계층에서 subprocess 금지"
        assert not re.search(r'"ffmpeg"|\'ffmpeg\'', src), \
            f"{rel}: 앱 계층에서 ffmpeg 직접 호출 금지 (voxa를 쓸 것)"
        assert "arnndn" not in src, f"{rel}: 필터 체인은 voxa.denoise 소관"
        assert "mlx_audio" not in src, f"{rel}: 모델 실행은 voxa.clone 소관"


def test_app_layer_uses_voxa_engine():
    for rel in APP_LAYER:
        assert "from voxa" in read(rel), f"{rel}: 처리는 voxa 엔진을 통해서만"
