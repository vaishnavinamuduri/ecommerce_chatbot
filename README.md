E-Commerce Chatbot
🔹 Project Overview
This chatbot enhances the e-commerce shopping experience by enabling users to search for products, get smart recommendations, and interact through a conversational UI. Built with Flask (backend) and React (frontend), it integrates basic NLP techniques to refine product queries.

🔹 Features
✔ Intelligent Product Search – Uses NLP to find relevant products based on user queries. 
✔ User Authentication & Session Management – Users can register, log in, and maintain session continuity. 
✔ Chat History Persistence – Saves user-specific interactions for personalized responses. 
✔ Dynamic Product Suggestions – Suggests alternative matches if the exact product isn’t found. 
✔ Mock Inventory System – Database-backed model to store and retrieve product details.

🔹 Installation Guide

Backend (Flask) :
     1️⃣ Clone the repository  -->  git clone <your-repo-link>
                                    cd ecommerce_chatbot
     2️⃣ Install dependencies  -->  pip install -r requirements.txt
     3️⃣ Set up the database   -->  python
                                   >>> from app import db
                                   >>> db.create_all()
                                   >>> exit()
     4️⃣ Start the backend    
        server                -->  flask run
        
Frontend (React):
     1️⃣ Navigate to the frontend directory  -->  cd botui
     2️⃣ Install frontend dependencies       -->  npm install
     3️⃣ Run the React application           -->  npm start


🔹 API Endpoints 

User Authentication:
Endpoint	          Method	          Description
/register	          POST	          Registers a new user
/login	             POST	          Authenticates the user
/check_login       	GET	           Verifies if user session is active
/logout	            POST	          Logs out the current user

Product Search & Recommendations:
Endpoint	          Method	          Description
/products	          GET	            Fetches products with filters
/predict	           POST	           Handles NLP-based search queries
/suggest	           POST	           Returns alternative product recommendations

Chat History
Endpoint	          Method	          Description
/get_chat	         GET	             Retrieves saved chat history for a user

🔹 Technologies Used

Backend: Flask, Flask-Login, SQLAlchemy, Spacy NLP
Frontend: React, JavaScript, CSS
Database: SQLite
API: RESTful architecture with JSON responses

🔹 Future Enhancements

📌 Improve Search Accuracy – Implement fuzzy matching techniques for better product queries. 
📌 Enhance UI Experience – Add interactive filtering options, such as price range sliders. 
📌 Expand NLP Capabilities – Refine user intent detection for smarter responses. 
📌 Include Product Images – Display product visuals alongside search results.
     
                          
