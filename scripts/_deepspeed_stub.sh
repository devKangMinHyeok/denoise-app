#!/bin/bash
# resemble-enhance 추론용 deepspeed 최소 스텁 설치 ($1 = 대상 venv 경로).
# deepspeed는 학습 경로에서만 실제로 쓰이고 Mac에 설치되지 않으므로,
# 추론이 참조하는 심볼만 스텁으로 채운다. (install_resynth·build_bundle 공용)
set -e
SP="$("$1/bin/python" -c "import site; print(site.getsitepackages()[0])")"
mkdir -p "$SP/deepspeed/accelerator" "$SP/deepspeed/runtime" "$SP/deepspeed/ops/adam"
cat > "$SP/deepspeed/__init__.py" <<'EOF'
"""추론용 스텁 — resemble-enhance는 학습 경로에서만 deepspeed를 실제로 쓴다."""
class DeepSpeedConfig:
    def __init__(self, *a, **k): pass
def init_distributed(*a, **k):
    raise RuntimeError("deepspeed stub: 학습은 지원하지 않습니다")
def initialize(*a, **k):
    raise RuntimeError("deepspeed stub: 학습은 지원하지 않습니다")
EOF
cat > "$SP/deepspeed/accelerator/__init__.py" <<'EOF'
class _CPUAccel:
    def communication_backend_name(self): return "gloo"
    def device_name(self, *a): return "cpu"
def get_accelerator(): return _CPUAccel()
EOF
: > "$SP/deepspeed/runtime/__init__.py"
cat > "$SP/deepspeed/runtime/engine.py" <<'EOF'
class DeepSpeedEngine:
    def __init__(self, *a, **k):
        raise RuntimeError("deepspeed stub: 학습은 지원하지 않습니다")
EOF
cat > "$SP/deepspeed/runtime/utils.py" <<'EOF'
def clip_grad_norm_(*a, **k):
    raise RuntimeError("deepspeed stub")
EOF
: > "$SP/deepspeed/ops/__init__.py"
cat > "$SP/deepspeed/ops/adam/__init__.py" <<'EOF'
class FusedAdam:
    def __init__(self, *a, **k):
        raise RuntimeError("deepspeed stub")
EOF
"$1/bin/python" -c "from resemble_enhance.enhancer.inference import enhance" \
  && echo "resemble-enhance OK"
