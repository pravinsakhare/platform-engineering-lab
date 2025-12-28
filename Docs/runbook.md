# Runbook – Local Setup

## Prerequisites
- Docker Desktop
- kind
- kubectl

## Build and Deploy
```bash
docker build -t node-app:1.1 ./app
kind load docker-image node-app:1.1 --name platform-lab
kubectl apply -f k8s/

Access Application
kubectl port-forward svc/node-app 8080:80 -n platform-dev


Open http://localhost:8080

Debugging

Check Pods: kubectl get pods -n platform-dev

Logs: kubectl logs -l app=node-app -n platform-dev

Metrics: kubectl top pods -n platform-dev