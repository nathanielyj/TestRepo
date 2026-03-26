from flask import Flask, render_template, jsonify, request
import datetime
import random
from dateutil.relativedelta import relativedelta

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/data')
def get_data():
    # Return data for the past 12 months from today
    today = datetime.date.today()
    start_date = today - relativedelta(years=1)

    data = {}
    current = start_date
    while current <= today:
        date_str = current.strftime("%Y-%m-%d")
        data[date_str] = round(random.uniform(-100, 200), 2)
        current += datetime.timedelta(days=1)

    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
