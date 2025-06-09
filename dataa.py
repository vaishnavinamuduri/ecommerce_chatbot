from app import app,db,Product
import random
categories = ["Electronics","Fashion","Books","Groceries","Accessories","Sports"]

product_names = {
    "Electronics": ["Samsung smart phone", "Laptop Pro", "Wireless Earbuds", "Smartwatch ", "Gaming Mouse", "Power Bank", "Wireless Keyboard", "Monitor"],
    "Fashion": ["Denim Jacket", "Sneakers", "Graphic T-Shirt", "Leather Wallet", "Sunglasses"],
    "Books": ["Little women","The Alchemist","Chic Lit", "IKIGAI", ],
    "Groceries": [ "Rice", "Green Tea", "Almonds", "Oil", "Chips", "Detergent", "Pulses", "Soft Drinks"],
    "Accessories": ["Bluetooth Speaker", "Power Bank", "Travel Backpack", "Digital Watch", "Phone Case"],
    "Sports": ["Yoga Mat", "Tennis Racket", "Running Shoes", "Football", "Cricket Bat"]
}

sample_products = [
    Product(
        name=random.choice(product_names[category]), 
        price=random.randint(100, 50000),
        category=category
    )
    for category in product_names 
    for _ in range(20)  
]

with app.app_context():
    db.session.add_all(sample_products) 
    db.session.commit()