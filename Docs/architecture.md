# Platform Engineering Lab – Architecture

This project demonstrates a production-style Kubernetes application deployed on a local kind cluster.

## Components

- **Node.js Application**
  - Exposes `/` for UI
  - `/health` for Kubernetes probes
  - `/load` for HPA testing

- **Deployment**
  - Manages Pod lifecycle
  - Enables self-healing and rolling updates

- **Service**
  - Provides a stable network endpoint
  - Routes traffic to healthy Pods only

- **Probes**
  - Readiness: controls traffic flow
  - Liveness: enables automatic restarts

- **HPA**
  - Scales Pods based on CPU utilization

## High-level Flow

Client → Service → Pod → Container

Pods are ephemeral. Services provide stability.
