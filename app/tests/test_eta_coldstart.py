"""ETA 콜드 스타트 회귀 테스트.

엔진이 새로 뜨고 첫 클론은 TTS 모델 로드(수십 초)를 포함하는데, RTF 기반 추정엔
그 1회성 비용이 없어 과소추정됐다. 이제 모델이 아직 warm이 아니면 cold_start를
더하고, 콜드 실행의 소요시간이 warm RTF를 오염시키지 않게 분리 학습한다.
"""

from api import rates, storage


def _isolate(tmp):
    storage.configure(home=str(tmp))
    rates._WARM.clear()   # 프로세스 warm 상태 초기화


def test_cold_estimate_is_larger_than_warm(tmp_path):
    _isolate(tmp_path)
    text = "안녕하세요 " * 20
    warm = rates.estimate_clone_eta(text, warm=True)
    cold = rates.estimate_clone_eta(text, warm=False)
    assert cold - warm == round(rates.get_rates()["cold_start"])


def test_warmth_tracking(tmp_path):
    _isolate(tmp_path)
    assert not rates.is_warm(fast=False)
    rates.mark_warm(fast=False)
    assert rates.is_warm(fast=False)
    # fast/best are tracked independently
    assert not rates.is_warm(fast=True)


def test_default_is_warm(tmp_path):
    # Callers that don't care (regen) get a warm estimate by default.
    _isolate(tmp_path)
    text = "테스트 문장입니다 " * 5
    assert rates.estimate_clone_eta(text) == rates.estimate_clone_eta(text, warm=True)


def test_english_text_falls_back_to_char_estimate(tmp_path):
    _isolate(tmp_path)
    # No Hangul: uses a char-based syllable estimate rather than zero.
    eta = rates.estimate_clone_eta("This is an English script.", warm=True)
    assert eta > round(rates.get_rates()["align_overhead"])
