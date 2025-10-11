from flask import Flask, request, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


# Session memory
user_state = {}


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_id = data.get("user_id", "demo")
    role = data.get("role", "worker")   # "client" or "worker"
    message = data.get("message", "").lower().strip()


    if user_id not in user_state:
        user_state[user_id] = {"awaiting_score": False, "mode": None, "role": role}


    state = user_state[user_id]
    state["role"] = role  # update role


    # === GUIDE MODE MENU ===
    if any(word in message for word in ["how", "use", "help", "guide", "where", "site"]):
        state["mode"] = "guide-menu"
        if role == "client":
            return jsonify({"reply": (
                "As a Client 🧑💼, what do you want help with?\n"
                "1️⃣ Signing up\n"
                "2️⃣ Posting gigs\n"
                "3️⃣ Making payments\n"
                "4️⃣ Reviewing workers"
            )})
        else:
            return jsonify({"reply": (
                "As a Worker 👷, what do you want help with?\n"
                "1️⃣ Signing up\n"
                "2️⃣ Completing gigs\n"
                "3️⃣ Withdrawing money\n"
                "4️⃣ Improving score"
            )})


    # === GUIDE MODE RESPONSES ===
    if state.get("mode") == "guide-menu":
        if role == "client":
            if message in ["1", "sign", "signup"]:
                return jsonify({"reply": "👉 To sign up as a Client: Click 'Register', choose Client, then verify your account."})
            elif message in ["2", "post", "gig"]:
                return jsonify({"reply": "👉 To post a gig: Dashboard → 'Create Gig' → fill title, description, budget → Submit."})
            elif message in ["3", "payment", "pay"]:
                return jsonify({"reply": "👉 To pay workers: Dashboard → 'Payments' → choose MPesa or card."})
            elif message in ["4", "review", "rate"]:
                return jsonify({"reply": "👉 After a gig, go to 'My Gigs' → select worker → leave a review and rating."})
        else:  # Worker
            if message in ["1", "sign", "signup"]:
                return jsonify({"reply": "👉 To sign up as a Worker: Click 'Register', choose Worker, and complete your profile."})
            elif message in ["2", "complete", "gig"]:
                return jsonify({"reply": "👉 To complete a gig: Accept gig from Dashboard → Work → Submit proof → wait for approval."})
            elif message in ["3", "withdraw"]:
                return jsonify({"reply": "👉 To withdraw: Wallet → 'Withdraw' → link MPesa or bank → confirm transaction."})
            elif message in ["4", "score"]:
                return jsonify({"reply": "👉 Improve your score by completing gigs, saving regularly, and keeping good reviews."})


    # === CREDIT SCORE MODE ===
    if any(word in message for word in ["score", "credit", "increase", "improve"]):
        state["awaiting_score"] = True
        return jsonify({"reply": "🚀 Let's check your credit score. What's your current score (1–100)?"})


    if state["awaiting_score"]:
        try:
            score = int([s for s in message.split() if s.isdigit()][0])
        except:
            return jsonify({"reply": "❗ Please give me a number between 1 and 100."})


        state["awaiting_score"] = False
        if score < 40:
            return jsonify({"reply": f"Your score is {score} 🔴 (Low). Advice: Start saving, complete gigs, and repay loans on time."})
        elif score < 70:
            return jsonify({"reply": f"Your score is {score} 🟡 (Moderate). Advice: Save more, take on more gigs, and keep good client reviews."})
        else:
            return jsonify({"reply": f"Your score is {score} 🟢 (Strong). Advice: Keep saving, repay early, and maintain your reputation!"})


    # === DEFAULT RESPONSE ===
    return jsonify({
        "reply": "Hi 👋 I can help with your **credit score** or **site guide**. Type 'help' to see numbered options."
    })


if __name__ == "__main__":
    print("✅ Chatbot API running on http://localhost:5000")
    app.run(debug=True, port=5000)