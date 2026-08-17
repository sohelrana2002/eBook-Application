import { useState } from "react";
import { allAdmins } from "@/http/api";
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
    staleTime: 1000 * 60 * 5, // Caches fresh data (5-mins)
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
    { name: "Email", selector: (row) => row.email, sortable: true },
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
      <div className="w-full">
        {/* Header */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Admin List
        </h2>

        {/* Toolbar */}
        <div className="flex flex-col gap-3 pt-3">
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

          {/* search field  */}
          <div className="py-5 flex flex-col md:flex-row gap-y-2 md:gap-0 items-start md:items-center justify-between">
            <div className="relative w-full md:w-md">
              <Search className="absolute left-2.5 top-[12px] h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name, email, or role..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                className="pl-8 placeholder:text-sm border-3 w-full"
                disabled={isLoading}
              />
            </div>
            <div className="text-sm text-gray-600 border-2 px-3 py-[6px] rounded-sm">
              <p>Total Admin: {filteredAdmins.length}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="shadow-md rounded-md">
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
    </div>
  );
};

export default Admins;
