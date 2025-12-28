# Design Decisions

## Why kind instead of EKS?
- Cost-effective for learning
- Fast feedback loop
- Same Kubernetes primitives as cloud

## Why Docker images over hostPath?
- Portable
- Production-aligned
- CI/CD friendly

## Why readiness & liveness probes?
- Prevent traffic to unhealthy Pods
- Enable self-healing without manual intervention

## Why resource limits?
- Protect cluster stability
- Enable predictable autoscaling

## Why HPA?
- Automatically adapt to load
- Demonstrate real production behavior
