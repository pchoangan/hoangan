import { NextResponse } from 'next/server';

export async function GET() {
  //const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  const scriptUrl ="https://script.google.com/macros/s/AKfycbxejicC-DhVc40W78Y9_kveg_jVru4TPrXGtUun7L1VHDOa8kUCeYvOjc1DCWIAlw/exec";
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
