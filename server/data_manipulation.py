import pandas as pd

table_data = [
    {"name": "Jones,Alice", "address": "123 Main St.|Anytown|MA", "zip": "12345"},
    {"name": "Smith,Bob", "address": "456 Elm St.|Somecity|CA", "zip": "67890"},
]

class DataHolder:
    def __init__(self):
        self.original_data = table_data
        self.transformed_data = table_data

    def get_data(self):
        return self.transformed_data

    def set_data(self, data):
        self.transformed_data = data

    def reset_data(self):
        self.transformed_data = self.original_data

    def transform_data(self, column, delimiter):
        data_copy = [row.copy() for row in self.transformed_data]
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
        self.set_data(df.to_dict('records'))
