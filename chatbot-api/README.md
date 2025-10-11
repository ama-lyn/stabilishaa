# Chatbot API

Flask-based chatbot API for the Stabilisha platform.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## Usage

Send POST requests to `/api/chat` with:
```json
{
  "user_id": "demo",
  "role": "worker",
  "message": "help"
}
```