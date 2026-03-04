from fastapi import FastAPI, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse, FileResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware
import joblib
import datetime
import os
import csv

app = FastAPI()

# ==========================
# Session Middleware
# ==========================
app.add_middleware(SessionMiddleware, secret_key="supersecretkey")

# ==========================
# Templates
# ==========================
templates = Jinja2Templates(directory="templates")

# ==========================
# Load ML Model
# ==========================
model = joblib.load("fake_job_model.pkl")
vectorizer = joblib.load("vectorizer.pkl")

# ==========================
# Admin Credentials
# ==========================
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "1234"

# ==========================
# Home Page
# ==========================
@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# ==========================
# Prediction (Web)
# ==========================
@app.post("/predict", response_class=HTMLResponse)
def predict(request: Request, job_text: str = Form(...)):

    vec = vectorizer.transform([job_text])
    prediction = model.predict(vec)[0]
    probability = model.predict_proba(vec)[0]

    fake_prob = float(probability[1]) * 100
    real_prob = float(probability[0]) * 100

    # ==========================
    # 🔥 Smart Scam Pattern Detection
    # ==========================
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

    boost_score = 0

    for word in suspicious_patterns:
        if word in job_text.lower():
            boost_score += 7

    # Detect currency symbols
    if "₹" in job_text or "$" in job_text:
        boost_score += 5

    # Detect unrealistic weekly income
    if "per week" in job_text.lower():
        boost_score += 5

    fake_prob += boost_score

    if fake_prob > 100:
        fake_prob = 100

    real_prob = 100 - fake_prob

    fake_prob = round(fake_prob, 2)
    real_prob = round(real_prob, 2)

    result = "Fake Job" if fake_prob > real_prob else "Real Job"
    confidence = max(fake_prob, real_prob)

    # ==========================
    # Risk Level
    # ==========================
    if fake_prob >= 85:
        risk = "High Risk 🚨"
    elif fake_prob >= 65:
        risk = "Medium Risk ⚠"
    else:
        risk = "Low Risk ✅"

    # ==========================
    # Save Logs
    # ==========================
    with open("prediction_logs.txt", "a", encoding="utf-8") as f:
        f.write(
            f"{datetime.datetime.now()} | {result} | {confidence} | {fake_prob} | {real_prob} | {job_text}\n"
        )

    return templates.TemplateResponse("index.html", {
        "request": request,
        "prediction": result,
        "confidence": confidence,
        "risk": risk,
        "fake_prob": fake_prob,
        "real_prob": real_prob
    })

# ==========================
# REST API Prediction
# ==========================
@app.post("/api/predict")
def api_predict(job_text: str):

    vec = vectorizer.transform([job_text])
    prediction = model.predict(vec)[0]
    probability = model.predict_proba(vec)[0]

    fake_prob = float(probability[1]) * 100
    real_prob = float(probability[0]) * 100

    result = "Fake Job" if fake_prob > real_prob else "Real Job"

    return JSONResponse({
        "prediction": result,
        "confidence": round(max(fake_prob, real_prob), 2)
    })

# ==========================
# Login Page
# ==========================
@app.get("/login", response_class=HTMLResponse)
def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.post("/login")
def login(request: Request, username: str = Form(...), password: str = Form(...)):

    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        request.session["user"] = username
        return RedirectResponse("/dashboard", status_code=302)

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

    total = 0
    fake = 0
    real = 0
    flagged_posts = []

    if os.path.exists("prediction_logs.txt"):
        with open("prediction_logs.txt", "r", encoding="utf-8") as f:
            logs = f.readlines()

        total = len(logs)

        for log in logs:
            if "Fake Job" in log:
                fake += 1
                flagged_posts.append(log)
            elif "Real Job" in log:
                real += 1

    return templates.TemplateResponse("dashboard.html", {
        "request": request,
        "total": total,
        "fake": fake,
        "real": real,
        "flagged_posts": flagged_posts
    })

# ==========================
# Logout
# ==========================
@app.get("/logout")
def logout(request: Request):
    request.session.clear()
    return RedirectResponse("/", status_code=302)

# ==========================
# Download TXT Logs
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