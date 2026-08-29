# 💻 Code Walkthrough - Understanding SpendWiser Line by Line

## 📖 Table of Contents
1. [Frontend Entry Point](#frontend-entry-point)
2. [App.tsx - Main Component](#apptsx---main-component)
3. [Authentication Flow](#authentication-flow)
4. [Adding a Transaction](#adding-a-transaction)
5. [Backend API Routes](#backend-api-routes)
6. [Database Operations](#database-operations)
7. [AI Integration](#ai-integration)

---

## 🎬 Frontend Entry Point

### index.html
```html
<!DOCTYPE html>
<html>
  <head>
    <title>SpendWiser</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>
```
**What it does:** HTML template that loads React app

### index.tsx
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```
**What it does:** 
- Imports React and App component
- Renders App into the `<div id="root">` element
- This is where everything starts!

---

## 🏗️ App.tsx - Main Component

### Part 1: Imports and Setup
```typescript
import React, { useState, useEffect } from 'react'
import { Transaction, Wallet, User, Budget } from './types'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
// ... more imports
```
**What it does:** Imports all components and types needed

### Part 2: State Management
```typescript
const App: React.FC = () => {
  // User state
  const [user, setUser] = useState<User | null>(null)
  
  // Page state
  const [activeTab, setActiveTab] = useState('dashboard')
  
  // Data state
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('')
}
```
**What it does:** Defines all state variables that control the app

### Part 3: Check if User is Logged In
```typescript
useEffect(() => {
  // Check for Auth Session
  const currentUser = AuthService.getCurrentUser()
  if (currentUser) {
    setUser(currentUser)
  }
}, [])
```
**What it does:**
- Runs when app loads
- Checks if user session exists in localStorage
- If yes, sets user state
- If no, shows login page

### Part 4: Fetch Transactions from Backend
```typescript
useEffect(() => {
  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/transactions')
      if (response.ok) {
        const data = await response.json()
        setTransactions(data)
      }
    } catch (err) {
      console.error("Backend unreachable", err)
    }
  }
  
  fetchTransactions()
}, [])
```
**What it does:**
- Fetches all transactions from backend
- Updates state with data
- Runs when app loads

### Part 5: Add Transaction Function
```typescript
const addTransaction = async (txData: Omit<Transaction, 'id'>) => {
  // Create new transaction with ID
  const newTx: Transaction = {
    ...txData,
    id: Math.random().toString(36).substr(2, 9),
  }
  
  // Update UI immediately (optimistic update)
  setTransactions(prev => [newTx, ...prev])
  
  // Send to backend
  try {
    const res = await fetch('http://localhost:5000/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTx)
    })
    if (!res.ok) {
      console.error("Failed to save to backend")
    }
  } catch (error) {
    console.error("Error saving transaction:", error)
  }
  
  // Update wallet balance
  setWallets(prev => prev.map(w => {
    if (w.id === newTx.walletId) {
      const change = newTx.type === 'income' ? newTx.amount : -newTx.amount
      return { ...w, balance: w.balance + change }
    }
    return w
  }))
}
```
**What it does:**
1. Creates new transaction object
2. Updates UI immediately (user sees it right away)
3. Sends to backend to save in MongoDB
4. Updates wallet balance

### Part 6: Render UI
```typescript
return (
  <div className="flex min-h-screen">
    {/* Sidebar */}
    <Sidebar
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      userEmail={user?.email}
      userName={user?.name}
    />
    
    {/* Main Content */}
    <main className="flex-1">
      {/* Header */}
      <header>
        <h1>{activeTab === 'dashboard' && 'Dashboard'}</h1>
        <button onClick={() => setIsModalOpen(true)}>
          Initialize Log
        </button>
      </header>
      
      {/* Page Content */}
      {activeTab === 'dashboard' && (
        <Dashboard transactions={transactions} wallets={wallets} />
      )}
      {activeTab === 'transactions' && (
        <LedgerView transactions={transactions} />
      )}
      {/* ... more pages */}
    </main>
    
    {/* Modals */}
    <TransactionModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSave={addTransaction}
    />
  </div>
)
```
**What it does:** Renders the UI based on state

---

## 🔐 Authentication Flow

### Login Process

#### Step 1: User Enters Credentials
```typescript
// In LoginPage.tsx
const handleLogin = async (email: string, password: string) => {
  try {
    const user = await AuthService.login(email, password)
    onLogin(user)
  } catch (error) {
    setError('Invalid credentials')
  }
}
```

#### Step 2: Frontend Calls Backend
```typescript
// In services/authService.ts
export const AuthService = {
  login: async (email: string, password: string): Promise<User> => {
    try {
      // Send to backend
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      if (!response.ok) {
        throw new Error('Login failed')
      }
      
      // Get user data
      const user = await response.json()
      
      // Save to localStorage
      localStorage.setItem('smartspend_session_v1', JSON.stringify(user))
      
      return user
    } catch (err) {
      throw err
    }
  }
}
```

#### Step 3: Backend Checks MongoDB
```javascript
// In backend/server.js
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    // Find user in MongoDB
    const user = await User.findOne({
      email: email.toLowerCase(),
      password,
    })
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    
    // Return user (without password)
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
    }
    
    res.status(200).json(userResponse)
  } catch (err) {
    res.status(500).json({ error: 'Failed to login' })
  }
})
```

#### Step 4: Frontend Saves Session
```typescript
// Session saved in localStorage
localStorage.setItem('smartspend_session_v1', JSON.stringify({
  id: 'uuid-here',
  email: 'user@example.com',
  name: 'User Name'
}))
```

#### Step 5: App Updates
```typescript
// In App.tsx
const currentUser = AuthService.getCurrentUser()
if (currentUser) {
  setUser(currentUser)  // User is logged in!
}
```

---

## ➕ Adding a Transaction

### Step 1: User Clicks "Initialize Log"
```typescript
// In App.tsx
<button onClick={() => setIsModalOpen(true)}>
  Initialize Log
</button>
```

### Step 2: Modal Opens
```typescript
// In TransactionModal.tsx
const TransactionModal: React.FC<TransactionModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  
  const handleSave = () => {
    onSave({
      amount: parseFloat(amount),
      type,
      category,
      description,
      date,
      walletId: '1',
      currency: 'INR'
    })
    onClose()
  }
  
  return (
    <div>
      <input 
        value={amount} 
        onChange={(e) => setAmount(e.target.value)} 
        placeholder="Amount"
      />
      <select 
        value={type} 
        onChange={(e) => setType(e.target.value as 'income' | 'expense')}
      >
        <option>income</option>
        <option>expense</option>
      </select>
      {/* ... more inputs */}
      <button onClick={handleSave}>Save Transaction</button>
    </div>
  )
}
```

### Step 3: Frontend Sends to Backend
```typescript
// In App.tsx addTransaction function
const res = await fetch('http://localhost:5000/api/transactions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newTx)
})
```

### Step 4: Backend Saves to MongoDB
```javascript
// In backend/server.js
app.post('/api/transactions', async (req, res) => {
  try {
    const { amount, type, category, description, date, walletId, currency } = req.body
    
    // Create transaction object
    const newTransaction = {
      id: uuidv4(),
      amount: Number(amount),
      type,
      category,
      description: description || '',
      date,
      walletId,
      currency: currency || 'INR',
      createdAt: new Date().toISOString()
    }
    
    // Save to MongoDB
    if (mongoose.connection.readyState === 1) {
      const tx = new Transaction(newTransaction)
      await tx.save()
      res.status(201).json(tx)
    }
  } catch (err) {
    res.status(400).json({ error: 'Failed to create transaction' })
  }
})
```

### Step 5: Frontend Updates UI
```typescript
// In App.tsx
setTransactions(prev => [newTx, ...prev])  // Add to top of list
```

---

## 🔌 Backend API Routes

### GET All Transactions
```javascript
app.get('/api/transactions', async (req, res) => {
  try {
    // Query MongoDB
    const transactions = await Transaction.find().sort({ date: -1 })
    
    // Return as JSON
    res.json(transactions)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' })
  }
})
```

### POST New Transaction
```javascript
app.post('/api/transactions', async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body)
    await newTransaction.save()
    res.status(201).json(newTransaction)
  } catch (err) {
    res.status(400).json({ error: 'Failed to create transaction' })
  }
})
```

### DELETE Transaction
```javascript
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await Transaction.findOneAndDelete({ id })
    
    if (!result) {
      return res.status(404).json({ error: 'Transaction not found' })
    }
    
    res.json({ message: 'Transaction deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete transaction' })
  }
})
```

---

## 💾 Database Operations

### MongoDB Schema
```javascript
const transactionSchema = new mongoose.Schema({
  id: { type: String, unique: true, default: () => uuidv4() },
  amount: Number,
  type: String,
  category: String,
  description: String,
  date: String,
  walletId: String,
  currency: { type: String, default: 'INR' },
  createdAt: { type: Date, default: Date.now },
})

const Transaction = mongoose.model('Transaction', transactionSchema)
```

### Create (INSERT)
```javascript
const newTx = new Transaction({
  amount: 500,
  type: 'expense',
  category: 'Food',
  description: 'Lunch',
  date: '2026-04-24'
})
await newTx.save()
```

### Read (SELECT)
```javascript
// Get all
const allTx = await Transaction.find()

// Get one
const oneTx = await Transaction.findOne({ id: 'uuid-here' })

// Get with filter
const expenseTx = await Transaction.find({ type: 'expense' })
```

### Update (UPDATE)
```javascript
const updated = await Transaction.findOneAndUpdate(
  { id: 'uuid-here' },
  { amount: 600 },
  { new: true }
)
```

### Delete (DELETE)
```javascript
await Transaction.findOneAndDelete({ id: 'uuid-here' })
```

---

## 🤖 AI Integration

### Getting AI Insights
```typescript
// In services/geminiService.ts
export const getAISuggestions = async (
  transactions: Transaction[]
): Promise<AISuggestionsResult> => {
  // Prepare data
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  
  // Send to Google Gemini
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Analyze this financial data and provide suggestions...`
  })
  
  // Parse response
  const result = JSON.parse(response.text)
  
  return {
    summary: result.summary,
    totalIncome,
    totalExpenses,
    suggestions: result.suggestions
  }
}
```

### Using AI in Component
```typescript
// In AISuggestionsView.tsx
const handleGenerateSuggestions = async () => {
  setIsLoadingSuggestions(true)
  try {
    // Call AI service
    const result = await getAISuggestions(transactions)
    
    // Update state
    setAiSuggestions(result)
  } catch (e) {
    console.error('Failed to generate suggestions:', e)
  } finally {
    setIsLoadingSuggestions(false)
  }
}
```

---

## 🔄 Complete Request Cycle Example

### User adds transaction with amount 500

```
1. FRONTEND
   User fills form and clicks Save
   ↓
2. FRONTEND
   handleSave() called
   ↓
3. FRONTEND
   onSave({amount: 500, type: 'expense', ...})
   ↓
4. FRONTEND (App.tsx)
   addTransaction() called
   ↓
5. FRONTEND
   setTransactions(prev => [newTx, ...prev])
   UI updates immediately
   ↓
6. FRONTEND
   fetch('http://localhost:5000/api/transactions', {
     method: 'POST',
     body: JSON.stringify(newTx)
   })
   ↓
7. NETWORK
   HTTP POST request sent
   ↓
8. BACKEND
   app.post('/api/transactions', ...) handler
   ↓
9. BACKEND
   Validates data
   ↓
10. BACKEND
    const tx = new Transaction(newTransaction)
    await tx.save()
    ↓
11. DATABASE
    MongoDB saves document
    ↓
12. BACKEND
    res.status(201).json(tx)
    ↓
13. NETWORK
    HTTP response sent
    ↓
14. FRONTEND
    Response received
    ↓
15. FRONTEND
    Transaction persisted in database
    User sees it in Ledger
```

---

## 📚 Key Concepts

### State Management
- **useState** - Manage component state
- **useEffect** - Run code when component loads
- **Props** - Pass data to child components

### API Communication
- **fetch()** - Make HTTP requests
- **async/await** - Handle asynchronous operations
- **JSON** - Data format for requests/responses

### Database
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ORM
- **Collections** - Tables in MongoDB
- **Documents** - Rows in MongoDB

### Backend
- **Express** - Web framework
- **Routes** - API endpoints
- **Middleware** - Process requests
- **Models** - Database schemas

---

## 🎓 Next Steps

1. **Read the code** - Open files and read through them
2. **Modify something** - Change a color or text
3. **Add a feature** - Try adding a new button
4. **Debug** - Use browser console (F12) to see errors
5. **Experiment** - Try changing values and see what happens

---

**Now you understand how the code works! 🎉**

Want to modify something? Let me know!
