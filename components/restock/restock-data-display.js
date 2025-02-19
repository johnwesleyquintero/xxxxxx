const outputTable = document.getElementById("outputTable");

function displayData(data) {
  const tbody = outputTable.querySelector("tbody");
  tbody.innerHTML = "";
  data.forEach(row => {
    const tr = document.createElement("tr");
    Object.values(row).forEach(value => {
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  outputTable.style.display = "table";
}

function downloadCSV(data) {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  try {
    a.click();
  } catch (e) {
    console.error("Download error:", e);
    alert("Error downloading CSV file. Please check your browser settings.");
  }
  URL.revokeObjectURL(url);
}

export { displayData, downloadCSV };