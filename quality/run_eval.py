#!/usr/bin/env python3
"""보이스 클로닝 품질 회귀 평가 (CI 품질 게이트의 본체).

픽스처 목소리(tests/fixtures/ref_fixture.wav — AI 생성, 권리 문제 없음)로
테스트 대본 세트(quality/testset.txt)를 낭독 생성하고, 지표로 채점한 뒤
게이트(core.metrics.GATES) 미달이면 종료 코드 1 → CI 실패.

사용:
  python3 quality/run_eval.py                # 기본 모델 (1.7B)
  python3 quality/run_eval.py --fast         # CI용 (0.6B, 빠름)
  python3 quality/run_eval.py --report r.json
"""
import argparse
import json
import os
import statistics
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, ROOT)

from core.clone import prepare_reference, synthesize  # noqa: E402
from core.metrics import GATES, check_gates, evaluate_clone, voice_clone_score  # noqa: E402

FIXTURE = os.path.join(ROOT, "tests", "fixtures", "ref_fixture.wav")
TESTSET = os.path.join(HERE, "testset.txt")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--fast", action="store_true", help="0.6B 모델 사용 (CI 기본)")
    ap.add_argument("--report", help="JSON 리포트 저장 경로")
    ap.add_argument("--no-gate", action="store_true", help="게이트 실패해도 종료코드 0")
    args = ap.parse_args()

    scripts = [line.strip() for line in open(TESTSET, encoding="utf-8")
               if line.strip()]
    results = []

    with tempfile.TemporaryDirectory() as wd:
        print("· 픽스처 참조 준비 (노이즈 제거 + 받아쓰기)…")
        ref_wav, ref_text = prepare_reference(FIXTURE, wd)
        for i, script in enumerate(scripts, 1):
            out = os.path.join(wd, f"gen_{i}.wav")
            print(f"· [{i}/{len(scripts)}] 생성: {script[:30]}…")
            synthesize(script, ref_wav, ref_text, out, fast=args.fast)
            r = evaluate_clone(ref_wav, script, out)
            r["script"] = script
            results.append(r)

    agg = {k: statistics.mean(r[k] for r in results)
           for k in ("sim", "cer", "mos")}
    agg["vcs"] = voice_clone_score(agg["sim"], agg["cer"], agg["mos"])
    ok, failures = check_gates(agg)

    hdr = f"{'#':<3} {'SIM':>6} {'CER%':>6} {'MOS':>5} {'VCS':>6}  script"
    print("\n" + hdr)
    print("-" * 60)
    for i, r in enumerate(results, 1):
        print(f"{i:<3} {r['sim']:6.3f} {r['cer']:6.1f} {r['mos']:5.2f} "
              f"{r['vcs']:6.1f}  {r['script'][:28]}…")
    print("-" * 60)
    print(f"평균  SIM {agg['sim']:.3f} | CER {agg['cer']:.1f}% | "
          f"MOS {agg['mos']:.2f} | VCS(북극성) {agg['vcs']:.1f}")
    print(f"게이트 {GATES} → {'✅ 통과' if ok else '❌ 실패: ' + '; '.join(failures)}")

    if args.report:
        with open(args.report, "w", encoding="utf-8") as f:
            json.dump({"aggregate": agg, "gates": GATES, "pass": ok,
                       "failures": failures, "results": results},
                      f, ensure_ascii=False, indent=2)
        print(f"리포트 저장: {args.report}")

    if not ok and not args.no_gate:
        sys.exit(1)


if __name__ == "__main__":
    main()
