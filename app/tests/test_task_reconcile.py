"""서버 시작 시 유령 작업 정리(reconcile_interrupted) 회귀 테스트.

이전 실행이 진행 중(preparing/generating/running)인 채로 죽으면 그 상태가 저장소에
남아, /api/tasks가 영원히 '진행 중'으로 보고한다(맥 앱 상단의 유령 'Rendering %').
서버가 새로 뜨면 진행 중인 작업이 있을 수 없으므로, 시작 시 그런 작업을 '중단됨'
오류로 정리한다.
"""

from api import storage


def _seed(tmp):
    storage.configure(home=str(tmp))
    # 진행 중인 채로 죽은 작업들 + 정상 종료된 작업(건드리면 안 됨)
    storage.store.write_doc("history", "stuck_clone", {
        "id": "stuck_clone", "kind": "clone", "status": "preparing",
        "stage": "reference", "created": "2026-07-21 07:59"})
    storage.store.write_doc("history", "done_clone", {
        "id": "done_clone", "kind": "clone", "status": "done",
        "stage": "done", "created": "2026-07-20 08:34"})
    storage.store.write_doc("history", "errored", {
        "id": "errored", "kind": "profile_build", "status": "error",
        "error": "No module named 'sklearn'", "created": "2026-07-20 08:24"})
    storage.store.write_doc("denoise", "stuck_dn", {
        "id": "stuck_dn", "status": "running", "stage": "extract",
        "created": "2026-07-21 07:00"})


def test_reconcile_marks_stuck_jobs_interrupted(tmp_path):
    from api import profiles, dnjobs
    _seed(tmp_path)

    n = profiles.reconcile_interrupted() + dnjobs.reconcile_interrupted()
    assert n == 2  # stuck_clone + stuck_dn

    stuck = storage.store.read_doc("history", "stuck_clone")
    assert stuck["status"] == "error"
    assert stuck["error"] == "interrupted"

    dn = storage.store.read_doc("denoise", "stuck_dn")
    assert dn["status"] == "error"
    assert dn["error"] == "interrupted"


def test_reconcile_leaves_terminal_jobs_untouched(tmp_path):
    from api import profiles, dnjobs
    _seed(tmp_path)
    profiles.reconcile_interrupted()
    dnjobs.reconcile_interrupted()

    done = storage.store.read_doc("history", "done_clone")
    assert done["status"] == "done"

    # 기존 오류는 원래 메시지를 유지한다(덮어쓰지 않음).
    errored = storage.store.read_doc("history", "errored")
    assert errored["status"] == "error"
    assert errored["error"] == "No module named 'sklearn'"


def test_reconcile_is_idempotent(tmp_path):
    from api import profiles, dnjobs
    _seed(tmp_path)
    profiles.reconcile_interrupted()
    dnjobs.reconcile_interrupted()
    # 두 번째 실행에는 진행 중인 작업이 남아있지 않다.
    again = profiles.reconcile_interrupted() + dnjobs.reconcile_interrupted()
    assert again == 0
