import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fake_job_detection.db")
conn = sqlite3.connect(DB_PATH)
c = conn.cursor()

# Add new columns to user table (ignore errors if they already exist)
columns = [
    ("bio", "TEXT DEFAULT ''"),
    ("profession", "VARCHAR(100) DEFAULT ''"),
    ("linkedin", "VARCHAR(255) DEFAULT ''"),
    ("github", "VARCHAR(255) DEFAULT ''"),
    ("website", "VARCHAR(255) DEFAULT ''"),
    ("profile_pic", "VARCHAR(500) DEFAULT ''"),
]

for col_name, col_def in columns:
    try:
        c.execute(f"ALTER TABLE user ADD COLUMN {col_name} {col_def}")
        print(f"Added column: {col_name}")
    except Exception as e:
        print(f"Skipped {col_name}: {e}")

conn.commit()
conn.close()
print("Done!")
