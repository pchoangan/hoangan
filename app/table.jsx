"use client";
import { useState, useEffect, useMemo } from "react";

import { sendForm } from "./actions"; 
import { fetchDataTable } from "./actions"; 


const Table = () => {
   //--------------Table reder---------------//

  const [data, setData] = useState([]);
  const [header, setHeader] = useState([]);
  useEffect( () => {
  const fetchData = async () => {
    const dataSheet = await fetchDataTable();
    setData(dataSheet);
    setHeader(dataSheet[0]);
    setLoading(false);
  }
  fetchData(); 
  
  const savedErrorRow = localStorage.getItem("errorRowState");
  if (savedErrorRow) setErrorRow(JSON.parse(savedErrorRow));
}, []);
  //Lọc dữ liệu
  const [filter, setFilter] = useState("");
  const filteredData = useMemo(() => {
    return data
      .slice(1)
      .filter((row) =>
        row.some((cell) =>
          String(cell).toLowerCase().includes(filter.toLowerCase())
        )
      );
  }, [data, filter]);
  //phân trang
  const [page, setPage] = useState();
  const rowsPerPage = 6;
  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  //hiển thị mặc định là trang cuối cùng
  useEffect(() => {
    setPage(totalPages);
  }, [totalPages]);
  //Phân trang và render
  const pagination = useMemo(() => {
    const endIndex = filteredData.length - (totalPages - page) * rowsPerPage;
    const startIndex = endIndex - rowsPerPage;
    if (startIndex <= 0) {
      return filteredData.slice(0, rowsPerPage);
    } else {
      return filteredData.slice(startIndex, endIndex);
    }
  }, [filteredData, page, rowsPerPage]);

  //--------------Form Render------------------//

  const [formData, setFormData] = useState({});
  useEffect(() => {
    const newForm = { ...formData, action: "" };
    header.map((header) => {
      newForm[header] = "";
      setFormData(newForm);
    });
    setIndexRow("");
    setErrorClick("");
  }, [data]);
  const resetForm = () => {
    const newForm = { ...formData, action: "" };
    header.map((header) => {
      newForm[header] = "";
      setFormData(newForm);
    });
    setIndexRow("");
  };
  const [indexRow, setIndexRow] = useState("");
  const [errorClick, setErrorClick] = useState("");

  const findRow = (row, error) => {
    const newForm = { ...formData };
    header.map((header, index) => {
      newForm[header] = row[index];
      setFormData(newForm);
    });
    const index = data.findIndex((row) => row[0] === newForm["ID"]);
    setIndexRow(index);
    setErrorClick(error);
  };

  const addRow = () => {
    const maxId = data.slice(1).reduce((max, row) => Math.max(max, row[0]), 0);
    formData["ID"] = maxId + 1;
    formData["DATE"] = new Date().toLocaleString("vi-VN");
    const newRow = [];
    header.map((header, index) => {
      newRow[index] = formData[header];
    });
    setData([...data, newRow]);
    sendFormData("save", newRow);
    setErrorRow([...errorRow, [...newRow, "New"]]);
    setLoading(true);
  };
  const updateRow = () => {
    if (!indexRow) {
      alert("Chọn một hàng hợp lệ để cập nhật.");
    }
    const newRow = [];
    header.map((header, index) => {
      newRow[index] = formData[header];
    });
    const update = [...data];
    !data[indexRow] ? update.push(newRow) : (update[indexRow] = newRow);
    setData(update);
    sendFormData("save", newRow);
    setErrorRow([...errorRow, [...newRow, "Update"]]);
    setLoading(true);
  };
  const deleteRow = () => {
    if (!indexRow) {
      alert("Chọn một hàng hợp lệ để xóa.");
    }
    sendFormData("delete", data[indexRow]);
    setErrorRow([...errorRow, [...data[indexRow], "Delete"]]);
    setLoading(true);
  };

  const [errorRow, setErrorRow] = useState([]);
  useEffect(() => {
    localStorage.setItem("errorRowState", JSON.stringify(errorRow));
  }, [errorRow]);
  const [loading, setLoading] = useState(true);
  //Gửi dữ liệu tơi server save/delete
  const sendFormData = async (action, row) => {
    try {
      const data = { ...formData };
      data["action"] = action;
      const result = await sendForm(data);
      
      if (result.success == true) {
        setLoading(false);
        alert(result.message);
        setErrorRow((prevErrorRow) =>
          prevErrorRow.filter((rows) => rows[0] != row[0])
        );
        action === "delete"
          ? setData((prevData) => prevData.filter((rows) => rows[0] != row[0]))
          : "";
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Đã có lỗi xảy ra khi gửi dữ liệu lên API");
      setLoading(false);
      //setErrorRow([...errorRow, row]);
    }
  };

  return (
    <>
      <div id="table-container">
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Filter Table"
            value={filter} // Liên kết với state Filter
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <table id="myTable">
          <thead>
            <tr>
              {header.map((headers, index) => (
                <th key={index}>{headers}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagination.map((rowData) => (
              <tr
                key={rowData[0]}
                id={rowData[0]}
                onClick={() => findRow(rowData,"")}                
                className={errorRow.some(
                    (err) => err && err.length > 0 && err[0] === rowData[0]
                  ) || errorClick === rowData[0]
                    ? "error-row"
                    : ""}
              >
                {rowData.map((cellData, cellIndex) => (
                  <td key={cellIndex}>
                    <div className="cell">{cellData}</div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <button onClick={() => setPage(1)} disabled={page === 1}>
          First
        </button>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Prev
        </button>
        <span>
          {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
        <button
          onClick={() => setPage(totalPages)}
          disabled={page === totalPages}
        >
          Last
        </button>
      </div>
      {loading? (
        <div className="loading">
          <p>Loading...</p>
        </div>
      ) : (   
      <table>
        <tbody>        
        {errorRow.map((rowData, rowIndex) => (
          <tr
            key={rowIndex}
            onClick={() => findRow(rowData,rowData[0])}
            className={"error-row"}
          >
            <td>{rowData[0]}</td>
            <td>{rowData[2]}</td>
          </tr>
        ))}
        </tbody>
      </table>
        )}
      <div>
        {!indexRow ? (
          <p>
            New ID:
            {data.slice(1).reduce((max, row) => Math.max(max, row[0]), 0) + 1}
          </p>
        ) : (
          <p>
            ID: {formData["ID"]} - DATE: {formData["DATE"]}{" "}
            <button onClick={resetForm}>Clear</button>
          </p>
        )}
        <form id="myForm">
          {header.map((header, index) => (
            <div key={index}>
              <label htmlFor={header}>{header}:</label>
              <textarea
                type="text"
                id={header}
                name={header}
                value={formData[header] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, [header]: e.target.value })
                }
              />
            </div>
          ))}
        </form>
        <div>
          <button onClick={addRow}>{!indexRow||!data[indexRow] ? "Tạo Mới" : "New copy"}</button>
          <button onClick={updateRow} disabled={!indexRow}>Cập Nhật</button>
          <button onClick={deleteRow} disabled={!indexRow||!data[indexRow]}>Xóa</button>
        </div>        
      </div>
    </>
  );
};

export default Table;
