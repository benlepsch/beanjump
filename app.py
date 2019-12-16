from flask import Flask, render_template, url_for
from flask_socketio import SocketIO, emit
import eventlet, os

from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

socketio = SocketIO(app, async_mode='eventlet')

class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(12))
    score = db.Column(db.Integer, index=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/beanjump')
def beanjump():
    return render_template('beanjump.html')

@socketio.on('new score', namespace='/beanjumpdata')
def add_score(message):
    username = message[0]
    score = message[1]

    # make sure there's no exact duplicates
    for score in Score.query.all():
        if score.username == username and score.score == score:
            return

    new = Score(username=username, score=score)
    db.session.add(new)
    db.session.commit()

@socketio.on('get scores', namespace='/beanjumpdata')
def get_scores(message):
    sending = []
    for score in Score.query.order_by(Score.score.desc()).all():
        sending.append([score.username, score.score])
    
    emit('update', sending)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=80)