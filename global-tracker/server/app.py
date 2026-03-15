import os

app = Flask(__name__, static_folder='../web', template_folder='../web')

# ---------------- Serve main index ----------------
@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")

# ---------------- Serve dashboard ----------------
@app.route("/dashboard")
def dashboard():
    return send_from_directory(app.static_folder, "dashboard.html")

# ---------------- Serve static files (script.js, CSS, etc.) ----------------
@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)

# ---------------- Automatically open browser ----------------
def open_browser():
    webbrowser.open("http://127.0.0.1:5000")

# ---------------- Run Flask App ----------------
if __name__ == "__main__":
    threading.Timer(1, open_browser).start()
    app.run(debug=True, host="0.0.0.0", port=5000)
