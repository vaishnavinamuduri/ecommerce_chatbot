from flask import Flask,jsonify
from flask_sqlalchemy import SQLAlchemy
from flask import request

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///products.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(100), nullable = False)
    price = db.Column(db.Integer, nullable = False)
    category = db.Column(db.String(50),nullable =  False)

@app.route("/")
def home():
    return "Hello! The backend is running"

@app.route("/products")
def get_products():
    search_query = request.args.get('search', '')  
    category_filter = request.args.get('category', '')  
    sort_order = request.args.get('sort', '')
    limit = request.args.get('limit', type=int, default=10)  
    offset = request.args.get('offset', type=int, default=0)
    
    query = Product.query
    if search_query:
        query = query.filter(Product.name.ilike(f"%{search_query}%"))
    if category_filter:
        query = query.filter(Product.category.ilike(category_filter))

    if sort_order == 'asc':
        query = query.order_by(Product.price.asc())  
    elif sort_order == 'desc':
        query = query.order_by(Product.price.desc())  

    products = query.offset(offset).limit(limit).all()

    product_list = [{"id": p.id, "name": p.name, "price": p.price, "category": p.category} for p in products]
    return jsonify(product_list)



if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug = True)

