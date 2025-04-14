from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import uuid
import subprocess

import matplotlib
matplotlib.use('Agg') 
import matplotlib.pyplot as plt


app = Flask(__name__, static_folder="outputs", static_url_path="/static")


#CORS fix — allow all origins during local dev
CORS(app)

@app.route('/api/execute', methods=['POST'])
def execute_code():
    data = request.get_json()
    code = data.get('code')
    language = data.get('language')

    file_id = uuid.uuid4().hex
    ext = '.html' if 'plotly' in code.lower() else '.png'
    filename = f"plot_{file_id}{ext}"
    output_path = os.path.abspath(os.path.join("outputs", filename))
    os.makedirs("outputs", exist_ok=True)

    try:
        if language == 'python':
            if ext == '.html':
                script_file = f"temp_{file_id}.py"
                debugged_code = code + f'\nfig.write_html("{output_path}")'

                # ✅ This writes the file before running it
                with open(script_file, 'w') as f:
                    f.write(debugged_code)

                try:
                    result = subprocess.run(
                        ["python3", script_file],
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE,
                        text=True,
                        check=True
                    )
                except subprocess.CalledProcessError as e:
                    return jsonify({
                        "error": f"Python script failed.\nSTDOUT:\n{e.stdout}\nSTDERR:\n{e.stderr}"
                    }), 500

                os.remove(script_file)

            else:
                # Matplotlib PNG
                exec(code + f"\nplt.savefig('{output_path}')", {'plt': plt})
        elif language == 'r':
            r_filename = f"temp_{file_id}.R"
            save_cmd = (
                f"htmlwidgets::saveWidget(fig, '{output_path}', selfcontained = TRUE)"
                if ext == '.html' else
                f"ggsave('{output_path}')"
            )
            with open(r_filename, 'w') as rfile:
                rfile.write(code + "\n" + save_cmd)
            os.system(f"Rscript {r_filename}")
            os.remove(r_filename)
        else:
            return jsonify({"error": "Unsupported language"}), 400

        # to confirm if file was actually saved.
        if not os.path.exists(output_path):
            return jsonify({"error": "No output was saved by your code."}), 500

        return jsonify({"image_url": f"http://localhost:5050/static/{filename}"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5050)

