import express from "express";
import crypto from "crypto";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Use raw body for signature verification
app.use(
  "/api/paystack/webhook",
  express.raw({ type: "application/json" })
);

// Use normal JSON for other routes
app.use(express.json());
app.use(cors());

// Temporary in-memory store (replace with DB later)
let payments = [];

/**
 * PAYSTACK WEBHOOK ENDPOINT
 * Paystack sends POST requests here after a payment event.
 */
app.post("/api/paystack/webhook", (req, res) => {
    try {
      const secret = process.env.PAYSTACK_SECRET_KEY;
      const hash = crypto
        .createHmac("sha512", secret)
        .update(req.body)
        .digest("hex");
  
      const signature = req.headers["x-paystack-signature"];
      if (hash !== signature) {
        console.log("Invalid Paystack signature");
        return res.status(401).send("Invalid signature");
      }
  
      const event = JSON.parse(req.body.toString());
  
      if (event.event === "charge.success") {
        const d = event.data;
        const payment = {
          reference: d.reference,
          transaction_code: d.id,      // Paystack transaction ID
          amount: d.amount / 100,      // convert to normal KES
          currency: d.currency,
          email: d.customer.email,
          name: d.metadata?.name,
          phone: d.metadata?.phone,
          channel: d.channel,          // should be 'mobile_money' for M-Pesa
          paid_at: d.paid_at,
          status: d.status
        };
  
        payments.push(payment);
        console.log("Payment received:", payment);
      }
  
      res.sendStatus(200);
    } catch (err) {
      console.error("Error in webhook:", err);
      res.sendStatus(500);
    }
  });

/**
 * ADMIN API — GET ALL PAYMENTS
 * Your admin panel can call this to show recent transactions
 */
app.get("/api/payments", (req, res) => {
  res.json(payments);
});

app.get("/", (req, res) => {
  res.send("Admin Backend Running");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
