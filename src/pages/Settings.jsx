/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Pencil, Plus } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { motion } from "framer-motion";
import axios from "../api/axios.js";

// Shadcn Dialog
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function Settings() {
  const [newDept, setNewDept] = useState({ departmentName: "" });
  const [departments, setDepartments] = useState([]);

  // Modal states
  const [openModal, setOpenModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  const addDepartment = async () => {
    try {
      await axios.post("/department/createDepartment", {
        departmentName: newDept.departmentName,
      });
    } catch (error) {
      console.error("Error adding department:", error);
    } finally {
      getDepartments();
      setNewDept({ departmentName: "" });
    }
  };

  const getDepartments = async () => {
    try {
      const response = await axios.get("/department/getDepartments");
      setDepartments(response.data.department);
    } catch (error) {
      console.error("Error getting department:", error);
    }
  };

  const openEditModal = (dept) => {
    setEditId(dept._id);
    setEditName(dept.name);
    setOpenModal(true);
  };

  const saveEdit = async () => {
    try {
      await axios.patch(`/department/updateDepartment/${editId}`, {
        departmentName: editName,
      });

      setOpenModal(false);
      setEditId(null);
      setEditName("");
      getDepartments();
    } catch (error) {
      console.error("Error updating department:", error);
    }
  };

  const deleteDepartment = async (deptId) => {
    try {
      await axios.delete(`/department/deleteDepartment/${deptId}`);
      getDepartments();
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  useEffect(() => {
    getDepartments();
  }, []);

  return (
    <div className="min-h-screen flex bg-linear-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-10 pt-20 md:pt-10">
        <motion.h2
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-6 tracking-wide"
        >
          Manage <span className="text-blue-400">Departments</span>
        </motion.h2>

        {/* Add Department */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-md bg-white/10 border border-white/10 p-6 rounded-2xl shadow-xl mb-8"
        >
          <h2 className="text-lg font-semibold mb-3">Add New Department</h2>
          <div className="flex gap-3 max-w-md">
            <Input
              placeholder="Enter department name"
              value={newDept.departmentName}
              onChange={(e) => setNewDept({ departmentName: e.target.value })}
              className="bg-white/20 border-white/20 text-white"
            />
            <Button onClick={addDepartment}>
              <Plus className="w-4 h-4 mr-2" /> Add
            </Button>
          </div>
        </motion.div>

        {/* Department Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept, i) => (
            <motion.div
              key={dept._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="backdrop-blur-md bg-white/10 border border-white/10 p-5 rounded-2xl shadow-xl"
            >
              <h3 className="font-semibold text-xl mb-4">{dept.name}</h3>
              <div className="flex justify-end gap-2">
                <Button
                  size="icon"
                  className="bg-green-600 hover:bg-green-700 px-4"
                  onClick={() => openEditModal(dept)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  className="bg-red-600 hover:bg-red-700 px-3"
                  onClick={() => deleteDepartment(dept._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Edit Modal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="bg-[#1e293b] text-white border-white/20">
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
          </DialogHeader>

          <Input
            className="bg-white/20 text-white mt-3"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />

          <DialogFooter className="mt-4">
            <Button variant="secondary" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button onClick={saveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
