# PillowFort - Cushon ISA Investment System

## 📌 Overview

PillowFort is a **lightweight, modular investment system** designed to support
Cushon's **retail ISA offering**. The system is built with **performance,
scalability, and maintainability** in mind while aligning with Cushon’s
technology stack.

This system provides a **flexible monorepo architecture**, supporting **Google
Firestore (NoSQL)** as the database, a **Vite + React frontend**, and an
**Express backend**. It integrates **Google SSO and email/password
authentication** via Firebase Authentication, ensuring a smooth and secure user
experience.

---

## 🚀 Monorepo Structure

To maintain flexibility and ease of development, the project is structured as a
**monorepo**:

```
/pillowfort
├── /backend  (Express API with Firestore)
├── /frontend (Vite + React with Firestore)
```

- **`/backend`** → Express API for investment handling, integrated with
  Firestore.
- **`/frontend`** → Vite + React SPA for user investment interactions.

---

## 🚀 Technology Stack & Design Choices

### **Frontend: Vite + React**

- **Vite** offers **faster development speeds** and **efficient HMR**.
- **Server-side rendering (SSR) is handled selectively** through Firestore
  caching.
- **React Server Components** are **not a priority** at this stage but could be
  introduced later.
- **Static Site Generation (SSG) is not essential** for this project.

### **Backend: Express + Firestore**

- **Express API with Firestore** for managing investment transactions.
- **Firestore (NoSQL) is chosen for scalability and real-time updates**.
- **Google SSO and email/password authentication are handled exclusively on the
  backend**.
- **Firestore location is set to `london`** to comply with data location
  regulations.

### **Database Choice: Firestore**

Firestore was chosen over SQL-based alternatives (e.g., Supabase, PlanetScale)
because:

- **It provides a free-tier option** and scales automatically.
- **Seamless integration with Firebase Authentication** enhances security.
- **Query flexibility** supports investment records and user tracking.

---

## 🚀 Development & Deployment

### **Authentication & Security**

- **Google SSO and email/password authentication** are integrated.
- **Two-factor authentication (2FA)** is a paid Firebase feature but would be
  necessary for production.
- **KYC functionality is demo-only**; a production-ready version would require
  additional compliance work.
- **Tiered Access** PillowFort uses a tiered access model to balance user
  engagement and security. Anonymous users can freely browse investment
  products, making discovery frictionless. To navigate the platform,
  authentication via Google SSO or email/password is required. However, users
  must complete identity verification (KYC) before investing, ensuring
  regulatory compliance and fraud prevention while maintaining a smooth
  onboarding experience.

### **Investment Handling**

- **Funds should calculate performance over time** rather than just displaying
  invested amounts.
- **Expand fund details with investment calculators for projected yields.**

### **Frontend Design Considerations**

- **Museo Sans is replaced with a similar free font** for simplicity.
- **Some components use Tailwind, but a full design system is not yet
  implemented.**
- **Two-part KYC flow** to support both SSO and manual email/password signups.
- **Users who sign up with an email and password should have that email stored
  in Firestore** to prevent discrepancies during KYC verification.

---

## 🚀 Developer Experience Enhancements

- **`nodemon` is used in Express for improved DX**.
- **Generate a Postman API collection dynamically** to sync environment
  variables.
- **Postman API key generation required**
  (https://web.postman.co/settings/me/api-keys) to update tokens dynamically.

### **Command Reference**

| **Command**                                     | **Description**                                       |
| ----------------------------------------------- | ----------------------------------------------------- |
| `pnpm run genFirebase`                          | Generates a Firebase test token & saves it to `.env`. |
| `pnpm run sync:postman`                         | Syncs `.env` values into `postman_environment.json`.  |
| `pnpm run genFirebase && pnpm run sync:postman` | Regenerates token and updates Postman.                |

- **Firebase token expires after 1 hour**, requiring frequent regeneration.
- **CORS is currently hardcoded to Vite’s default local port**—should be made
  more robust.
- **Google SSO requires URL sanitization** for a smooth user experience.

---

## 🎯 Handover Notes & Future Considerations

### **Technical Enhancements**

- **Convert backend to TypeScript** for better maintainability.
- **Implement end-to-end testing** for API reliability.
- **Improve CI/CD pipelines** for automated deployment and testing.

### **KYC Considerations**

- The **current KYC flow is a demo**; a production-ready flow needs validation
  steps.
- **Identity verification (ID uploads) should integrate an external validation
  service**.

### **Additional Features to Consider**

- **Expand fund information with projections and calculators.**
- **Enhance Firestore interactions for better data consistency.**
- **Ensure email consistency between sign-up and KYC completion.**

---

## 📌 Design References

- **Figma Designs**:
  [PillowFort UI Design](https://www.figma.com/design/rV7IK0nLn4XCZQuxojiES4/pillowFort?node-id=0-1&t=gpPmq05im1TlpH3d-1)
  - the design along with most of the assets were lifted from cushon.co.uk site.
    The task then became a display of familiarty with figma, and the ability to
    build very closely to a design. There are some differences, the log journey
    differs due to the accomodation of

---

## 🚀 Summary

PillowFort is a **scalable, modular investment system** tailored for Cushon’s
ISA offering. This document outlines the **technical choices, development
considerations, and next steps** for a smooth handover.

**For additional clarifications, refer to the documentation and Postman API
collection.** 🚀

//TODO: mobile view, testing FE and BE, deploy //TODO: design approach, swagger,
db, be, design then FE

- ro run the be locally: `firebase emulators:start --only functions`
