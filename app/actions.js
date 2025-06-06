"use server";
export async function fetchDataTable() {
  const response = await fetch(
    "https://script.google.com/macros/s/AKfycbxejicC-DhVc40W78Y9_kveg_jVru4TPrXGtUun7L1VHDOa8kUCeYvOjc1DCWIAlw/exec",
    { cache: "no-store" }
  );  
  return response.json()
}

export async function sendForm(formData) {
  const response = await fetch(
    "https://script.google.com/macros/s/AKfycbxejicC-DhVc40W78Y9_kveg_jVru4TPrXGtUun7L1VHDOa8kUCeYvOjc1DCWIAlw/exec",
    {
      method: "POST",
      body: JSON.stringify(formData)      
    }
  );
  return response.json();
}
export async function login(username, password) {
  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbxTvH1tTHYnHXl_prIJczjytFZG0MPAclpHdzUxjEeiMABR_hBhrsAn1p-m5Ibwcr8/exec",
      {
        method: "POST",
        body: JSON.stringify({ action: 'login', email: username, password: password }),
      }
    );
    return response.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}
export async function register(username, password) {
  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbxTvH1tTHYnHXl_prIJczjytFZG0MPAclpHdzUxjEeiMABR_hBhrsAn1p-m5Ibwcr8/exec",
      {
        method: "POST",
        body: JSON.stringify({ action: 'register', email: username, password: password }),
      }
    );
    return response.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}
