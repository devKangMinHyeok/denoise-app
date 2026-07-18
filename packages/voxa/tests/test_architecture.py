"""voxa 엔진 완결성 테스트 — 라이브러리가 어떤 앱/프레임워크에도 독립적임을 강제.

이 패키지는 그 자체로 완결적이어야 한다:
1. 웹 프레임워크(flask)나 CLI 파서(argparse)를 몰라야 한다.
2. 표준 출력(print)으로 UX를 하지 않는다 — 호출한 쪽이 UX를 담당.
3. 특정 앱(api·voice·cli 등)을 절대 import하지 않는다 (역방향 의존 금지).
"""
import os
import re

import voxa

# 패키지 루트(= voxa/) 아래 모든 소스
PKG = os.path.dirname(os.path.abspath(voxa.__file__))


def sources():
    for root, _dirs, files in os.walk(PKG):
        if "__pycache__" in root:
            continue
        for fn in files:
            if fn.endswith(".py"):
                yield os.path.join(root, fn)


def test_engine_is_framework_free():
    for path in sources():
        src = open(path, encoding="utf-8").read()
        rel = os.path.relpath(path, PKG)
        assert "flask" not in src.lower(), f"{rel}: 엔진은 웹 프레임워크를 모른다"
        assert "argparse" not in src, f"{rel}: CLI 파싱은 앱 계층 몫"
        assert not re.search(r"^\s*print\(", src, re.M), \
            f"{rel}: 엔진에 print 금지 (UX는 앱 계층 몫)"


def test_engine_never_imports_an_app():
    # 엔진은 자신을 붙여 쓰는 어떤 앱도 알아선 안 된다.
    for path in sources():
        src = open(path, encoding="utf-8").read()
        rel = os.path.relpath(path, PKG)
        for banned in ("from api", "import api", "from voice", "import voice",
                       "from web", "import web", "import flask"):
            assert banned not in src, f"{rel}: 엔진 → 앱 계층 역방향 의존 금지 ({banned})"


def test_bundled_models_present():
    # 엔진은 자기 데이터(모델)를 스스로 들고 다닌다 → 어디 설치돼도 자립.
    assert os.path.isfile(os.path.join(PKG, "models", "rnnoise-sh.rnnn"))
