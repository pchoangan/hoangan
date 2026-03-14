'use client';
import { useEffect, useState } from 'react';
import "./table.css";

export default function GoogleDataPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/google-sheets')
      .then(res => res.json())
      .then(data => {
        setRows(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: '20px' }}>Đang tải dữ liệu từ Google Sheets...</p>;

  return (
    <main style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Dữ liệu từ Google Sheets (via API Route)</h1>
      
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            {/* Giả sử hàng đầu tiên là tiêu đề [a, b, c] */}
            {rows[0]?.map((header, i) => <th key={i}>{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {/* Các hàng dữ liệu tiếp theo [1, 2, 3] */}
          {rows.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
