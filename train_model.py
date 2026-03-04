import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score

# ==========================
# Load Dataset
# ==========================
df = pd.read_csv("fake_job_postings.csv")

# Fill missing values
df['title'] = df['title'].fillna("")
df['description'] = df['description'].fillna("")

# Combine title + description
df['text'] = df['title'] + " " + df['description']

X = df['text']
y = df['fraudulent']

# ==========================
# TF-IDF Vectorization (Improved)
# ==========================
vectorizer = TfidfVectorizer(
    stop_words='english',
    max_features=30000,
    ngram_range=(1, 2)  # Unigrams + Bigrams
)

X_vec = vectorizer.fit_transform(X)

# ==========================
# Stratified Train-Test Split
# ==========================
X_train, X_test, y_train, y_test = train_test_split(
    X_vec,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# ==========================
# Logistic Regression Model
# ==========================
model = LogisticRegression(
    class_weight='balanced',
    max_iter=1000
)

model.fit(X_train, y_train)

# ==========================
# Evaluation
# ==========================
y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print("\n🔥 Model Accuracy:", round(accuracy * 100, 2), "%\n")
print("Classification Report:\n")
print(classification_report(y_test, y_pred))

# ==========================
# Save Model & Vectorizer
# ==========================
joblib.dump(model, "fake_job_model.pkl")
joblib.dump(vectorizer, "vectorizer.pkl")

print("✅ Logistic Regression model trained successfully!")