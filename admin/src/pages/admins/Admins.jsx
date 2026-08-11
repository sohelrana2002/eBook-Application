import { useState } from "react";
import { allAdmins } from "@/http/api";
import Heading from "@/shared/heading/Heading";
import Loading from "@/shared/loading/Loading";
import { useQuery } from "@tanstack/react-query";
import { capitalizedWords } from "@/helpers/stringUtils";
import {
  LockKeyhole,
  FileSpreadsheet,
  FileText,
  Copy,
  Printer,
  Search,
} from "lucide-react";
import DataTable from "react-data-table-component";

// Import your export utilities
import {
  exportToCSV,
  exportToExcel,
  exportToPDF,
  copyToClipboard,
  printTable,
} from "@/utlis/export/exportFile";
import { Input } from "@/components/ui/input";

const Admins = () => {
  const { data: adminData, isLoading } = useQuery({
    queryKey: ["admins"],
    queryFn: allAdmins,
    staleTime: 10000,
  });

  const [searchTerm, setSearchTerm] = useState("");

  const admins = adminData?.users || [];

  const filteredAdmins = admins.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const columns = [
    {
      name: "Name",
      selector: (row) => capitalizedWords(row.name),
      sortable: true,
    },
    { name: "Email", selector: (row) => row.email },
    { name: "Role", selector: (row) => capitalizedWords(row.role) },
    {
      name: "Created At",
      selector: (row) => new Date(row.created_at).toLocaleDateString(),
      sortable: true,
    },
  ];

  // console.log("columns".columns);

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
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2 ">
            <button
              onClick={() => exportToCSV(columns, filteredAdmins, "Admin List")}
              className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded cursor-pointer"
            >
              <FileSpreadsheet size={16} /> CSV
            </button>
            <button
              onClick={() =>
                exportToExcel(columns, filteredAdmins, "Admin List")
              }
              className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded cursor-pointer"
            >
              <FileSpreadsheet size={16} /> Excel
            </button>
            <button
              onClick={() => exportToPDF(columns, filteredAdmins, "Admin List")}
              className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded cursor-pointer"
            >
              <FileText size={16} /> PDF
            </button>
            <button
              onClick={() => copyToClipboard(columns, filteredAdmins)}
              className="flex items-center gap-2 px-3 py-1 bg-yellow-500 text-white rounded cursor-pointer"
            >
              <Copy size={16} /> Copy
            </button>
            <button
              onClick={() => printTable(columns, filteredAdmins, "Admin List")}
              className="flex items-center gap-2 px-3 py-1 bg-gray-700 text-white rounded cursor-pointer"
            >
              <Printer size={16} /> Print
            </button>
          </div>

          <div className="relative w-full md:w-72 mb-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              className="pl-8 placeholder:text-sm"
              disabled={isLoading}
            />
          </div>
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
