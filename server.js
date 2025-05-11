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

const Client = mongoose.model("Client", clientSchema, "clients");

app.use(cors());
app.use(express.json());

// 📍 API: Отримати всі клієнти
app.get("/clients", async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    console.error("❌ Помилка отримання клієнтів:", err);
    res.status(500).json({ error: "Помилка сервера" });
  }
});
// const Transaction = mongoose.model("Transaction", transactionSchema, "transactions");
// // 📍 API: Отримати всі транзакції
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
