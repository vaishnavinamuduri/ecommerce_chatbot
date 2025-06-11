import re
import spacy
from flask import Flask, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import UserMixin, LoginManager, login_user, logout_user, login_required, current_user
from flask import send_from_directory

nlp = spacy.load("en_core_web_sm")

app = Flask(__name__)
CORS(app, origins="http://localhost:3000", supports_credentials=True)
app.config["SECRET_KEY"] = "your_super_secret_key"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///products.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_USE_SIGNER"] = True

db = SQLAlchemy(app)

class Product(db.Model):
    __tablename__ = "products"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String(50), nullable=False)

login_manager = LoginManager()
login_manager.init_app(app)

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique = True, nullable = False)
    password = db.Column(db.String(120), nullable=False)

class Chat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # ✅ Connects messages to users
    message = db.Column(db.String(500), nullable=False)
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())  # ✅ Saves when the message was sent

    user = db.relationship('User', backref=db.backref('chats', lazy=True))  # ✅ Allows easy access to user chats

    
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route("/register", methods = ["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}),400
    new_user = User(username=username, password=password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully!" }),201

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first() 
    if user and user.password == password:
        login_user(user)
        session["user_id"] = user.id  # ✅ Ensure session is stored
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401


@app.route("/check_login", methods=["GET"])
def check_login():
  return jsonify({"status": "User is logged in" if current_user.is_authenticated else "No active session"}), 200


@app.route("/logout", methods=["POST"])
def logout():
    session.clear()  # ✅ Fully clears all session data
    return jsonify({"message": "Logged out successfully!"}), 200

@app.route("/get_chat", methods=["GET"])
def get_chat():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "No active session"}), 401

    messages = Chat.query.filter_by(user_id=user_id).order_by(Chat.timestamp.asc()).all()
    return jsonify([{"message": msg.message, "timestamp": msg.timestamp} for msg in messages])


@app.route("/products", methods=["GET"])
def get_products():
    search_query = request.args.get("search", "").lower()
    category_filter = request.args.get("category", "").lower()
    max_price = request.args.get("max_price", type=int, default=None)
    sort_order = request.args.get("sort", "")
    limit = request.args.get("limit", type=int, default=10)
    offset = request.args.get("offset", type=int, default=0)

    query = Product.query
    if search_query:
        query = query.filter(Product.name.ilike(f"%{search_query}%"))
    if category_filter:
        query = query.filter(Product.category.ilike(f"%{category_filter}%"))
    if max_price:
        query = query.filter(Product.price <= max_price)

    if sort_order == "asc":
        query = query.order_by(Product.price.asc())
    elif sort_order == "desc":
        query = query.order_by(Product.price.desc())

    products = query.offset(offset).limit(limit).all()
    product_list = [{"id": p.id, "name": p.name, "price": p.price, "category": p.category} for p in products]

    return jsonify(product_list)


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    raw_text = data.get("message", "").strip().lower()

    if not raw_text:
        return jsonify({"answer": "Please enter a valid message."})

    # ✅ NLP-based tokenization for better query understanding
    doc = nlp(raw_text)
    search_terms = [token.text for token in doc if not token.is_stop and not token.is_punct or token.like_num]
    cleaned_query = " ".join(search_terms)

    # ✅ Save the chat messages under the logged in user (but don't return yet!)
    user_id = session.get("user_id")
    if user_id:
        new_message = Chat(user_id=user_id, message=raw_text)
        db.session.add(new_message)
        db.session.commit()

    # ✅ Extract price filter (e.g., "laptops under 50000")
    price_match = re.search(r"under\s*(\d+)", raw_text)
    max_price = int(price_match.group(1)) if price_match else None
    print("Extracted Price:", max_price)

    if not cleaned_query:
        return jsonify({"answer": "Please enter a valid product name."})

    # ✅ Category-based searches (returns all items in a category)
    category_products = Product.query.filter(Product.category.ilike(f"%{cleaned_query}%"))
    if max_price:
        category_products = category_products.filter(Product.price <= max_price)

    category_results = category_products.limit(5).all()
    if category_results:
        return jsonify({
            "answer": "Here are some products in this category:",
            "products": [{"name": p.name, "price": p.price, "category": p.category} for p in category_results]
        })

    # ✅ Try finding exact matches first
    matching_products = Product.query.filter(Product.name.ilike(f"%{cleaned_query}%"))
    if max_price:
        matching_products = matching_products.filter(Product.price <= max_price)

    matching_results = matching_products.all()
    if matching_results:
        return jsonify({
            "answer": "Here are some matching products:",
            "products": [{"name": p.name, "price": p.price, "category": p.category} for p in matching_results]
        })

    return jsonify({"answer": "Sorry, no matching products found."})


@app.route("/suggest", methods=["POST"])
def suggest():
    data = request.get_json()
    query = data.get("query", "").strip().lower()
    
    if not query:
        return jsonify({"suggestions": []})
    
    # ✅ Find similar product names for suggestions
    similar_products = Product.query.filter(Product.name.ilike(f"%{query}%")).limit(3).all()
    suggestions = [product.name for product in similar_products]
    
    return jsonify({"suggestions": suggestions})

@app.route('/')
def home():
    return "Flask backend is running!"


@app.route('/favicon.ico')  
def favicon():
    return send_from_directory('static', 'favicon.ico')

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        db.session.commit()
        print("Table created successfully")

    app.run(debug=True)