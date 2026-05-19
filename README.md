# 🎯 SpendWiser - MERN Stack Financial Management App

## 🚀 Deployment (Vercel Ready)

SpendWiser is now configured for a seamless deployment on **Vercel**:

1.  **Framework**: Integrated React 19 + Vite with an Express API bridge.
2.  **Configuration**: The `vercel.json` file automatically routes frontend traffic and serverless backend calls.
3.  **Database**: To host on Vercel, you must use a remote MongoDB instance (e.g., **MongoDB Atlas**) instead of a local one.
4.  **Cloud Setup**:
    - Push this repository to **GitHub**.
    - Import the project into your **Vercel Dashboard**.
    - Add these **Environment Variables**:
        - `MONGODB_URI`: Your MongoDB Atlas connection string.
        - `VITE_GEMINI_API_KEY`: Your Google Gemini API Key.

> [!TIP]
> If you see `ECONNREFUSED` when running locally, change your computer's DNS settings to **Google DNS (8.8.8.8)**. Some ISPs block MongoDB SRV records.

---

## 📚 Documentation Files

Start with these files in order:

1. **[QUICK_START.md](./QUICK_START.md)** ⚡ - 5-minute setup checklist
2. **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** 📖 - Detailed step-by-step instructions
3. **[VISUAL_GUIDE.md](./VISUAL_GUIDE.md)** 🎨 - Visual diagrams and flowcharts
4. **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** 🔧 - Common issues & solutions
5. **[MONGODB_SETUP.md](./MONGODB_SETUP.md)** 🗄️ - MongoDB installation guide

---

## ✨ Features

### 💰 Transaction Management
- ✅ Add transactions manually
- ✅ Parse bank SMS automatically
- ✅ Categorize expenses
- ✅ Track income & expenses
- ✅ Download Excel backups

### 🏦 Bank Integration
- ✅ Secure bank details storage (MongoDB)
- ✅ Account number masking
- ✅ SMS webhook integration
- ✅ Automatic transaction parsing
- ✅ Multi-bank support

### 🤖 AI Features
- ✅ AI-powered spending insights
- ✅ Personalized saving suggestions
- ✅ Investment recommendations
- ✅ Budget optimization tips
- ✅ Financial health analysis

### 📊 Analytics & Reports
- ✅ Dashboard with key metrics
- ✅ Spending breakdown by category
- ✅ Budget tracking
- ✅ Wallet management
- ✅ Data export (Excel & JSON)

### 🔐 Security
- ✅ MongoDB encryption
- ✅ Local browser storage for non-sensitive data
- ✅ Account number masking
- ✅ Secure API endpoints
- ✅ Automatic backups

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud)
- Modern web browser

### Installation

```bash
# 1. Install MongoDB (see MONGODB_SETUP.md)

# 2. Configure backend
# Edit backend/.env:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/spendwiser

# 3. Install dependencies
npm install
cd backend && npm install && cd ..

# 4. Start the app
npm run dev

# 5. Open browser
# Frontend: http://localhost:3000
# Backend: http://localhost:5000

# 6. Login
# Email: test@example.com
# Password: password123
```

---

## 📁 Project Structure

```
spendwiser/
├── backend/                    # Express + MongoDB backend
│   ├── server.js              # Main server file
│   ├── package.json           # Dependencies
│   ├── .env                   # Configuration
│   └── data.xlsx              # Excel backup
├── components/                # React components
│   ├── Dashboard.tsx
│   ├── UserProfileView.tsx
│   ├── SettingsView.tsx
│   ├── LedgerView.tsx
│   └── ...
├── services/                  # API services
│   ├── geminiService.ts       # AI service
│   └── authService.ts         # Auth service
├── App.tsx                    # Main app
├── package.json               # Frontend dependencies
└── Documentation files        # Setup guides
```

---

## 🔧 Technology Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Charts & graphs
- **Lucide Icons** - Icons

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **CORS** - Cross-origin support

### AI & Services
- **Google Gemini API** - AI insights
- **Twilio** - SMS integration (optional)

---

## 📖 How to Use

### 1. Add Bank Details
```
Sidebar → User Profile → Bank Details → Edit
Fill in your bank information → Save Details
```

### 2. Add Transactions
```
Click "Initialize Log" button
Fill in: Amount, Type, Category, Description, Date
Click "Save Transaction"
```

### 3. Parse SMS
```
Click "Decrypt SMS" button
Paste bank SMS message
Click "Parse SMS"
Transaction created automatically!
```

### 4. View Insights
```
Sidebar → AI Advisor
Click "Get AI Suggestions"
See personalized recommendations
```

### 5. Check Investments
```
Sidebar → Investment Plans
View recommended investment options
```

### 6. Export Data
```
Settings → Export Data
Download JSON backup
Or: Ledger History → Download Excel
```

---

## 🔐 Security & Privacy

- **Bank Details**: Encrypted in MongoDB, never in browser
- **Account Numbers**: Masked in UI (shows only last 4 digits)
- **Transactions**: Secure database storage with backups
- **Settings**: Local browser storage (non-sensitive)
- **Backups**: Automatic Excel + manual JSON export

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh

# If not, start MongoDB
# Windows: MongoDB should auto-start
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongodb
```

### Port Already in Use
```bash
# Change PORT in backend/.env
# Or kill the process using the port
```

### Dependencies Missing
```bash
npm install
cd backend && npm install && cd ..
```

See **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** for more issues.

---

## 📊 API Endpoints

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/download` - Download Excel

### Bank Details
- `GET /api/bank-details/:userId` - Get bank details
- `POST /api/bank-details` - Save bank details
- `DELETE /api/bank-details/:userId` - Delete bank details

### SMS
- `POST /api/sms/webhook` - Receive SMS webhook

---

## 🎯 Roadmap

### Current Features ✅
- Transaction management
- Bank details storage
- SMS parsing
- AI insights
- Investment recommendations
- Data export

### Planned Features 🔄
- Multi-currency support
- Bill reminders
- Recurring transactions
- Budget alerts
- Mobile app
- Cloud sync
- Advanced analytics

---

## 📞 Support

### Documentation
1. **QUICK_START.md** - Quick setup
2. **SETUP_GUIDE.md** - Detailed instructions
3. **VISUAL_GUIDE.md** - Visual diagrams
4. **TROUBLESHOOTING.md** - Common issues
5. **MONGODB_SETUP.md** - MongoDB guide

### Debug Steps
1. Check terminal output for errors
2. Open browser console (F12)
3. Verify MongoDB is running
4. Check `.env` configuration
5. Restart the app

---

## 📝 Environment Variables

```env
# backend/.env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/spendwiser

# For MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/spendwiser
```

---

## 🔄 Data Flow

```
User Browser (React)
    ↓
Express Backend (Node.js)
    ↓
MongoDB Database
    ↓
Excel Backup (data.xlsx)
```

---

## 💾 Data Storage

| Data | Storage | Security |
|------|---------|----------|
| Bank Details | MongoDB | ⭐⭐⭐⭐⭐ |
| Transactions | MongoDB | ⭐⭐⭐⭐⭐ |
| Wallets | Browser | ⭐⭐⭐ |
| Budgets | Browser | ⭐⭐⭐ |
| Settings | Browser | ⭐⭐⭐ |
| Backups | Excel/JSON | ⭐⭐⭐⭐ |

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- Built with React, Express, and MongoDB
- AI powered by Google Gemini
- Icons by Lucide
- Charts by Recharts

---

## 🚀 Getting Started

**New to SpendWiser?**

1. Start with **[QUICK_START.md](./QUICK_START.md)** (5 minutes)
2. Follow **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** for detailed steps
3. Check **[VISUAL_GUIDE.md](./VISUAL_GUIDE.md)** for diagrams
4. Use **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** if issues arise

---

## ✅ Verification Checklist

Before using the app, verify:

- [ ] MongoDB installed and running
- [ ] `backend/.env` configured
- [ ] Dependencies installed
- [ ] Frontend loads at `http://localhost:3000`
- [ ] Backend responds at `http://localhost:5000`
- [ ] Can login with test credentials
- [ ] Can add a transaction
- [ ] Can save bank details

---

**Ready to manage your finances? Let's go! 🎉**

For step-by-step instructions, see **[SETUP_GUIDE.md](./SETUP_GUIDE.md)**
