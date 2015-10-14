#!/usr/bin/env python3
import hmac
import json
import requests
import subprocess

from config import *
from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html.jinja2")

@app.route("/stream")
def stream():
    return render_template("stream.html.jinja2")

@app.route("/about")
def about():
    return render_template("about.html.jinja2")

@app.route("/rules")
def rules():
    return render_template("rules.html.jinja2")

@app.route("/contact")
def contact():
    return render_template("contact.html.jinja2")

@app.route("/github-update", methods=["POST"])
def github_update():
    h = hmac.new(GITHUB_WEBOOK_SECRET, request.get_data())
    if not hmac.compare_digest(h.hexdigest(), request.headers.get("X-Hub-Signature", "")):
        return "FAIL"

    try:
        subprocess.Popen("git pull").wait(10)
    except Exception:
        return "ERROR"

    return "OK"

@app.route("/api/news")
def api_news():
    base_url = "https://api.tumblr.com/v2/blog/btv-news.tumblr.com/posts?api_key=%s&limit=5" % TUMBLR_API_KEY
    posts = []
    try:
        res = requests.get(base_url)
        j = json.loads(res.text)
        if "response" in j and "posts" in j["response"]:
            posts = j["response"]["posts"]
    except Exception as e:
        pass

    return jsonify(posts=posts)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)