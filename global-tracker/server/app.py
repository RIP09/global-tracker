from flask import Flask, send_from_directory
import webbrowser
import threading
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WEB_DIR = os.path.join(BASE_DIR, "../web")

app = Flask(__name__, static_folder=WEB_DIR)

@app.route("/")
def index():
    return send_from_directory(WEB_DIR, "index.html")

@app.route("/dashboard")
def dashboard():
    return send_from_directory(WEB_DIR, "dashboard.html")

@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(WEB_DIR, path)


def open_browser():
    webbrowser.open("http://127.0.0.1:5000")


if __name__ == "__main__":
    threading.Timer(1, open_browser).start()
    app.run(host="0.0.0.0", port=5000, debug=True)
