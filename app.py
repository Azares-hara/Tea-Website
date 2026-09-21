from flask import (
  Flask,
  render_template,
  request,
  redirect,
  url_for,
  flash,
  send_file
)
import json
import os
import csv
import time
import smtplib
from email.message import EmailMessage
from config import EMAIL, APP_PASS
from utilis import unique.EmailMessage
from emailClassifier import classify_emils
#--APP CONFIG
app = Flask(__name__)
app.secret_key="emailpro_secret_key"

UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] - UPLOAD_FOLDER
os.makedir(UPLOAD_FOLDER, exist_ok True)

#GLOBAL REPORT DATA
report_data - {
  "total_emails": 0,
  "success_count":0,
  "failed_count":0,
  "succesful_emails": [],
  "failed_emails": []
}

#HOME

@app.route("/")
def home():
  return render_template("index.html")

#UPLOAD PAGE
@app.route("/upload", methods=["GET", "POST"])
def upload():
  upload_path = os.path.join(app.config["UPLOAD_FOLDER"], "Email.csv")
  if request.method == "POST":
    file = request.files.get("csv_file")

    if not file == file.filename =="":
      flash("Please select a CSV file", "danger")
      return redirect(url_for("upload"))


  #STATS
  uploaded_files = 0
  total_emails = 0