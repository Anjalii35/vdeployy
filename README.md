# vdeploy — Vercel-like Deployment Platform

VDeploy is a lightweight deployment platform — think of it as a mini Vercel/Netlify clone. Give it a GitHub repo, and it clones it, detects the framework, builds it, and deploys it automatically.

## 🌐 Live Demo
→ http://vdeploy-project-frontend.s3-website-us-east-1.amazonaws.com

## ✨ Features
 
- 🔐 **Secure Authentication** — JWT-based login/signup with Spring Security
- 🚀 **One-Click Deployments** — Paste a GitHub repo URL and deploy
- 🔍 **Auto Framework Detection** — Detects React (Vite), and other frontend frameworks automatically
- 🐳 **Dockerized Build Pipeline** — Isolated, reproducible builds using Docker
- ☁️ **Cloud Hosting** — Frontend served via AWS S3, backend running on AWS EC2 and database on RDS (PostgreSQL)

## 🛠️ Tech Stack
 
| Layer | Tech |
|-------|------|
| Backend | Java 21, Spring Boot, Spring Security + JWT |
| Database | PostgreSQL on AWS RDS |
| Build Pipeline | Docker, Git |
| Cloud | AWS EC2, AWS S3, AWS RDS |
| Frontend | React + Vite, Axios |
| DevOps | Docker Compose |
 
## 🏗️ How It Works
 
```
User enter GitHub URL
        ↓
Backend clones repo (EC2)
        ↓
Detects framework
        ↓
Docker build (npm install + npm run build)
        ↓
Uploads build output to S3
        ↓
Returns live S3 URL to user
```

## 🔧 Supported Frameworks
 
| Framework | Detected By | Output Folder |
|-----------|-------------|---------------|
| React + Vite | vite.config.js | dist/ |
| Next.js | next.config.js | out/ |
| Angular | angular.json | dist/ |
| Node.js | package.json | build/ |

## 🏃 Run Locally

### Prerequisites
- Java 21
- Node.js 20+
- Docker
- AWS Account (S3 + RDS)

### Setup

1. Clone the repo
```bash
git clone https://github.com/Anjalii35/vdeployy.git
cd vdeployy
```

2. Create `.env` file in root folder
```env
DB_URL=jdbc:postgresql://your-rds-endpoint:5432/vdeploy
DB_USERNAME=your_username
DB_PASSWORD=your_password
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=your_bucket
AWS_REGION=your_region
JWT_SECRET=your_jwt_secret
```

3. Run with Docker Compose
```bash
docker compose up --build
```

4. Frontend → http://localhost:80
5. Backend → http://localhost:5050

## 📁 Project Structure
 
```
vdeployy/
├── backend/            ← Spring Boot API
│   ├── src/main/java/com/example/vdeployy/
│   │   ├── config/     ← Security, AWS config
│   │   ├── controller/ ← REST endpoints
│   │   ├── service/    ← Business logic + build pipeline
│   │   ├── model/      ← JPA entities
│   │   ├── repo/       ← Repositories
│   │   ├── dtos/       ← Request/Response DTOs
│   │   └── enums/      ← Status, Role
│   └── Dockerfile
├── frontend/           ← React + Vite
│   ├── src/
│   │   ├── api/        ← Axios calls
│   │   ├── components/ ← UI components
│   │   ├── context/    ← Auth context
│   │   └── pages/      ← Route pages
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## 👩‍💻 Author

**Anjali**
- GitHub → [@Anjalii35](https://github.com/Anjalii35)

---

*Built with ❤️ to learn AWS, Docker, and Spring Boot*
