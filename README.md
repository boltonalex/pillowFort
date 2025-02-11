# PillowFort - A simple investment system

---

## 📌 Overview

PillowFort is a simple direct to customer investment platform. Platform is
usable on a mobile device and a desktop.

## http://pillow-fort.vercel.app

## 🚀 Monorepo Structure

To maintain flexibility and ease of development, the project is structured as a
**monorepo**:

```
/pillowfort
├── /backend  (Express API with Firebase Functions)
├── /frontend (Vite with vercel hosting)
```

---

## 🚀 Technology Stack & Design Choices

### **Frontend: Vite + React**

- Vite
- Tailwind
- React Router
- Vitest

### **Backend: Express + Firebase Functions**

- Express API
- Firebase Function
- Authentication: Google SSO and email/password authentication
- swagger file to capture API structure

### **Database: Firestore**

- Minimal DB footprint:
  - Funds
  - Investments
  - Users

---

## 🚀 Development & Deployment

### **Authentication & Security**

- **Google SSO and email/password authentication** are integrated.
- **Tiered Access** PillowFort uses a tiered access model to balance user
  engagement and security.
  - **Anonymous users:** can freely browse investment products, making discovery
    frictionless.
  - **Trusted users:** Google SSO or email/password is required.
  - **Verified:** Users must complete identity verification (KYC) before
    investing, ensuring regulatory compliance and fraud prevention while
    maintaining a smooth onboarding experience.
- **KYC functionality is demo-only**; a production-ready version would require
  additional compliance work.

### **Design**

- **Figma design** collage of existing UI assets pulled from public facing
  website and apple store for iPad view
  - https://www.figma.com/design/rV7IK0nLn4XCZQuxojiES4/pillowFort?node-id=0-1&t=ntkWfJajgoZa2X39-1
- UX flow is reduced for brevity
- mobile view and desktop views

### **DB**

- **Firestore** used for data persistence
  - allows local development when run with the command:
    `firebase emulators:start --only functions`
  - deployment command: `firebase deploy --only functions`

### **Frontend**

- vite startup command for local dev: `pnpm dev`
- vite startup command to run tests: `pnpm vitest`
- vercel deployments are handled via vercel > github integration
- to trigger a deploy to the prod url:
  - commit to main (not a habit to allow in the real world)
  - create a PR and merge it
- responsive styles to allow for full UX on a mobile phone and a full size
  monitor
- login form errors are ugly

### **DX**

- I made a postman collection during the backend dev phase and a few scripts to
  automate the token management and sync task
  - these might not work now since i migrated to firebase functions when it came
    time to deploy, so use with caution

---

### **Command Reference**

**Backend:**

| **Command**                                     | **Description**                                                           |
| ----------------------------------------------- | ------------------------------------------------------------------------- |
| `pnpm run genFirebase`                          | Generates a Firebase test token & saves it to `.env`.                     |
| `pnpm run sync:postman`                         | Syncs `.env` values into `postman_environment.json`.                      |
| `pnpm run genFirebase && pnpm run sync:postman` | Regenerates token and updates Postman.                                    |
| `firebase emulators:start --only functions`     | Run local interaction of backend for debugging and better access to logs. |
| `firebase deploy --only functions`              | deploy backend functions to firebase                                      |

**Frontend:**

| **Command**   | **Description**                                      |
| ------------- | ---------------------------------------------------- |
| `pnpm dev`    | Starts local dev server                              |
| `pnpm vitest` | Starts a vitest runner that also watches for changes |

- **NOTE:** you will need to populate the `.env` files in `/frontend` and
  `/backend` using the `.env.sample` files in order to get a full functioning
  developer experience

---

## 🎯 Handover Notes & Future Considerations

### **Technical Enhancements**

- **Convert backend to TypeScript** for better maintainability.
- **Implement end-to-end testing** for API reliability.
- **Improve CI/CD pipelines** for conditional deployments using the tests.

### **KYC Considerations**

- The **current KYC flow is a demo**; a production-ready flow needs validation
  steps.
- **Identity verification (ID uploads) should integrate an external validation
  service**.

### **Additional Features to Consider**

- **Expand fund information with projections and calculators.**
- **Enhance Firestore interactions for better data consistency.**
- **Ensure email consistency between sign-up and KYC completion.**
- **Investment Handling**
  - **Funds should calculate performance over time** rather than just displaying
    invested amounts.
  - **Expand fund details with investment calculators for projected yields.**

---

## 🚀 Summary

PillowFort is a **scalable, modular investment system** tailored for Cushon’s
ISA offering. This document outlines the **technical choices, development
considerations, and next steps** for a smooth handover.
