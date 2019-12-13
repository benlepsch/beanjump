from flask import Flask, render_template, url_for
from flask_socketio import SocketIO
import eventlet

app = Flask(__name__)
socketio = SocketIO(app, async_mode='eventlet')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/beanjump')
def beanjump():
    return render_template('beanjump.html')

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=80)