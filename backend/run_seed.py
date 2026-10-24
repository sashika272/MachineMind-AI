import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.seed.demo_data import seed_database

if __name__ == "__main__":
    print("Running database seed...")
    seed_database()
    print("Database seeded successfully!")
