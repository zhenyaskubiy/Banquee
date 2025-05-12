const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

const MONGO_URI = "mongodb://127.0.0.1:27017/bank";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Підключено до MongoDB"))
  .catch((error) => console.error("❌ Помилка підключення:", error));

app.use(express.static('public'));

const clientSchema  = new mongoose.Schema({
  fullName: String,
  passport: String,
  phone: String,
  email: String,
});

const accountSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  depositId: { type: mongoose.Schema.Types.ObjectId, ref: 'Deposit', required: true },
  balance: Number,
  currency: String,
  createdAt: { type: Date, default: Date.now }
});

const depositSchema = new mongoose.Schema({
  name: String,
  minAmount: Number,
  durationMonths: Number,
  conditions: String
});

const Account = mongoose.model("Account", accountSchema, "accounts");

const Client = mongoose.model("Client", clientSchema, "clients");

const Deposit = mongoose.model("Deposit", depositSchema, "deposits");
app.use(cors());
app.use(express.json());

app.get("/clients", async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    console.error("❌ Помилка отримання клієнтів:", err);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

app.post("/accounts", async (req, res) => {
  try {
    const { clientId, depositId, balance, currency } = req.body;

    const newAccount = new Account({
      clientId,
      depositId,
      balance,
      currency
    });

    await newAccount.save();
    res.status(201).json({ message: "Рахунок створено", account: newAccount });
  } catch (err) {
    console.error("❌ Помилка створення рахунку:", err);
    res.status(500).json({ error: "Помилка при створенні рахунку", details: err.message });
  }
});

app.get("/deposits", async (req, res) => {
  try {
    const deposits = await Deposit.find().limit(5);
    res.json(deposits);
  } catch (err) {
    console.error("❌ Помилка отримання депозитів:", err);
    res.status(500).json({ error: "Помилка сервера" });
  }
});
// const Transaction = mongoose.model("Transaction", transactionSchema, "transactions");
// app.get("/transactions", async (req, res) => {
//   try {
//     const transactions = await Transaction.find().sort({ date: -1 });
//     res.json(transactions);
//   } catch (err) {
//     console.error("❌ Помилка отримання транзакцій:", err);
//     res.status(500).json({ error: "Помилка сервера" });
//   }
// });

app.listen(PORT, () => {
  console.log(`🚀 Сервер працює на http://localhost:${PORT}`);
});
