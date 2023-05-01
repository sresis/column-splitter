from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import data_manipulation

app = Flask(__name__)
CORS(app)

data_holder = data_manipulation.DataHolder()

@app.route('/api/data')
def data_view():
    """ Returns the table. """
    new_data = data_holder.get_data()
    return jsonify(new_data)

@app.route('/api/transform')
def transform_view():
    """ Transforms the table to split column by delimiter. """
    column = request.args.get('column')
    delimiter = request.args.get('delimiter')

    if not column or not delimiter:
        return jsonify(data_holder.get_data())

    data_holder.transform_data(column, delimiter)
    new_data = data_holder.get_data()
    return jsonify(new_data)

@app.route('/api/reset')
def reset_view():
    """ Resets the table to original state."""
    data_holder.reset_data()
    new_data = data_holder.get_data()
    return jsonify(new_data)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
