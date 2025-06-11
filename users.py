from app import app,db, User

# ✅ Create a list of users to add
users_to_add = [
    User(username="user1", password="password123"),
    User(username="user2", password="password456"),
    User(username="user3", password="pass789"),
    User(username="user4", password="securepass"),
    User(username="user5", password="testpass"),
]

# ✅ Insert users into the database
with app.app_context():
    db.session.add_all(users_to_add)
    db.session.commit()
    print("Users added successfully!")
