"""작업의 음성이 어떤 언어인지.

Whisper 는 언어를 지정받아야 하고, 틀린 언어를 강제하면 전사가 잡음이 된다.
그 전사는 클론이 학습하는 참조 텍스트이자 가라오케 워드 타임라인의 원본이라,
언어가 어긋나면 품질이 통째로 무너진다.

각 작업이 시작할 때 한 번 설정하고, 분석 계층은 여기서 읽는다. contextvars 라
한국어 렌더와 영어 렌더가 동시에 돌아도 서로 섞이지 않는다 (스레드마다 독립).
"""
import contextvars

DEFAULT = "ko"
SUPPORTED = ("ko", "en")

_lang = contextvars.ContextVar("voxa_speech_language", default=DEFAULT)


def set_speech_language(code):
    """이 작업이 다루는 음성의 언어를 지정한다. 모르는 값이면 기본값."""
    _lang.set(code if code in SUPPORTED else DEFAULT)


def speech_language():
    """현재 작업의 음성 언어 (Whisper 에 넘길 코드)."""
    return _lang.get()
