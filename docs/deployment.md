# AWS Production Deployment Guide

This document outlines the production hosting architecture on **Amazon Web Services (AWS)** for the Jajal Medical Case Management platform.

---

## 🏛️ High-Level Cloud Architecture

```text
[ Users / Surgeons ]
         │ (HTTPS / Port 443)
         ▼
[ AWS Route 53 (DNS) + AWS Certificate Manager (ACM) ]
         │
         ▼
[ Application Load Balancer (ALB) ]
         │ (Private Subnet)
         ▼
[ EC2 Auto Scaling Group ] (Node.js / Laravel Application)
    │                  │
    │ (VPC Peering)    │ (IAM Instance Profile)
    ▼                  ▼
[ AWS RDS MySQL ]    [ AWS S3 Bucket ]
(Multi-AZ db.t4g)    (Encrypted DICOM / Surgical Plans)
```

---

## 🔒 1. Compute & High Availability: Amazon EC2
- **Instance Sizing**: `t4g.small` or `t4g.medium` running Amazon Linux 2023 or Ubuntu 24.04 LTS.
- **Process Management**: Managed via systemd or Docker ECS containers behind an Application Load Balancer (ALB) spanning two Availability Zones.
- **Auto Scaling**: Target tracking policy maintaining 60% CPU utilization.

## 🗄️ 2. Database: Amazon RDS for MySQL
- **Engine**: MySQL 8.0 with Multi-AZ automated replication for zero-downtime failover.
- **Storage**: General Purpose SSD (gp3) with automated daily snapshots and 30-day point-in-time recovery (PITR).
- **Network Isolation**: Placed in private isolated database subnets with no public IP assigned.

## 📁 3. File & Medical Imaging Storage: Amazon S3
- **Bucket Configuration**: Dedicated S3 bucket `jajal-medical-case-assets-prod`.
- **Encryption**: Server-Side Encryption with AWS KMS (SSE-KMS) enforcing HIPAA-compliant 256-bit AES encryption at rest.
- **Access Control**: Block Public Access enabled; pre-signed URLs with short lifespans (15 minutes) for surgeon access to radiological scans and implant specs.

## 🛡️ 4. Network Security & Security Groups
- **`alb-sg`**: Inbound TCP 443 from `0.0.0.0/0`. Outbound TCP 3000 to `app-sg`.
- **`app-sg` (EC2)**: Inbound TCP 3000 only from `alb-sg`. Outbound to `rds-sg` on TCP 3306 and S3 via VPC Endpoint.
- **`rds-sg` (MySQL)**: Inbound TCP 3306 restricted solely to `app-sg`. No inbound Internet traffic.

## 🔑 5. Environment Secrets & Configuration
- Never commit `.env` or credentials to source control.
- Store database credentials, JWT/Sanctum secret keys, and external API keys in **AWS Secrets Manager** or **AWS Systems Manager Parameter Store**.
- The EC2 instance retrieves secrets at startup via an attached IAM Role with least-privilege permissions (`secretsmanager:GetSecretValue`).

## 🌐 6. SSL/TLS & HTTPS Termination
- Domain managed via **Amazon Route 53**.
- Free SSL/TLS certificates generated via **AWS Certificate Manager (ACM)** with automatic renewal.
- HTTPS terminated at the ALB with HTTP-to-HTTPS permanent 301 redirection and modern TLS 1.3 security policies.
- **HTTP Security Headers**: Enforce HSTS (`max-age=63072000; includeSubDomains; preload`), `X-Frame-Options: SAMEORIGIN`, and strict CSP.
