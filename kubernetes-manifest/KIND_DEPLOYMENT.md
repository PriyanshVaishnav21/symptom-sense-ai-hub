
# Deploying Symptom Sense AI Hub using KIND on EC2

This guide provides step-by-step instructions for deploying the Symptom Sense AI Hub application on an EC2 instance using KIND (Kubernetes IN Docker).

## Prerequisites

- An AWS EC2 instance (recommended: t3.medium or larger with at least 4GB RAM)
- SSH access to your EC2 instance
- Basic knowledge of AWS, Docker, and Kubernetes

## Step 1: Set Up Your EC2 Instance

1. Launch an EC2 instance with Amazon Linux 2 or Ubuntu Server 20.04/22.04 LTS
2. Ensure the security group allows the following inbound traffic:
   - SSH (port 22)
   - HTTP (port 80)
   - HTTPS (port 443)
   - Custom TCP (port 30000-32767) for NodePort services

3. Connect to your EC2 instance:
   ```
   ssh -i your-key.pem ec2-user@your-ec2-ip
   ```

## Step 2: Install Docker

For Amazon Linux 2:
```bash
sudo yum update -y
sudo amazon-linux-extras install docker -y
sudo service docker start
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user
```

For Ubuntu:
```bash
sudo apt-get update
sudo apt-get install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ubuntu
```

Log out and log back in for the group changes to take effect:
```bash
exit
# reconnect with SSH
```

## Step 3: Install KIND

```bash
# Download KIND binary
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.17.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind

# Verify installation
kind --version
```

## Step 4: Install kubectl

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv ./kubectl /usr/local/bin/kubectl

# Verify installation
kubectl version --client
```

## Step 5: Create a KIND Cluster

Create a file named `kind-config.yaml`:
```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  extraPortMappings:
  - containerPort: 30000
    hostPort: 80
    protocol: TCP
  - containerPort: 30001
    hostPort: 443
    protocol: TCP
```

Create the cluster:
```bash
kind create cluster --name symptom-sense --config kind-config.yaml
```

## Step 6: Clone the Repository and Build the Docker Image

```bash
# Clone the repository
git clone https://github.com/your-username/symptom-sense-ai-hub.git
cd symptom-sense-ai-hub

# Build the Docker image
docker build -t symptom-sense-ai-hub:latest .
```

## Step 7: Load the Image into KIND

```bash
kind load docker-image symptom-sense-ai-hub:latest --name symptom-sense
```

## Step 8: Update the Deployment Manifest

Edit the `kubernetes-manifest/service.yaml` file to use NodePort type:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: symptom-sense-service
spec:
  selector:
    app: symptom-sense
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30000
  type: NodePort
```

## Step 9: Deploy the Application

```bash
kubectl apply -f kubernetes-manifest/
```

## Step 10: Verify the Deployment

```bash
kubectl get pods
kubectl get services
```

## Step 11: Access Your Application

Access the application using your EC2 instance's public IP address:
```
http://your-ec2-public-ip
```

## Step 12: Configure SSL (Optional)

For production environments, you might want to set up SSL using cert-manager:

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.10.0/cert-manager.yaml

# Create and apply SSL issuer and certificate resources
# ...
```

## Troubleshooting

1. **Pod issues**:
   ```bash
   kubectl describe pod <pod-name>
   kubectl logs <pod-name>
   ```

2. **Service issues**:
   ```bash
   kubectl describe service symptom-sense-service
   ```

3. **Restart a deployment**:
   ```bash
   kubectl rollout restart deployment symptom-sense-deployment
   ```

## Clean Up

To delete the KIND cluster when you're done:
```bash
kind delete cluster --name symptom-sense
```

To terminate your EC2 instance (when no longer needed):
- Go to the AWS Management Console
- Navigate to EC2 > Instances
- Select your instance
- Choose Instance state > Terminate instance
