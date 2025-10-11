#!/usr/bin/env python3
"""
Training script for the AI credit scoring model
"""

from credit_scorer import CreditScorer
import numpy as np

def main():
    print("Starting AI Credit Scoring Model Training...")
    
    # Initialize the credit scorer
    scorer = CreditScorer()
    
    # Train the models
    print("Training Random Forest and Logistic Regression models...")
    scorer.train_models()
    
    # Save the trained models
    print("Saving trained models...")
    scorer.save_models()
    
    # Test the model with sample data
    print("Testing model with sample data...")
    
    test_cases = [
        {
            'name': 'High Performer',
            'data': {
                'total_earnings': 100000,
                'wallet_balance': 25000,
                'completed_gigs': 35,
                'avg_rating': 4.8,
                'days_active': 300,
                'payment_delays': 0,
                'sacco_contributions': 15000,
                'loan_repayments': 5
            }
        },
        {
            'name': 'Average User',
            'data': {
                'total_earnings': 50000,
                'wallet_balance': 10000,
                'completed_gigs': 15,
                'avg_rating': 4.2,
                'days_active': 150,
                'payment_delays': 2,
                'sacco_contributions': 5000,
                'loan_repayments': 2
            }
        },
        {
            'name': 'New User',
            'data': {
                'total_earnings': 15000,
                'wallet_balance': 2000,
                'completed_gigs': 3,
                'avg_rating': 4.0,
                'days_active': 30,
                'payment_delays': 1,
                'sacco_contributions': 1000,
                'loan_repayments': 0
            }
        }
    ]
    
    for test_case in test_cases:
        result = scorer.calculate_credit_score(test_case['data'])
        print(f"\n{test_case['name']}:")
        print(f"  Credit Score: {result['credit_score']}")
        print(f"  Gig Consistency: {result['factors']['gig_consistency']:.1f}%")
        print(f"  Payment History: {result['factors']['payment_history']:.1f}%")
        print(f"  Financial Health: {result['factors']['financial_health']:.1f}%")
    
    print("\nModel training completed successfully!")
    print("You can now start the API server with: python api_server.py")

if __name__ == "__main__":
    main()