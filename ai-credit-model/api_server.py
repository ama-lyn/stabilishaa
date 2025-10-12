from flask import Flask, request, jsonify
from flask_cors import CORS
from credit_scorer import CreditScorer
import json

app = Flask(__name__)
CORS(app)

# Initialize credit scorer
scorer = CreditScorer()
scorer.load_models()

@app.route('/api/calculate-score', methods=['POST'])
def calculate_score():
    try:
        data = request.get_json()
        
        # Extract user data from request
        user_data = {
            'total_earnings': data.get('totalEarnings', 0),
            'wallet_balance': data.get('walletBalance', 0),
            'completed_gigs': data.get('completedGigs', 0),
            'avg_rating': data.get('avgRating', 0),
            'days_active': data.get('daysActive', 0),
            'payment_delays': data.get('paymentDelays', 0),
            'sacco_contributions': data.get('saccoContributions', 0),
            'loan_repayments': data.get('loanRepayments', 0)
        }
        
        # Calculate credit score
        result = scorer.calculate_credit_score(user_data)
        
        return jsonify({
            'success': True,
            'creditScore': result['credit_score'],
            'factors': result['factors'],
            'modelPredictions': {
                'randomForest': result['rf_prediction'],
                'logisticRegression': result['lr_probabilities']
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/update-learning', methods=['POST'])
def update_learning():
    try:
        data = request.get_json()
        
        state = data.get('state')
        action = data.get('action')
        reward = data.get('reward')
        next_state = data.get('nextState')
        
        scorer.rl_update(state, action, reward, next_state)
        scorer.save_models()
        
        return jsonify({'success': True, 'message': 'Learning updated'})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'AI Credit Scorer'})

if __name__ == '__main__':
    print("🤖 AI Credit Scoring API running on http://localhost:5001")
    app.run(debug=True, port=5001)