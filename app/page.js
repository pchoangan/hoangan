'use client';
import { useEffect, useState } from 'react';

export default function GoogleSheetsManager() {
  const [rows, setRows] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  // 1. Hàm lấy dữ liệu (Tương ứng với GET trong route.js)
  const loadData = async () => {
    try {
      const res = await fetch('/api/google-sheets');
      const data = await res.json();
      if (data && data.length > 0) {
        setHeaders(data[0]); // Lấy dòng tiêu đề
        setRows(data);
        
        // Khởi tạo form động dựa trên headers
        const init = {};
        data[0].forEach(h => init[h] = "");
        setFormData(init);
      }
    } catch (err) {
      console.error("Không thể load dữ liệu");
    }
  };

  useEffect(() => { loadData(); }, []);

  // 2. Hàm gửi dữ liệu (Tương ứng với POST trong route.js)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/google-sheets', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert("Gửi thành công!");
        loadData(); // Tải lại bảng sau khi gửi thành công
      }
    } catch (err) {
      alert("Lỗi khi gửi dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1>Quản lý Database Google Sheets</h1>

      {/* Form tự động sinh ra dựa trên tiêu đề bảng */}
      <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
        <h3>Thêm mới</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {headers.map(h => (
            <div key={h}>
              <label style={{ fontSize: '12px', fontWeight: 'bold' }}>{h}</label>
              <input 
                style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                value={formData[h] || ''} 
                onChange={e => setFormData({...formData, [h]: e.target.value})}
                required
              />
            </div>
          ))}
        </div>
        <button 
          type="submit" 
          disabled={loading}
          style={{ marginTop: '15px', width: '100%', padding: '10px', backgroundColor: '#000', color: '#fff', cursor: 'pointer' }}
        >
          {loading ? "Đang xử lý..." : "Gửi dữ liệu"}
        </button>
      </form>

      {/* Bảng hiển thị */}
      <table border="1" style={{ width: '100%', marginTop: '30px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            {headers.map(h => <th key={h} style={{ padding: '10px' }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.slice(1).map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => <td key={j} style={{ padding: '10px' }}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
