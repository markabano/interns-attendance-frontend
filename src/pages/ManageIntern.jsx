import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, EyeOff } from "lucide-react";
import Sidebar from "../components/Sidebar";
import axios from "../api/axios";

export default function ManageIntern() {
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState({});
  const [interns, setInterns] = useState([]);
  const [newIntern, setNewIntern] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    initialPassword: "",
    department: "",
    requiredHours: "",
    schedule: { timeIn: "", timeOut: "", breakStart: "", breakEnd: "" },
  });
  const emptyIntern = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    initialPassword: "",
    department: "",
    requiredHours: "",
    schedule: { timeIn: "", timeOut: "", breakStart: "", breakEnd: "" },
  };
  const [search, setSearch] = useState("");

  const handleAddIntern = async () => {
    try {
      const response = await axios.post(
        "/manageIntern/createIntern",
        newIntern
      );
      console.log("Intern added:", response.data);
      setShowModal(false);
    } catch (error) {
      console.error("Error adding intern:", error);
    } finally {
      setNewIntern(emptyIntern);
      setShowModal(false);
    }
  };

  const fetchInterns = async () => {
    try {
      const response = await axios.get("/manageIntern/fetchInterns");
      setInterns(response.data.data);
    } catch (error) {
      console.error("Error fetching interns:", error);
    }
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  const deleteIntern = async (internId) => {
    try {
      await axios.delete(`/manageIntern/deleteIntern/${internId}`);
      fetchInterns();
    } catch (error) {
      console.error("Error deleting intern:", error);
    }
  };

  return (
    <div className="min-h-screen flex bg-linear-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      <Sidebar />
      <main className="flex-1 p-6 md:p-10 pt-20 md:pt-10 space-y-6">
        <h1 className="text-3xl font-bold tracking-wide">Manage Interns</h1>

        {/* Add Intern Button */}
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowModal(true)}
        >
          Add Intern
        </Button>

        {/* Search Bar */}
        <Card className="bg-[#1e293b] border-none shadow-lg">
          <CardContent className="p-4 flex items-center gap-4">
            <Input
              placeholder="Search intern by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#0f172a] border-none text-white"
            />
            <Button className="bg-blue-600 hover:bg-blue-700">Search</Button>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="bg-[#1e293b] border-none shadow-lg">
          <CardContent className="p-4 overflow-x-auto">
            <Table className="w-full table-auto">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white w-1/5">Name</TableHead>
                  <TableHead className="text-white w-1/5">Email</TableHead>
                  <TableHead className="text-white w-1/6">
                    Initial Password
                  </TableHead>
                  <TableHead className="text-white w-1/6">Department</TableHead>
                  <TableHead className="text-white w-1/6">
                    Required Hours
                  </TableHead>
                  <TableHead className="text-white text-center w-1/6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="text-white">
                {interns.length > 0 ? (
                  interns.map((intern) => (
                    <TableRow key={intern._id} className="hover:bg-[#0f172a]">
                      <TableCell>
                        {intern.firstName} {intern.lastName}
                      </TableCell>
                      <TableCell>{intern.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>
                            {showPassword[intern._id]
                              ? intern.initialPassword
                              : "••••••••"}
                          </span>

                          <button
                            onClick={() =>
                              setShowPassword((prev) => ({
                                ...prev,
                                [intern._id]: !prev[intern._id],
                              }))
                            }
                            className="text-gray-300 hover:text-white"
                          >
                            {showPassword[intern._id] ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </TableCell>
                      <TableCell>{intern.department}</TableCell>
                      <TableCell>{intern.requiredHours}</TableCell>

                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            onClick={() => deleteIntern(intern._id)}
                            className="bg-red-600 hover:bg-red-700 px-3"
                          >
                            Delete
                          </Button>
                          <Button className="bg-green-600 hover:bg-green-700 px-4">
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-4 text-gray-300"
                    >
                      No intern data available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add Intern Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#1e293b] p-6 rounded-xl w-full max-w-md shadow-xl">
              <h2 className="text-xl font-semibold mb-4">Add New Intern</h2>

              <div className="space-y-4">
                <label htmlFor="firstName">First Name</label>
                <Input
                  placeholder="First Name"
                  className="bg-[#0f172a] text-white"
                  value={newIntern.firstName}
                  onChange={(e) =>
                    setNewIntern({ ...newIntern, firstName: e.target.value })
                  }
                />
                <label htmlFor="lastName">Last Name</label>
                <Input
                  placeholder="Last Name"
                  className="bg-[#0f172a] text-white"
                  value={newIntern.lastName}
                  onChange={(e) =>
                    setNewIntern({ ...newIntern, lastName: e.target.value })
                  }
                />
                <label htmlFor="email">Email</label>
                <div className="flex flex-row items-center gap-4">
                  <Input
                    placeholder="Email"
                    className="bg-[#0f172a] text-white"
                    value={newIntern.email}
                    onChange={(e) =>
                      setNewIntern({ ...newIntern, email: e.target.value })
                    }
                  />
                  <button
                    disabled={!newIntern.firstName || !newIntern.lastName}
                    onClick={() => {
                      const generatedEmail =
                        newIntern.firstName.toLowerCase() +
                        "." +
                        newIntern.lastName.toLowerCase() +
                        "@gmail.com";

                      setNewIntern({
                        ...newIntern,
                        email: generatedEmail,
                      });
                    }}
                    className={
                      !newIntern.firstName || !newIntern.lastName
                        ? "text-sm text-gray-400 mt-1"
                        : "text-sm text-blue-400 hover:underline mt-1"
                    }
                  >
                    Generate
                  </button>
                </div>

                <label htmlFor="password">Password</label>
                <div className="flex flex-row items-center gap-4">
                  <Input
                    placeholder="Initial Password"
                    className="bg-[#0f172a] text-white"
                    value={newIntern.password}
                    onChange={(e) =>
                      setNewIntern({ ...newIntern, password: e.target.value })
                    }
                  />
                  <button
                    onClick={() => {
                      const generatedPassword = Math.random()
                        .toString(36)
                        .slice(-8);
                      setNewIntern({
                        ...newIntern,
                        password: generatedPassword,
                        initialPassword: generatedPassword,
                      });
                    }}
                    className="text-sm text-blue-400 hover:underline mt-1"
                  >
                    Generate
                  </button>
                </div>
                <label htmlFor="department">Department</label>
                <Input
                  placeholder="Department"
                  className="bg-[#0f172a] text-white"
                  value={newIntern.department}
                  onChange={(e) =>
                    setNewIntern({ ...newIntern, department: e.target.value })
                  }
                />
                <label htmlFor="requiredHours">Required Hours</label>
                <Input
                  placeholder="Required Hours"
                  type="number"
                  className="bg-[#0f172a] text-white"
                  value={newIntern.requiredHours}
                  onChange={(e) =>
                    setNewIntern({
                      ...newIntern,
                      requiredHours: e.target.value,
                    })
                  }
                />
                <h3 className="text-xl font-semibold mb-4">
                  Schedule (eg., 08:00am - 17:00pm)
                </h3>
                <label htmlFor="timeIn">Time In</label>
                <Input
                  placeholder="Schedule - Time In (e.g., 08:00)"
                  type="time"
                  className="bg-[#0f172a] text-white"
                  value={newIntern.schedule.timeIn}
                  onChange={(e) =>
                    setNewIntern({
                      ...newIntern,
                      schedule: {
                        ...newIntern.schedule,
                        timeIn: e.target.value,
                      },
                    })
                  }
                />
                <label htmlFor="timeOut">Time Out</label>
                <Input
                  placeholder="Schedule - Time Out (e.g., 17:00)"
                  type="time"
                  className="bg-[#0f172a] text-white"
                  value={newIntern.schedule.timeOut}
                  onChange={(e) =>
                    setNewIntern({
                      ...newIntern,
                      schedule: {
                        ...newIntern.schedule,
                        timeOut: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  className="bg-gray-600 hover:bg-gray-700"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    handleAddIntern();
                    setShowModal(false);
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
