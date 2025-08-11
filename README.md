# 💳 Digital Wallet API

A secure, modular, and role-based backend API for a **digital wallet system** (similar to **Bkash** or **Nagad**) built with **Express.js** and **Mongoose**.

The system supports user registration, wallet management, and core financial operations like **add money, withdraw, send money**, and more.

---

## 🎯 Features

* 🔐 **Authentication** — JWT-based authentication system
* 🎭 **Role-based Authorization** — Admin, User, Agent
* 🏦 **Wallet Management** — Auto wallet creation, blocking/unblocking
* 🧱 **Transactional Logic** — Cash-in, cash-out, send money, withdraw
* 📦 **Modular Architecture** — Maintainable and scalable code structure
* 🔁 **RESTful API Endpoints**
* 🗄 **Mongoose ODM** for MongoDB

---

## 📌 Functional Requirements

### ✅ User Roles

* **User**

  * Add money (top-up)
  * Withdraw money
  * Send money to other users
  * View transaction history
* **Agent**

  * Add money to a user's wallet (cash-in)
  * Withdraw money from a user's wallet (cash-out)
  * View commission history *(optional)*
* **Admin**

  * View all users, agents, wallets, transactions
  * Block/unblock wallets
  * Approve/suspend agents
  * Set system parameters *(optional)*

### ✅ Common Requirements

* JWT-based login for **Admin**, **User**, **Agent**
* Secure password hashing (**bcrypt** or equivalent)
* Auto wallet creation on registration (initial balance: ৳50)
* Role-based route protection
* All transactions stored & trackable

---

## 🧠 System Design Considerations

### 🏦 Wallet Creation

* Auto-create wallets during registration
* Separate endpoint possible for admins
* Wallets can be **blocked/unblocked** by admins

### 🔁 Transaction Management

* Track `type`, `amount`, `fee`, `commission`, `initiator`, `status`
* Ensure atomic operations (balance updates + transaction records)
* Status flow: `pending → completed → reversed`

### 👥 Role Representation

* Single **User** model with a `role` field
* Agents: commission rate, approval status
* Admins: system control permissions

### 🫆 Validations

* Prevent negative amounts
* Handle insufficient balance
* Blocked wallets cannot send/receive money
* Minimum balance rules *(optional)*

### 📜 Access & Visibility

* Pagination & sorting for transaction history
* Users see **only** their own wallets & history
* Admins see **all** data

---

## 🔐 API Endpoints (Sample)

| Method | Endpoint             | Description                | Roles       |
| ------ | -------------------- | -------------------------- | ----------- |
| POST   | `/auth/register`     | Register new user/agent    | Public      |
| POST   | `/auth/login`        | Login                      | Public      |
| POST   | `/wallets/deposit`   | Add money to wallet        | User, Agent |
| POST   | `/wallets/withdraw`  | Withdraw money             | User, Agent |
| POST   | `/wallets/send`      | Send money to another user | User        |
| GET    | `/transactions/me`   | Get my transactions        | User, Agent |
| GET    | `/admin/users`       | View all users             | Admin       |
| PATCH  | `/wallets/block/:id` | Block a wallet             | Admin       |

---

## 📂 Project Structure

```
src/
├── modules/
│   ├── auth/
│   ├── user/
│   ├── wallet/
│   └── transaction/
├── middlewares/
├── config/
├── utils/
├── app.ts
```

---

## ⚡ Getting Started

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/digital-wallet-api.git
cd digital-wallet-api
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/digitalwallet
JWT_SECRET=your_jwt_secret
INITIAL_BALANCE=50
```

### 4️⃣ Run in Development

```bash
npm run dev
```

### 5️⃣ Build & Run in Production

```bash
npm run build
npm start
```

---

## 🧪 Testing

Run tests using:

```bash
npm test
```

---

## 🛠 Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB** + **Mongoose**
* **JWT** Authentication
* **Bcrypt** Password Hashing

