import { allAdmins } from "@/http/api";
import Heading from "@/shared/heading/Heading";
import Loading from "@/shared/loading/Loading";
import { useQuery } from "@tanstack/react-query";
import {
  LockKeyhole,
  FileSpreadsheet,
  FileText,
  Copy,
  Printer,
} from "lucide-react";
import DataTable from "react-data-table-component";
import { useState } from "react";

// Import your export utilities
import {
  exportToCSV,
  exportToExcel,
  exportToPDF,
  copyToClipboard,
  printTable,
} from "@/utlis/export/exportFile";

const Admins = () => {
  const { data: adminData, isLoading } = useQuery({
    queryKey: ["admins"],
    queryFn: allAdmins,
    staleTime: 10000,
  });

  const [search, setSearch] = useState("");

  const admins = adminData?.users || [];

  const filteredAdmins = admins.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Email", selector: (row) => row.email },
    { name: "Role", selector: (row) => row.role },
    {
      name: "Created At",
      selector: (row) => new Date(row.created_at).toLocaleDateString(),
      sortable: true,
    },
  ];

  console.log("columns".columns);

  if (isLoading) return <Loading />;

  return (
    <div>
      <Heading icon={<LockKeyhole />} title="All Admins" />

      <div className="max-w-6xl mx-auto mt-10 p-4 sm:p-6 bg-white shadow-md rounded-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Admin List
          </h2>
          <h3>Total Admin: {filteredAdmins.length}</h3>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            onClick={() => exportToCSV(columns, filteredAdmins, "Admin List")}
            className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded"
          >
            <FileSpreadsheet size={16} /> CSV
          </button>
          <button
            onClick={() => exportToExcel(columns, filteredAdmins, "Admin List")}
            className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded"
          >
            <FileSpreadsheet size={16} /> Excel
          </button>
          <button
            onClick={() => exportToPDF(columns, filteredAdmins, "Admin List")}
            className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded"
          >
            <FileText size={16} /> PDF
          </button>
          <button
            onClick={() => copyToClipboard(columns, filteredAdmins)}
            className="flex items-center gap-2 px-3 py-1 bg-yellow-500 text-white rounded"
          >
            <Copy size={16} /> Copy
          </button>
          <button
            onClick={() => printTable(columns, filteredAdmins)}
            className="flex items-center gap-2 px-3 py-1 bg-gray-700 text-white rounded"
          >
            <Printer size={16} /> Print
          </button>
          <input
            type="text"
            placeholder="Search admin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 ml-auto"
          />
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={filteredAdmins}
          pagination
          highlightOnHover
          striped
          responsive
        />
      </div>
    </div>
  );
};

export default Admins;
