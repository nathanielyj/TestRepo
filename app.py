from flask import Flask, render_template, jsonify, request
import datetime
import random

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/data')
def get_data():
    # In a real app, we would query a database here.
    # For this report, we'll generate mock data for the requested months.
    year = request.args.get('year', datetime.datetime.now().year, type=int)
    month = request.args.get('month', datetime.datetime.now().month, type=int)
    count = request.args.get('count', 1, type=int)

    data = {}

    current_year = year
    current_month = month

    for _ in range(count):
        # Simple mock data generation for the current month
        for day in range(1, 32):
            try:
                date_str = f"{current_year}-{current_month:02d}-{day:02d}"
                datetime.date(current_year, current_month, day) # check if valid date
                data[date_str] = round(random.uniform(-100, 200), 2)
            except ValueError:
                break

        # Increment month
        current_month += 1
        if current_month > 12:
            current_month = 1
            current_year += 1

    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
