// Simple, consistent data table. `columns` is an array of { key, label }.
// `rows` is an array of plain objects; `renderCell` lets you customize a
// specific column's output (e.g. render a StatusBadge instead of plain text).
export default function Table({ columns, rows, renderCell }) {
  return (
    <div className="overflow-x-auto border border-border rounded-card shadow-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-navy-100">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left font-semibold text-navy-900 px-4 py-3.5 border-b border-border"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.id ?? i}
              className="border-b border-border last:border-b-0 transition-colors duration-150 hover:bg-navy-100/40"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3.5 text-ink-900">
                  {renderCell ? renderCell(col.key, row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}