# 🛍️ E-Commerce Chatbot  

## Overview  
This project is an **AI-powered chatbot** built for an e-commerce platform. It helps users search for products based on keywords and provides recommendations from a database. The chatbot connects a **Flask backend** with a **React.js frontend**, ensuring dynamic interactions.  

## Tech Stack  
- **Backend:** Flask, SQLAlchemy, SQLite  
- **Frontend:** React.js  
- **API Communication:** Flask-CORS  

## 🚀 Features  
✅ **Smart Product Search** – Matches queries with items dynamically  
✅ **Seamless Backend-Frontend Integration** – React UI fetches responses via Flask API  
✅ **Styled Chat Interface** – Clean, user-friendly message bubbles  
✅ **Error Handling** – Prevents crashes due to empty or invalid inputs  
✅ **Expandable Design** – Ready for future upgrades like price filtering  

## 🔗 API Endpoints  
| Endpoint | Method | Description |  
|----------|--------|-------------|  
| `/predict` | `POST` | Returns products based on user queries |  
| `/products` | `GET` | Fetches product details from the database |  
| `/debug_db` | `GET` | Provides database health and stored products |  

## 🛠️ Installation & Setup  
### **1️⃣ Clone the Repository**  
```bash
git clone https://github.com/your-repo/chatbot
cd chatbot

2️⃣ Backend Setup

pip install -r requirements.txt
python app.py

3️⃣ Frontend Setup
cd frontend
npm install
npm start

4️⃣ Access the Chatbot
Visit: http://localhost:3000
🚀 Future Enhancements
✅ Dark Mode – Toggle between themes ✅ Better NLP Understanding – Improve search flexibility ✅ Category & Price Filters – Users can refine searches


Challenges & Solutions
Query Matching Issues → Fixed by improving search logic in Flask

CORS Errors → Resolved via Flask-CORS integration

UI Styling Improvements → Enhanced message display & layout

Conclusion
This chatbot efficiently connects users with relevant e-commerce products, streamlining their shopping experience through AI-powered interactions.
 Developed by: Vaishnavi Namuduri
