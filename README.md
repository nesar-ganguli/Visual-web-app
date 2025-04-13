# Language Agnostic Visualization Web Application

## Overview

This application allows users to generate and view basic visualizations by submitting custom Python or R code. The system supports both static and interactive visualizations, including 3D plots. Users can select the language, input their visualization code, and view the output either as a static image or an embedded HTML chart.

The goal of this project was to build a lightweight, language-agnostic visualization platform that can interpret Python and R scripts, execute them dynamically, and display the resulting chart in the frontend.

### Tech Stack

- **Frontend:** React
- **Backend:** Flask (Python)
- **Visualization Libraries:**
  - Python: Matplotlib (static), Plotly (interactive/3D)
  - R: ggplot2 (static), Plotly (interactive/3D)
- **Inter-process execution:** `subprocess` and `os.system`
- **Static asset serving:** Flask static folder setup

---

## Design Summary

### Frontend

- A simple React interface with:
  - A dropdown to select the language (`Python` or `R`)
  - A text area to enter code
  - A generate button that sends code and language to the Flask backend
  - Conditional rendering:
    - If the result is a `.png`, it renders using an `<img>` tag
    - If the result is a `.html`, it renders using an `<iframe>`

### Backend

- Accepts code and language via POST request at `/api/execute`
- Detects whether the code uses Plotly (`.html`) or generates a static plot (`.png`)
- Dynamically writes and executes temporary scripts for Python or R
- Auto-appends save commands for interactive outputs
- Serves generated files via Flask’s static route using `outputs/` as the directory

---

## Issues Encountered and Resolutions

### 1. CORS Errors Between React and Flask
- **Problem:** React frontend (on port 3000) was blocked from accessing Flask (port 5000) due to CORS policy.
- **Fix:** Installed `flask-cors` and added `CORS(app)` to the backend to allow cross-origin requests.

### 2. Port Conflict on macOS
- **Problem:** macOS Ventura and later versions use port 5000 for AirPlay, causing conflicts with Flask.
- **Fix:** Changed the Flask server to run on port 5050 instead.

### 3. Matplotlib GUI Crash
- **Problem:** Matplotlib attempted to use GUI backends when saving plots, which caused errors in a headless environment.
- **Fix:** Added `matplotlib.use('Agg')` to switch to a non-GUI backend.

### 4. Missing Libraries in Python or R
- **Problem:** Executed Python and R scripts failed due to missing packages like `plotly`, `pandas`, or `htmlwidgets`.
- **Fix:** Installed required packages manually and ensured they were available in the same environment where scripts were run.

### 5. File Not Found or Not Saved
- **Problem:** In some cases, the `.html` or `.png` was not created, causing a 404 when trying to load it in React.
- **Fix:** Verified file creation with `os.path.exists(output_path)` and added proper error messages.

### 6. Manual Save Function in User Code
- **Problem:** Initially, users had to explicitly write `fig.write_html(...)` or `saveWidget(...)` in their code.
- **Fix:** The backend was updated to automatically append save commands for consistency and simplicity.

---

## Result

The final application successfully supports both static and interactive visualizations in Python and R. It provides a clean user interface, dynamic code execution, robust error handling, and correct rendering behavior in the browser. Both 2D and 3D plots are supported.

## Setup Instructions

Follow the steps below to run the application locally after cloning the repository.

### 1. Clone the Repository

```bash
git clone https://github.com/nesar-ganguli/Visual-web-app.git
cd Visual-web-app
```
### 2. Set Up the Backend (Flask)

```bash
cd viz-backend
python3 -m venv venv
source venv/bin/activate 
pip install -r requirements.txt
python app.py
```
This starts the Flask server on http://localhost:5050.

### 3. Set Up the Frontend (React)
Open a new terminal window or tab:
```bash
cd viz-app
npm install
npm start
```
This starts the React app on http://localhost:3000.

Usage
Select a language (Python or R)

Paste your code in the editor

Click "Generate"

The output will appear below:

.png → displayed as an image

.html → displayed as an embedded iframe (interactive)

Enjoy!!! 🥳 
