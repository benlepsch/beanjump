"""
    this is all the server side code I need because this version is single player
    in the future i'll rework it to be multiplayer i think
"""

from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=80)