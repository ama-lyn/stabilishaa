import express from "express"
import crypto from "crypto"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()
const port = process.env.PORT || 4000

//  Use raw body for Paystack signature verification
app.use("/api/paystack/webhook", express.raw({ type: "application/json" }))

//  Use JSON body for other routes
app.use(express.json())
app.use(cors({ origin: "*" }))

//  Single in-memory store for all payments (temporary)
let payments = []

/**
 *  PAYSTACK WEBHOOK
 * Paystack sends POST requests here when a payment event occurs.
 */
app.post("/api/paystack/webhook", (req, res) => {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY
    const signature = req.headers["x-paystack-signature"]

    // Generate HMAC SHA512 hash from the raw request body
    const hash = crypto.createHmac("sha512", secret).update(req.body).digest("hex")

    if (hash !== signature) {
      console.log("Invalid Paystack signature")
      return res.status(401).send("Invalid signature")
    }

    const event = JSON.parse(req.body.toString())

    // Handle successful charge
    if (event.event === "charge.success") {
      const d = event.data
      const payment = {
        reference: d.reference,
        transaction_code: d.id, // Paystack transaction ID
        amount: d.amount / 100, // Convert from kobo to normal currency
        currency: d.currency,
        email: d.customer.email,
        name: d.metadata?.name || "Unknown",
        phone: d.metadata?.phone || "N/A",
        channel: d.channel, // 'mobile_money' or 'card'
        paid_at: d.paid_at,
        status: d.status, // should be "success"
      }

      //  Store payment in memory
      payments.push(payment)

      console.log("Payment received:", payment)
    }

    res.sendStatus(200)
  } catch (err) {
    console.error(" Error in webhook:", err)
    res.sendStatus(500)
  }
})

/**
 * FRONTEND ENDPOINT — Get all transactions
 */
app.get("/api/transactions", (req, res) => {
  // Sort newest first
  const sorted = [...payments].sort((a, b) => new Date(b.paid_at) - new Date(a.paid_at))
  res.json(sorted)
})

/**
 * Root check
 */
app.get("/", (req, res) => {
  res.send(" Admin Backend Running — M-Pesa/Paystack Integration Active")
})

app.listen(port, () => {
  console.log(` Server running on port ${port}`)
})
