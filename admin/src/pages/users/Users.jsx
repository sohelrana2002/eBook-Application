import { allUsers } from "@/http/api";
import Heading from "@/shared/heading/Heading";
import Loading from "@/shared/loading/Loading";
import { useQuery } from "@tanstack/react-query";
import {
  Copy,
  FileSpreadsheet,
  FileText,
  Printer,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Trash2, ArrowUpDown, ArrowUp, ArrowDown, Search } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  copyToClipboard,
  exportToCSV,
  exportToExcel,
  exportToPDF,
  printTable,
} from "@/utlis/export/exportFile.js";

const Users = () => {
  const { data: UsersRes, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: allUsers,
    staleTime: 10000,
  });
  const userData = UsersRes?.users;

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    order: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Initially store data in the state
  useEffect(() => {
    if (userData) {
      setUsers(userData);
    }
  }, [userData]);

  // handle search functionality
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user?.name?.toLowerCase()?.includes(searchTerm?.toLocaleLowerCase()) ||
        user?.email?.toLowerCase()?.includes(searchTerm?.toLocaleLowerCase()) ||
        user?.role?.toLowerCase()?.includes(searchTerm?.toLocaleLowerCase()),
    );
  }, [users, searchTerm]);

  // handle sorting functionality
  const sortedUsers = useMemo(() => {
    let sortableUsers = [...filteredUsers];

    if (sortConfig.key) {
      sortableUsers.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // process number
        if (sortConfig.key === "created_at") {
          const aDate = aValue ? new Date(aValue).getTime() : 0;
          const bDate = bValue ? new Date(bValue).getTime() : 0;

          return sortConfig.order === "asc" ? aDate - bDate : bDate - aDate;
        }

        // process string
        if (aValue < bValue) {
          return sortConfig.order === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.order === "asc" ? 1 : -1;
        }

        return 0;
      });
    }

    return sortableUsers;
  }, [filteredUsers, sortConfig]);

  // handle request sort
  const requestSort = (key) => {
    let order = "asc";

    if (sortConfig.key === key && sortConfig.order === "asc") {
      order = "desc";
    }
    setSortConfig({ key, order });
  };

  // handle sort icon
  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName)
      return <ArrowUp className="ml-2 h-4 w-4" />;

    return sortConfig.order === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  // handle pagination
  const totalPage = Math.ceil(sortedUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    return sortedUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedUsers, currentPage]);

  // Toolbar columns
  const columns = [
    {
      name: "Name",
      selector: (row) => row.name || "",
    },
    {
      name: "Email",
      selector: (row) => row.email || "",
    },
    {
      name: "Role",
      selector: (row) => row.role || "",
    },
    {
      name: "Created At",
      selector: (row) => new Date(row.created_at).toLocaleDateString() || "N/A",
    },
  ];

  // Loading state UI
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <Heading icon={<UsersRound />} title="All Users" />

      {/* Table wrapper  */}
      <div className="max-w-6xl mx-auto my-5 p-4 sm:p-6 bg-white shadow-md rounded-lg">
        {/* Toolbar section  */}
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            onClick={() => exportToCSV(columns, filteredUsers, "Users List")}
            className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded cursor-pointer"
          >
            <FileSpreadsheet size={16} /> CSV
          </button>
          <button
            onClick={() => exportToExcel(columns, filteredUsers, "Users List")}
            className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded cursor-pointer"
          >
            <FileSpreadsheet size={16} /> Excel
          </button>
          <button
            onClick={() => exportToPDF(columns, filteredUsers, "Users List")}
            className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded cursor-pointer"
          >
            <FileText size={16} /> PDF
          </button>
          <button
            onClick={() => copyToClipboard(columns, filteredUsers)}
            className="flex items-center gap-2 px-3 py-1 bg-yellow-500 text-white rounded cursor-pointer"
          >
            <Copy size={16} /> Copy
          </button>
          <button
            onClick={() => printTable(columns, filteredUsers, "Users List")}
            className="flex items-center gap-2 px-3 py-1 bg-gray-700 text-white rounded cursor-pointer"
          >
            <Printer size={16} /> Print
          </button>
        </div>

        {/* search field  */}
        <div className="pb-5 flex flex-col md:flex-row gap-2 md:gap-0 items-center justify-between">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 placeholder:text-sm"
              disabled={isLoading}
            />
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Total Users: {sortedUsers?.length}</p>
          </div>
        </div>

        {/* actual table  */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("name")}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      Name {sortConfig.key === "name" && getSortIcon("name")}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to sort</p>
                  </TooltipContent>
                </Tooltip>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("email")}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      Email {sortConfig.key === "email" && getSortIcon("email")}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to sort</p>
                  </TooltipContent>
                </Tooltip>
              </TableHead>
              <TableHead>Role</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("created_at")}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      Created At{" "}
                      {sortConfig.key === "created_at" &&
                        getSortIcon("created_at")}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to sort</p>
                  </TooltipContent>
                </Tooltip>
              </TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers?.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium capitalize">
                    {user.name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="capitalize">{user.role}</TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>Delete</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination  */}
      <div className="flex items-center justify-center gap-3 pb-5">
        <button
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage <= 1}
          className={`text-sm md:text-md px-3 md:px-4 py-1 md:py-2 rounded-md ${currentPage <= 1 ? "border-2 bg-white text-black" : "bg-foreground text-background cursor-pointer"}`}
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPage} | {sortedUsers.length} users.
        </span>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage >= totalPage}
          className={`text-sm md:text-md px-3 md:px-4 py-1 md:py-2 rounded-md ${currentPage >= totalPage ? "border-2 bg-white text-black" : "bg-foreground text-background cursor-pointer"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Users;
