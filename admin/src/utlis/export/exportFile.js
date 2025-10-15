import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const exportToCSV = (columns, data, fileName = "Data") => {
  const exportData = data.map((row) => {
    const newRow = {};
    columns.forEach((col) => {
      if (typeof col.selector === "function") {
        newRow[col.name] = col.selector(row);
      }
    });

    return newRow;
  });

  const ws = XLSX.utils.json_to_sheet(exportData);
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.csv`;
  link.click();
};

const exportToExcel = (columns, data, fileName = "Data") => {
  // Only include the columns you want
  const exportData = data.map((row) => {
    const newRow = {};
    columns.forEach((col) => {
      if (typeof col.selector === "function") {
        newRow[col.name] = col.selector(row);
      }
    });
    return newRow;
  });

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

const exportToPDF = (columns, data, title = "Data List") => {
  const doc = new jsPDF();
  doc.text(title, 14, 10);

  // Only include valid selector columns
  const validColumns = columns.filter((c) => typeof c.selector === "function");

  autoTable(doc, {
    head: [validColumns.map((c) => c.name)],
    body: data.map((row) => validColumns.map((c) => c.selector(row))),
  });

  doc.save(`${title}.pdf`);
};

const copyToClipboard = (columns, data) => {
  // Only include the columns that are shown in your table
  const validColumns = columns.filter((c) => typeof c.selector === "function");

  // Prepare table-like text
  const header = validColumns.map((c) => c.name).join("\t");
  const rows = data.map((row) =>
    validColumns.map((c) => c.selector(row)).join("\t")
  );

  const text = [header, ...rows].join("\n");

  // Copy to clipboard
  navigator.clipboard.writeText(text).then(() => {
    alert("Copied visible table data to clipboard!");
  });
};

const printTable = (columns, data, title = "Admin List") => {
  const validCols = columns.filter((c) => typeof c.selector === "function");

  const table = `
    <html><head><title>${title}</title>
    <style>
      body{font-family:Arial;margin:20px;}
      table{width:100%;border-collapse:collapse;}
      th,td{border:1px solid #ccc;padding:6px;text-align:left;}
      th{background:#f2f2f2;}
    </style></head><body>
    <h2>${title}</h2>
    <table>
      <thead><tr>${validCols
        .map((c) => `<th>${c.name}</th>`)
        .join("")}</tr></thead>
      <tbody>${data
        .map(
          (r) =>
            `<tr>${validCols
              .map((c) => `<td>${c.selector(r)}</td>`)
              .join("")}</tr>`
        )
        .join("")}</tbody>
    </table>
    </body></html>
  `;

  const w = window.open("", "_blank");
  w.document.write(table);
  w.document.close();
  w.print();
};

export { exportToCSV, exportToExcel, exportToPDF, copyToClipboard, printTable };
