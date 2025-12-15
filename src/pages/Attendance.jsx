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
import { Calendar, Clock, Plus, Pencil, Trash2 } from "lucide-react";
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
  stats: {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: 0.1 },
  },
  filters: {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: 0.15 },
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

const EMPTY_ATTENDANCE = {
  internId: "",
  date: "",
  timeIn: "",
  timeOut: "",
  workedHours: "",
  holidayType: "",
};

const HOLIDAY_TYPES = [
  { value: "", label: "None" },
  { value: "regular", label: "Regular Holiday" },
  { value: "special", label: "Special Holiday" },
];

const TOAST_MESSAGES = {
  ADD_SUCCESS: "Attendance record added successfully",
  ADD_ERROR: "Failed to add attendance record",
  UPDATE_SUCCESS: "Attendance record updated successfully",
  UPDATE_ERROR: "Failed to update attendance record",
  DELETE_SUCCESS: "Attendance record deleted successfully",
  DELETE_ERROR: "Failed to delete attendance record",
  FETCH_ERROR: "Failed to load attendance records",
  FETCH_INTERNS_ERROR: "Failed to load interns",
  VALIDATION_ERROR: "Please fill in all required fields",
  HOURS_ERROR: "Worked hours must be between 0 and 24",
};

// ============================================================================
// API SERVICE
// ============================================================================

const attendanceService = {
  getAll: async () => {
    const response = await axios.get("/attendance/getAttendances");
    return response.data.attendance;
  },

  create: async (attendanceData, userId) => {
    const response = await axios.post("/attendance/createAttendance", {
      ...attendanceData,
      userId, // Admin's userId
    });
    return response.data;
  },

  update: async (id, attendanceData, userId) => {
    await axios.patch(
      `/attendance/updateAttendance/${id}`,
      { ...attendanceData, userId } // Admin's userId
    );
  },

  delete: async (id) => {
    await axios.delete(`/attendance/deleteAttendance/${id}`);
  },
};

const internService = {
  getAll: async () => {
    const response = await axios.get("/manageIntern/fetchInterns");
    return response.data.data;
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (time) => {
  if (!time) return "N/A";
  return time;
};

const calculateWorkedHours = (timeIn, timeOut) => {
  if (!timeIn || !timeOut) return "";
  const [inHour, inMin] = timeIn.split(":").map(Number);
  const [outHour, outMin] = timeOut.split(":").map(Number);
  const inMinutes = inHour * 60 + inMin;
  const outMinutes = outHour * 60 + outMin;
  return ((outMinutes - inMinutes) / 60).toFixed(2);
};

const getHolidayBadgeColor = (type) => {
  switch (type) {
    case "regular":
      return "bg-red-500/20 text-red-300 border-red-500/30";
    case "special":
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    default:
      return "bg-gray-500/20 text-gray-300 border-gray-500/30";
  }
};

const getHolidayMultiplier = (type) => {
  switch (type) {
    case "regular":
      return 2;
    case "special":
      return 1.3;
    default:
      return 1;
  }
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const PageHeader = () => (
  <motion.div
    {...ANIMATION_CONFIG.title}
    className="flex items-center justify-between"
  >
    <h1 className="text-3xl font-bold tracking-wide">
      Attendance <span className="text-blue-400">Management</span>
    </h1>
  </motion.div>
);

const StatsCards = ({
  totalRecords,
  totalHours,
  overtimeHours,
  renderedHours,
}) => (
  <motion.div
    {...ANIMATION_CONFIG.stats}
    className="grid grid-cols-1 md:grid-cols-4 gap-6"
  >
    <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-xl border-blue-500/20 shadow-xl rounded-2xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-200/70">Total Records</p>
            <h3 className="text-3xl font-bold text-white mt-1">
              {totalRecords}
            </h3>
          </div>
          <Calendar className="w-12 h-12 text-blue-400/50" />
        </div>
      </CardContent>
    </Card>

    <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-xl border-green-500/20 shadow-xl rounded-2xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-green-200/70">Total Hours</p>
            <h3 className="text-3xl font-bold text-white mt-1">
              {totalHours}h
            </h3>
          </div>
          <Clock className="w-12 h-12 text-green-400/50" />
        </div>
      </CardContent>
    </Card>

    <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-xl border-purple-500/20 shadow-xl rounded-2xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-purple-200/70">Rendered Hours</p>
            <h3 className="text-3xl font-bold text-white mt-1">
              {renderedHours}h
            </h3>
          </div>
          <Clock className="w-12 h-12 text-purple-400/50" />
        </div>
      </CardContent>
    </Card>

    <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 backdrop-blur-xl border-orange-500/20 shadow-xl rounded-2xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-orange-200/70">Overtime Hours</p>
            <h3 className="text-3xl font-bold text-white mt-1">
              {overtimeHours}h
            </h3>
          </div>
          <Clock className="w-12 h-12 text-orange-400/50" />
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const FilterBar = ({
  dateFilter,
  onDateChange,
  internFilter,
  onInternChange,
  interns,
  onAddClick,
}) => (
  <motion.div {...ANIMATION_CONFIG.filters}>
    <Card className="bg-white/10 backdrop-blur-xl border-white/10 shadow-xl rounded-2xl">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm text-white/70 mb-2 block">
              Filter by Date
            </label>
            <Input
              type="date"
              value={dateFilter}
              onChange={onDateChange}
              className="bg-white/5 border-none text-white"
            />
          </div>

          <div className="flex-1">
            <label className="text-sm text-white/70 mb-2 block">
              Filter by Intern
            </label>
            <select
              value={internFilter}
              onChange={onInternChange}
              className="bg-white/5 text-white p-2 rounded-md w-full border-none"
            >
              <option value="" className="text-black">
                All Interns
              </option>
              {interns.map((intern) => (
                <option
                  key={intern._id}
                  value={intern._id}
                  className="text-black"
                >
                  {intern.firstName} {intern.lastName}
                </option>
              ))}
            </select>
          </div>

          <Button
            onClick={onAddClick}
            className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Record
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const AttendanceTable = ({ records, interns, onEdit, onDelete }) => {
  const getInternName = (userId) => {
    const intern = interns.find((i) => i._id === userId);
    return intern ? `${intern.firstName} ${intern.lastName}` : "Unknown";
  };

  return (
    <motion.div {...ANIMATION_CONFIG.table}>
      <Card className="bg-white/10 backdrop-blur-xl border-white/10 shadow-xl rounded-2xl overflow-hidden">
        <CardContent className="p-4 overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-white">Intern</TableHead>
                <TableHead className="text-white">Date</TableHead>
                <TableHead className="text-white">Time In</TableHead>
                <TableHead className="text-white">Time Out</TableHead>
                <TableHead className="text-white">Worked Hours</TableHead>
                <TableHead className="text-white">Rendered Hours</TableHead>
                <TableHead className="text-white">Overtime</TableHead>
                <TableHead className="text-white">Undertime</TableHead>
                <TableHead className="text-white">Holiday</TableHead>
                <TableHead className="text-white text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="text-white">
              {records.length > 0 ? (
                records.map((record, index) => (
                  <motion.tr
                    key={record._id}
                    {...ANIMATION_CONFIG.row}
                    style={{ transitionDelay: `${index * 0.05}s` }}
                    className="hover:bg-white/5 transition rounded-lg"
                  >
                    <TableCell className="font-medium">
                      {getInternName(record.userId)}
                    </TableCell>
                    <TableCell>{formatDate(record.date)}</TableCell>
                    <TableCell>{formatTime(record.timeIn)}</TableCell>
                    <TableCell>{formatTime(record.timeOut)}</TableCell>
                    <TableCell>
                      {record.workedHours?.toFixed(2) || "0.00"}h
                    </TableCell>
                    <TableCell className="font-semibold text-green-300">
                      {record.renderedHours?.toFixed(2) || "0.00"}h
                    </TableCell>
                    <TableCell>
                      {record.overtimeHours > 0 ? (
                        <span className="text-orange-300">
                          +{record.overtimeHours?.toFixed(2)}h
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {record.undertimeHours > 0 ? (
                        <span className="text-red-300">
                          -{record.undertimeHours?.toFixed(2)}h
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {record.holidayType && record.holidayType !== "" ? (
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-medium border ${getHolidayBadgeColor(
                            record.holidayType
                          )}`}
                        >
                          {record.holidayType.charAt(0).toUpperCase() +
                            record.holidayType.slice(1)}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="icon"
                          onClick={() => onEdit(record)}
                          className="bg-green-600 hover:bg-green-700 px-3"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          onClick={() => onDelete(record)}
                          className="bg-red-600 hover:bg-red-700 px-3"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="text-center py-8 text-gray-300"
                  >
                    No attendance records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const FormField = ({ label, children, required = false }) => (
  <div>
    <label className="block mb-2 text-sm">
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
    {children}
  </div>
);

const AttendanceModal = ({
  isOpen,
  isEditMode,
  attendanceData,
  interns,
  onChange,
  onSave,
  onCancel,
}) => {
  if (!isOpen) return null;

  const workedHours =
    attendanceData.workedHours ||
    (attendanceData.timeIn && attendanceData.timeOut
      ? calculateWorkedHours(attendanceData.timeIn, attendanceData.timeOut)
      : "");

  const calculateRendered = () => {
    if (!workedHours) return "0.00";
    const multiplier = getHolidayMultiplier(attendanceData.holidayType);
    return (parseFloat(workedHours) * multiplier).toFixed(2);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        {...ANIMATION_CONFIG.modal}
        className="bg-white/10 backdrop-blur-2xl p-6 rounded-xl w-full max-w-md shadow-2xl border border-white/10"
      >
        <h2 className="text-xl font-semibold mb-4">
          {isEditMode ? "Edit" : "Add"} Attendance Record
        </h2>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <FormField label="Select Intern" required>
            <select
              value={attendanceData.internId}
              onChange={(e) => onChange("internId", e.target.value)}
              className="bg-white/5 text-white p-2 rounded-md w-full"
              disabled={isEditMode}
            >
              <option value="" className="text-black">
                Select an intern
              </option>
              {interns.map((intern) => (
                <option
                  key={intern._id}
                  value={intern._id}
                  className="text-black"
                >
                  {intern.firstName} {intern.lastName}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Date" required>
            <Input
              type="date"
              value={attendanceData.date}
              onChange={(e) => onChange("date", e.target.value)}
              className="bg-white/5 text-white"
            />
          </FormField>

          <FormField label="Time In" required>
            <Input
              type="time"
              value={attendanceData.timeIn}
              onChange={(e) => onChange("timeIn", e.target.value)}
              className="bg-white/5 text-white"
            />
          </FormField>

          <FormField label="Time Out" required>
            <Input
              type="time"
              value={attendanceData.timeOut}
              onChange={(e) => onChange("timeOut", e.target.value)}
              className="bg-white/5 text-white"
            />
          </FormField>

          <FormField label="Worked Hours" required>
            <Input
              type="number"
              step="0.01"
              min="0"
              max="24"
              value={workedHours}
              onChange={(e) => onChange("workedHours", e.target.value)}
              className="bg-white/5 text-white"
              placeholder="Auto-calculated or enter manually"
            />
            <p className="text-xs text-gray-400 mt-1">
              Auto-calculated from time in/out or enter manually
            </p>
          </FormField>

          <FormField label="Holiday Type">
            <select
              value={attendanceData.holidayType || ""}
              onChange={(e) => onChange("holidayType", e.target.value)}
              className="bg-white/5 text-white p-2 rounded-md w-full"
            >
              {HOLIDAY_TYPES.map((type) => (
                <option
                  key={type.value}
                  value={type.value}
                  className="text-black"
                >
                  {type.label}
                </option>
              ))}
            </select>
          </FormField>

          {workedHours && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <p className="text-sm text-blue-200">
                <span className="font-semibold">Rendered Hours:</span>{" "}
                {calculateRendered()}h
                {attendanceData.holidayType === "regular" && (
                  <span className="text-xs ml-2">(2x multiplier)</span>
                )}
                {attendanceData.holidayType === "special" && (
                  <span className="text-xs ml-2">(1.3x multiplier)</span>
                )}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button className="bg-gray-600 hover:bg-gray-700" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={onSave}>
            {isEditMode ? "Save Changes" : "Add Record"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

const useAttendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await attendanceService.getAll();
      setRecords(data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      toast.error(TOAST_MESSAGES.FETCH_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const addRecord = async (recordData, userId) => {
    try {
      await attendanceService.create(recordData, userId);
      await fetchRecords();
      toast.success(TOAST_MESSAGES.ADD_SUCCESS);
    } catch (error) {
      console.error("Error adding attendance:", error);
      const message = error.response?.data?.message || TOAST_MESSAGES.ADD_ERROR;
      toast.error(message);
      throw error;
    }
  };

  const updateRecord = async (id, recordData, userId) => {
    try {
      await attendanceService.update(id, recordData, userId);
      await fetchRecords();
      toast.success(TOAST_MESSAGES.UPDATE_SUCCESS);
    } catch (error) {
      console.error("Error updating attendance:", error);
      toast.error(TOAST_MESSAGES.UPDATE_ERROR);
      throw error;
    }
  };

  const deleteRecord = async (id) => {
    try {
      await attendanceService.delete(id);
      await fetchRecords();
      toast.success(TOAST_MESSAGES.DELETE_SUCCESS);
    } catch (error) {
      console.error("Error deleting attendance:", error);
      toast.error(TOAST_MESSAGES.DELETE_ERROR);
      throw error;
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return { records, loading, addRecord, updateRecord, deleteRecord };
};

const useInterns = () => {
  const [interns, setInterns] = useState([]);

  const fetchInterns = async () => {
    try {
      const data = await internService.getAll();
      setInterns(data);
    } catch (error) {
      console.error("Error fetching interns:", error);
      toast.error(TOAST_MESSAGES.FETCH_INTERNS_ERROR);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchInterns();
  }, []);

  return { interns };
};

const useModalManager = () => {
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const openAddModal = () => {
    setIsEditMode(false);
    setShowModal(true);
  };

  const openEditModal = (record) => {
    setSelectedRecord(record);
    setIsEditMode(true);
    setShowModal(true);
  };

  const openDeleteModal = (record) => {
    setSelectedRecord(record);
    setShowDeleteConfirm(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setSelectedRecord(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteConfirm(false);
    setSelectedRecord(null);
  };

  return {
    showModal,
    isEditMode,
    showDeleteConfirm,
    selectedRecord,
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

export default function Attendance() {
  const { records, loading, addRecord, updateRecord, deleteRecord } =
    useAttendance();
  const { interns } = useInterns();
  const {
    showModal,
    isEditMode,
    showDeleteConfirm,
    selectedRecord,
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeModal,
    closeDeleteModal,
  } = useModalManager();

  const [attendanceData, setAttendanceData] = useState(EMPTY_ATTENDANCE);
  const [dateFilter, setDateFilter] = useState("");
  const [internFilter, setInternFilter] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Get current user ID from JWT token
  const getCurrentUserId = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      // Decode JWT token to get user ID
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );

      const decoded = JSON.parse(jsonPayload);
      return decoded.id || decoded._id || decoded.userId;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  // Update attendanceData when editing
  useEffect(() => {
    if (isEditMode && selectedRecord) {
      setAttendanceData({
        internId: selectedRecord.userId,
        date: selectedRecord.date.split("T")[0],
        timeIn: selectedRecord.timeIn,
        timeOut: selectedRecord.timeOut,
        workedHours: selectedRecord.workedHours?.toString() || "",
        holidayType: selectedRecord.holidayType,
      });
    } else {
      setAttendanceData(EMPTY_ATTENDANCE);
    }
  }, [isEditMode, selectedRecord]);

  // Auto-calculate worked hours when time in/out changes
  useEffect(() => {
    if (attendanceData.timeIn && attendanceData.timeOut && !isEditMode) {
      const calculated = calculateWorkedHours(
        attendanceData.timeIn,
        attendanceData.timeOut
      );
      if (calculated) {
        setAttendanceData((prev) => ({
          ...prev,
          workedHours: calculated,
        }));
      }
    }
  }, [attendanceData.timeIn, attendanceData.timeOut, isEditMode]);

  // Filter records
  const filteredRecords = records.filter((record) => {
    const matchesDate = !dateFilter || record.date.startsWith(dateFilter);
    const matchesIntern = !internFilter || record.userId === internFilter;
    return matchesDate && matchesIntern;
  });

  // Calculate stats
  const totalRecords = filteredRecords.length;
  const totalHours = filteredRecords
    .reduce((sum, record) => sum + (record.workedHours || 0), 0)
    .toFixed(2);
  const renderedHours = filteredRecords
    .reduce((sum, record) => sum + (record.renderedHours || 0), 0)
    .toFixed(2);
  const overtimeHours = filteredRecords
    .reduce((sum, record) => sum + (record.overtimeHours || 0), 0)
    .toFixed(2);

  // Event Handlers
  const handleFieldChange = (field, value) => {
    setAttendanceData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateAttendanceData = () => {
    if (!attendanceData.internId) {
      toast.error("Please select an intern");
      return false;
    }
    if (!attendanceData.date) {
      toast.error("Please select a date");
      return false;
    }
    if (!attendanceData.timeIn) {
      toast.error("Please enter time in");
      return false;
    }
    if (!attendanceData.timeOut) {
      toast.error("Please enter time out");
      return false;
    }
    if (!attendanceData.workedHours) {
      toast.error("Worked hours is required");
      return false;
    }

    const hours = parseFloat(attendanceData.workedHours);
    if (isNaN(hours) || hours < 0 || hours > 24) {
      toast.error(TOAST_MESSAGES.HOURS_ERROR);
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateAttendanceData()) return;

    try {
      setActionLoading(true);
      const dataToSend = {
        internId: attendanceData.internId,
        date: attendanceData.date,
        timeIn: attendanceData.timeIn,
        timeOut: attendanceData.timeOut,
        workedHours: parseFloat(attendanceData.workedHours),
        holidayType: attendanceData.holidayType,
      };

      if (isEditMode) {
        const userId = getCurrentUserId();
        await updateRecord(selectedRecord._id, dataToSend, userId);
      } else {
        const userId = getCurrentUserId();
        await addRecord(dataToSend, userId);
      }
      closeModal();
      setAttendanceData(EMPTY_ATTENDANCE);
    } catch (error) {
      // Error handled in hook
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setActionLoading(true);
      await deleteRecord(selectedRecord._id);
      closeDeleteModal();
    } catch (error) {
      // Error handled in hook
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10 pt-20 md:pt-10 space-y-8">
        <PageHeader />
        <StatsCards
          totalRecords={totalRecords}
          totalHours={totalHours}
          overtimeHours={overtimeHours}
          renderedHours={renderedHours}
        />
        <FilterBar
          dateFilter={dateFilter}
          onDateChange={(e) => setDateFilter(e.target.value)}
          internFilter={internFilter}
          onInternChange={(e) => setInternFilter(e.target.value)}
          interns={interns}
          onAddClick={openAddModal}
        />

        {loading ? (
          <div className="text-center py-12 text-white/60">
            <p>Loading attendance records...</p>
          </div>
        ) : (
          <AttendanceTable
            records={filteredRecords}
            interns={interns}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />
        )}
      </main>

      {/* Add/Edit Modal */}
      <AttendanceModal
        isOpen={showModal}
        isEditMode={isEditMode}
        attendanceData={attendanceData}
        interns={interns}
        onChange={handleFieldChange}
        onSave={handleSave}
        onCancel={closeModal}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onCancel={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Attendance Record"
        description="Are you sure you want to delete this attendance record? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="delete"
        loading={actionLoading}
      />
    </div>
  );
}
