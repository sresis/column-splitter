import json

from flask import Flask, jsonify, request, Response
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

table_data = [
    {"name": "Jones,Alice", "address": "123 Main St.|Anytown|MA", "zip": "12345"},
    {"name": "Smith,Bob", "address": "456 Elm St.|Somecity|CA", "zip": "67890"},
]

class DataHolder:
    def __init__(self, data):
        self.original_data = data
        self.transformed_data = data

    def get_data(self):
        return self.transformed_data

    def set_data(self, data):
        self.transformed_data = data

    def reset_data(self):
        self.transformed_data = self.original_data

data_holder = DataHolder(table_data)

@app.route('/api/data')
def data_view():
    """ Returns the table. """
    df = pd.DataFrame(data_holder.get_data())
    new_data = df.to_dict('records')
    json_data = json.dumps(new_data)
    response = Response(json_data, mimetype='application/json')
    return response


@app.route('/api/transform')
def transform_view():
    """ Transforms the table to split column by delimiter. """
    column = request.args.get('column')
    delimiter = request.args.get('delimiter')

    if not column or not delimiter:
        return jsonify(data_holder.get_data())

    data_copy = [row.copy() for row in data_holder.transformed_data]
    df = pd.DataFrame(data_copy)

    new_split_columns = df[column].str.split(delimiter, expand=True)
    n_cols = new_split_columns.shape[1]

    # insert new columns at the original index of the original column
    orig_col_index = df.columns.get_loc(column)
    new_columns = [f"{column}_{i+1}" for i in range(n_cols)]
    for i, col in enumerate(new_columns):
        df.insert(orig_col_index+i, col, new_split_columns[i])

    df.drop(column, axis=1, inplace=True)  # drop the original column

    # update the transformed data in the data holder
    data_holder.set_data(df.to_dict('records'))

    json_data = json.dumps(data_holder.get_data())
    response = Response(json_data, mimetype='application/json')
    return response


@app.route('/api/reset')
def reset_view():
    """ Resets the table to original state."""
    data_holder.reset_data()
    df = pd.DataFrame(data_holder.get_data())
    new_data = df.to_dict('records')
    json_data = json.dumps(new_data)
    response = Response(json_data, mimetype='application/json')
    return response

if __name__ == '__main__':
    app.run(port=5000, debug=True)
