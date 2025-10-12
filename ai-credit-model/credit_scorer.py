import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import joblib
import json

class CreditScorer:
    def __init__(self):
        self.rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.lr_model = LogisticRegression(random_state=42)
        self.scaler = StandardScaler()
        self.q_table = {}  # For reinforcement learning
        self.alpha = 0.1   # Learning rate
        self.gamma = 0.9   # Discount factor
        
    def extract_features(self, user_data):
        """Extract features from user data"""
        features = {
            'total_earnings': user_data.get('total_earnings', 0),
            'wallet_balance': user_data.get('wallet_balance', 0),
            'completed_gigs': user_data.get('completed_gigs', 0),
            'avg_rating': user_data.get('avg_rating', 0),
            'days_active': user_data.get('days_active', 0),
            'payment_delays': user_data.get('payment_delays', 0),
            'sacco_contributions': user_data.get('sacco_contributions', 0),
            'loan_repayments': user_data.get('loan_repayments', 0)
        }
        return np.array(list(features.values())).reshape(1, -1)
    
    def generate_training_data(self):
        """Generate synthetic training data"""
        np.random.seed(42)
        n_samples = 1000
        
        data = {
            'total_earnings': np.random.normal(50000, 20000, n_samples),
            'wallet_balance': np.random.normal(10000, 5000, n_samples),
            'completed_gigs': np.random.poisson(15, n_samples),
            'avg_rating': np.random.normal(4.2, 0.8, n_samples),
            'days_active': np.random.randint(30, 365, n_samples),
            'payment_delays': np.random.poisson(2, n_samples),
            'sacco_contributions': np.random.normal(5000, 2000, n_samples),
            'loan_repayments': np.random.randint(0, 5, n_samples)
        }
        
        # Create credit score based on features
        scores = []
        for i in range(n_samples):
            score = 300  # Base score
            score += min(data['total_earnings'][i] / 1000, 200)
            score += min(data['wallet_balance'][i] / 500, 100)
            score += data['completed_gigs'][i] * 5
            score += data['avg_rating'][i] * 30
            score += data['days_active'][i] * 0.5
            score -= data['payment_delays'][i] * 20
            score += min(data['sacco_contributions'][i] / 100, 50)
            score += data['loan_repayments'][i] * 10
            scores.append(min(max(score, 300), 850))
        
        df = pd.DataFrame(data)
        df['credit_score'] = scores
        df['score_category'] = pd.cut(df['credit_score'], 
                                    bins=[300, 550, 650, 750, 850], 
                                    labels=['Poor', 'Fair', 'Good', 'Excellent'])
        
        return df
    
    def train_models(self):
        """Train the ML models"""
        df = self.generate_training_data()
        
        X = df.drop(['credit_score', 'score_category'], axis=1)
        y_regression = df['credit_score']
        y_classification = df['score_category']
        
        X_train, X_test, y_reg_train, y_reg_test, y_clf_train, y_clf_test = train_test_split(
            X, y_regression, y_classification, test_size=0.2, random_state=42
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train Random Forest for score prediction
        self.rf_model.fit(X_train_scaled, y_reg_train)
        
        # Train Logistic Regression for category classification
        self.lr_model.fit(X_train_scaled, y_clf_train)
        
        print("Models trained successfully!")
        
    def rl_update(self, state, action, reward, next_state):
        """Update Q-table using reinforcement learning"""
        state_key = str(state)
        if state_key not in self.q_table:
            self.q_table[state_key] = {}
        
        if action not in self.q_table[state_key]:
            self.q_table[state_key][action] = 0
        
        # Q-learning update
        old_value = self.q_table[state_key][action]
        next_max = max(self.q_table.get(str(next_state), {}).values(), default=0)
        new_value = old_value + self.alpha * (reward + self.gamma * next_max - old_value)
        self.q_table[state_key][action] = new_value
    
    def calculate_credit_score(self, user_data):
        """Calculate credit score using ensemble of models"""
        features = self.extract_features(user_data)
        features_scaled = self.scaler.transform(features)
        
        # Random Forest prediction
        rf_score = self.rf_model.predict(features_scaled)[0]
        
        # Logistic Regression prediction
        lr_proba = self.lr_model.predict_proba(features_scaled)[0]
        
        # Combine predictions
        final_score = rf_score * 0.7 + np.dot(lr_proba, [400, 550, 700, 800]) * 0.3
        
        # Apply reinforcement learning adjustment
        state = tuple(features[0][:4])  # Use first 4 features as state
        rl_adjustment = self.q_table.get(str(state), {}).get('score_boost', 0)
        final_score += rl_adjustment
        
        return {
            'credit_score': int(np.clip(final_score, 300, 850)),
            'rf_prediction': int(rf_score),
            'lr_probabilities': lr_proba.tolist(),
            'factors': {
                'gig_consistency': min(user_data.get('completed_gigs', 0) * 5, 100),
                'payment_history': max(100 - user_data.get('payment_delays', 0) * 10, 0),
                'financial_health': min(user_data.get('wallet_balance', 0) / 500, 100)
            }
        }
    
    def save_models(self):
        """Save trained models"""
        joblib.dump(self.rf_model, 'rf_model.pkl')
        joblib.dump(self.lr_model, 'lr_model.pkl')
        joblib.dump(self.scaler, 'scaler.pkl')
        
        with open('q_table.json', 'w') as f:
            json.dump(self.q_table, f)
    
    def load_models(self):
        """Load trained models"""
        try:
            self.rf_model = joblib.load('rf_model.pkl')
            self.lr_model = joblib.load('lr_model.pkl')
            self.scaler = joblib.load('scaler.pkl')
            
            with open('q_table.json', 'r') as f:
                self.q_table = json.load(f)
        except FileNotFoundError:
            print("Models not found. Training new models...")
            self.train_models()
            self.save_models()

if __name__ == "__main__":
    scorer = CreditScorer()
    scorer.train_models()
    scorer.save_models()
    
    # Test with sample data
    test_data = {
        'total_earnings': 75000,
        'wallet_balance': 15000,
        'completed_gigs': 20,
        'avg_rating': 4.5,
        'days_active': 180,
        'payment_delays': 1,
        'sacco_contributions': 8000,
        'loan_repayments': 3
    }
    
    result = scorer.calculate_credit_score(test_data)
    print(f"Credit Score: {result['credit_score']}")
    print(f"Factors: {result['factors']}")