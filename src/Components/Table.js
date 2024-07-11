// src/Components/Table.js
import React from "react";

const Table = ({ headers, data, renderRow }) => {
  console.log(data);
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded">
        <thead className="bg-gray-200">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="py-3 px-4 text-left text-sm font-medium text-gray-600"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{data.map((item, index) => renderRow(item))}</tbody>
      </table>
    </div>
  );
};

export default Table;
