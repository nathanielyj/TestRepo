from flask import Flask, render_template, jsonify, request
import datetime
import calendar
import random

app = Flask(__name__)

# Mock data generator for Profit and Loss
def generate_pl_data(year, month):
    num_days = calendar.monthrange(year, month)[1]
    data = {}
    for day in range(1, num_days + 1):
        # Generate a random profit or loss between -500 and 500
        data[f"{year}-{month:02d}-{day:02d}"] = round(random.uniform(-500, 1000), 2)
    return data

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/pl-data')
def get_pl_data():
    year = request.args.get('year', default=datetime.datetime.now().year, type=int)
    month = request.args.get('month', default=datetime.datetime.now().month, type=int)

    pl_data = generate_pl_data(year, month)
    return jsonify(pl_data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
