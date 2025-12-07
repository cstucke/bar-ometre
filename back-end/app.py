from flask import Flask
from flask_cors import CORS
from config import Config
from routes.bar_route import bar_bp
from routes.filter_route import filter_bp

app = Flask(__name__)
CORS(app)

app.config.from_object(Config)


app.register_blueprint(bar_bp, url_prefix='/api')
app.register_blueprint(filter_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)