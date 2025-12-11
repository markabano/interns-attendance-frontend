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
import { toast } from "react-toastify";
import ConfirmModal from "@/components/ConfirmModal";

// ============================================================================
// CONSTANTS
// ============================================================================

const ANIMATION_CONFIG = {
  title: {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  },
  button: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { delay: 0.15 },
  },
  search: {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: 0.1 },
  },
  table: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: 0.2 },
  },
  modal: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.25 },
  },
  row: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.25 },
  },
};

const EMPTY_INTERN = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  initialPassword: "",
  department: "",
  requiredHours: "",
  schedule: { timeIn: "", timeOut: "", breakStart: "", breakEnd: "" },
};

const TOAST_MESSAGES = {
  ADD_SUCCESS: "Intern added successfully",
  ADD_ERROR: "Failed to add intern",
  UPDATE_SUCCESS: "Intern updated successfully",
  UPDATE_ERROR: "Failed to update intern",
  DELETE_SUCCESS: "Intern deleted successfully",
  DELETE_ERROR: "Failed to delete intern",
  FETCH_INTERNS_ERROR: "Failed to load interns",
  FETCH_DEPARTMENTS_ERROR: "Failed to load departments",
};

// ============================================================================
// API SERVICE
// ============================================================================

const internService = {
  getAll: async () => {
    const response = await axios.get("/manageIntern/fetchInterns");
    return response.data.data;
  },

  create: async (internData) => {
    const response = await axios.post("/manageIntern/createIntern", internData);
    return response.data;
  },

  update: async (id, internData) => {
    await axios.patch(`/manageIntern/updateIntern/${id}`, internData);
  },

  delete: async (id) => {
    await axios.delete(`/manageIntern/deleteIntern/${id}`);
  },
};

const departmentService = {
  getAll: async () => {
    const response = await axios.get("/department/getDepartments");
    return response.data.department;
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const generateEmail = (firstName, lastName) => {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`;
};

const generatePassword = () => {
  return Math.random().toString(36).slice(-8);
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const PageHeader = () => (
  <motion.h1
    {...ANIMATION_CONFIG.title}
    className="text-3xl font-bold tracking-wide"
  >
    Manage Interns
  </motion.h1>
);

const AddButton = ({ onClick }) => (
  <motion.div {...ANIMATION_CONFIG.button}>
    <Button
      className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20"
      onClick={onClick}
    >
      Add Intern
    </Button>
  </motion.div>
);

const SearchBar = ({ value, onChange }) => (
  <motion.div {...ANIMATION_CONFIG.search}>
    <Card className="bg-white/10 backdrop-blur-xl border-white/10 shadow-xl rounded-2xl">
      <CardContent className="p-4 flex items-center gap-4">
        <Input
          placeholder="Search intern by name..."
          value={value}
          onChange={onChange}
          className="bg-white/5 border-none text-white placeholder:text-gray-400"
        />
        <Button className="bg-blue-600 hover:bg-blue-700">Search</Button>
      </CardContent>
    </Card>
  </motion.div>
);

const PasswordField = ({ internId, password, showPassword, onToggle }) => (
  <div className="flex items-center gap-2">
    <span>{showPassword ? password : "••••••••"}</span>
    <button onClick={onToggle} className="text-gray-300 hover:text-white">
      {showPassword ? (
        <EyeOff className="w-4 h-4" />
      ) : (
        <Eye className="w-4 h-4" />
      )}
    </button>
  </div>
);

const InternTable = ({
  interns,
  showPassword,
  onTogglePassword,
  onEdit,
  onDelete,
}) => (
  <motion.div {...ANIMATION_CONFIG.table}>
    <Card className="bg-white/10 backdrop-blur-xl border-white/10 shadow-xl rounded-2xl overflow-hidden">
      <CardContent className="p-4 overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-white">Name</TableHead>
              <TableHead className="text-white">Email</TableHead>
              <TableHead className="text-white">Initial Password</TableHead>
              <TableHead className="text-white">Department</TableHead>
              <TableHead className="text-white">Required Hours</TableHead>
              <TableHead className="text-white text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-white">
            {interns.length > 0 ? (
              interns.map((intern) => (
                <motion.tr
                  key={intern._id}
                  {...ANIMATION_CONFIG.row}
                  className="hover:bg-white/5 transition rounded-lg"
                >
                  <TableCell>
                    {intern.firstName} {intern.lastName}
                  </TableCell>
                  <TableCell>{intern.email}</TableCell>
                  <TableCell>
                    <PasswordField
                      internId={intern._id}
                      password={intern.initialPassword}
                      showPassword={showPassword[intern._id]}
                      onToggle={() => onTogglePassword(intern._id)}
                    />
                  </TableCell>
                  <TableCell>{intern.department}</TableCell>
                  <TableCell>{intern.requiredHours}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        onClick={() => onDelete(intern)}
                        className="bg-red-600 hover:bg-red-700 px-3"
                      >
                        Delete
                      </Button>
                      <Button
                        onClick={() => onEdit(intern)}
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
);

const FormField = ({ label, children }) => (
  <div>
    <label className="block mb-2">{label}</label>
    {children}
  </div>
);

const InternModal = ({
  isOpen,
  isEditMode,
  internData,
  departments,
  onChange,
  onSave,
  onCancel,
  onGenerateEmail,
  onGeneratePassword,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        {...ANIMATION_CONFIG.modal}
        className="bg-white/10 backdrop-blur-2xl p-6 rounded-xl w-full max-w-md shadow-2xl border border-white/10"
      >
        <h2 className="text-xl font-semibold mb-4">
          {isEditMode ? "Edit" : "Add New"} Intern
        </h2>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <FormField label="First Name">
            <Input
              className="bg-white/5 text-white"
              value={internData.firstName}
              onChange={(e) => onChange("firstName", e.target.value)}
            />
          </FormField>

          <FormField label="Last Name">
            <Input
              className="bg-white/5 text-white"
              value={internData.lastName}
              onChange={(e) => onChange("lastName", e.target.value)}
            />
          </FormField>

          <FormField label="Email">
            <div className="flex items-center gap-3">
              <Input
                disabled={isEditMode}
                className="bg-white/5 text-white"
                value={internData.email}
                onChange={(e) => onChange("email", e.target.value)}
              />
              {!isEditMode && (
                <button
                  disabled={!internData.firstName || !internData.lastName}
                  onClick={onGenerateEmail}
                  className="text-blue-400 text-sm hover:underline disabled:text-gray-500"
                >
                  Generate
                </button>
              )}
            </div>
          </FormField>

          {!isEditMode && (
            <FormField label="Password">
              <div className="flex items-center gap-3">
                <Input
                  className="bg-white/5 text-white"
                  value={internData.password}
                  onChange={(e) => onChange("password", e.target.value)}
                />
                <button
                  onClick={onGeneratePassword}
                  className="text-blue-400 text-sm hover:underline"
                >
                  Generate
                </button>
              </div>
            </FormField>
          )}

          <FormField label="Department">
            <select
              className="bg-white/5 text-white p-2 rounded-md w-full"
              value={internData.department}
              onChange={(e) => onChange("department", e.target.value)}
            >
              <option value="" className="text-black">
                Select Department
              </option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept.name} className="text-black">
                  {dept.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Required Hours">
            <Input
              type="number"
              className="bg-white/5 text-white"
              value={internData.requiredHours}
              onChange={(e) => onChange("requiredHours", e.target.value)}
            />
          </FormField>

          <h3 className="text-lg font-semibold mt-4">Schedule</h3>

          <FormField label="Time In">
            <Input
              type="time"
              className="bg-white/5 text-white"
              value={internData.schedule.timeIn}
              onChange={(e) => onChange("schedule.timeIn", e.target.value)}
            />
          </FormField>

          <FormField label="Time Out">
            <Input
              type="time"
              className="bg-white/5 text-white"
              value={internData.schedule.timeOut}
              onChange={(e) => onChange("schedule.timeOut", e.target.value)}
            />
          </FormField>

          <FormField label="Break Start">
            <Input
              type="time"
              className="bg-white/5 text-white"
              value={internData.schedule.breakStart}
              onChange={(e) => onChange("schedule.breakStart", e.target.value)}
            />
          </FormField>

          <FormField label="Break End">
            <Input
              type="time"
              className="bg-white/5 text-white"
              value={internData.schedule.breakEnd}
              onChange={(e) => onChange("schedule.breakEnd", e.target.value)}
            />
          </FormField>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button className="bg-gray-600 hover:bg-gray-700" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={onSave}>
            {isEditMode ? "Save Changes" : "Add Intern"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

const useInterns = () => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInterns = async () => {
    try {
      setLoading(true);
      const data = await internService.getAll();
      setInterns(data);
    } catch (error) {
      console.error("Error fetching interns:", error);
      toast.error(TOAST_MESSAGES.FETCH_INTERNS_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const addIntern = async (internData) => {
    try {
      await internService.create(internData);
      await fetchInterns();
      toast.success(TOAST_MESSAGES.ADD_SUCCESS);
    } catch (error) {
      console.error("Error adding intern:", error);
      toast.error(TOAST_MESSAGES.ADD_ERROR);
      throw error;
    }
  };

  const updateIntern = async (id, internData) => {
    try {
      await internService.update(id, internData);
      await fetchInterns();
      toast.success(TOAST_MESSAGES.UPDATE_SUCCESS);
    } catch (error) {
      console.error("Error updating intern:", error);
      toast.error(TOAST_MESSAGES.UPDATE_ERROR);
      throw error;
    }
  };

  const deleteIntern = async (id) => {
    try {
      await internService.delete(id);
      await fetchInterns();
      toast.success(TOAST_MESSAGES.DELETE_SUCCESS);
    } catch (error) {
      console.error("Error deleting intern:", error);
      toast.error(TOAST_MESSAGES.DELETE_ERROR);
      throw error;
    }
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  return { interns, loading, addIntern, updateIntern, deleteIntern };
};

const useDepartments = () => {
  const [departments, setDepartments] = useState([]);

  const fetchDepartments = async () => {
    try {
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error(TOAST_MESSAGES.FETCH_DEPARTMENTS_ERROR);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDepartments();
  }, []);

  return { departments };
};

const useModalManager = () => {
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState(null);

  const openAddModal = () => {
    setIsEditMode(false);
    setShowModal(true);
  };

  const openEditModal = (intern) => {
    setSelectedIntern(intern);
    setIsEditMode(true);
    setShowModal(true);
  };

  const openDeleteModal = (intern) => {
    setSelectedIntern(intern);
    setShowDeleteConfirm(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setSelectedIntern(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteConfirm(false);
    setSelectedIntern(null);
  };

  return {
    showModal,
    isEditMode,
    showDeleteConfirm,
    selectedIntern,
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeModal,
    closeDeleteModal,
  };
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ManageIntern() {
  const { interns, loading, addIntern, updateIntern, deleteIntern } =
    useInterns();
  const { departments } = useDepartments();
  const {
    showModal,
    isEditMode,
    showDeleteConfirm,
    selectedIntern,
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeModal,
    closeDeleteModal,
  } = useModalManager();

  const [search, setSearch] = useState("");
  const [showPassword, setShowPassword] = useState({});
  const [internData, setInternData] = useState(EMPTY_INTERN);
  const [actionLoading, setActionLoading] = useState(false);

  // Update internData when editing
  useEffect(() => {
    if (isEditMode && selectedIntern) {
      setInternData(selectedIntern);
    } else {
      setInternData(EMPTY_INTERN);
    }
  }, [isEditMode, selectedIntern]);

  // Event Handlers
  const handleTogglePassword = (internId) => {
    setShowPassword((prev) => ({
      ...prev,
      [internId]: !prev[internId],
    }));
  };

  const handleFieldChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setInternData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setInternData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleGenerateEmail = () => {
    const email = generateEmail(internData.firstName, internData.lastName);
    setInternData((prev) => ({ ...prev, email }));
  };

  const handleGeneratePassword = () => {
    const password = generatePassword();
    setInternData((prev) => ({
      ...prev,
      password,
      initialPassword: password,
    }));
  };

  const handleSave = async () => {
    try {
      setActionLoading(true);
      if (isEditMode) {
        await updateIntern(internData._id, internData);
      } else {
        await addIntern(internData);
      }
      closeModal();
      setInternData(EMPTY_INTERN);
    } catch (error) {
      // Error handled in hook
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setActionLoading(true);
      await deleteIntern(selectedIntern._id);
      closeDeleteModal();
    } catch (error) {
      // Error handled in hook
    } finally {
      setActionLoading(false);
    }
  };

  const filteredInterns = interns.filter((intern) => {
    const fullName = `${intern.firstName} ${intern.lastName}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10 pt-20 md:pt-10 space-y-8">
        <PageHeader />
        <AddButton onClick={openAddModal} />
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />

        {loading ? (
          <div className="text-center py-12 text-white/60">
            <p>Loading interns...</p>
          </div>
        ) : (
          <InternTable
            interns={filteredInterns}
            showPassword={showPassword}
            onTogglePassword={handleTogglePassword}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />
        )}
      </main>

      {/* Add/Edit Modal */}
      <InternModal
        isOpen={showModal}
        isEditMode={isEditMode}
        internData={internData}
        departments={departments}
        onChange={handleFieldChange}
        onSave={handleSave}
        onCancel={closeModal}
        onGenerateEmail={handleGenerateEmail}
        onGeneratePassword={handleGeneratePassword}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onCancel={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Intern"
        description={`Are you sure you want to delete ${selectedIntern?.firstName} ${selectedIntern?.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="delete"
        loading={actionLoading}
      />
    </div>
  );
}
