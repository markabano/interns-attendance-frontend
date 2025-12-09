/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  const [editIntern, setEditIntern] = useState(false);
  const [showPassword, setShowPassword] = useState({});
  const [interns, setInterns] = useState([]);
  const [departments, setDepartments] = useState([]);
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
  const [updateInternData, setUpdateInternData] = useState({
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

  const updateIntern = async (internId, updateInternData) => {
    try {
      await axios.patch(
        `/manageIntern/updateIntern/${internId}`,
        updateInternData
      );
      fetchInterns();
    } catch (error) {
      console.error("Error updating intern:", error);
    } finally {
      setNewIntern(emptyIntern);
      setUpdateInternData(emptyIntern);
      setShowModal(false);
    }
  };

  const deleteIntern = async (internId) => {
    try {
      await axios.delete(`/manageIntern/deleteIntern/${internId}`);
      fetchInterns();
    } catch (error) {
      console.error("Error deleting intern:", error);
    }
  };

  const getDepartments = async () => {
    try {
      const response = await axios.get("/department/getDepartments");
      setDepartments(response.data.department);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    fetchInterns();
    getDepartments();
  }, []);

  return (
    <div className="min-h-screen flex bg-linear-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10 pt-20 md:pt-10 space-y-8">
        {/* TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl font-bold tracking-wide"
        >
          Manage Interns
        </motion.h1>

        {/* Add Intern Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <Button
            className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20"
            onClick={() => setShowModal(true)}
          >
            Add Intern
          </Button>
        </motion.div>

        {/* SEARCH */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/10 shadow-xl rounded-2xl">
            <CardContent className="p-4 flex items-center gap-4">
              <Input
                placeholder="Search intern by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white/5 border-none text-white placeholder:text-gray-400"
              />
              <Button className="bg-blue-600 hover:bg-blue-700">Search</Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* TABLE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/10 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-4 overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-white">Name</TableHead>
                    <TableHead className="text-white">Email</TableHead>
                    <TableHead className="text-white">
                      Initial Password
                    </TableHead>
                    <TableHead className="text-white">Department</TableHead>
                    <TableHead className="text-white">Required Hours</TableHead>
                    <TableHead className="text-white text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody className="text-white">
                  {interns.length > 0 ? (
                    interns.map((intern) => (
                      <motion.tr
                        key={intern._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className="hover:bg-white/5 transition rounded-lg"
                      >
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
                            <Button
                              onClick={() => {
                                setUpdateInternData(intern);
                                setEditIntern(true);
                                setShowModal(true);
                              }}
                              className="bg-green-600 hover:bg-green-700 px-4"
                            >
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
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
        </motion.div>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="bg-white/10 backdrop-blur-2xl p-6 rounded-xl w-full max-w-md shadow-2xl border border-white/10"
            >
              <h2 className="text-xl font-semibold mb-4">
                {editIntern ? "Edit" : "Add New"} Intern
              </h2>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <label>First Name</label>
                <Input
                  className="bg-white/5 text-white"
                  value={
                    editIntern
                      ? updateInternData.firstName
                      : newIntern.firstName
                  }
                  onChange={(e) =>
                    editIntern
                      ? setUpdateInternData({
                          ...updateInternData,
                          firstName: e.target.value,
                        })
                      : setNewIntern({
                          ...newIntern,
                          firstName: e.target.value,
                        })
                  }
                />

                <label>Last Name</label>
                <Input
                  className="bg-white/5 text-white"
                  value={
                    editIntern ? updateInternData.lastName : newIntern.lastName
                  }
                  onChange={(e) =>
                    editIntern
                      ? setUpdateInternData({
                          ...updateInternData,
                          lastName: e.target.value,
                        })
                      : setNewIntern({ ...newIntern, lastName: e.target.value })
                  }
                />

                <label>Email</label>
                <div className="flex items-center gap-3">
                  <Input
                    disabled={editIntern}
                    className="bg-white/5 text-white"
                    value={
                      editIntern ? updateInternData.email : newIntern.email
                    }
                    onChange={(e) =>
                      editIntern
                        ? setUpdateInternData({
                            ...updateInternData,
                            email: e.target.value,
                          })
                        : setNewIntern({ ...newIntern, email: e.target.value })
                    }
                  />

                  {!editIntern && (
                    <button
                      disabled={!newIntern.firstName || !newIntern.lastName}
                      onClick={() => {
                        const generatedEmail =
                          newIntern.firstName.toLowerCase() +
                          "." +
                          newIntern.lastName.toLowerCase() +
                          "@gmail.com";
                        setNewIntern({ ...newIntern, email: generatedEmail });
                      }}
                      className="text-blue-400 text-sm hover:underline disabled:text-gray-500"
                    >
                      Generate
                    </button>
                  )}
                </div>

                {!editIntern && (
                  <div>
                    <label>Password</label>
                    <div className="flex items-center gap-3">
                      <Input
                        className="bg-white/5 text-white"
                        value={newIntern.password}
                        onChange={(e) =>
                          setNewIntern({
                            ...newIntern,
                            password: e.target.value,
                          })
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
                        className="text-blue-400 text-sm hover:underline"
                      >
                        Generate
                      </button>
                    </div>
                  </div>
                )}

                <label>Department</label>
                <select
                  className="bg-white/5 text-white p-2 rounded-md w-full"
                  value={
                    editIntern
                      ? updateInternData.department
                      : newIntern.department
                  }
                  onChange={(e) =>
                    editIntern
                      ? setUpdateInternData({
                          ...updateInternData,
                          department: e.target.value,
                        })
                      : setNewIntern({
                          ...newIntern,
                          department: e.target.value,
                        })
                  }
                >
                  <option value="" className="text-black">
                    Select Department
                  </option>

                  {departments.map((dept) => (
                    <option
                      key={dept._id}
                      value={dept.name}
                      className="text-black"
                    >
                      {dept.name}
                    </option>
                  ))}
                </select>

                <label>Required Hours</label>
                <Input
                  type="number"
                  className="bg-white/5 text-white"
                  value={
                    editIntern
                      ? updateInternData.requiredHours
                      : newIntern.requiredHours
                  }
                  onChange={(e) =>
                    editIntern
                      ? setUpdateInternData({
                          ...updateInternData,
                          requiredHours: e.target.value,
                        })
                      : setNewIntern({
                          ...newIntern,
                          requiredHours: e.target.value,
                        })
                  }
                />

                <h3 className="text-lg font-semibold mt-4">Schedule</h3>

                <label>Time In</label>
                <Input
                  type="time"
                  className="bg-white/5 text-white"
                  value={
                    editIntern
                      ? updateInternData.schedule.timeIn
                      : newIntern.schedule.timeIn
                  }
                  onChange={(e) =>
                    editIntern
                      ? setUpdateInternData({
                          ...updateInternData,
                          schedule: {
                            ...updateInternData.schedule,
                            timeIn: e.target.value,
                          },
                        })
                      : setNewIntern({
                          ...newIntern,
                          schedule: {
                            ...newIntern.schedule,
                            timeIn: e.target.value,
                          },
                        })
                  }
                />

                <label>Time Out</label>
                <Input
                  type="time"
                  className="bg-white/5 text-white"
                  value={
                    editIntern
                      ? updateInternData.schedule.timeOut
                      : newIntern.schedule.timeOut
                  }
                  onChange={(e) =>
                    editIntern
                      ? setUpdateInternData({
                          ...updateInternData,
                          schedule: {
                            ...updateInternData.schedule,
                            timeOut: e.target.value,
                          },
                        })
                      : setNewIntern({
                          ...newIntern,
                          schedule: {
                            ...newIntern.schedule,
                            timeOut: e.target.value,
                          },
                        })
                  }
                />

                <label>Break Start</label>
                <Input
                  type="time"
                  className="bg-white/5 text-white"
                  value={
                    editIntern
                      ? updateInternData.schedule.breakStart
                      : newIntern.schedule.breakStart
                  }
                  onChange={(e) =>
                    editIntern
                      ? setUpdateInternData({
                          ...updateInternData,
                          schedule: {
                            ...updateInternData.schedule,
                            breakStart: e.target.value,
                          },
                        })
                      : setNewIntern({
                          ...newIntern,
                          schedule: {
                            ...newIntern.schedule,
                            breakStart: e.target.value,
                          },
                        })
                  }
                />

                <label>Break End</label>
                <Input
                  type="time"
                  className="bg-white/5 text-white"
                  value={
                    editIntern
                      ? updateInternData.schedule.breakEnd
                      : newIntern.schedule.breakEnd
                  }
                  onChange={(e) =>
                    editIntern
                      ? setUpdateInternData({
                          ...updateInternData,
                          schedule: {
                            ...updateInternData.schedule,
                            breakEnd: e.target.value,
                          },
                        })
                      : setNewIntern({
                          ...newIntern,
                          schedule: {
                            ...newIntern.schedule,
                            breakEnd: e.target.value,
                          },
                        })
                  }
                />
              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  className="bg-gray-600 hover:bg-gray-700"
                  onClick={() => {
                    setShowModal(false);
                    setEditIntern(false);
                  }}
                >
                  Cancel
                </Button>

                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    if (editIntern) {
                      updateIntern(updateInternData._id, updateInternData);
                    } else {
                      handleAddIntern();
                    }
                  }}
                >
                  {editIntern ? "Save Changes" : "Add Intern"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
