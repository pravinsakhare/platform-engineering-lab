# Platform Engineering Lab 🚀

**Production-Style Kubernetes Application with CI/CD Pipeline**

This repository demonstrates a **production-ready Kubernetes application** built with **Node.js**, **Docker**, **Kubernetes**, and **GitHub Actions CI/CD**. The focus is on **platform engineering concepts** and **automated deployment workflows**, not frontend complexity.

![Application Demo](https://github.com/user-attachments/assets/71404dd7-6ded-40e5-aa3b-a435df0a94f1)

---

## 🧠 Project Goals

- Understand **how Kubernetes actually works**, not just YAML syntax
- Build a realistic local platform without cloud costs
- Learn platform behaviors: probes, scaling, rollouts, and self-healing
- Implement **automated CI/CD pipeline** with GitHub Actions
- Practice **GitOps principles** with automated manifest updates
- Follow clean Git and documentation practices

---

## 🏗️ Architecture Overview

```
Developer Push
      ↓
GitHub Actions CI/CD
      ↓
Docker Build & Push
      ↓
Update K8s Manifest
      ↓
Git Commit & Push
      ↓
Service (stable endpoint)
      ↓
Deployment (desired state)
      ↓
Pods (ephemeral workloads)
      ↓
Node.js Container
```

**Key Concepts:**
- **CI/CD Pipeline** automates build, push, and deployment
- **GitOps Workflow** keeps infrastructure as code in Git
- **Pods** are ephemeral and disposable
- **Services** provide stable networking endpoints
- **Deployments** enforce desired state and enable rolling updates
- **HPA** adjusts replica count automatically based on metrics

---

## ⚙️ Tech Stack

- **Node.js (Express)** - Application runtime
- **Docker** - Containerization
- **Docker Hub** - Container registry
- **GitHub Actions** - CI/CD automation
- **Kubernetes (kind)** - Local cluster orchestration
- **kubectl** - Cluster management
- **Metrics Server** - Resource metrics collection
- **Horizontal Pod Autoscaler (HPA)** - Auto-scaling

---

## ✨ Key Features

### CI/CD Pipeline
- **Automated Docker builds** on every push to main branch
- **Multi-tag strategy** (latest + git SHA for versioning)
- **Automatic manifest updates** with new image tags
- **GitOps workflow** with automated commits
- **Docker Hub integration** for container registry

### Application Layer
- Minimal Node.js app with clean, functional UI
- `/health` endpoint for Kubernetes liveness and readiness probes
- `/load` endpoint to simulate CPU load for autoscaling demos
- Real-time Pod name display (demonstrates load balancing)

### Kubernetes Layer
- **Deployment** for self-healing and zero-downtime rollouts
- **Service** for stable networking and load balancing
- **Readiness & Liveness Probes** for intelligent health checks
- **Resource Requests & Limits** for predictable scheduling
- **Horizontal Pod Autoscaler (HPA)** for CPU-based scaling
- **Namespace isolation** for environment separation

---

## 📁 Repository Structure

```
.
├── .github/
│   └── workflows/
│       └── docker-build.yaml    # CI/CD pipeline definition
│
├── app/
│   ├── index.js                 # Express application
│   ├── package.json             # Node.js dependencies
│   └── Dockerfile               # Container image definition
│
├── k8s/
│   ├── namespace.yaml           # Isolated environment
│   └── node-app/
│       ├── deployment.yaml      # Pod template & strategy
│       ├── service.yaml         # Stable networking
│       └── hpa.yaml             # Autoscaling rules
│
├── Docs/
│   ├── architecture.md          # System design decisions
│   ├── decisions.md             # Technical trade-offs
│   └── runbook.md               # Operational procedures
│
└── README.md                    # This file
```

---

## 🔄 CI/CD Pipeline

### Pipeline Workflow

The GitHub Actions pipeline automatically:

1. **Triggers** on every push to the `main` branch
2. **Checks out** the repository code
3. **Authenticates** with Docker Hub using secrets
4. **Builds** the Docker image from `./app`
5. **Tags** the image with both `latest` and the git commit SHA
6. **Pushes** both tags to Docker Hub
7. **Updates** the Kubernetes deployment manifest with the new image tag
8. **Commits** and pushes the updated manifest back to the repository

### Required Secrets

Configure these secrets in your GitHub repository settings:

- `DOCKER_USERNAME` - Your Docker Hub username
- `DOCKER_PASSWORD` - Your Docker Hub access token

### Pipeline Benefits

✅ **Automated deployments** - No manual image building or tagging  
✅ **Version tracking** - Every deployment tagged with git SHA  
✅ **GitOps compliance** - Infrastructure changes tracked in Git  
✅ **Reproducible builds** - Consistent build environment  
✅ **Rapid iteration** - Push code and deploy automatically

---

## 🚀 Local Setup (kind)

### Prerequisites
- **Docker Desktop** (running)
- **kind** ([installation guide](https://kind.sigs.k8s.io/docs/user/quick-start/))
- **kubectl** ([installation guide](https://kubernetes.io/docs/tasks/tools/))

---

### Step-by-Step Deployment

#### 1️⃣ Create kind Cluster
```bash
kind create cluster --name platform-lab
```

#### 2️⃣ Install Metrics Server
```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

kubectl patch deployment metrics-server -n kube-system --type='json' \
  -p='[{"op": "add", "path": "/spec/template/spec/containers/0/args/-", "value": "--kubelet-insecure-tls"}]'
```

#### 3️⃣ Build the Docker Image
```bash
cd app
docker build -t node-app:1.1 .
```

#### 4️⃣ Load Image into kind Cluster
```bash
kind load docker-image node-app:1.1 --name platform-lab
```

#### 5️⃣ Deploy to Kubernetes
```bash
kubectl apply -f k8s/
```

#### 6️⃣ Verify Deployment
```bash
kubectl get all -n platform-dev
```

#### 7️⃣ Access the Application
```bash
kubectl port-forward svc/node-app 8080:80 -n platform-dev
```

Open in browser: **http://localhost:8080**

---

## 📈 Autoscaling Demo (HPA)

### Generate CPU Load
```bash
kubectl run load-generator \
  --image=busybox \
  --restart=Never \
  -n platform-dev \
  -- /bin/sh -c "while true; do wget -q -O- http://node-app.platform-dev.svc.cluster.local/load; done"
```

### Watch Scaling in Real-Time
```bash
# Terminal 1: Watch HPA metrics
kubectl get hpa -n platform-dev -w

# Terminal 2: Watch pod creation
kubectl get pods -n platform-dev -w
```

### Cleanup Load Generator
```bash
kubectl delete pod load-generator -n platform-dev
```

---

## 🧪 Health & Reliability Features

| Feature | Purpose | Configuration |
|---------|---------|---------------|
| **Readiness Probe** | Controls traffic flow to ready pods | HTTP GET `/health` every 5s |
| **Liveness Probe** | Auto-restarts unhealthy pods | HTTP GET `/health` every 10s |
| **Resource Requests** | Guaranteed minimum resources | CPU: 100m, Memory: 128Mi |
| **Resource Limits** | Prevents resource starvation | CPU: 200m, Memory: 256Mi |
| **HPA** | Scales based on CPU utilization | Target: 50% CPU, 1-5 replicas |
| **Namespace Isolation** | Environment separation | platform-dev namespace |

---

## 🔍 Useful Commands

### Application Management
```bash
# View application logs
kubectl logs -f deployment/node-app -n platform-dev

# Describe pod for detailed info
kubectl describe pod <pod-name> -n platform-dev

# Check all resources in namespace
kubectl get all -n platform-dev

# View recent events
kubectl get events -n platform-dev --sort-by='.lastTimestamp'
```

### Scaling Operations
```bash
# Check HPA status
kubectl get hpa -n platform-dev

# Monitor resource usage
kubectl top pods -n platform-dev

# Manual scale (override HPA temporarily)
kubectl scale deployment node-app --replicas=3 -n platform-dev
```

### Debugging
```bash
# Execute commands in pod
kubectl exec -it <pod-name> -n platform-dev -- /bin/sh

# Port forward to specific pod
kubectl port-forward pod/<pod-name> 8080:3000 -n platform-dev

# View pod logs (specific container)
kubectl logs <pod-name> -n platform-dev -c node-app
```

### Cleanup
```bash
# Delete all application resources
kubectl delete -f k8s/

# Delete the cluster
kind delete cluster --name platform-lab
```

---

## 📚 Documentation

Detailed explanations are available in the `Docs/` directory:

- **[architecture.md](./Docs/architecture.md)** – System design and component interaction
- **[decisions.md](./Docs/decisions.md)** – Technical choices and trade-offs
- **[runbook.md](./Docs/runbook.md)** – Operational guide and troubleshooting

---

## 🎯 Learning Outcomes

✅ Deep understanding of Kubernetes core abstractions (Pods, Services, Deployments)  
✅ Production-grade CI/CD pipeline with GitHub Actions  
✅ GitOps workflow implementation and best practices  
✅ Container registry integration (Docker Hub)  
✅ Automated deployment and version management  
✅ Real-world debugging experience (metrics-server TLS configuration)  
✅ Production-aligned container workflow (build → push → deploy)  
✅ Platform-first mindset (observability, scalability, reliability)  
✅ Clean Git practices and professional documentation

---

## 🔮 Future Enhancements

- [x] **CI/CD Pipeline** with GitHub Actions ✅
- [ ] **ConfigMaps & Secrets** for configuration management
- [ ] **Prometheus & Grafana** for metrics and dashboards
- [ ] **Ingress Controller** for advanced routing
- [ ] **ArgoCD** for GitOps continuous delivery
- [ ] **Helm Charts** for package management
- [ ] **Multi-environment setup** (dev, staging, prod)
- [ ] **Deployment to AWS EKS** for cloud environment

---

## 🐛 Troubleshooting

### CI/CD Pipeline Issues

**Pipeline fails at Docker login**
```bash
# Verify secrets are set in GitHub repository settings
# Settings → Secrets and variables → Actions
# Add: DOCKER_USERNAME and DOCKER_PASSWORD
```

**Image push fails**
```bash
# Verify Docker Hub credentials
# Check Docker Hub repository exists and is accessible
# Ensure DOCKER_USERNAME matches your Docker Hub username exactly
```

**Manifest update fails**
```bash
# Check the sed command in workflow file
# Verify the image path in deployment.yaml matches expected format
# Ensure proper spacing in the sed substitution
```

### Kubernetes Issues

**HPA shows "unknown" for metrics**
```bash
# Verify metrics-server is running
kubectl get deployment metrics-server -n kube-system

# Check metrics-server logs
kubectl logs -n kube-system deployment/metrics-server

# Wait 30-60 seconds for metrics to populate
```

**Pod stuck in "Pending" state**
```bash
# Check node resources
kubectl describe node

# View pod events
kubectl describe pod <pod-name> -n platform-dev

# Check if image is loaded (for kind)
docker exec -it platform-lab-control-plane crictl images
```

**Pod shows ImagePullBackOff**
```bash
# For kind clusters, reload the image
kind load docker-image node-app:1.1 --name platform-lab

# For Docker Hub, verify image exists
docker pull <your-username>/node-app:latest

# Check imagePullPolicy in deployment.yaml
```

---

## 🔒 Security Considerations

- **Secrets Management**: Use GitHub Secrets for sensitive data
- **Image Scanning**: Consider adding vulnerability scanning to CI/CD
- **Resource Limits**: Always set resource limits to prevent resource exhaustion
- **Least Privilege**: Use minimal permissions for service accounts
- **Network Policies**: Implement network policies for production deployments

---

## 👤 Author

**Pravin Sakhare**  
Cloud & DevOps Enthusiast

This project focuses on **clarity, correctness, and real platform behavior** with production-grade CI/CD automation rather than unnecessary complexity.

---

## 📝 License

This project is open-source and available for educational purposes.

---

**💡 Note:** This repository is designed to be **portfolio-ready** and **interview-safe**. It clearly demonstrates:
- What you built (Full-stack K8s application with CI/CD)
- Why you built it (Learn platform engineering and automation)
- How it works (GitOps workflow with automated deployments)
- What you learned (CI/CD, Kubernetes, Docker, GitOps practices)
