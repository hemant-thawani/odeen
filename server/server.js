const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

mongoose.connect('mongodb://127.0.0.1:27017/notes')
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

const ProfileSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const Profile = mongoose.model('Profile', ProfileSchema);

const TransactionSchema = new mongoose.Schema({
    username: { type: String, required: true },
    amount: { type: Number, required: true },
    transaction_name: { type: String, required: true },
    transaction_type: { type: String, enum: ['Income', 'Expense'], required: true },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now },
});
const Transaction = mongoose.model('Transaction', TransactionSchema);

app.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await Profile.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }
        const newUser = new Profile({ username, password });
        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: { username: newUser.username } });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await Profile.findOne({ username, password });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        res.json({ message: "Login successful", user: { username: user.username } });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


app.post('/transactions', async (req, res) => {
    try {
        const { username, amount, transaction_name, transaction_type, category } = req.body;

        const userExists = await Profile.findOne({ username });
        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }

        const newTransaction = new Transaction({
            username,
            amount,
            transaction_name,
            transaction_type,
            category,
        });
        await newTransaction.save();
        res.status(201).json({ message: "Transaction saved", transaction: newTransaction });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.get('/transactions/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const transactions = await Transaction.find({ username }).sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching transactions" });
    }
});

//
app.get('/transactions/:username/history', async (req, res) => {
    try {
        const { username } = req.params;

        const transactions = await Transaction.find({ username }).sort({ date: -1 });

        // Group by "Month Year" e.g. "March 2026"
        const grouped = {};
        transactions.forEach((t) => {
            const date = new Date(t.date);
            const key = date.toLocaleString('default', { month: 'long', year: 'numeric' });

            if (!grouped[key]) {
                grouped[key] = { transactions: [], totalIncome: 0, totalExpense: 0 };
            }

            grouped[key].transactions.push(t);

            if (t.transaction_type === 'Income') {
                grouped[key].totalIncome += t.amount;
            } else {
                grouped[key].totalExpense += t.amount;
            }
        });

        res.json(grouped);
    } catch (error) {
        res.status(500).json({ message: "Error fetching history" });
    }
});

// ─── Misc ────────────────────────────────────────────────────
app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.url}`);
    next();
});

app.get('/profile', async (req, res) => {
    try {
        const profiles = await Profile.find();
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ message: "Error fetching profiles" });
    }
});

app.listen(5000, '0.0.0.0', () => {
    console.log('Server running on http://localhost:5000');
});