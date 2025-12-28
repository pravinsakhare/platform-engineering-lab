# Platform Engineering Lab 🚀

**Production-Style Kubernetes Application on Local kind Cluster**

This repository demonstrates a **production-ready Kubernetes application** built with **Node.js**, **Docker**, and **Kubernetes** primitives. The focus is on **platform engineering concepts**, not frontend complexity.

![Application Demo](https://github.com/user-attachments/assets/71404dd7-6ded-40e5-aa3b-a435df0a94f1)

---

## 🧠 Project Goals

- Understand **how Kubernetes actually works**, not just YAML syntax
- Build a realistic local platform without cloud costs
- Learn platform behaviors: probes, scaling, rollouts, and self-healing
- Follow clean Git and documentation practices

---

## 🏗️ Architecture Overview

```
Client
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
- **Pods** are ephemeral and disposable
- **Services** provide stable networking endpoints
- **Deployments** enforce desired state and enable rolling updates
- **HPA** adjusts replica count automatically based on metrics

---

## ⚙️ Tech Stack

- **Node.js (Express)** - Application runtime
- **Docker** - Containerization
- **Kubernetes (kind)** - Local cluster orchestration
- **kubectl** - Cluster management
- **Metrics Server** - Resource metrics collection
- **Horizontal Pod Autoscaler (HPA)** - Auto-scaling

---

## ✨ Key Features

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

---

## 📁 Repository Structure

```
.
├── app/
│   ├── index.js              # Express application
│   ├── package.json          # Node.js dependencies
│   └── Dockerfile            # Container image definition
│
├── k8s/
│   ├── namespace.yaml        # Isolated environment
│   └── node-app/
│       ├── deployment.yaml   # Pod template & strategy
│       ├── service.yaml      # Stable networking
│       └── hpa.yaml          # Autoscaling rules
│
├── Docs/
│   ├── architecture.md       # System design decisions
│   ├── decisions.md          # Technical trade-offs
│   └── runbook.md            # Operational procedures
│
└── README.md                 # This file
```

---

## 🚀 Local Setup (kind)

### Prerequisites
- **Docker Desktop** (running)
- **kind** ([installation guide](https://kind.sigs.k8s.io/docs/user/quick-start/))
- **kubectl** ([installation guide](https://kubernetes.io/docs/tasks/tools/))

---

### Step-by-Step Deployment

#### 1️⃣ Build the Docker Image
```bash
cd app
docker build -t node-app:1.1 .
```

#### 2️⃣ Load Image into kind Cluster
```bash
kind load docker-image node-app:1.1 --name platform-lab
```

#### 3️⃣ Deploy to Kubernetes
```bash
kubectl apply -f k8s/
```

#### 4️⃣ Verify Deployment
```bash
kubectl get all -n platform-dev
```

#### 5️⃣ Access the Application
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
| **Readiness Probe** | Controls traffic flow to ready pods | HTTP GET `/health` |
| **Liveness Probe** | Auto-restarts unhealthy pods | HTTP GET `/health` |
| **Resource Limits** | Prevents resource starvation | CPU: 200m, Memory: 128Mi |
| **HPA** | Scales based on CPU utilization | Target: 50% CPU |

---

## 🔍 Useful Commands

```bash
# View application logs
kubectl logs -f deployment/node-app -n platform-dev

# Describe pod for detailed info
kubectl describe pod <pod-name> -n platform-dev

# Check HPA status
kubectl get hpa -n platform-dev

# Scale manually (override HPA temporarily)
kubectl scale deployment node-app --replicas=5 -n platform-dev

# Delete all resources
kubectl delete -f k8s/
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
✅ Real-world debugging experience (metrics-server TLS configuration)  
✅ Production-aligned container workflow (build → load → deploy)  
✅ Platform-first mindset (observability, scalability, reliability)  
✅ Clean Git practices and professional documentation

---

## 🔮 Future Enhancements

- [ ] **CI/CD Pipeline** with GitHub Actions
- [ ] **ConfigMaps & Secrets** for configuration management
- [ ] **Prometheus & Grafana** for metrics and dashboards
- [ ] **Ingress Controller** for advanced routing
- [ ] **Deployment to AWS EKS** for cloud environment

---

## 🐛 Troubleshooting

### HPA shows "unknown" for metrics
```bash
# Verify metrics-server is running
kubectl get deployment metrics-server -n kube-system

# Check metrics-server logs
kubectl logs -n kube-system deployment/metrics-server
```

### Pod stuck in "Pending" state
```bash
# Check node resources
kubectl describe node

# View pod events
kubectl describe pod <pod-name> -n platform-dev
```

---

## 👤 Author

**Pravin Sakhare**  
Cloud & DevOps Enthusiast

This project focuses on **clarity, correctness, and real platform behavior** rather than unnecessary complexity.

---

## 📝 License

This project is open-source and available for educational purposes.

---

**💡 Note:** This repository is designed to be **portfolio-ready** and **interview-safe**. It clearly demonstrates what you built, why you built it, and what you learned through the process.
