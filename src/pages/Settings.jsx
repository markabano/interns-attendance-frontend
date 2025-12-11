/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Pencil, Plus } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { motion } from "framer-motion";
import axios from "../api/axios.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmModal from "@/components/ConfirmModal.jsx";

// ============================================================================
// CONSTANTS
// ============================================================================

const ANIMATION_CONFIG = {
  header: {
    initial: { opacity: 0, y: -15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  },
  addSection: {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.2 },
  },
  card: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
};

const MODAL_TYPES = {
  EDIT: "edit",
  DELETE: "delete",
  NONE: null,
};

const TOAST_MESSAGES = {
  ADD_SUCCESS: "Department added successfully",
  ADD_ERROR: "Failed to add department",
  UPDATE_SUCCESS: "Department updated successfully",
  UPDATE_ERROR: "Failed to update department",
  DELETE_SUCCESS: "Department deleted successfully",
  DELETE_ERROR: "Failed to delete department",
  FETCH_ERROR: "Failed to load departments",
};

// ============================================================================
// API SERVICE
// ============================================================================

const departmentService = {
  getAll: async () => {
    const response = await axios.get("/department/getDepartments");
    return response.data.department;
  },

  create: async (departmentName) => {
    await axios.post("/department/createDepartment", { departmentName });
  },

  update: async (id, departmentName) => {
    await axios.patch(`/department/updateDepartment/${id}`, { departmentName });
  },

  delete: async (id) => {
    await axios.delete(`/department/deleteDepartment/${id}`);
  },
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const PageHeader = () => (
  <motion.h2
    {...ANIMATION_CONFIG.header}
    className="text-3xl font-bold mb-6 tracking-wide"
  >
    Manage <span className="text-blue-400">Departments</span>
  </motion.h2>
);

const AddDepartmentSection = ({ value, onChange, onAdd, loading }) => (
  <motion.div
    {...ANIMATION_CONFIG.addSection}
    className="backdrop-blur-md bg-white/10 border border-white/10 p-6 rounded-2xl shadow-xl mb-8"
  >
    <h2 className="text-lg font-semibold mb-3">Add New Department</h2>
    <div className="flex gap-3 max-w-md">
      <Input
        placeholder="Enter department name"
        value={value}
        onChange={onChange}
        onKeyPress={(e) => e.key === "Enter" && !loading && onAdd()}
        disabled={loading}
        className="bg-white/20 border-white/20 text-white placeholder:text-white/50"
      />
      <Button
        className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20"
        onClick={onAdd}
        disabled={!value.trim() || loading}
      >
        {loading ? (
          <>
            <span className="animate-spin mr-2">⏳</span> Adding...
          </>
        ) : (
          <>
            <Plus className="w-4 h-4 mr-2" /> Add
          </>
        )}
      </Button>
    </div>
  </motion.div>
);

const DepartmentCard = ({ department, index, onEdit, onDelete }) => (
  <motion.div
    key={department._id}
    {...ANIMATION_CONFIG.card}
    transition={{ delay: 0.1 * index }}
    className="backdrop-blur-md bg-white/10 border border-white/10 p-5 rounded-2xl shadow-xl hover:bg-white/15 transition-all"
  >
    <h3 className="font-semibold text-xl mb-4">{department.name}</h3>
    <div className="flex justify-end gap-2">
      <Button
        size="icon"
        className="bg-green-600 hover:bg-green-700 px-4"
        onClick={() => onEdit(department)}
      >
        <Pencil className="w-4 h-4" />
      </Button>
      <Button
        size="icon"
        className="bg-red-600 hover:bg-red-700 px-3"
        onClick={() => onDelete(department)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  </motion.div>
);

const DepartmentGrid = ({ departments, onEdit, onDelete }) => {
  if (departments.length === 0) {
    return (
      <div className="text-center py-12 text-white/60">
        <p className="text-lg">No departments yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {departments.map((dept, index) => (
        <DepartmentCard
          key={dept._id}
          department={dept}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

const EditModal = ({ isOpen, onClose, value, onChange, onSave, loading }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="bg-[#1e293b] text-white border-white/20">
      <DialogHeader>
        <DialogTitle>Edit Department</DialogTitle>
      </DialogHeader>

      <Input
        className="bg-white/20 text-white mt-3 placeholder:text-white/50"
        value={value}
        onChange={onChange}
        onKeyPress={(e) => e.key === "Enter" && !loading && onSave()}
        placeholder="Department name"
        disabled={loading}
      />

      <DialogFooter className="mt-4">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={onSave} disabled={!value.trim() || loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

const useDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching departments:", err);
      toast.error(TOAST_MESSAGES.FETCH_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const addDepartment = async (name) => {
    try {
      await departmentService.create(name);
      await fetchDepartments();
      toast.success(TOAST_MESSAGES.ADD_SUCCESS);
    } catch (err) {
      console.error("Error adding department:", err);
      toast.error(TOAST_MESSAGES.ADD_ERROR);
      throw err;
    }
  };

  const updateDepartment = async (id, name) => {
    try {
      await departmentService.update(id, name);
      await fetchDepartments();
      toast.success(TOAST_MESSAGES.UPDATE_SUCCESS);
    } catch (err) {
      console.error("Error updating department:", err);
      toast.error(TOAST_MESSAGES.UPDATE_ERROR);
      throw err;
    }
  };

  const deleteDepartment = async (id) => {
    try {
      await departmentService.delete(id);
      await fetchDepartments();
      toast.success(TOAST_MESSAGES.DELETE_SUCCESS);
    } catch (err) {
      console.error("Error deleting department:", err);
      toast.error(TOAST_MESSAGES.DELETE_ERROR);
      throw err;
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return {
    departments,
    loading,
    error,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    refetch: fetchDepartments,
  };
};

const useModalManager = () => {
  const [activeModal, setActiveModal] = useState(MODAL_TYPES.NONE);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const openEditModal = (department) => {
    setSelectedDepartment(department);
    setActiveModal(MODAL_TYPES.EDIT);
  };

  const openDeleteModal = (department) => {
    setSelectedDepartment(department);
    setActiveModal(MODAL_TYPES.DELETE);
  };

  const closeModal = () => {
    setActiveModal(MODAL_TYPES.NONE);
    setSelectedDepartment(null);
  };

  return {
    activeModal,
    selectedDepartment,
    openEditModal,
    openDeleteModal,
    closeModal,
    isEditOpen: activeModal === MODAL_TYPES.EDIT,
    isDeleteOpen: activeModal === MODAL_TYPES.DELETE,
  };
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Settings() {
  // Custom hooks
  const {
    departments,
    loading: departmentsLoading,
    addDepartment,
    updateDepartment,
    deleteDepartment,
  } = useDepartments();

  const {
    selectedDepartment,
    openEditModal,
    openDeleteModal,
    closeModal,
    isEditOpen,
    isDeleteOpen,
  } = useModalManager();

  // Local state
  const [newDeptName, setNewDeptName] = useState("");
  const [editDeptName, setEditDeptName] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Event handlers
  const handleAddDepartment = async () => {
    if (!newDeptName.trim()) return;

    try {
      setActionLoading(true);
      await addDepartment(newDeptName);
      setNewDeptName("");
    } catch (err) {
      // Error handled in hook
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditClick = (department) => {
    setEditDeptName(department.name);
    openEditModal(department);
  };

  const handleSaveEdit = async () => {
    if (!editDeptName.trim()) return;

    try {
      setActionLoading(true);
      await updateDepartment(selectedDepartment._id, editDeptName);
      closeModal();
      setEditDeptName("");
    } catch (err) {
      // Error handled in hook
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setActionLoading(true);
      await deleteDepartment(selectedDepartment._id);
      closeModal();
    } catch (err) {
      // Error handled in hook
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelEdit = () => {
    closeModal();
    setEditDeptName("");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-10 pt-20 md:pt-10">
        <PageHeader />

        <AddDepartmentSection
          value={newDeptName}
          onChange={(e) => setNewDeptName(e.target.value)}
          onAdd={handleAddDepartment}
          loading={actionLoading}
        />

        {departmentsLoading ? (
          <div className="text-center py-12 text-white/60">
            <p>Loading departments...</p>
          </div>
        ) : (
          <DepartmentGrid
            departments={departments}
            onEdit={handleEditClick}
            onDelete={openDeleteModal}
          />
        )}
      </main>

      {/* Edit Modal */}
      <EditModal
        isOpen={isEditOpen}
        onClose={handleCancelEdit}
        value={editDeptName}
        onChange={(e) => setEditDeptName(e.target.value)}
        onSave={handleSaveEdit}
        loading={actionLoading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        onCancel={closeModal}
        onConfirm={handleConfirmDelete}
        title="Delete Department"
        description={`Are you sure you want to delete "${selectedDepartment?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="delete"
        loading={actionLoading}
      />
    </div>
  );
}
