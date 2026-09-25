# 🚀 SpendWiser - Quick Reference Guide

## File Locations Quick Lookup

### Frontend (React)
```
client/
├── App.tsx                          # ROOT - Main component with all state
├── types.ts                         # TypeScript interfaces
├── index.tsx                        # Entry point
├── vite.config.ts                   # Build config
├── components/
│   ├── Dashboard.tsx                # Main dashboard
│   ├── LoginPage.tsx                # Login/Register
│   ├── TransactionModal.tsx         # Add transaction UI
│   ├── LedgerView.tsx               # View transactions
│   ├── AISuggestionsView.tsx        # Investment recommendations
│   ├── InsightsView.tsx             # Spending analysis
│   ├── UserProfileView.tsx          # User settings
│   ├── SettingsView.tsx             # App settings
│   ├── Sidebar.tsx                  # Navigation
│   └── [Other components]
└── services/
    ├── authService.ts              # Login/Register API calls
    └── geminiService.ts            # AI/Receipt analysis API calls
```

### Backend (Express)
```
backend/
├── server.js                        # ROOT - Express setup
├── package.json                     # Dependencies
├── .env.example                     # Config template
├── routes/
│   ├── authRoutes.js               # POST /register, /login
│   ├── transactionRoutes.js        # GET/POST/PUT/DELETE /transactions
│   ├── bankRoutes.js               # GET/POST /bank-details
│   └── smsRoutes.js                # POST /sms/webhook
├── controllers/
│   ├── authController.js           # register(), login(), getUser()
│   ├── transactionController.js    # getTransactions(), createTransaction()
│   ├── bankController.js           # getBankDetails(), updateBankDetails()
│   └── smsController.js            # receiveWebhook()
├── middleware/
│   ├── auth.js                     # JWT verification
│   ├── validate.js                 # Input validation wrapper
│   └── rateLimiter.js              # Rate limiting
├── validators/
│   └── schemas.js                  # Joi validation rules
├── services/
│   ├── excelService.js            # Read/write Excel backup
│   ├── emailService.js            # Send emails
│   └── scraperService.js          # Scrape interest rates
├── utils/
│   ├── smsParser.js               # Parse bank SMS
│   └── prisma.js                  # Database client
└── prisma/
    ├── schema.prisma              # Database schema
    └── migrations/                # Database changes
```

---

## API Endpoints Reference

### Authentication
| Method | Endpoint | Protected | Purpose |
|--------|----------|-----------|---------|
| POST | `/api/auth/register` | ❌ | Create new user account |
| POST | `/api/auth/login` | ❌ | Login user, return JWT token |
| GET | `/api/auth/user/:userId` | ✅ | Get user info |
| PUT | `/api/auth/user/:userId` | ✅ | Update user profile |

### Transactions
| Method | Endpoint | Protected | Purpose |
|--------|----------|-----------|---------|
| GET | `/api/transactions` | ✅ | Fetch all transactions |
| POST | `/api/transactions` | ✅ | Create new transaction |
| PUT | `/api/transactions/:id` | ✅ | Update transaction |
| DELETE | `/api/transactions/:id` | ✅ | Delete transaction |

### Bank Details
| Method | Endpoint | Protected | Purpose |
|--------|----------|-----------|---------|
| GET | `/api/bank-details/:userId` | ✅ | Get bank account info |
| POST | `/api/bank-details` | ✅ | Add/update bank accounts |
| DELETE | `/api/bank-details/:userId` | ✅ | Delete bank details |

### SMS Integration
| Method | Endpoint | Protected | Purpose |
|--------|----------|-----------|---------|
| POST | `/api/sms/webhook` | ❌ | Receive bank SMS, create transaction |

---

## Key Data Flow Paths

### User Adds Transaction
```
TransactionModal (UI)
  ↓
App.tsx addTransaction()
  ↓
POST /api/transactions
  ↓
Backend: transactionController.createTransaction()
  ↓
Prisma: prisma.transaction.create()
  ↓
PostgreSQL: INSERT
  ↓
Response: {id, amount, type, ...}
  ↓
Frontend: Update state + localStorage
```

### Bank SMS Arrives
```
SMS: "Debit ₹2500 Amazon"
  ↓
POST /api/sms/webhook
  ↓
smsController.receiveWebhook()
  ↓
parseBankSMS() extracts data
  ↓
prisma.transaction.create()
  ↓
Frontend: Fetches transactions (automatic or on refresh)
  ↓
UI: Shows new transaction
```

### User Logs In
```
LoginPage: email + password
  ↓
authService.login()
  ↓
POST /api/auth/login
  ↓
authController.login()
  ↓
bcrypt.compare(password, hashedPassword)
  ↓
jwt.sign() generates token
  ↓
Response: { token, user }
  ↓
localStorage: Save token + user
  ↓
App: setUser() → Show dashboard
```

---

## Database Schema Cheat Sheet

### User Table
```
id (UUID)           - Unique identifier
email (String)      - Login email, unique
password (String)   - Hashed password
name (String)       - User's name
createdAt (Date)    - Account creation
updatedAt (Date)    - Last update
```

### Transaction Table
```
id (UUID)           - Unique ID
amount (Float)      - Transaction amount
type (String)       - 'income' or 'expense'
category (String)   - Food, Transport, etc.
description (String)- Merchant/description
date (String)       - ISO date YYYY-MM-DD
walletId (String)   - Which wallet
currency (String)   - INR, USD, etc.
source (String)     - 'manual', 'sms', 'bank_sync'
smsFrom (String)    - Bank phone number (if SMS)
createdAt (Date)    - When created
updatedAt (Date)    - When modified
```

### BankDetails Table
```
userId (String)     - User's ID (primary key)
accounts (JSON)     - Array of bank accounts:
                      {
                        bankName: "HDFC",
                        accountNumber: "****5678",
                        ifscCode: "HDFC0001234",
                        accountType: "savings"
                      }
createdAt (Date)
updatedAt (Date)
```

---

## Important Functions Quick Reference

### Frontend Functions

**authService.ts:**
```typescript
AuthService.login(email, password)           // → User + token
AuthService.register(email, password, name)  // → User + token
AuthService.logout()                         // → Clear session
AuthService.getCurrentUser()                 // → User | null
AuthService.getToken()                       // → JWT string
AuthService.updateProfile(userId, name, pwd) // → Updated user
```

**geminiService.ts:**
```typescript
analyzeReceiptImage(base64)      // → { merchant, amount, date, ... }
getSpendingInsights(transactions[]) // → "You spent..." (string)
getAISuggestions(transactions[])    // → { summary, suggestions[], ... }
parseBankMessage(smsMessage)        // → { amount, type, category, ... }
```

**App.tsx:**
```typescript
addTransaction(data)         // Create new transaction
deleteTransaction(id)        // Remove transaction
handleGenerateInsights()     // Call AI analysis
handleGenerateSuggestions()  // Call AI recommendations
handleLogin(user)            // Set auth user
handleLogout()               // Clear auth
```

### Backend Functions

**authController.js:**
```javascript
exports.register(req, res)      // Create user + JWT
exports.login(req, res)         // Verify + JWT
exports.getUser(req, res)       // Fetch user
exports.updateUser(req, res)    // Modify user
```

**transactionController.js:**
```javascript
exports.getTransactions(req, res)    // GET all
exports.createTransaction(req, res)  // POST new
exports.updateTransaction(req, res)  // PUT update
exports.deleteTransaction(req, res)  // DELETE
```

**smsParser.js:**
```javascript
parseBankSMS(message) // → { amount, type, category, ... }
```

---

## State Management Map

### App.tsx State
```typescript
// Auth
user: User | null              // Currently logged-in user

// Data
transactions: Transaction[]    // From backend
wallets: Wallet[]             // From localStorage
budgets: Budget[]             // From localStorage

// UI
activeTab: string             // Which page showing
isModalOpen: boolean          // Transaction modal
isParserModalOpen: boolean    // SMS parser modal
isSMSIntegrationOpen: boolean // SMS setup modal
isMobileMenuOpen: boolean     // Mobile navigation

// AI
aiInsights: string            // Generated text
aiSuggestions: null | AISuggestionsResult  // AI recommendations
isLoadingInsights: boolean    // Fetching insights
isLoadingSuggestions: boolean // Fetching suggestions
```

### localStorage Keys
```
app_wallets_v2        → JSON wallets array
app_transactions_v2   → JSON transactions array
app_budgets_v2        → JSON budgets array
smartspend_session_v1 → JSON user object
smartspend_token      → JWT token string
```

---

## Middleware Chain Reference

### For Transaction POST

```
Router.post('/transactions', 
  authMiddleware,           // 1️⃣ Check JWT token
  validateRequest(...),     // 2️⃣ Validate input schema
  apiLimiter,              // 3️⃣ Rate limit check
  controller.create()      // 4️⃣ Business logic
)
```

### Middleware File Locations
```
backend/middleware/auth.js          # JWT verification
backend/middleware/validate.js      # Joi validation wrapper
backend/middleware/rateLimiter.js   # Rate limiting
```

---

## Error Codes Commonly Used

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful request |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Invalid/missing token |
| 403 | Forbidden | User not authorized |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Backend crash |

---

## Environment Variables Cheat Sheet

### Required Variables
```
PORT=5000                    # Server port
NODE_ENV=development         # Environment
DATABASE_URL=postgresql://... # PostgreSQL connection
FRONTEND_URL=http://...      # For CORS
JWT_SECRET=abc123...         # Token signing key
```

### Optional Variables
```
GEMINI_API_KEY=...          # For AI features
MONGODB_URI=...             # Legacy, not used
TWILIO_ACCOUNT_SID=...      # For SMS
SMTP_HOST=...               # For emails
```

---

## Common Commands

### Development
```bash
npm run dev              # Start frontend + backend
npm run dev:client       # Start frontend only (port 3001)
npm run dev:backend      # Start backend only (port 5000)
```

### Database
```bash
npx prisma migrate dev   # Create migration
npx prisma studio       # Open DB UI
npx prisma generate     # Generate Prisma client
```

### Deployment
```bash
npm run build            # Build for production
vercel deploy            # Deploy to Vercel
```

---

## Testing Endpoints with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get Transactions (with token)
```bash
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:5000/api/transactions
```

### Create Transaction
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"amount":1500,"type":"expense","category":"Food","date":"2026-05-21"}'
```

---

## File Reading Order for Learning

### Start Here (Understand Flow)
1. `client/types.ts` - What data structures exist
2. `client/App.tsx` - How frontend is structured
3. `backend/server.js` - How backend is structured

### Then Read (Understand Auth)
4. `backend/controllers/authController.js` - Login logic
5. `backend/middleware/auth.js` - Token verification
6. `client/services/authService.ts` - Frontend auth calls

### Then Read (Understand Transactions)
7. `backend/controllers/transactionController.js` - CRUD logic
8. `backend/routes/transactionRoutes.js` - Endpoint definitions
9. `client/App.tsx` - Transaction handling in UI

### Then Read (Understand Database)
10. `backend/prisma/schema.prisma` - Data structure
11. `backend/utils/prisma.js` - Database client setup

### Then Read (Understand Security)
12. `backend/middleware/validate.js` - Input validation
13. `backend/middleware/rateLimiter.js` - Rate limiting
14. `backend/validators/schemas.js` - Validation rules

### Finally (Understand Advanced)
15. `client/services/geminiService.ts` - AI integration
16. `backend/utils/smsParser.js` - SMS parsing
17. `backend/services/excelService.js` - Fallback storage

---

## Quick Debugging Tips

### Frontend Issue?
1. Check browser console (F12)
2. Check localStorage: `localStorage.getItem('smartspend_token')`
3. Check Network tab for API failures
4. Verify token is being sent in Authorization header

### Backend Issue?
1. Check console logs (terminal)
2. Test endpoint with cURL/Postman
3. Check environment variables loaded
4. Verify JWT_SECRET matches

### Database Issue?
1. Check PostgreSQL connection string in .env
2. Try Excel fallback (check `backend/data.xlsx`)
3. Run: `npx prisma studio` to view data
4. Check Prisma logs: `DEBUG="*" npm run dev:backend`

### Authentication Issue?
1. Verify JWT not expired: `jwt_secret_in_dev_is_not_secure`
2. Check token format: `Bearer <token>`
3. Verify user exists in database
4. Check password hashing with bcrypt

---

## Performance Tips

### Frontend
- Wrap expensive components with `React.memo()`
- Use `useMemo()` for expensive calculations
- Lazy load routes with `React.lazy()`
- Cache AI results (don't call on every render)

### Backend
- Add database indexes on frequently queried fields
- Implement pagination (don't fetch all at once)
- Cache investment rates (don't scrape every request)
- Use connection pooling for database

### General
- Minimize third-party API calls (cost + latency)
- Compress images before upload
- Implement caching headers
- Use CDN for static files

---

## Security Checklist

- [ ] JWT_SECRET is 32+ characters
- [ ] Passwords hashed with bcrypt (10+ salt rounds)
- [ ] Rate limiting enabled on all endpoints
- [ ] Input validation with Joi schemas
- [ ] CORS restricted to frontend domain
- [ ] No sensitive data in error messages
- [ ] Environment variables not in .env file
- [ ] Password validation min 8 characters
- [ ] User authorization checked (not just auth)
- [ ] HTTPS enabled in production

---

## Quick Fixes for Common Errors

### "No token provided"
**Cause:** Forgot Authorization header
**Fix:** Add `-H "Authorization: Bearer <TOKEN>"` to curl/fetch

### "Token expired"
**Cause:** JWT token older than 7 days
**Fix:** Login again to get new token

### "User already exists"
**Cause:** Email already registered
**Fix:** Use different email or login

### "CORS error"
**Cause:** Frontend URL not in CORS whitelist
**Fix:** Check FRONTEND_URL in .env matches your frontend URL

### "Rate limit exceeded"
**Cause:** Too many requests
**Fix:** Wait 15 minutes (or specified window)

### "Database connection failed"
**Cause:** PostgreSQL unavailable
**Fix:** Check DATABASE_URL, verify Neon is running, app uses Excel fallback

---

End of Quick Reference! 🚀
