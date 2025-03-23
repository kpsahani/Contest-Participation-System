

# 🏆 Contest Participation System  

A **MERN Stack** application that allows users to participate in contests, answer questions, view leaderboards, and win prizes.  

🔒 Secure **JWT authentication** with role-based access (Guest, Signed-in, VIP, Admin).  
⚡ Optimized performance with **Redis caching**, **rate limiting**, and **error handling**.  
📝 Well-structured code following **SOLID principles** and the **Repository Pattern**.  
✅ Includes **unit tests** for authentication and core functionalities.  
📦 **Docker support** for easy deployment.  

---

## 📌 Table of Contents  

- [🎯 Features](#-features)  
- [🛠️ Tech Stack](#️-tech-stack)  
- [🚀 Project Setup](#-project-setup)  
- [🏗️ Architecture](#️-architecture)  
- [📜 API Documentation](#-api-documentation)  
- [🐳 Docker Deployment](#-docker-deployment)  
- [🧪 Running Tests](#-running-tests)  
- [🔒 Security Features](#-security-features)  
- [📌 Useful Links](#-useful-links)  

---

## 🎯 Features  

✅ **User Authentication & Role-Based Access** (JWT)  
✅ **Create & Join Contests** (Admin, VIP, Signed-in users)  
✅ **Submit Answers & Get Scores**  
✅ **View Global & Contest Leaderboards** (Cached in Redis)  
✅ **Prize Distribution for Winners** (Automated via Cron Jobs)  
✅ **MongoDB with Mongoose ORM**  
✅ **Redis Caching for Leaderboard Performance**  
✅ **Rate Limiting (`express-rate-limit`) to Prevent Abuse**  
✅ **Winston Logger for Error & API Request Logging**  
✅ **Centralized Error Handling Middleware**  
✅ **Automated Background Jobs (`node-cron`)**  
✅ **Unit & Integration Testing (`Jest`, `Supertest`)**  
✅ **Dockerized for Easy Deployment**  

---

## 🛠️ Tech Stack  

| **Category**  | **Technology**  |  
|--------------|---------------|  
| **Frontend** | React.js (Redux Toolkit, React Query) |  
| **Backend**  | Node.js, Express.js |  
| **Database** | MongoDB (Mongoose ORM) |  
| **Caching**  | Redis |  
| **Authentication** | JWT, bcrypt.js |  
| **Security** | Helmet.js, CORS, Rate Limiting |  
| **Logging**  | Winston, Morgan |  
| **Testing**  | Jest, Supertest |  
| **Deployment** | Docker |  #
---


## 🚀 Project Setup  
### 1️⃣ Clone the repository  
```bash
git clone https://github.com/your-repo/contest-participation-system.git
cd contest-participation-system
```

### 2️⃣ Install dependencies  
```bash
npm install
```

### 3️⃣ Set up environment variables  
Create a `.env` file in the root directory and add:  
```env
MONGODB_URI=mongodb://localhost:27017/contest-system
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
PORT=5000

# For frontend
FRONTEND_URL=http://localhost:5174

# For api
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4️⃣ Run migrations (Seeding test data)  
```bash
npm run seed
```

### 5️⃣ Start the backend server  
```bash
npm run dev:server
```

### 6️⃣ Start the frontend  
```bash
npm run dev
```

### 7️⃣ Test the application  
```bash
npm run test
```

---

## 🏗️ Architecture  

### High-Level Design (HLD)  

📌 **Mermaid Architecture Diagram:**  
[View Architecture](https://mermaid.live/view#pako:eNp9lOGO0kAQx19lssklZ6Qm-BETE2hBNByelIuJLR-W7lxZr90lu1sVr_cKvoKP4Kv5CM62ID1I6Aco0_9_Z-Y3Ux5ZpgWyAcsN325gGb1JFdB1dQV_f__6A5PFx_lyPI_a6DCZGK0cKgEBLJBn7tVXu4IgeFsPb99DyIvC1jBKRjx7aEXjH1uD1npZe0T7aat1mzBlB22M5pvM0ML1nCoiA7zsuF-krHX6a9RkvLNoIOKO1xAmN1rlOqIH0Nxpi6tTfcizDe4NUbJAIS3JfVSq_Ew903lO8RrGyWeprNMKfAjNmTLGrDLS7WqYJNgWHBjuMChkKR11McWiRHdEcLSOjdEGplyJosn1LgkrSlXCjRSiwO_cnLfheeVGV4Tsg14T7mmiCFiQ0WSon2FFfsouYMntwyElAU7VGXrPYs0twozv0HQJh21nThsEz9n2IPSDt47uPlX0LbWi3GH_P_lQFwVmTfxi0j3w85xRZ0oz5ALNWnMjjplpbP393JrKOmiiPpmb3v3OSLPzZ0F0qY4TjnAdU2JRFQdyzzZu2u54cz4ZjhVN-8ndVhBv2HNYnZoiaZ2R64okt0b-RG96fTA1O9yGz4xhgdy07VBNDZf6cksdahDvrMPy2Uz7zbETdNkG4owAUimzpGuiDZdZp5BZZyRSQcPeT-FU4d9dhAm3jjR2SytApY46pbIeK9GUXAr6q3n0D1LmNlhiygZ0K_CeV4Xz1T6RlBPneKcyNnCmwh6jKeUbNrjnhaVfVYMukpzaLg-SLVdftC73oqd_vrWIPg)  

---

## 📜 API Documentation  

📌 **Postman Collection:**  
[View API Documentation](https://documenter.getpostman.com/view/10236578/2sAYkHoxvb#1ba851b8-7f7c-493b-93aa-283914dd8074)  

---

## 🐳 Docker Deployment  

```bash
docker build -t contest-participation-system .
docker run -d -p 5000:5000 -p 5174:5174 --name contest-participation-system contest-participation-system
```

---

## 🧪 Running Tests  

Run all unit and integration tests:  
```bash
npm run test
```

---

## 🔒 Security Features  

✅ **Helmet.js** - Protects against common web vulnerabilities  
✅ **CORS** - Restricts API access to trusted domains  
✅ **Rate Limiting (`express-rate-limit`)** - Prevents brute force attacks  
✅ **JWT Authentication** - Secure user authentication  

---

## 📌 Useful Links  

- 🏗️ **[Project Architecture Diagram](https://mermaid.live/view#)**  
- 📜 **[Postman API Docs](https://documenter.getpostman.com/view/10236578/2sAYkHoxvb#)**  

🚀 **Now you’re ready to build, test, and deploy the Contest Participation System!** 🎉🔥  
```
