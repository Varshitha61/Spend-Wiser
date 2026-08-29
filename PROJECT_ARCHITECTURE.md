# 🏗️ SpendWiser - Complete Project Architecture Guide

## 📚 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Frontend Architecture](#frontend-architecture)
5. [Backend Architecture](#backend-architecture)
6. [Database Design](#database-design)
7. [Data Flow](#data-flow)
8. [Key Features Explained](#key-features-explained)
9. [How Everything Works Together](#how-everything-works-together)

---

## 🎯 Project Overview

**SpendWiser** is a modern personal finance management application that helps users:
- Track income and expenses
- Manage bank accounts
- Get AI-powered financial insights
- Receive investment recommendations
- Parse bank SMS messages
- Export and backup data

### Key Characteristics:
- **Full-Stack Application** - Frontend + Backend + Database
- **Real-time Data Sync** - Changes reflect immediately
- **Secure Storage** - MongoDB for sensitive data
- **AI Integration** - Google Gemini for insights
- **Multi-platform** - Works on any modern browser

---

## 🛠️ Technology Stack

### Frontend (What Users See)
```
React 19              - UI Framework
TypeScript            - Type Safety
Vite                  - Build Tool (Fast)
Tailwind CSS          - Styling
Recharts              - Charts & Graphs
Lucide Icons          - Beautiful Icons
```

### Backend (Server Logic)
```
Node.js               - Runtime Environment
Express               - Web Framework
MongoDB               - Database
Mongoose              - Database ORM
CORS                  - Cross-Origin Support
```

### AI & External Services
```
Google Gemini API     - AI Insights
Twilio (Optional)     - SMS Integration
```

---

## 📁 Project Structure

```
spendwiser/
│
├── 📄 Frontend Files (Root Level)
│   ├── App.tsx                    ← Main React App
│   ├── index.tsx                  ← Entry Point
│   ├── index.html                 ← HTML Template
│   ├── package.json               ← Frontend Dependencies
│   ├── tsconfig.json              ← TypeScript Config
│   ├── vite.config.ts             ← Vite Config
│   └── types.ts                   ← TypeScript Types
│
├── 📁 components/                 ← React Components
│   ├── Dashboard.tsx              ← Main Dashboard
│   ├── LedgerView.tsx             ← Transaction List
│   ├── UserProfileView.tsx        ← User Profile & Bank Details
│   ├── SettingsView.tsx           ← App Settings
│   ├── AISuggestionsView.tsx      ← AI Suggestions
│   ├── InvestmentPlansView.tsx    ← Investment Plans
│   ├── TransactionModal.tsx       ← Add Transaction Form
│   ├── MessageParserModal.tsx     ← SMS Parser
│   ├── SMSIntegrationModal.tsx    ← SMS Setup
│   ├── Sidebar.tsx                ← Navigation Menu
│   ├── VaultsView.tsx             ← Wallet Management
│   ├── InsightsView.tsx           ← AI Insights
│   ├── LoginPage.tsx              ← Login/Register
│   └── LiquidGauge.tsx            ← Budget Visualization
│
├── 📁 services/                   ← API Services
│   ├── authService.ts             ← User Authentication
│   └── geminiService.ts           ← AI Service
│
├── 📁 backend/                    ← Express Server
│   ├── server.js                  ← Main Server File
│   ├── package.json               ← Backend Dependencies
│   ├── .env                       ← Configuration
│   ├── data.xlsx                  ← Excel Backup
│   └── node_modules/              ← Installed Packages
│
└── 📁 Documentation/              ← Setup Guides
    ├── README.md
    ├── SETUP_GUIDE.md
    ├── QUICK_START.md
    ├── VISUAL_GUIDE.md
    ├── TROUBLESHOOTING.md
    ├── MONGODB_SETUP.md
    ├── USER_AUTH_GUIDE.md
    └── PROJECT_ARCHITECTURE.md    ← This File
```

---

## 🎨 Frontend Architecture

### How Frontend Works

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                         │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  React Application (localhost:3001)              │  │
│  │                                                  │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │  App.tsx (Main Component)                  │ │  │
│  │  │  - Manages all state                       │ │  │
│  │  │  - Handles routing                         │ │  │
│  │  │  - Manages user session                    │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │                      ↓                           │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │  Sidebar Component                         │ │  │
│  │  │  - Navigation menu                         │ │  │
│  │  │  - User profile display                    │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │                      ↓                           │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │  Page Components (Based on Active Tab)     │ │  │
│  │  │  - Dashboard                               │ │  │
│  │  │  - Ledger View                             │ │  │
│  │  │  - User Profile                            │ │  │
│  │  │  - Settings                                │ │  │
│  │  │  - AI Advisor                              │ │  │
│  │  │  - Investment Plans                        │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │                      ↓                           │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │  Services (API Calls)                      │ │  │
│  │  │  - authService.ts (Login/Register)         │ │  │
│  │  │  - geminiService.ts (AI)                   │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │                      ↓                           │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │  localStorage (Browser Storage)            │ │  │
│  │  │  - User session                            │ │  │
│  │  │  - Wallets                                 │ │  │
│  │  │  - Budgets                                 │ │  │
│  │  │  - Settings                                │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App.tsx (Root)
├── LoginPage
│   └── Login/Register Form
│
├── Sidebar
│   └── Navigation Menu
│
└── Main Content (Based on activeTab)
    ├── Dashboard
    │   ├── Stats Cards
    │   ├── Budget Gauges
    │   ├── Spending Chart
    │   └── Transaction Feed
    │
    ├── VaultsView
    │   └── Wallet Cards
    │
    ├── LedgerView
    │   └── Transaction List
    │
    ├── AISuggestionsView
    │   └── AI Recommendations
    │
    ├── InvestmentPlansView
    │   └── Investment Options
    │
    ├── UserProfileView
    │   └── Bank Details Form
    │
    └── SettingsView
        └── App Settings
```

### State Management

```
App.tsx State:
├── user                    - Current logged-in user
├── activeTab              - Current page
├── transactions           - All transactions
├── wallets                - User wallets
├── budgets                - Budget limits
├── aiInsights             - AI generated insights
├── aiSuggestions          - AI recommendations
├── searchQuery            - Search filter
└── Modal States           - Open/close modals
```

---

## 🖥️ Backend Architecture

### How Backend Works

```
┌─────────────────────────────────────────────────────────┐
│                  EXPRESS SERVER                         │
│              (localhost:5000)                           │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  server.js (Main File)                           │  │
│  │                                                  │  │
│  │  1. Initialize Express App                       │  │
│  │  2. Connect to MongoDB                           │  │
│  │  3. Define Routes                                │  │
│  │  4. Start Server                                 │  │
│  └──────────────────────────────────────────────────┘  │
│                      ↓                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Middleware                                      │  │
│  │  - express.json()      (Parse JSON)              │  │
│  │  - cors()              (Allow Cross-Origin)      │  │
│  │  - dotenv              (Load Environment Vars)   │  │
│  └──────────────────────────────────────────────────┘  │
│                      ↓                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  MongoDB Connection                              │  │
│  │  - Connect to MongoDB                            │  │
│  │  - Define Schemas                                │  │
│  │  - Create Models                                 │  │
│  └──────────────────────────────────────────────────┘  │
│                      ↓                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  API Routes                                      │  │
│  │  - /api/auth/*         (User Auth)               │  │
│  │  - /api/transactions/* (Transactions)            │  │
│  │  - /api/bank-details/* (Bank Info)               │  │
│  │  - /api/sms/webhook    (SMS Handler)             │  │
│  └──────────────────────────────────────────────────┘  │
│                      ↓                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Database Operations                             │  │
│  │  - Create (POST)                                 │  │
│  │  - Read (GET)                                    │  │
│  │  - Update (PUT)                                  │  │
│  │  - Delete (DELETE)                               │  │
│  └──────────────────────────────────────────────────┘  │
│                      ↓                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Response to Frontend                            │  │
│  │  - JSON Data                                     │  │
│  │  - Status Codes                                  │  │
│  │  - Error Messages                                │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### API Routes

```
Authentication:
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
GET    /api/auth/user/:userId      - Get user profile
PUT    /api/auth/user/:userId      - Update user profile

Transactions:
GET    /api/transactions           - Get all transactions
POST   /api/transactions           - Create transaction
PUT    /api/transactions/:id       - Update transaction
DELETE /api/transactions/:id       - Delete transaction
GET    /api/transactions/download  - Download Excel

Bank Details:
GET    /api/bank-details/:userId   - Get bank details
POST   /api/bank-details           - Save bank details
DELETE /api/bank-details/:userId   - Delete bank details

SMS:
POST   /api/sms/webhook            - Receive SMS
```

---

## 🗄️ Database Design

### MongoDB Collections

#### 1. Users Collection
```javascript
{
  _id: ObjectId,
  id: "uuid-string",
  email: "user@example.com",
  password: "hashed-password",
  name: "User Name",
  createdAt: ISODate,
  updatedAt: ISODate
}
```

#### 2. Transactions Collection
```javascript
{
  _id: ObjectId,
  id: "uuid-string",
  amount: 500,
  type: "expense",              // "income" or "expense"
  category: "Food",
  description: "Lunch",
  date: "2026-04-24",
  walletId: "1",
  currency: "INR",
  source: "manual",             // "manual", "sms", "api"
  smsFrom: "+919876543210",
  createdAt: ISODate,
  updatedAt: ISODate
}
```

#### 3. Bank Details Collection
```javascript
{
  _id: ObjectId,
  userId: "uuid-string",        // Links to user
  accountHolder: "John Doe",
  accountNumber: "1234567890",
  ifscCode: "HDFC0001234",
  bankName: "HDFC Bank",
  accountType: "Savings",
  mobileNumber: "+91 98765 43210",
  email: "user@example.com",
  createdAt: ISODate,
  updatedAt: ISODate
}
```

### Data Relationships

```
User (1) ──────→ (Many) Transactions
  ↓
  └──────→ (1) Bank Details

User
├── id (Primary Key)
├── email (Unique)
├── password
└── name

Transactions
├── id (Primary Key)
├── userId (Foreign Key)
├── amount
├── type
├── category
└── date

Bank Details
├── userId (Primary Key, Foreign Key)
├── accountNumber
├── bankName
└── accountType
```

---

## 🔄 Data Flow

### Complete User Journey

```
1. USER OPENS APP
   ↓
2. CHECK SESSION (localStorage)
   ├─ Session Found → Go to Dashboard
   └─ No Session → Show Login Page
   ↓
3. USER REGISTERS/LOGS IN
   ├─ Frontend: authService.register() or authService.login()
   ├─ Backend: POST /api/auth/register or /api/auth/login
   ├─ MongoDB: Save/Find user
   ├─ Frontend: Save session in localStorage
   └─ Go to Dashboard
   ↓
4. USER ADDS BANK DETAILS
   ├─ Frontend: UserProfileView component
   ├─ User fills form and clicks Save
   ├─ Frontend: POST /api/bank-details
   ├─ Backend: Save to MongoDB
   ├─ Frontend: Show success message
   └─ Data saved in MongoDB
   ↓
5. USER ADDS TRANSACTION
   ├─ Frontend: Click "Initialize Log"
   ├─ Frontend: TransactionModal opens
   ├─ User fills form and clicks Save
   ├─ Frontend: POST /api/transactions
   ├─ Backend: Save to MongoDB
   ├─ Frontend: Update UI immediately
   └─ Data saved in MongoDB
   ↓
6. USER VIEWS DASHBOARD
   ├─ Frontend: GET /api/transactions
   ├─ Backend: Query MongoDB
   ├─ Frontend: Display data in charts
   └─ Show stats and insights
   ↓
7. USER GETS AI INSIGHTS
   ├─ Frontend: Click "AI Advisor"
   ├─ Frontend: getAISuggestions(transactions)
   ├─ Frontend: Call Google Gemini API
   ├─ Gemini: Analyze transactions
   ├─ Frontend: Display recommendations
   └─ Show investment plans
   ↓
8. USER EXPORTS DATA
   ├─ Frontend: Settings → Export Data
   ├─ Frontend: Download JSON backup
   └─ Or: Ledger → Download Excel
```

---

## ✨ Key Features Explained

### 1. User Authentication
**What it does:** Manages user login and registration
**How it works:**
- User enters email and password
- Frontend sends to backend
- Backend checks MongoDB
- If valid, returns user data
- Frontend saves session in localStorage

**Files involved:**
- `services/authService.ts` (Frontend)
- `backend/server.js` (Backend routes)
- MongoDB `users` collection

---

### 2. Transaction Management
**What it does:** Track income and expenses
**How it works:**
- User clicks "Initialize Log"
- Modal opens for transaction details
- User fills: amount, type, category, date
- Frontend sends to backend
- Backend saves to MongoDB
- Frontend updates UI

**Files involved:**
- `components/TransactionModal.tsx`
- `backend/server.js` (routes)
- MongoDB `transactions` collection

---

### 3. Bank Details Storage
**What it does:** Securely store bank information
**How it works:**
- User goes to User Profile
- Clicks Edit on Bank Details
- Fills in account information
- Frontend sends to backend
- Backend saves to MongoDB
- Account number is masked in UI

**Files involved:**
- `components/UserProfileView.tsx`
- `backend/server.js` (routes)
- MongoDB `bankdetails` collection

---

### 4. SMS Parsing
**What it does:** Parse bank SMS messages
**How it works:**
- User clicks "Decrypt SMS"
- Pastes bank SMS message
- Frontend sends to backend
- Backend uses regex to parse
- Extracts: amount, type, merchant, category
- Creates transaction automatically

**Files involved:**
- `components/MessageParserModal.tsx`
- `backend/server.js` (parseBankSMS function)

---

### 5. AI Insights
**What it does:** Generate financial insights
**How it works:**
- User clicks "AI Advisor"
- Frontend gets all transactions
- Sends to Google Gemini API
- Gemini analyzes spending patterns
- Returns personalized suggestions
- Frontend displays recommendations

**Files involved:**
- `components/AISuggestionsView.tsx`
- `services/geminiService.ts`
- Google Gemini API

---

### 6. Investment Plans
**What it does:** Show investment options
**How it works:**
- User clicks "Investment Plans"
- Frontend analyzes user's savings rate
- Recommends suitable plans
- Shows: PPF, Mutual Funds, LIC, NPS, FDs, Gold
- Each plan has details and benefits

**Files involved:**
- `components/InvestmentPlansView.tsx`

---

### 7. Data Export
**What it does:** Backup user data
**How it works:**
- User goes to Settings
- Clicks "Export Data"
- Frontend downloads JSON file
- Or: Ledger → Download Excel
- Backend serves Excel file

**Files involved:**
- `components/SettingsView.tsx`
- `components/LedgerView.tsx`
- `backend/server.js` (download route)

---

## 🔗 How Everything Works Together

### Complete Request-Response Cycle

```
EXAMPLE: User Adds a Transaction

1. FRONTEND (React)
   ├─ User clicks "Initialize Log"
   ├─ TransactionModal opens
   ├─ User fills form:
   │  ├─ Amount: 500
   │  ├─ Type: Expense
   │  ├─ Category: Food
   │  ├─ Description: Lunch
   │  └─ Date: 2026-04-24
   ├─ User clicks "Save Transaction"
   └─ Frontend calls: addTransaction()
   
2. FRONTEND → BACKEND (HTTP Request)
   ├─ Method: POST
   ├─ URL: http://localhost:5000/api/transactions
   ├─ Headers: Content-Type: application/json
   └─ Body:
      {
        "amount": 500,
        "type": "expense",
        "category": "Food",
        "description": "Lunch",
        "date": "2026-04-24",
        "walletId": "1",
        "currency": "INR"
      }

3. BACKEND (Express Server)
   ├─ Receives POST request
   ├─ Validates data
   ├─ Generates UUID for transaction
   ├─ Creates transaction object:
   │  {
   │    "id": "uuid-here",
   │    "amount": 500,
   │    "type": "expense",
   │    "category": "Food",
   │    "description": "Lunch",
   │    "date": "2026-04-24",
   │    "walletId": "1",
   │    "currency": "INR",
   │    "createdAt": "2026-04-24T10:30:00Z"
   │  }
   └─ Saves to MongoDB

4. MONGODB (Database)
   ├─ Receives save request
   ├─ Validates schema
   ├─ Inserts document
   ├─ Returns confirmation
   └─ Data now persisted

5. BACKEND → FRONTEND (HTTP Response)
   ├─ Status: 201 (Created)
   ├─ Body: Transaction object
   └─ Sends back to frontend

6. FRONTEND (React)
   ├─ Receives response
   ├─ Updates state: setTransactions()
   ├─ Closes modal
   ├─ Shows success message
   ├─ Updates UI immediately
   └─ User sees new transaction in Ledger

7. PERSISTENCE
   ├─ Data saved in MongoDB
   ├─ Backup in Excel (data.xlsx)
   ├─ Session in localStorage
   └─ Data persists across sessions
```

---

## 📊 Technology Interaction

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │  React + TypeScript + Tailwind CSS              │   │
│  │  (Frontend - What user sees)                    │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                        ↕ HTTP/REST
┌─────────────────────────────────────────────────────────┐
│                  YOUR COMPUTER                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Node.js + Express + Mongoose                   │   │
│  │  (Backend - Server logic)                       │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                        ↕ MongoDB Driver
┌─────────────────────────────────────────────────────────┐
│                  MONGODB DATABASE                       │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Collections:                                   │   │
│  │  - users                                        │   │
│  │  - transactions                                 │   │
│  │  - bankdetails                                  │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                        ↕ File System
┌─────────────────────────────────────────────────────────┐
│                  EXCEL BACKUP                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │  data.xlsx (Automatic backup)                   │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 🎓 Learning Path

### Beginner Level
1. Understand the project structure
2. Learn how frontend and backend communicate
3. Understand MongoDB collections
4. Try adding a transaction manually

### Intermediate Level
1. Modify a component (e.g., change colors)
2. Add a new API endpoint
3. Create a new MongoDB collection
4. Understand the data flow

### Advanced Level
1. Add new features (e.g., recurring transactions)
2. Optimize database queries
3. Add authentication tokens (JWT)
4. Deploy to production

---

## 🔍 Key Files to Understand

### Frontend
- **App.tsx** - Main app logic and state management
- **components/Dashboard.tsx** - Main dashboard view
- **services/authService.ts** - User authentication
- **services/geminiService.ts** - AI integration

### Backend
- **backend/server.js** - All API routes and logic
- **backend/.env** - Configuration

### Database
- **MongoDB** - All data storage

---

## ✅ Summary

**SpendWiser** is a complete financial management app with:
- **Frontend**: React app that users interact with
- **Backend**: Express server that handles logic
- **Database**: MongoDB that stores all data
- **AI**: Google Gemini for insights
- **Features**: Transactions, bank details, SMS parsing, investments

All components work together to provide a seamless experience!

---

**Now you understand your project! 🎉**

Want to dive deeper into any specific part?
