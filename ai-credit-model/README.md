# AI Credit Scoring Model

Advanced credit scoring system using machine learning and reinforcement learning for the Stabilisha platform.

## Features

- **Random Forest Classifier**: Predicts credit scores based on user behavior
- **Logistic Regression**: Categorizes users into credit score ranges
- **Reinforcement Learning**: Continuously improves predictions based on user feedback
- **Feature Engineering**: Extracts meaningful features from user data

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Train the models:
```bash
python credit_scorer.py
```

3. Start the API server:
```bash
python api_server.py
```

The API will be available at `http://localhost:5001`

## API Endpoints

### Calculate Credit Score
```
POST /api/calculate-score
```

Request body:
```json
{
  "totalEarnings": 75000,
  "walletBalance": 15000,
  "completedGigs": 20,
  "avgRating": 4.5,
  "daysActive": 180,
  "paymentDelays": 1,
  "saccoContributions": 8000,
  "loanRepayments": 3
}
```

### Update Reinforcement Learning
```
POST /api/update-learning
```

## Integration with NextJS App

The AI model can be integrated with the NextJS app by calling the API endpoints from the credit score route.