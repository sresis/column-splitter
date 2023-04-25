import React, { useState, useEffect } from 'react';
import './table.css';

interface IData {
  [key: string]: string;
}

const App: React.FC = () => {
    const [data, setData] = useState<IData[]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [column, setColumn] = useState<string>('');
    const [delimiter, setDelimiter] = useState<string>('');
    const [transformedData, setTransformedData] = useState<IData[]>([]);
    const [transformedColumns, setTransformedColumns] = useState<string[]>([]);
    const [allTransformedData, setAllTransformedData] = useState<IData[][]>([]);
    const [allTransformedColumns, setAllTransformedColumns] = useState<string[][]>([]);

    useEffect(() => {
      async function fetchData() {
        const res = await fetch('http://localhost:5000/api/data');
        const data = await res.json();
        setData(data);
        setColumns(Object.keys(data[0] || {}));
      }
      fetchData();
    }, []);

    const handleColumnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setColumn(event.target.value);
    };

    const handleDelimiterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setDelimiter(event.target.value);
    };

    const handleReset = async () => {
      const res = await fetch('http://localhost:5000/api/reset');
      const data = await res.json();
      setData(data);
      setColumns(Object.keys(data[0] || {}));
      setColumn('');
      setDelimiter('');
      setTransformedData([]);
      setTransformedColumns([]);
      setAllTransformedData([]);
      setAllTransformedColumns([]);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const column = formData.get('column');
        const delimiter = formData.get('delimiter');
        if (column && delimiter) {
          try {
            const res = await fetch(`http://localhost:5000/api/transform?column=${column}&delimiter=${delimiter}`);
            const transformedData = await res.json();
            setColumns(Object.keys(transformedData[0] || {}));

            setTransformedData(transformedData);
            setTransformedColumns(Object.keys(transformedData[0] || []));
          } catch (error) {
            console.error(error);
          }
        }
      };



    const renderData = () => {
        if (allTransformedColumns.length) {
          const displayColumns = allTransformedColumns[allTransformedColumns.length - 1];

          return (
            <table style={{ margin: '0 auto' }}>
              <thead>
                <tr>
                  {displayColumns.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allTransformedData[allTransformedData.length - 1].map((row, index) => (
                  <tr key={index}>
                    {displayColumns.map((column) => (
                      <td key={column}>{row[column]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          );
        } else if (transformedColumns.length) {
          const displayColumns = transformedColumns;

          return (
            <table style={{ margin: '0 auto' }}>
              <thead>
                <tr>
                  {displayColumns.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transformedData.map((row, index) => (
                  <tr key={index}>
                    {displayColumns.map((column) => (
                      <td key={column}>{row[column]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          );
        } else {
          const displayColumns = columns;

          return (
            <table style={{ margin: '0 auto' }}>
              <thead>
                <tr>
                  {displayColumns.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    {displayColumns.map((column) => (
                      <td key={column}>{row[column]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          );
        }
      };


  return (
    <div style={{ textAlign: "center" }}>
      <h1>Data Splitter</h1>
      {renderData()}
      <form onSubmit={handleSubmit}>
        <table style={{ margin: '0 auto' }}>
          <tbody>
            <tr>
              <td>
                <label htmlFor="column">Column:</label>
                <select name="column" value={column} onChange={handleColumnChange}>
                  <option value="">Select a column</option>
                  {columns.map((column) => (
                    <option key={column} value={column}>
                      {column}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <label htmlFor="delimiter">Delimiter:</label>
                <input type="text" name="delimiter" value={delimiter} onChange={handleDelimiterChange} />
              </td>
              <td>
                <button type="submit">Split Data</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      <button type="button" onClick={handleReset}>
                  Reset Data
                </button>
    </div>
  );
}
export default App;