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
    already = False

    # make sure there's no exact duplicates
    for score in Score.query.all():
        #print('checking duplicate: ' + score.username + ' and ' + message[0] + '\t' + str(score.score) + ' and ' + str(message[1]))
        if score.username == message[0]:
            already = True
            new = Score(username=message[0], score=message[1])
            db.session.delete(score)
            db.session.add(new)
            db.session.commit()

    if not already:
        new = Score(username=message[0], score=message[1])
        db.session.add(new)
        db.session.commit()

@socketio.on('get scores', namespace='/beanjumpdata')
def get_scores(message):
    sending = []
    for score in Score.query.order_by(Score.score.desc()).all():
        sending.append([score.username, score.score])
    
    emit('update', sending)

@socketio.on('find score', namespace='/beanjumpdata')
def find_score(message):
    sending = { 'username': message, 'highscore': 0, 'rank': 0 }
    scores = Score.query.order_by(Score.score.desc()).all()
    for i in range(len(scores)):
        if scores[i].username == message:
            sending['highscore'] = scores[i].score
            sending['rank'] = i + 1
            break
    emit('found score', sending)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=80)