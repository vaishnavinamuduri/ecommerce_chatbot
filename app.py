from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import inspect

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///products.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String(50), nullable=False)

@app.route("/")
def home():
    return "Hello! The backend is running"

@app.route("/products")
def get_products():
    search_query = request.args.get('search', '').lower()
    category_filter = request.args.get('category', '').lower()
    sort_order = request.args.get('sort', '')
    limit = request.args.get('limit', type=int, default=10)
    offset = request.args.get('offset', type=int, default=0)

    query = Product.query
    if search_query:
        query = query.filter(Product.name.ilike(f"%{search_query}%"))
    if category_filter:
        query = query.filter(Product.category.ilike(f"%{category_filter}%"))

    if sort_order == 'asc':
        query = query.order_by(Product.price.asc())
    elif sort_order == 'desc':
        query = query.order_by(Product.price.desc())

    products = query.offset(offset).limit(limit).all()
    product_list = [{"id": p.id, "name": p.name, "price": p.price, "category": p.category} for p in products]

    return jsonify(product_list)

@app.post("/predict")
def predict():
    data = request.get_json()
    text = data.get("message", "").strip().lower()

    if not text:
        return jsonify({"answer": "Please enter a valid message."})

    # Try full phrase match first
    matching_products = Product.query.filter(Product.name.ilike(f"%{text}%")).all()

    # If no exact match, try searching each word individually
    if not matching_products:
        words = text.split()
        for word in words:
            matching_products = Product.query.filter(Product.name.ilike(f"%{word}%")).all()
            if matching_products:
                break  

    if matching_products:
        product_list = [{"name": p.name, "price": p.price, "category": p.category} for p in matching_products]
        return jsonify({"answer": "Here are some matching products:", "products": product_list})  # ✅ Fixed JSON formatting

    return jsonify({"answer": "Sorry, no matching products found."})


@app.route("/debug_db")
def debug_db():
    with app.app_context():
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()  # ✅ Updated method
        products = Product.query.all()

        product_list = [{"id": p.id, "name": p.name, "price": p.price, "category": p.category} for p in products]
        return jsonify({"tables": tables, "products": product_list})

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        db.session.commit()
        print("Table created successfully")
    app.run(debug=True)
