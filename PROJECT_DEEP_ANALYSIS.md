# 🔍 SpendWiser - Complete Deep Analysis & Architecture Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Application Flow](#application-flow)
5. [Frontend Architecture](#frontend-architecture)
6. [Backend Architecture](#backend-architecture)
7. [Database Architecture](#database-architecture)
8. [Authentication & Security](#authentication--security)
9. [Important Functions & Modules](#important-functions--modules)
10. [End-to-End Examples](#end-to-end-examples)
11. [Dependencies Explained](#dependencies-explained)
12. [Configuration & Environment](#configuration--environment)
13. [Potential Issues & Technical Debt](#potential-issues--technical-debt)
14. [Learning Roadmap](#learning-roadmap)
15. [Final Summary](#final-summary)

---

## Project Overview

### What is SpendWiser?

SpendWiser is a **full-stack AI-powered personal finance management application** that helps users track spending, manage budgets, receive financial insights, and get investment recommendations.

### Problem It Solves

- **Manual expense tracking** - Users need an easy way to record and categorize transactions
- **Poor financial visibility** - Users can't see spending patterns or trends
- **Lack of financial guidance** - Users need intelligent suggestions for saving and investing
- **SMS-based transactions** - Bank SMS notifications need to be automatically converted to transactions
- **Multi-wallet management** - Users need to track money across different accounts

### Main Purpose

To provide an intelligent financial dashboard where users can:
- Track all transactions (income & expenses)
- Manage multiple wallets (savings, checking, cash)
- Set and monitor budgets
- Receive AI-powered spending insights
- Get personalized investment recommendations
- Automatically capture transactions from bank SMS
- Store bank account information securely

---

## Technology Stack

### Frontend Technologies
- **React 19.2.0** - UI framework for building interactive components
- **TypeScript 5.8** - Type-safe JavaScript for better code quality
- **Vite 6.2** - Lightning-fast build tool and dev server
- **Recharts 3.5** - Chart library for visualizing transaction data
- **Lucide React 0.554** - Beautiful SVG icons
- **Axios 1.15** - HTTP client for API calls
- **Google GenAI SDK 1.30** - AI/ML integration for receipt analysis and financial insights

### Backend Technologies
- **Express.js 5.2** - Node.js web framework for REST API
- **Node.js + CommonJS** - Runtime environment
- **Prisma 7.10** - ORM (Object-Relational Mapping) for database
- **PostgreSQL** - Primary relational database (via Neon)
- **Mongoose 8.0** - MongoDB ODM (Object Document Mapper) - Legacy/backup option
- **xlsx 0.18** - Excel file reading/writing for data backup
- **node-cron 4.2** - Scheduled job execution

### Database
- **PostgreSQL** (Primary) - Via Prisma ORM, connection through Neon
- **Excel (.xlsx)** (Backup) - Fallback when database fails
- **MongoDB** (Legacy) - Not actively used but models still exist

### APIs & Services
- **Google Gemini API** - AI for:
  - Receipt image analysis
  - Spending insights generation
  - Investment recommendations
- **Express Rate Limiting** - DDoS/brute force protection
- **Nodemailer** - Email sending (welcome emails)
- **Twilio** - SMS integration (optional)

### Authentication & Security
- **JWT (JSON Web Tokens)** - Stateless authentication
- **Bcryptjs 2.4** - Password hashing and verification
- **Joi 17.11** - Input validation schemas
- **CORS** - Cross-Origin Resource Sharing

### Deployment
- **Vercel** - Frontend & Serverless backend deployment
- **PostgreSQL via Neon** - Cloud database

---

## Project Structure

```
spendwiser/
├── client/                          # React Frontend (Vite)
│   ├── components/                  # React Components
│   │   ├── Dashboard.tsx           # Main dashboard view
│   │   ├── LoginPage.tsx           # Authentication page
│   │   ├── TransactionModal.tsx    # Add/Edit transactions
│   │   ├── AISuggestionsView.tsx   # AI recommendations
│   │   ├── InsightsView.tsx        # Spending insights
│   │   ├── VaultsView.tsx          # Wallet management
│   │   ├── LedgerView.tsx          # Transaction history
│   │   ├── Sidebar.tsx             # Navigation
│   │   ├── UserProfileView.tsx     # User settings
│   │   └── ...
│   ├── services/
│   │   ├── authService.ts          # Authentication API calls
│   │   ├── geminiService.ts        # AI service integration
│   ├── types.ts                    # TypeScript type definitions
│   ├── App.tsx                     # Root React component
│   ├── index.tsx                   # Entry point
│   ├── vite.config.ts              # Vite configuration
│   └── package.json
│
├── backend/                         # Express.js API
│   ├── controllers/                 # Business logic handlers
│   │   ├── authController.js       # Auth endpoints logic
│   │   ├── transactionController.js # Transaction CRUD logic
│   │   ├── bankController.js       # Bank details logic
│   │   └── smsController.js        # SMS webhook logic
│   ├── routes/                      # API route definitions
│   │   ├── authRoutes.js           # Auth endpoints
│   │   ├── transactionRoutes.js    # Transaction endpoints
│   │   ├── bankRoutes.js           # Bank endpoints
│   │   └── smsRoutes.js            # SMS webhook
│   ├── middleware/                  # Request middleware
│   │   ├── auth.js                 # JWT verification
│   │   ├── rateLimiter.js          # Rate limiting
│   │   └── validate.js             # Input validation
│   ├── validators/
│   │   └── schemas.js              # Joi validation schemas
│   ├── services/                    # Business logic & utilities
│   │   ├── excelService.js         # Excel backup system
│   │   ├── emailService.js         # Email notifications
│   │   └── scraperService.js       # Interest rate scraping
│   ├── utils/
│   │   ├── smsParser.js            # Parse bank SMS messages
│   │   ├── prisma.js               # Prisma client singleton
│   │   └── ...
│   ├── prisma/
│   │   ├── schema.prisma           # Database schema (PostgreSQL)
│   │   └── migrations/             # Database migrations
│   ├── server.js                   # Express app setup
│   ├── package.json                # Backend dependencies
│   └── .env.example                # Environment template
│
├── package.json                    # Root package.json
├── .env                            # Environment variables
└── vercel.json                     # Vercel deployment config
```

### Important Folders Explained

| Folder | Responsibility | Key Files |
|--------|-----------------|-----------|
| `client/components` | UI components & pages | Dashboard, LoginPage, TransactionModal |
| `backend/controllers` | Business logic for each endpoint | authController, transactionController |
| `backend/routes` | Define API endpoints | authRoutes, transactionRoutes |
| `backend/middleware` | Request processing (auth, validation, rate-limit) | auth.js, validate.js |
| `backend/services` | Utility functions & external integrations | excelService, emailService |
| `backend/utils` | Helper functions | smsParser, prisma client |
| `backend/prisma` | Database schema & migrations | schema.prisma |

### Entry Points

**Frontend Entry:**
- `client/index.tsx` - React app mounts to DOM
- `client/App.tsx` - Root React component, initializes app state

**Backend Entry:**
- `backend/server.js` - Express server initialization
- Starts on port 5000 (development) or Vercel serverless (production)

---

## Application Flow

### From Start to Finish

```
1. USER LOADS APP
   ↓
2. Browser loads client/index.html → client/index.tsx
   ↓
3. React mounts App.tsx
   ↓
4. App.tsx checks if user is logged in (AuthService.getCurrentUser())
   ↓
5. IF NOT LOGGED IN
   → Show LoginPage component
   ↓
6. IF LOGGED IN
   → Initialize state (transactions, wallets, budgets)
   → Fetch transactions from backend: GET /api/transactions
   → Load localStorage data (wallets, budgets)
   → Show Dashboard with all features
```

### Complete User Flow Example: Adding a Transaction

```
USER CLICKS "ADD TRANSACTION" BUTTON
↓
TransactionModal opens (client/components/TransactionModal.tsx)
↓
USER FILLS FORM & SUBMITS
↓
App.tsx calls addTransaction() function
↓
OPTIMISTIC UPDATE: setTransactions (adds to UI immediately)
↓
BACKEND CALL: POST /api/transactions
   ↓
   Request goes to: backend/routes/transactionRoutes.js
   ↓
   Router calls: transactionController.createTransaction()
   ↓
   Middleware checks:
   - authMiddleware verifies JWT token
   - validateRequest(transactionSchema) validates input
   ↓
   If valid:
   - Generate UUID for transaction
   - Try to save to PostgreSQL (Prisma)
   - If PostgreSQL fails, fallback to Excel
   ↓
   Return transaction object (201 Created)
↓
FRONTEND receives response
↓
Update wallet balance
Update budgets
Re-render UI
```

### API Data Flow Diagram

```
┌─────────────┐
│  React App  │
└──────┬──────┘
       │ fetch() with JWT
       ↓
┌──────────────────┐
│ HTTP Request     │
│ /api/transactions│
└──────┬───────────┘
       │
       ↓
┌─────────────────────────┐
│ Express Route Handlers  │
│ (routes/*.js)           │
└──────┬──────────────────┘
       │
       ↓
┌──────────────────────────────┐
│ Middleware Stack             │
│ 1. authMiddleware (auth.js)  │
│ 2. validateRequest           │
│ 3. rateLimiter              │
└──────┬───────────────────────┘
       │
       ↓
┌──────────────────────────┐
│ Controller               │
│ (controllers/*.js)       │
│ - Business Logic         │
└──────┬───────────────────┘
       │
       ├──→ Try: PostgreSQL (Prisma)
       │    └→ Success: Return data
       │
       └──→ Catch: Excel Fallback
            └→ Read/Write .xlsx
            └→ Return data
       │
       ↓
┌──────────────────┐
│ JSON Response    │
│ (200, 201, etc) │
└──────┬───────────┘
       │
       ↓
React processes response → Updates state → Re-renders UI
```

---

## Frontend Architecture

### Important Pages/Screens

| Component | File | Purpose |
|-----------|------|---------|
| **Dashboard** | `Dashboard.tsx` | Main overview with spending summary, recent transactions, budget progress |
| **Login** | `LoginPage.tsx` | User authentication (email + password) |
| **Transactions** | `LedgerView.tsx` | View, search, delete all transactions |
| **Add Transaction** | `TransactionModal.tsx` | Modal to create new transaction |
| **Wallets** | `VaultsView.tsx` | Manage multiple wallets/accounts |
| **Budgets** | `Dashboard.tsx` | Set spending limits per category |
| **Insights** | `InsightsView.tsx` | AI-generated spending analysis |
| **Suggestions** | `AISuggestionsView.tsx` | AI investment recommendations |
| **Profile** | `UserProfileView.tsx` | User info, bank details |
| **Settings** | `SettingsView.tsx` | App settings, preferences |

### Main Components

```typescript
// Root component in client/App.tsx
App (React.FC)
├── Sidebar (Navigation)
├── Dashboard (Main content)
├── LoginPage (Auth gate)
├── TransactionModal (Add transaction)
├── MessageParserModal (Parse SMS)
├── SMSIntegrationModal (Setup SMS)
└── [Various View Components]
    ├── Dashboard
    ├── VaultsView
    ├── LedgerView
    ├── InsightsView
    ├── AISuggestionsView
    ├── InvestmentPlansView
    ├── UserProfileView
    └── SettingsView
```

### State Management

**Stored in React Component State (App.tsx):**
```typescript
// Auth State
const [user, setUser] = useState<User | null>(null);

// Data State
const [transactions, setTransactions] = useState<Transaction[]>([]);
const [wallets, setWallets] = useState<Wallet[]>([]);
const [budgets, setBudgets] = useState<Budget[]>([]);

// UI State
const [activeTab, setActiveTab] = useState('dashboard');
const [isModalOpen, setIsModalOpen] = useState(false);

// AI State
const [aiInsights, setAiInsights] = useState<string>('');
const [aiSuggestions, setAiSuggestions] = useState<AISuggestionsResult | null>(null);
```

**Persisted in localStorage:**
```
app_wallets_v2        → Wallet data
app_transactions_v2   → Transaction data (fallback)
app_budgets_v2        → Budget data
smartspend_session_v1 → User session info
smartspend_token      → JWT token
```

**Fetched from Backend:**
```
GET /api/transactions → Fetch all transactions from database
```

### Routing

**Navigation via Tab System (Not traditional routing):**
```typescript
activeTab can be:
- 'dashboard'     → Shows Dashboard component
- 'wallets'       → Shows VaultsView
- 'transactions'  → Shows LedgerView
- 'insights'      → Shows InsightsView
- 'suggestions'   → Shows AISuggestionsView
- 'investments'   → Shows InvestmentPlansView
- 'profile'       → Shows UserProfileView
- 'settings'      → Shows SettingsView
```

Button clicks change `activeTab` → Component re-renders with conditional rendering

### API Calls & Data Handling

**Key API Endpoints Called from Frontend:**

```typescript
// Authentication
POST /api/auth/register
POST /api/auth/login
PUT /api/auth/user/:userId

// Transactions
GET /api/transactions          (Fetch all)
POST /api/transactions         (Create)
PUT /api/transactions/:id      (Update)
DELETE /api/transactions/:id   (Delete)

// Bank Details
GET /api/bank-details/:userId
POST /api/bank-details

// SMS
POST /api/sms/webhook
```

**Frontend HTTP Patterns:**

```typescript
// In client/App.tsx - Fetch transactions on mount
useEffect(() => {
  const fetchTransactions = async () => {
    try {
      const token = AuthService.getToken();  // Get JWT from localStorage
      const response = await fetch('/api/transactions', {
        headers: {
          'Authorization': `Bearer ${token}`  // Include token
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);  // Update state
      } else {
        // Fallback to localStorage
        const stored = localStorage.getItem('app_transactions_v2');
        setTransactions(stored ? JSON.parse(stored) : []);
      }
    } catch (err) {
      // Handle offline/error
    }
  };
  
  fetchTransactions();
}, []);
```

**Data Handling Pattern:**

1. **Optimistic Updates** - Update UI immediately before backend confirms
2. **Fallback System** - localStorage if backend fails
3. **Token Inclusion** - All requests include JWT token in headers
4. **Error Graceful** - Show data from cache if API fails

---

## Backend Architecture

### Server Structure

**File: `backend/server.js`**

```javascript
// 1. Configuration & Setup
require('dotenv').config();           // Load environment variables
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');    // Scheduled jobs

// 2. Middleware Setup
app.use(express.json());              // Parse JSON requests
app.use(cors(corsOptions));           // Allow frontend requests
app.use('/api/', apiLimiter);         // Rate limiting

// 3. Initialization
loadCachedRates();                    // Load investment rates
performScraping();                    // Scrape latest rates

// 4. Scheduled Jobs
cron.schedule('0 0 1 */2 *', () => {  // Every 2 months
  performScraping();                  // Update interest rates
});

// 5. Route Registration
app.use('/api/transactions', transactionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bank-details', bankRoutes);
app.use('/api/sms', smsRoutes);

// 6. Error Handler
app.use(globalErrorHandler);

// 7. Start Server
app.listen(PORT, ...)
```

### Routes/Controllers Structure

**Request Flow:**

```
Route Definition (routes/*.js)
    ↓ specifies middleware & controller
Middleware Chain
    ↓ auth.js validates JWT
    ↓ validate.js checks input
    ↓ rateLimiter.js checks rate limit
Controller Function (controllers/*.js)
    ↓ contains business logic
    ↓ calls database/services
    ↓ returns response
```

**Example: Creating a Transaction**

```javascript
// File: backend/routes/transactionRoutes.js
router.post('/', 
  authMiddleware,                    // 1. Check JWT
  validateRequest(transactionSchema), // 2. Validate input
  transactionController.createTransaction  // 3. Handler
);

// File: backend/controllers/transactionController.js
exports.createTransaction = async (req, res) => {
  // Business logic here
};
```

### Services/Business Logic

**File: `backend/services/excelService.js`**
```javascript
// Read/write Excel file for data backup
readTransactionsFromExcel()
writeTransactionsToExcel(transactions)
initExcel()
```

**File: `backend/services/emailService.js`**
```javascript
// Send welcome emails
sendWelcomeEmail(email, name)
```

**File: `backend/utils/smsParser.js`**
```javascript
// Parse bank SMS messages into transactions
parseBankSMS(message)
  ↓ Regex patterns to extract amount
  ↓ Keywords to determine type (income/expense)
  ↓ Category detection
  ↓ Return parsed transaction object
```

### Models/Schemas

**File: `backend/prisma/schema.prisma`**

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique        // Login email
  password  String                  // Hashed password
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Transaction {
  id          String   @id @default(uuid())
  amount      Float                 // Transaction amount
  type        String                // 'income' or 'expense'
  category    String?               // Food, Transport, etc.
  description String?               // Merchant name
  date        String?               // ISO format date
  walletId    String?               // Which wallet
  currency    String   @default("INR")
  source      String   @default("manual")  // How it was added
  smsFrom     String?               // Bank SMS sender
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model BankDetails {
  userId    String   @id            // User's ID
  accounts  Json                    // Array of bank accounts
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Rates {
  id        String   @id
  rates     Json                    // Investment rates (PPF, etc)
  updatedAt DateTime @updatedAt
}
```

### Middleware

**File: `backend/middleware/auth.js`**
```javascript
// 1. Extract JWT token from Authorization header
// 2. Verify token signature
// 3. Add user info to req.user
// 4. Allow route handler to proceed
```

**File: `backend/middleware/validate.js`**
```javascript
// 1. Run Joi schema validation on req.body
// 2. Return 400 if validation fails
// 3. Proceed if valid
```

**File: `backend/middleware/rateLimiter.js`**
```javascript
// Different limiters:
apiLimiter        // 100 req/15min for general API
loginLimiter      // 5 attempts/15min for login
registerLimiter   // 3 registrations/hour
smsLimiter        // 50 SMS/hour
```

### Error Handling

**Global Error Handler (server.js):**
```javascript
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});
```

**Per-Controller Pattern:**
```javascript
try {
  // Try to save to PostgreSQL (Prisma)
  const tx = await prisma.transaction.create({ data });
  return res.status(201).json(tx);
} catch (dbErr) {
  // Fallback to Excel
  const transactions = readTransactionsFromExcel();
  transactions.push(newTransaction);
  writeTransactionsToExcel(transactions);
  return res.status(201).json(newTransaction);
}
```

---

## Database Architecture

### Database Being Used

**Primary:** PostgreSQL (via Neon cloud) with Prisma ORM
**Fallback:** Excel (.xlsx files) at `backend/data.xlsx`
**Legacy:** MongoDB (models exist but not actively used)

### Important Collections/Models

| Model | Purpose | Key Fields |
|-------|---------|-----------|
| **User** | Store user accounts | id, email, password (hashed), name, timestamps |
| **Transaction** | Record all spending | id, amount, type, category, date, source, walletId |
| **BankDetails** | Store bank info | userId, accounts (JSON array), timestamps |
| **Rates** | Investment rates | id, rates (JSON - PPF, FD, etc), timestamp |

### Relationships

```
User (1) ──→ (Many) Transaction
User (1) ──→ (1) BankDetails
User (1) ──→ (Many) Rates
```

### Data Operations (CRUD)

**CREATE Transaction:**
```javascript
// POST /api/transactions
→ transactionController.createTransaction()
  → Generate UUID
  → Prisma: prisma.transaction.create({ data })
  → Return created object
```

**READ Transactions:**
```javascript
// GET /api/transactions
→ transactionController.getTransactions()
  → Prisma: prisma.transaction.findMany()
  → Sort by date (descending)
  → Return array
```

**UPDATE Transaction:**
```javascript
// PUT /api/transactions/:id
→ transactionController.updateTransaction()
  → Prisma: prisma.transaction.update({ where: {id}, data })
  → Return updated object
```

**DELETE Transaction:**
```javascript
// DELETE /api/transactions/:id
→ transactionController.deleteTransaction()
  → Prisma: prisma.transaction.delete({ where: {id} })
  → Return success message
```

### Excel Fallback System

If PostgreSQL connection fails:

```javascript
// Read from Excel
const transactions = readTransactionsFromExcel();  // Parse .xlsx

// Write to Excel
writeTransactionsToExcel(transactions);  // Create/update .xlsx
```

**Location:** `backend/data.xlsx`
**Sheets:** Single sheet named "Transactions"
**Columns:** id, amount, type, category, description, date, walletId, currency, createdAt, source, smsFrom

---

## Authentication & Security

### Login/Authentication Flow

**User Registration:**
```
1. User fills registration form (email, password, name)
   └─→ POST /api/auth/register
   
2. Backend validates:
   • Email format (Joi)
   • Password length (min 6)
   • Unique email check (Prisma query)
   
3. Hash password:
   • Generate salt (bcryptjs, 10 rounds)
   • Create hash: bcrypt.hash(password, salt)
   
4. Create user in database:
   • Prisma: prisma.user.create({
       email: email.toLowerCase(),
       password: hashedPassword,
       name
     })
   
5. Generate JWT token:
   • jwt.sign(
       { userId, email },
       JWT_SECRET,
       { expiresIn: '7d' }
     )
   
6. Send welcome email (async)
   • nodemailer: sendWelcomeEmail()
   
7. Return token + user info to frontend
   └─→ Frontend stores token in localStorage
```

**User Login:**
```
1. User enters email + password
   └─→ POST /api/auth/login
   
2. Backend validates:
   • Email format
   • Find user by email
   
3. Verify password:
   • bcrypt.compare(password, user.password)
   • If mismatch → return 401
   
4. Generate JWT token
   
5. Return token to frontend
   └─→ Frontend stores in localStorage
```

### Authorization & User Roles

**Current Implementation:** No explicit roles
- Authentication: Token-based (JWT)
- Authorization: User can only access their own data
- User ID comes from JWT payload: `req.user.userId`

**Example Protection:**
```javascript
// In bank routes
router.get('/:userId', authMiddleware, bankController.getBankDetails);
// req.user.userId SHOULD match :userId (not enforced in code!)
```

### Tokens, Sessions, Passwords

**JWT Token:**
- **Format:** Bearer token in Authorization header
- **Payload:** `{ userId, email }`
- **Secret:** `process.env.JWT_SECRET`
- **Expiration:** 7 days
- **Sent in:** `Authorization: Bearer <token>`

**Session Storage:**
```javascript
// localStorage keys:
smartspend_token      // JWT token
smartspend_session_v1 // User object { id, email, name }
```

**Password Security:**
- Hashed with bcryptjs (10 salt rounds)
- Never sent in API responses
- Only compared using bcrypt.compare()

---

## Important Functions & Modules

### Frontend Functions

**File: `client/services/authService.ts`**

| Function | Purpose | Parameters | Returns |
|----------|---------|-----------|---------|
| `login()` | Authenticate user | email, password | User object + token |
| `register()` | Create new user | email, password, name | User object + token |
| `logout()` | Clear session | - | void |
| `getCurrentUser()` | Get logged-in user | - | User \| null |
| `getToken()` | Get JWT token | - | string \| null |
| `updateProfile()` | Update user info | userId, name?, password? | Updated User object |

**File: `client/services/geminiService.ts`**

| Function | Purpose | Parameters | Returns |
|----------|---------|-----------|---------|
| `analyzeReceiptImage()` | Extract data from receipt photo | base64Image | ReceiptAnalysisResult |
| `getSpendingInsights()` | Generate AI spending analysis | transactions[] | string (summary) |
| `getAISuggestions()` | Get investment recommendations | transactions[] | AISuggestionsResult |
| `parseBankMessage()` | Parse bank SMS to transaction | message string | Partial<Transaction> |

**File: `client/App.tsx`**

| Function | Purpose | Called By | Does What |
|----------|---------|-----------|-----------|
| `addTransaction()` | Add new transaction | TransactionModal | 1. Optimistic update 2. POST to backend 3. Update wallet |
| `deleteTransaction()` | Remove transaction | LedgerView | DELETE request + update state |
| `handleGenerateInsights()` | Fetch AI insights | Dashboard button | Call geminiService → display |
| `handleGenerateSuggestions()` | Fetch AI suggestions | Suggestions button | Call geminiService → display |

### Backend Functions

**File: `backend/controllers/authController.js`**

```javascript
exports.register = async (req, res)
// 1. Validate email unique
// 2. Hash password
// 3. Create user in DB
// 4. Generate JWT
// 5. Send welcome email
// 6. Return token + user

exports.login = async (req, res)
// 1. Find user by email
// 2. Compare password
// 3. Generate JWT
// 4. Return token + user

exports.updateUser = async (req, res)
// 1. Find user
// 2. Hash new password (if provided)
// 3. Update in DB
// 4. Return updated user
```

**File: `backend/controllers/transactionController.js`**

```javascript
exports.getTransactions = async (req, res)
// 1. Query all transactions from Prisma
// 2. Sort by date (descending)
// 3. Return array

exports.createTransaction = async (req, res)
// 1. Validate input with Joi
// 2. Generate UUID
// 3. Create in Prisma
// 4. Fallback to Excel if DB fails
// 5. Return created object

exports.updateTransaction = async (req, res)
// 1. Update in Prisma
// 2. Fallback to Excel
// 3. Return updated object

exports.deleteTransaction = async (req, res)
// 1. Delete from Prisma
// 2. Fallback to Excel
// 3. Return success message

exports.downloadTransactions = (req, res)
// 1. Initialize Excel file
// 2. Send as file download
```

**File: `backend/controllers/smsController.js`**

```javascript
exports.receiveWebhook = async (req, res)
// 1. Extract SMS message
// 2. Parse with parseBankSMS()
// 3. Create transaction object
// 4. Save to Prisma or Excel
// 5. Return created transaction
```

**File: `backend/utils/smsParser.js`**

```javascript
function parseBankSMS(message)
// 1. Run regex patterns to extract amount
// 2. Check keywords to determine type (income/expense)
// 3. Extract merchant name
// 4. Detect payment app (GPay, PhonePe, Paytm)
// 5. Categorize based on keywords
// 6. Return parsed object
```

---

## End-to-End Examples

### Example 1: User Registration

**User Action:** Fills form and clicks "Register"

**Frontend (client/services/authService.ts):**
```typescript
export const register = async (email, password, name) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name })
  });
  
  const data = await response.json();
  
  // Store token and user
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));
  
  return data.user;
};
```

**Backend (backend/routes/authRoutes.js):**
```javascript
router.post('/register', 
  registerLimiter,  // Rate limit: 3/hour
  validateRequest(userSchema),  // Validate: email, password, name
  authController.register
);
```

**Backend (backend/controllers/authController.js):**
```javascript
exports.register = async (req, res) => {
  const { email, password, name } = req.body;
  
  // 1. Check if email exists
  const existing = await prisma.user.findUnique({ 
    where: { email: email.toLowerCase() } 
  });
  if (existing) return res.status(400).json({ error: 'User exists' });
  
  // 2. Hash password (10 rounds)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  // 3. Create user in PostgreSQL
  const newUser = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: email.toLowerCase(),
      password: hashedPassword,
      name
    }
  });
  
  // 4. Send welcome email (async, doesn't block response)
  sendWelcomeEmail(newUser.email, newUser.name);
  
  // 5. Generate JWT token (7-day expiration)
  const token = jwt.sign(
    { userId: newUser.id, email: newUser.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  // 6. Return response
  return res.status(201).json({
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name
    }
  });
};
```

**Frontend (client/App.tsx):**
```typescript
const handleLogin = (user: User) => {
  setUser(user);  // Update auth state
  // Redirect to dashboard
};
```

**Database Result (PostgreSQL):**
```
User table:
┌──────────────────────────────────┬─────────────┬──────────────────┐
│ id                               │ email       │ password         │
├──────────────────────────────────┼─────────────┼──────────────────┤
│ 550e8400-e29b-41d4-a716-... │ john@ex... │ $2a$10$bWM... (hashed) │
└──────────────────────────────────┴─────────────┴──────────────────┘
```

---

### Example 2: Adding a Transaction

**User Action:** Opens TransactionModal, fills amount, category, date, clicks Save

**Frontend (client/components/TransactionModal.tsx):**
```typescript
const handleSave = async (txData) => {
  const newTx = {
    ...txData,
    id: Math.random().toString(36).substr(2, 9)  // Temp ID
  };
  
  // 1. Optimistic update (show immediately)
  setTransactions(prev => [newTx, ...prev]);
  
  // 2. Backend call
  try {
    const token = AuthService.getToken();
    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newTx)
    });
    
    if (!res.ok) {
      console.error("Failed to save to backend");
      // UI will revert on page reload since we saved to localStorage
    }
  } catch (error) {
    console.error("Error saving:", error);
  }
  
  // 3. Update wallet balance
  setWallets(prev => prev.map(w => {
    if (w.id === newTx.walletId) {
      const change = newTx.type === 'income' ? newTx.amount : -newTx.amount;
      return { ...w, balance: w.balance + change };
    }
    return w;
  }));
};
```

**Backend (backend/routes/transactionRoutes.js):**
```javascript
router.post('/', 
  authMiddleware,  // Verify JWT
  validateRequest(transactionSchema),  // Check: amount, type, category, date
  transactionController.createTransaction
);
```

**Backend (backend/controllers/transactionController.js):**
```javascript
exports.createTransaction = async (req, res) => {
  try {
    const { amount, type, category, description, date, walletId, currency } = req.body;
    
    // 1. Create transaction object
    const newTransaction = {
      id: uuidv4(),
      amount: Number(amount),
      type,
      category,
      description: description || '',
      date,
      walletId,
      currency: currency || 'INR',
    };
    
    // 2. Try PostgreSQL first
    try {
      const tx = await prisma.transaction.create({
        data: newTransaction
      });
      return res.status(201).json(tx);
    } catch (dbErr) {
      // 3. Fallback to Excel if DB fails
      console.error('PostgreSQL failed, using Excel:', dbErr.message);
      
      const transactions = readTransactionsFromExcel();
      newTransaction.createdAt = new Date().toISOString();
      transactions.push(newTransaction);
      writeTransactionsToExcel(transactions);
      
      return res.status(201).json(newTransaction);
    }
  } catch (err) {
    res.status(400).json({ error: 'Failed to create transaction' });
  }
};
```

**Database (PostgreSQL):**
```sql
INSERT INTO "Transaction" (id, amount, type, category, date, walletId, currency, source)
VALUES ('550e8400-e29b-41d4-a716-...', 1500, 'expense', 'Food', '2026-05-21', '1', 'INR', 'manual');
```

**Frontend Update (client/App.tsx):**
```typescript
// useEffect re-calculates budgets
useEffect(() => {
  setBudgets(prev => prev.map(b => {
    const spent = transactions
      .filter(t => t.type === 'expense' && t.category === b.category)
      .reduce((acc, curr) => acc + curr.amount, 0);
    return { ...b, spent };
  }));
}, [transactions]);

// Save to localStorage
localStorage.setItem('app_transactions_v2', JSON.stringify(transactions));
```

**UI Update:**
```
Dashboard shows:
✓ Transaction appears in recent list
✓ Wallet balance decreases by 1500
✓ Food budget shows updated spending
```

---

### Example 3: SMS Transaction from Bank

**Trigger:** Bank sends SMS: "Debit of ₹2500 at Amazon via your HDFC account"

**Flow:**

**1. SMS arrives at webhook:**
```
POST /api/sms/webhook
{
  "message": "Debit of ₹2500 at Amazon via your HDFC account",
  "from": "+919876543210",
  "timestamp": "2026-05-21T10:30:00Z"
}
```

**2. Backend routes to SMS handler (backend/routes/smsRoutes.js):**
```javascript
router.post('/webhook', 
  smsLimiter,  // Rate limit: 50/hour
  validateRequest(smsSchema),  // Validate: message
  smsController.receiveWebhook
);
```

**3. SMS controller parses (backend/controllers/smsController.js):**
```javascript
exports.receiveWebhook = async (req, res) => {
  const { message, from, timestamp } = req.body;
  
  // Parse SMS
  const parsedTx = parseBankSMS(message);
  // Returns: { amount: 2500, type: 'expense', category: 'Shopping', ... }
  
  const newTransaction = {
    id: uuidv4(),
    amount: 2500,
    type: 'expense',
    category: 'Shopping',
    description: 'Amazon',
    date: '2026-05-21',
    walletId: '1',
    currency: 'INR',
    source: 'sms',
    smsFrom: '+919876543210'
  };
  
  // Save to database
  const tx = await prisma.transaction.create({ data: newTransaction });
  
  return res.status(201).json({ success: true, transaction: tx });
};
```

**4. SMS Parser logic (backend/utils/smsParser.js):**
```javascript
function parseBankSMS(message) {
  // "Debit of ₹2500 at Amazon..."
  
  // 1. Extract amount using regex
  const amountMatch = message.match(/₹([\d,]+)/);
  const amount = parseFloat(amountMatch[1].replace(/,/g, ''));  // 2500
  
  // 2. Determine type
  const lowerMsg = message.toLowerCase();
  const type = lowerMsg.includes('debit') ? 'expense' : 'income';  // expense
  
  // 3. Extract merchant
  const merchantMatch = message.match(/at\s+([A-Za-z\s]+?)(?:\s+via|\.|\s|$)/i);
  const description = merchantMatch ? merchantMatch[1].trim() : 'Bank Transaction';  // Amazon
  
  // 4. Categorize
  let category = 'Other';
  if (lowerMsg.includes('amazon')) category = 'Shopping';
  // ... more keyword checks
  
  return {
    amount: 2500,
    type: 'expense',
    description: 'Amazon',
    category: 'Shopping',
    currency: 'INR'
  };
}
```

**5. Database saved (PostgreSQL):**
```sql
INSERT INTO "Transaction" 
  (id, amount, type, category, description, date, source, smsFrom)
VALUES 
  ('550e8400-...', 2500, 'expense', 'Shopping', 'Amazon', '2026-05-21', 'sms', '+919876543210');
```

**6. Frontend fetches on next sync:**
```
GET /api/transactions
→ Returns all transactions including the new SMS one
→ App.tsx state updates
→ Dashboard shows new transaction
```

---

## Dependencies Explained

### Frontend Dependencies (client/package.json)

| Package | Version | Why Used | What It Does |
|---------|---------|----------|------------|
| **react** | 19.2 | Core UI library | Builds interactive user interfaces |
| **react-dom** | 19.2 | React renderer | Renders React components to DOM |
| **vite** | 6.2 | Build tool | Fast dev server & production bundler |
| **typescript** | 5.8 | Type checking | Catches errors at dev time |
| **axios** | 1.15 | HTTP client | Makes API requests (alternative to fetch) |
| **@google/genai** | 1.30 | AI SDK | Integrates Google Gemini for AI features |
| **recharts** | 3.5 | Charts | Visualizes transaction data |
| **lucide-react** | 0.554 | Icon library | Beautiful SVG icons |
| **vite-plugin-pwa** | 0.21 | PWA support | Makes app installable offline |

### Backend Dependencies (backend/package.json)

| Package | Version | Why Used | What It Does |
|---------|---------|----------|------------|
| **express** | 5.2 | Web framework | Creates REST API & handles HTTP requests |
| **cors** | 2.8 | CORS middleware | Allows frontend to call backend |
| **prisma** | 7.10 | ORM | Database abstraction (queries, migrations) |
| **jsonwebtoken** | 9.0 | Auth tokens | Creates & verifies JWT tokens |
| **bcryptjs** | 2.4 | Password hashing | Hashes passwords securely |
| **joi** | 17.11 | Input validation | Validates request data against schemas |
| **express-rate-limit** | 7.1 | Rate limiting | Prevents brute force & DDoS attacks |
| **xlsx** | 0.18 | Excel library | Reads/writes Excel files (fallback storage) |
| **nodemailer** | 8.0 | Email sending | Sends welcome emails to new users |
| **node-cron** | 4.2 | Scheduled jobs | Runs tasks on schedule (rate scraping) |
| **uuid** | 14.0 | ID generation | Creates unique identifiers |
| **dotenv** | 17.3 | Config loading | Loads .env variables into process.env |
| **mongoose** | 8.0 | MongoDB ODM | MongoDB queries (legacy, not active) |

### Why Each Important Dependency

**express** - Can't build API without it (Node.js standard)
**prisma** - Type-safe database queries, migrations, easy switching between databases
**jsonwebtoken** - JWT is industry standard for stateless auth
**bcryptjs** - One-way hashing (can't decrypt passwords, only verify)
**joi** - Prevents invalid data from entering backend
**express-rate-limit** - Essential for security (prevent brute force login attacks)
**vite** - Much faster than Webpack, great dev experience
**react** - Popular, large ecosystem, great for UIs
**@google/genai** - Enables AI features without building own ML

---

## Configuration & Environment

### Environment Variables

**File: `backend/.env.example`**

```env
# Server Configuration
PORT=5000                                    # API port
NODE_ENV=development                        # Environment mode

# Database
DATABASE_URL=postgresql://...               # PostgreSQL connection string
MONGODB_URI=mongodb://localhost:27017/...   # MongoDB (legacy)

# Frontend
FRONTEND_URL=http://localhost:3001          # For CORS

# Authentication
JWT_SECRET=your-super-secret-key-...        # Signing key for JWT tokens
JWT_EXPIRE=7d                               # Token expiration time

# AI Features
GEMINI_API_KEY=your-gemini-api-key-...      # Google Gemini API

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# SMS (Optional)
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...

# Deployment
VERCEL=0                                    # Set to 1 on Vercel
```

### Configuration Files

| File | Purpose |
|------|---------|
| `backend/prisma/schema.prisma` | Database schema (tables, fields, relationships) |
| `backend/.env` | Actual environment values (secrets) |
| `client/.env.local` | Frontend environment (if needed) |
| `vercel.json` | Vercel deployment configuration |

### Environment Handling

**Development:**
```bash
npm run dev              # Runs both frontend & backend locally
# Frontend: http://localhost:3001
# Backend: http://localhost:5000
# Database: Local PostgreSQL or Excel fallback
```

**Production (Vercel):**
```
Frontend: Deployed as static site on Vercel CDN
Backend: Deployed as serverless functions on Vercel
Database: PostgreSQL on Neon (cloud)
```

---

## Potential Issues & Technical Debt

### Issues Found

**1. Authorization Not Enforced**
- **Location:** `backend/routes/bankRoutes.js`, `backend/controllers/bankController.js`
- **Problem:** Route accepts `:userId` parameter but doesn't verify it matches authenticated user
- **Risk:** User A could access User B's bank details if they know the ID
- **Fix:** Add check in controller:
  ```javascript
  if (req.user.userId !== userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  ```

**2. Sensitive Data in Error Messages**
- **Location:** Throughout controllers
- **Problem:** Error messages expose database errors to frontend
- **Risk:** Information disclosure (helps attackers)
- **Fix:** Return generic "Internal Server Error" to client, log actual error

**3. No Input Sanitization**
- **Problem:** SMS parser uses regex without escaping
- **Risk:** Could be vulnerable to malicious SMS patterns
- **Fix:** Use proper HTML escaping for descriptions

**4. Database Fallback Logic Issue**
- **Location:** Multiple controllers
- **Problem:** If PostgreSQL fails, falls back to Excel but doesn't sync data back
- **Risk:** Data inconsistency if DB comes back online
- **Fix:** Implement proper sync mechanism or migrate entirely to one DB

**5. Password Reset Not Implemented**
- **Problem:** User can't recover account if password forgotten
- **Risk:** Users locked out of accounts
- **Fix:** Implement password reset via email token

**6. No HTTPS/CORS in Dev Mode**
- **Problem:** Development CORS allows "localhost:3001" unencrypted
- **Risk:** Man-in-the-middle attacks in development
- **Fix:** Use HTTPS even in dev

### Bad Architecture

**1. Monolithic Error Handling**
```javascript
// Current: Try/catch everything in each controller
try {
  // do stuff
} catch (err) {
  // Returns different errors in different places
}

// Better: Create error handler middleware
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
```

**2. No Logging System**
- Problem: Only console.log() used
- Fix: Add Winston or Pino logger

**3. No Input Sanitization**
- Problem: Descriptions saved as-is
- Fix: Use xss or sanitize library

### Duplicate Code

**1. Excel Fallback Pattern**
```javascript
// Repeated in transactionController, bankController, smsController
try {
  // PostgreSQL
} catch {
  // Excel fallback
}
```
**Fix:** Create utility function to handle this

**2. Validation Applied Manually**
- Each route has validateRequest middleware
- Could be applied globally via app.use()

### Performance Issues

**1. No Database Indexes**
- Searching transactions by date/category will be slow
- Fix: Add `@db.Index()` in Prisma schema

**2. No Pagination**
- If user has 10,000 transactions, fetches all at once
- Fix: Implement limit/offset pagination

**3. AI Requests Not Cached**
- Calling getAISuggestions multiple times with same data = multiple API calls
- Fix: Cache results for 1 hour

### Security Risks

**1. JWT Secret Weak**
- Example shows `your-secret-key` - too short
- Fix: Use 32+ character random string

**2. Password Min 6 Characters**
- Too short, should be 8+
- Fix: Update Joi schema to min(8)

**3. Rate Limiting Lenient**
- 5 login attempts/15min is generous (should be 3)
- 50 SMS/hour is generous (could be 10)

**4. No Request Logging**
- Can't audit who accessed what
- Fix: Add Morgan or request logging middleware

---

## Learning Roadmap

### Concepts You Should Understand First

**Frontend Basics:**
1. React hooks (useState, useEffect, useCallback)
2. Component lifecycle
3. Props and state
4. Conditional rendering
5. Event handling

**Backend Basics:**
1. HTTP methods (GET, POST, PUT, DELETE)
2. REST API design
3. Request/response cycle
4. Middleware concept
5. Error handling

**Full-Stack Fundamentals:**
1. Client-server communication
2. JSON data format
3. API testing (Postman/ThunderClient)
4. Environment variables
5. Git version control

### Advanced Concepts

**Frontend Advanced:**
1. Global state management (Redux, Context)
2. Performance optimization (memo, useMemo)
3. Forms handling & validation
4. File uploads
5. Authentication flows

**Backend Advanced:**
1. Database design & normalization
2. Query optimization & indexes
3. Caching strategies
4. Job scheduling (cron)
5. Monitoring & logging

**Full-Stack Advanced:**
1. Deployment (CI/CD)
2. Microservices architecture
3. API versioning
4. Rate limiting strategies
5. Security best practices

### 10 Concepts to Master First

1. **JWT Authentication** - How login tokens work
2. **REST API Design** - How endpoints are structured
3. **React Hooks** - useState, useEffect, useContext
4. **Express Middleware** - How requests are processed
5. **Database Schemas** - How data is structured
6. **Password Hashing** - Why passwords must be hashed
7. **Error Handling** - Try-catch patterns
8. **Environment Variables** - Keeping secrets safe
9. **HTTP Status Codes** - 200, 400, 401, 500, etc.
10. **localStorage vs Backend** - When to store where

### Learning Path

**Week 1: HTTP & REST Basics**
- Understand GET, POST, PUT, DELETE
- Test APIs with Postman
- Read code: `backend/routes/authRoutes.js`

**Week 2: Frontend State & React**
- Understand useState, useEffect
- Read code: `client/App.tsx`
- Trace transaction flow in UI

**Week 3: Backend Routes & Controllers**
- Understand routing pattern
- Read code: `backend/controllers/authController.js`
- Understand middleware chain

**Week 4: Database & Prisma**
- Understand schema design
- Read code: `backend/prisma/schema.prisma`
- Run Prisma migrations

**Week 5: Authentication**
- Understand JWT tokens
- Read code: `backend/middleware/auth.js`
- Trace login flow end-to-end

**Week 6: Error Handling & Validation**
- Understand Joi schemas
- Read code: `backend/validators/schemas.js`
- Add new validation

**Week 7: Integration & Testing**
- Test APIs manually
- Test frontend-backend flow
- Write test cases

**Week 8: Deployment & DevOps**
- Understand environment setup
- Deploy to Vercel
- Monitor production

---

## Final Summary

### SpendWiser in 10 Points

1. **Full-Stack Finance App**: React frontend + Express backend + PostgreSQL database

2. **User Authentication**: JWT tokens, bcrypt password hashing, 7-day token expiration

3. **Transaction Management**: CRUD operations with fallback to Excel if database fails

4. **AI Features**: Google Gemini integration for receipt analysis and spending insights

5. **Automatic SMS Parsing**: Bank SMS messages automatically converted to transactions via webhook

6. **Multi-Wallet Support**: Track spending across checking, savings, and cash accounts

7. **Budget Tracking**: Set limits per category, see spending vs budget

8. **Security Layers**: Rate limiting, input validation, JWT authentication, CORS

9. **Responsive Design**: Works on desktop, tablet, and mobile

10. **Deployment Ready**: Configured for Vercel with PostgreSQL on Neon

### 10 Most Important Files to Understand

**Frontend:**
1. `client/App.tsx` - Root component, state management, main app logic
2. `client/services/authService.ts` - Authentication API calls
3. `client/services/geminiService.ts` - AI integration
4. `client/components/Dashboard.tsx` - Main dashboard view
5. `client/types.ts` - TypeScript type definitions

**Backend:**
1. `backend/server.js` - Express setup, routes registration
2. `backend/controllers/authController.js` - Authentication logic
3. `backend/controllers/transactionController.js` - Transaction operations
4. `backend/middleware/auth.js` - JWT verification
5. `backend/prisma/schema.prisma` - Database schema

### 10 Most Important Concepts to Learn

1. **React Hooks** - How useState and useEffect work
2. **JWT Authentication** - Stateless token-based auth
3. **Express Middleware** - Request processing chain
4. **Database Schemas** - How data is organized
5. **Password Hashing** - Why bcrypt is used
6. **Error Handling** - Try-catch and status codes
7. **REST API Design** - HTTP verbs and endpoints
8. **Async/Await** - Promise handling
9. **Environment Variables** - Secrets management
10. **API Rate Limiting** - Preventing attacks

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────┐                            │
│  │   React Frontend (Vite)         │                            │
│  ├─────────────────────────────────┤                            │
│  │ App.tsx                         │                            │
│  │ ├─ Dashboard                    │                            │
│  │ ├─ LoginPage                    │                            │
│  │ ├─ TransactionModal             │                            │
│  │ ├─ AISuggestionsView            │                            │
│  │ └─ [Other Views]                │                            │
│  │                                 │                            │
│  │ Services:                       │                            │
│  │ ├─ authService.ts              │                            │
│  │ └─ geminiService.ts            │                            │
│  │                                 │                            │
│  │ State:                          │                            │
│  │ ├─ user (Auth)                 │                            │
│  │ ├─ transactions (API)           │                            │
│  │ ├─ wallets (localStorage)       │                            │
│  │ └─ budgets (localStorage)       │                            │
│  └─────────────────────────────────┘                            │
│           ↓ fetch() + JWT Token                                 │
└─────────────────────────────────────────────────────────────────┘
                          ↓↓↓ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────────┐
│                  EXPRESS.JS BACKEND (API)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────┐                            │
│  │ Routes (routes/)                │                            │
│  │ ├─ authRoutes.js               │                            │
│  │ ├─ transactionRoutes.js        │                            │
│  │ ├─ bankRoutes.js               │                            │
│  │ └─ smsRoutes.js                │                            │
│  └──────────┬──────────────────────┘                            │
│             │                                                    │
│  ┌──────────▼──────────────────────┐                            │
│  │ Middleware Stack                │                            │
│  │ 1. authMiddleware (auth.js)     │                            │
│  │ 2. validateRequest (validate.js)│                            │
│  │ 3. rateLimiter (rateLimiter.js) │                            │
│  └──────────┬──────────────────────┘                            │
│             │                                                    │
│  ┌──────────▼──────────────────────┐                            │
│  │ Controllers (controllers/)      │                            │
│  │ ├─ authController.js           │                            │
│  │ ├─ transactionController.js    │                            │
│  │ ├─ bankController.js           │                            │
│  │ └─ smsController.js            │                            │
│  └──────────┬──────────────────────┘                            │
│             │                                                    │
│  ┌──────────▼──────────────────────┐                            │
│  │ Services & Utils                │                            │
│  │ ├─ excelService.js             │                            │
│  │ ├─ emailService.js             │                            │
│  │ └─ smsParser.js                │                            │
│  └──────────┬──────────────────────┘                            │
│             │                                                    │
│  ┌──────────▼──────────────────────┐                            │
│  │ Prisma ORM                      │                            │
│  │ (Database abstraction)          │                            │
│  └──────────┬──────────────────────┘                            │
│             │                                                    │
└─────────────┼────────────────────────────────────────────────────┘
              │
              ├─→ Try: PostgreSQL (Primary) ──→ Neon Cloud
              │
              └─→ Catch: Excel Fallback ──→ backend/data.xlsx
              
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Google Gemini API ──→ AI features (insights, suggestions)      │
│  Nodemailer        ──→ Email notifications                      │
│  Neon              ──→ PostgreSQL hosting                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Conclusion

**SpendWiser** is a well-structured full-stack application that demonstrates:

✅ Modern React patterns (hooks, state management)
✅ Secure authentication (JWT + bcrypt)
✅ RESTful API design with Express
✅ Database design with Prisma
✅ Error handling & fallbacks
✅ AI/ML integration
✅ Deployment readiness

**Key Strengths:**
- Clean separation of concerns (frontend/backend)
- Graceful fallback system (Excel when DB fails)
- AI-powered features for competitive advantage
- Security-first design (rate limiting, input validation)

**Areas to Improve:**
- Authorization enforcement (prevent user data leaks)
- Logging & monitoring system
- Caching strategy for AI requests
- Database indexing for performance
- Comprehensive error handling

Understanding this codebase will teach you valuable full-stack development concepts applicable to any web application!

