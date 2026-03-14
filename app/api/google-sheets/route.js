import { NextResponse } from 'next/server';

//const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  const scriptUrl ="https://script.google.com/macros/s/AKfycbwuMbl9Mni2sCNvNBkU2gzn7wZCFn5tE1d1kYu1rjLEFd0zB19S85ZLEtB5evCRmLDW/exec";

export async function GET() {  
  try {
    // 1. Gọi đến Google Apps Script
    const response = await fetch(scriptUrl, {
      method: 'GET',
      // Google Script thường có redirect, fetch trong Next.js tự động xử lý tốt việc này
    });

    if (!response.ok) {
      throw new Error('Không thể kết nối với Google Script');
    }

    // 2. Nhận dữ liệu (giả định GAS trả về JSON dạng mảng 2 chiều)
    const data = await response.json(); 

    // 3. Trả về cho Frontend
    return NextResponse.json(data);

  } catch (error) {
    console.error("Lỗi API:", error);
    return NextResponse.json({ error: "Lỗi khi lấy dữ liệu từ Database" }, { status: 500 });
  }
}
// Thêm hàm POST để gửi dữ liệu
export async function POST(request) {
  try {
    const body = await request.json(); // Nhận {a, b, c} từ Frontend

    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi khi gửi dữ liệu" }, { status: 500 });
  }
}
