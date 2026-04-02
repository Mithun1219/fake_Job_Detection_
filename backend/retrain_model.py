import pandas as pd
import joblib
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "fake_job_postings.csv")
MODEL_PATH = os.path.join(BASE_DIR, "app", "fake_job_model.pkl")
VEC_PATH   = os.path.join(BASE_DIR, "app", "vectorizer.pkl")

def retrain():
    if not os.path.exists(CSV_PATH):
        return "Training dataset not found (fake_job_postings.csv)"

    df = pd.read_csv(CSV_PATH)

    # Build text feature from key columns
    text_cols = ["title", "company_profile", "description", "requirements", "benefits"]
    for col in text_cols:
        if col not in df.columns:
            df[col] = ""
    df["text"] = df[text_cols].fillna("").agg(" ".join, axis=1)
    df["text"] = df["text"].str.lower().str.replace(r"[^\w\s]", " ", regex=True)

    if "fraudulent" not in df.columns:
        return "Dataset missing 'fraudulent' column"

    df = df.dropna(subset=["text", "fraudulent"])
    X = df["text"]
    y = df["fraudulent"].astype(int)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    vectorizer = TfidfVectorizer(stop_words="english", max_features=10000)
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec  = vectorizer.transform(X_test)

    model = LogisticRegression(max_iter=1000, class_weight="balanced")
    model.fit(X_train_vec, y_train)

    acc = round(accuracy_score(y_test, model.predict(X_test_vec)) * 100, 2)

    joblib.dump(model, MODEL_PATH)
    joblib.dump(vectorizer, VEC_PATH)

    return f"Model retrained successfully on {len(df):,} samples. New accuracy: {acc}%"