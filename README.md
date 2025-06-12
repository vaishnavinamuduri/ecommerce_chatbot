E-Commerce Chatbot
# E-Commerce Chatbot
## 1. Project Overview
This chatbot enhances the e-commerce shopping experience by enabling users to search for products, get
smart recommendations, and interact through a conversational UI. Built with **Flask** (backend) and
**React** (frontend), it integrates basic **NLP techniques** to refine product queries.
---
## 2. Features
- **Intelligent Product Search** - Uses NLP to find relevant products based on user queries.
- **User Authentication & Session Management** - Users can register, log in, and maintain session
continuity.
- **Chat History Persistence** - Saves user-specific interactions for personalized responses.
- **Dynamic Product Suggestions** - Suggests alternative matches if the exact product isn't found.
- **Advanced Product Filtering** - Filter products by categories (Electronics, Fashion, Books, Groceries, Accessories, Sports),       price range, and availability status.
- **Mock Inventory System** - Database-backed model to store and retrieve product details.
---
## 3. Installation Guide
### -> Backend (Flask):
1. **Clone the repository**
 ```bash
 git clone <your-repo-link>
 cd ecommerce_chatbot
 ```
2. **Install dependencies**
E-Commerce Chatbot
 ```bash
 pip install -r requirements.txt
 ```
3. **Set up the database**
 ```bash
 python
 >>> from app import db
 >>> db.create_all()
 >>> exit()
 ```
4. **Start the backend server**
 ```bash
 flask run
 ```
### -> Frontend (React):
1. **Navigate to the frontend directory**
 ```bash
 cd botui
 ```
2. **Install frontend dependencies**
 ```bash
 npm install
 ```
3. **Run the React application**
 ```bash
 npm start
E-Commerce Chatbot
 ```
---
## 4. API Endpoints
### -> User Authentication:
- `POST /register` - Registers a new user
- `POST /login` - Authenticates the user
- `GET /check_login` - Verifies if user session is active
- `POST /logout` - Logs out the current user
### -> Product Search & Recommendations:
| Endpoint | Method | Description |
|--------------|--------|-------------------------------------------|
| `/products` | GET | Fetches products with category, price, and availability filters | `category`, `price`, `availability` |
| `/predict` | POST | Handles NLP-based search queries |
| `/suggest` | POST | Returns alternative product recommendations |
### -> Chat History:
| Endpoint | Method | Description |
|--------------|--------|-------------------------------------------|
| `/get_chat` | GET | Retrieves saved chat history for a user |
---
## 5. Technologies Used
- **Backend**: Flask, Flask-Login, SQLAlchemy, Spacy NLP
E-Commerce Chatbot
- **Frontend**: React, JavaScript, CSS
- **Database**: SQLite
- **API**: RESTful architecture with JSON responses
---
## 6. Future Enhancements
- **Improve Search Accuracy** - Implement fuzzy matching techniques for better product queries.
- - **Enhance UI Experience** - Add interactive filtering options, such as price range sliders, multi-                                                             select category filters, and sorting capabilities.
- **Expand NLP Capabilities** - Refine user intent detection for smarter responses.
- **Include Product Images** - Display product visuals alongside search results. 
