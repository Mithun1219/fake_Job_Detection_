from database import SessionLocal
from models import Prediction
from fastapi import FastAPI, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse, FileResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware
import joblib
import datetime
import os
import csv

from retrain_model import retrain

app = FastAPI()

app.add_middleware(SessionMiddleware, secret_key="supersecretkey")

templates = Jinja2Templates(directory="templates")

model = joblib.load("fake_job_model.pkl")
vectorizer = joblib.load("vectorizer.pkl")

ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "1234"


# ==========================
# START PAGE -> LOGIN FIRST
# ==========================
@app.get("/", response_class=HTMLResponse)
def home():
    return RedirectResponse("/login", status_code=302)


# ==========================
# DETECTOR PAGE (PROTECTED)
# ==========================
@app.get("/detector", response_class=HTMLResponse)
def detector(request: Request):

    if "user" not in request.session:
        return RedirectResponse("/login", status_code=302)

    return templates.TemplateResponse("index.html", {"request": request})


# ==========================
# Prediction
# ==========================
@app.post("/predict", response_class=HTMLResponse)
def predict(request: Request, job_text: str = Form(...)):

    if "user" not in request.session:
        return RedirectResponse("/login", status_code=302)

    vec = vectorizer.transform([job_text])
    probability = model.predict_proba(vec)[0]

    fake_prob = float(probability[1]) * 100
    real_prob = float(probability[0]) * 100

    suspicious_patterns = [
        "registration fee",
        "no interview",
        "earn money",
        "work from home",
        "whatsapp",
        "urgent hiring",
        "investment required",
        "limited slots",
        "instant joining",
        "guaranteed income"
    ]

    real_keywords = [
        "company",
        "experience",
        "benefits",
        "location",
        "responsibilities",
        "requirements"
    ]

    boost_score = 0
    highlight_words = []

    for word in suspicious_patterns:
        if word in job_text.lower():
            boost_score += 7
            highlight_words.append(word)

    if "₹" in job_text or "$" in job_text:
        boost_score += 5

    if "per week" in job_text.lower():
        boost_score += 5

    fake_prob += boost_score

    for word in real_keywords:
        if word in job_text.lower():
            real_prob += 5

    fake_prob = min(fake_prob, 100)
    real_prob = min(real_prob, 100)

    total = fake_prob + real_prob
    fake_prob = (fake_prob / total) * 100
    real_prob = (real_prob / total) * 100

    fake_prob = round(fake_prob, 2)
    real_prob = round(real_prob, 2)

    # Hybrid AI decision
    if len(highlight_words) >= 3:
        fake_prob = max(fake_prob, 80)
        result = "Fake Job"
    elif fake_prob >= 60:
        result = "Fake Job"
    else:
        result = "Real Job"

    confidence = max(fake_prob, real_prob)

    if fake_prob >= 85:
        risk = "High Risk 🚨"
    elif fake_prob >= 60:
        risk = "Medium Risk ⚠"
    else:
        risk = "Low Risk ✅"

    with open("prediction_logs.txt", "a", encoding="utf-8") as f:
        f.write(
            f"{datetime.datetime.now()} | {result} | {confidence} | {fake_prob} | {real_prob} | {job_text}\n"
        )

    db = SessionLocal()

    new_prediction = Prediction(
        job_text=job_text,
        result=result
    )

    db.add(new_prediction)
    db.commit()
    db.close()

    return templates.TemplateResponse("index.html", {
        "request": request,
        "prediction": result,
        "confidence": confidence,
        "risk": risk,
        "fake_prob": fake_prob,
        "real_prob": real_prob,
        "highlight_words": highlight_words
    })


# ==========================
# API Prediction
# ==========================
@app.post("/api/predict")
def api_predict(job_text: str):

    vec = vectorizer.transform([job_text])
    probability = model.predict_proba(vec)[0]

    fake_prob = float(probability[1]) * 100
    real_prob = float(probability[0]) * 100

    result = "Fake Job" if fake_prob > real_prob else "Real Job"

    return JSONResponse({
        "prediction": result,
        "confidence": round(max(fake_prob, real_prob), 2)
    })


# ==========================
# Stats API
# ==========================
@app.get("/stats")
def stats():

    db = SessionLocal()

    total = db.query(Prediction).count()
    fake = db.query(Prediction).filter(Prediction.result == "Fake Job").count()
    real = db.query(Prediction).filter(Prediction.result == "Real Job").count()

    db.close()

    return {
        "total": total,
        "fake": fake,
        "real": real
    }


# ==========================
# Model Metrics API
# ==========================
@app.get("/metrics")
def metrics():
    return {
        "accuracy": 0.94,
        "precision": 0.92,
        "recall": 0.90,
        "f1_score": 0.91
    }


# ==========================
# Login
# ==========================
@app.get("/login", response_class=HTMLResponse)
def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})


@app.post("/login")
def login(request: Request, username: str = Form(...), password: str = Form(...)):

    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        request.session["user"] = username
        return RedirectResponse("/detector", status_code=302)

    return templates.TemplateResponse("login.html", {
        "request": request,
        "error": "Invalid credentials"
    })


# ==========================
# Dashboard
# ==========================
@app.get("/dashboard", response_class=HTMLResponse)
def dashboard(request: Request):

    if "user" not in request.session:
        return RedirectResponse("/login", status_code=302)

    db = SessionLocal()

    total = db.query(Prediction).count()
    fake = db.query(Prediction).filter(Prediction.result == "Fake Job").count()
    real = db.query(Prediction).filter(Prediction.result == "Real Job").count()

    flagged_posts = db.query(Prediction)\
        .filter(Prediction.result == "Fake Job")\
        .order_by(Prediction.id.desc())\
        .limit(10)\
        .all()

    db.close()

    return templates.TemplateResponse("dashboard.html", {
        "request": request,
        "total": total,
        "fake": fake,
        "real": real,
        "flagged_posts": flagged_posts
    })


@app.get("/logout")
def logout(request: Request):
    request.session.clear()
    return RedirectResponse("/login", status_code=302)


# ==========================
# Download Logs
# ==========================
@app.get("/download-logs")
def download_logs():

    if os.path.exists("prediction_logs.txt"):
        return FileResponse(
            "prediction_logs.txt",
            media_type='text/plain',
            filename="prediction_logs.txt"
        )

    return {"message": "No logs found"}


# ==========================
# Download CSV
# ==========================
@app.get("/download-csv")
def download_csv():

    if not os.path.exists("prediction_logs.txt"):
        return {"message": "No logs found"}

    csv_file = "prediction_logs.csv"

    with open("prediction_logs.txt", "r", encoding="utf-8") as txt:
        lines = txt.readlines()

    with open(csv_file, "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["Date", "Result", "Confidence", "Fake %", "Real %", "Job Description"])

        for line in lines:
            parts = line.strip().split(" | ")
            writer.writerow(parts)

    return FileResponse(csv_file, filename="prediction_logs.csv")


# ==========================
# Retrain Model
# ==========================
@app.get("/retrain-model")
def retrain_model():

    try:
        message = retrain()
        return {"status": message}

    except Exception as e:
        return {"error": str(e)}