'use client';
import { useEffect, useState } from 'react';

export default function DynamicFullstackPage() {
  const [rows, setRows] = useState([]);
  const [headers, setHeaders] = useState([]); // Lưu danh sách tiêu đề
  const [formData, setFormData] = useState({}); // Object động: { "Tiêu đề 1": "", ... }
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const res = await fetch('/api/google-sheets');
    const data = await res.json();
    if (data.length > 0) {
      setHeaders(data[0]); // Lấy dòng đầu làm Header
      setRows(data);
      
      // Khởi tạo formData với các key là header và value trống
      const initialForm = {};
      data[0].forEach(header => { initialForm[header] = ""; });
      setFormData(initialForm);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Hàm xử lý khi nhập liệu: cập nhật đúng Key trong object
  const handleChange = (header, value) => {
    setFormData(prev => ({
      ...prev,
      [header]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    await fetch('/api/google-sheets', {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    alert("Đã thêm dữ liệu thành công!");
    setLoading(false);
    fetchData(); // Refresh bảng
  };

  return (
    <main style={{ padding: '20px', maxWidth: '900px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h1>Hệ thống quản lý Sheet tự động</h1>

      {/* --- FORM ĐỘNG --- */}
      <section style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h3>Thêm dữ liệu mới</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px' }}>
          {headers.map((header) => (
            <div key={header} style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontWeight: 'bold', marginBottom: '5px' }}>{header}:</label>
              <input
                type="text"
                value={formData[header] || ""}
                onChange={(e) => handleChange(header, e.target.value)}
                placeholder={`Nhập ${header}...`}
                style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                required
              />
            </div>
          ))}
          <button 
            type="submit" 
            disabled={loading}
            style={{ marginTop: '10px', padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            {loading ? "Đang gửi..." : "Gửi dữ liệu"}
          </button>
        </form>
      </section>

      {/* --- BẢNG DỮ LIỆU --- */}
      <div style={{ overflowX: 'auto' }}>
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#333', color: 'white' }}>
            <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.slice(1).map((row, i) => (
              <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
