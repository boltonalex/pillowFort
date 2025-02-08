# PillowFort - Cushon ISA Investment System

## 📌 Overview

PillowFort is a lightweight, modular investment system designed for Cushon's
retail ISA offering. The system aligns with Cushon’s technology stack while
balancing performance, scalability, and maintainability.

## 🚀 Monorepo Structure

To ensure maintainability and flexibility, we are structuring this project as a
**monorepo** with separate frontend and backend components:

```
/pillowfort
├── /backend  (Express API with Firestore)
├── /frontend (Vite + React with Firestore)
├── /types    (Shared TypeScript types)
├── /docs     (README, Swagger)
└── package.json
```

- The **`/backend`** folder contains an **Express API** connected to Firestore.
- The **`/frontend`** folder is built with **Vite + React + TypeScript**.
- The **`/types`** folder holds shared TypeScript types for both services.

## 🚀 Framework Choice: Next.js vs. Vite SSR

### **1. Decision: Use Vite + React**

- **Vite** provides faster development speeds and better Hot Module Reloading
  (HMR).
- **SSR is handled selectively** with Firestore caching.
- **React Server Components** are not a current priority, but we maintain
  flexibility.

### **2. Static Site Generation (SSG) Needs**

- **Vite SSR requires manual setup for SSG**, but it is not essential for this
  project.
- Next.js was considered, but **Vite’s speed and flexibility** make it a better
  fit.

### **3. Backend Architecture**

- **Express API with Firestore** for storing and retrieving investment data.
- **Cloud Firestore** provides scalability and real-time capabilities.
- Future compatibility with **Golang microservices** has been considered.

## 🚀 Database Choice: Firestore

We opted for **Google Firestore (NoSQL)** due to:

- **Free-tier availability** and automatic scaling.
- **Simpler setup and integration** with the Firebase ecosystem.
- **Query flexibility** for investment records.
- Alternative SQL-based choices (e.g., Supabase, PlanetScale) were considered
  but deemed unnecessary at this stage.

## ✅ **Final Considerations**

| **Feature**                 | **Vite + Express + Firestore** |
| --------------------------- | ------------------------------ |
| **SSR Support**             | ✅ Yes (via API)               |
| **React Server Components** | ❌ No                          |
| **Static Site Generation**  | ⚠️ Limited                     |
| **Dev Speed & HMR**         | 🚀 Fast                        |
| **Backend Flexibility**     | ✅ High                        |
| **Database Choice**         | ✅ Firestore (NoSQL)           |
| **Security**                | ✅ Strong via Firestore rules  |

## 🚀 Next Steps

- Finalize backend API endpoints.
- Implement the frontend investment submission flow.
- Deploy using **Vercel for FE** and **Render/Fly.io for BE**.

📌 If I Had More Time •	Convert the backend to TypeScript for better type safety
and maintainability. •	Implement end-to-end testing for API reliability.
•	Enhance CI/CD pipelines for automated deployment and testing.

- nodemon on the express setup to improve DX
- london for firebase for data location rules
- google sso and un/pw for firebase auth on the BE -- access to the list of
  funds is public to widen the funnel for new customers instead of forcing a
  signup before seeing whats on offer
- backend dev experience tool: generate a new postman collection from the
  scripts to include the env vars

## **Command	Description

- pnpm run genFirebase	Generates a Firebase test token & saves it to .env.
- pnpm run sync:postman	Syncs .env values into postman_environment.json.
- pnpm run genFirebase && pnpm run sync:postman	Regenerates token and updates
  Postman.
- firebase token expires after 1 hour, so the process needs to be repeated too
  often. perhaps a more streamlined method needs to be employed
- generate a postman api key on the website
  (https://web.postman.co/settings/me/api-keys) in order to use the generate
  tool do dynamic updates to tokens (or remove env and re-add)
- CORS added to BE and hardcoded to the VITE default local port TODO: make this
  more robust
- Google SSO with some URL rewrite to sanitise the FE experience
- firebase DB interactions and auth are all handled on the BE
- do repeat investments tally or stack as new
- 2fa is a paid-for feature on firebase but would be requirement on a prod
  version
- mobile fist UI to match whats available on https://www.cushon.co.uk/
- add more information into the funds, with maybe a calculator on your potential
  investment over time (% yields etc)
- kyc functionality is demo only. this would need to be built for prod

## **Frontend design choices

-- similar font instead of Museo Sans for simplicity
