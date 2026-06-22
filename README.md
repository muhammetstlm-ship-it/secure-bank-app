# 🛡️ Secure Bank App & Real-Time SOC Incident Monitor

This production-ready web application simulates a secure banking dashboard tightly integrated with a **SIEM (Security Information and Event Management)** engine and a **SOC (Security Operations Center)** real-time monitor. 

The primary objective of this project is to demonstrate **Defensive Programming** principles, frontend data validation, and threat log persistence against common client-side banking manipulation attacks.

🚀 **Live Demo:** [https://secure-bank-app-iota.vercel.app/](https://secure-bank-app-iota.vercel.app/)

---

## 🔒 Implemented Security Architectures & Core Features

### 1. Input Manipulation & Injection Defenses (Ders 1 & 2)
* **The Threat:** Attackers often try to inject negative values, `0 ₺`, empty datasets, or string configurations into financial transaction forms to induce system logical bypasses or cause Application DoS via data type confusion.
* **The Defense:** Implemented strict TypeScript type definitions and a robust validation pipeline. The system enforces client-side rules where any input `amount <= 0` or evaluating to `isNaN` triggers an immediate system refusal and signs a severe log tracking incident.

### 2. Forensic Artifact Persistence / Anti-Delil Karartma Koruması (Ders 3)
* **The Threat:** In a standard client-side architecture, refreshing the page (F5) or closing the session wipes out all state data. In a cyber security scenario, this allows an attacker to execute **Anti-Forensics** tactics to cover their tracks and delete active SIEM logs.
* **The Defense:** Integrated full data persistence using the **Web Storage API (`localStorage`)**. Utilizing React `useEffect` hooks, the system securely synchronizes the live ledger state and SOC log list directly to the browser storage, ensuring evidence remains intact even after network reloads. Next.js server-side hydration errors are completely mitigated via isolated lifecycle management.

### 3. Real-Time SOC Analyst UX Optimization (Ders 4)
* **The Threat:** Under an active cyber attack campaign, log density grows rapidly. If an incident analyst has to manually scroll down a dense UI window to hunt for new breaches, critical response seconds are lost.
* **The Defense:** Integrated a synchronized **Auto-Scroll** interface using React `useRef`. Whenever a new threat alert is pushed to the pipeline, the DOM smooth-scrolls directly to the latest `[CRITICAL]` event, maximizing operational triage velocity.

---

## 🛠️ Tech Stack & Concepts Demonstrated

* **Framework:** Next.js (App Router)
* **Language:** TypeScript (Strict Type Enforcement)
* **Styling:** Tailwind CSS (Cyberpunk/Corporate SOC Theme)
* **State Management:** React Functional Components (`useState`, `useEffect`, `useRef`)
* **Cybersecurity Paradigm:** Defensive Programming & Digital Forensics Readiness

---

## 📈 Future Security Roadmap

- [ ] **Role-Based Access Control (RBAC):** Implementing separate authentication routes for Customers and SOC Administrators using JWT (JSON Web Tokens).
- [ ] **Client-Side Rate Limiting / Anti-Flooding:** Detecting and throttling brute-force clicking actions on the transaction module to block automation bots.
- [ ] **XSS (Cross-Site Scripting) Sanitization:** Stripping malicious HTML/Script elements from the transfer description field before UI parsing.

---

## 👤 Author
* **Developer:** Muhammet Can Satılmış
* **Focus:** Banking Security, Frontend Security Architecture & Secure Software Development