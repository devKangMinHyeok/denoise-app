#!/usr/bin/env python3
"""보이스 클로닝 결과물 채점 CLI. (지표 로직은 core/metrics.py)

사용: python3 voice/evaluate_tts.py <참조음성.wav> <대본.txt> <생성본1.wav> [...]
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from core.analysis.metrics import evaluate_clone  # noqa: E402


def main():
    if len(sys.argv) < 4:
        sys.exit(__doc__)
    ref, script_path, gens = sys.argv[1], sys.argv[2], sys.argv[3:]
    script = open(script_path, encoding="utf-8").read().strip()

    hdr = f"{'file':<34} {'SIM':>6} {'CER%':>6} {'MOS':>5} {'VCS':>6}"
    print(f"reference: {os.path.basename(ref)}\n{hdr}\n" + "-" * len(hdr))
    for g in gens:
        r = evaluate_clone(ref, script, g)
        print(f"{os.path.basename(g):<34} {r['sim']:6.3f} {r['cer']:6.1f} "
              f"{r['mos']:5.2f} {r['vcs']:6.1f}")
        print(f"   받아쓰기: {r['transcript']}")


if __name__ == "__main__":
    main()
