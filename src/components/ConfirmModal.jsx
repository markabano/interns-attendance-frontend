import React from "react";
import { AlertTriangle, Trash2, LogOut, Info, CheckCircle } from "lucide-react";

// ============================================================================
// CONSTANTS
// ============================================================================

const MODAL_VARIANTS = {
  danger: {
    icon: AlertTriangle,
    iconColor: "text-red-400",
    iconBg: "bg-red-500/20",
    confirmButton:
      "flex-1 px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 font-medium transition-all active:scale-95 border border-red-500/30",
    confirmText: "text-red-300",
  },
  delete: {
    icon: Trash2,
    iconColor: "text-red-400",
    iconBg: "bg-red-500/20",
    confirmButton:
      "flex-1 px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 font-medium transition-all active:scale-95 border border-red-500/30",
    confirmText: "text-red-300",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-yellow-400",
    iconBg: "bg-yellow-500/20",
    confirmButton:
      "flex-1 px-4 py-2.5 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 font-medium transition-all active:scale-95 border border-yellow-500/30",
    confirmText: "text-yellow-300",
  },
  info: {
    icon: Info,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/20",
    confirmButton:
      "flex-1 px-4 py-2.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-medium transition-all active:scale-95 border border-blue-500/30",
    confirmText: "text-blue-300",
  },
  success: {
    icon: CheckCircle,
    iconColor: "text-green-400",
    iconBg: "bg-green-500/20",
    confirmButton:
      "flex-1 px-4 py-2.5 rounded-xl bg-green-500/20 hover:bg-green-500/30 text-green-300 font-medium transition-all active:scale-95 border border-green-500/30",
    confirmText: "text-green-300",
  },
  logout: {
    icon: LogOut,
    iconColor: "text-red-400",
    iconBg: "bg-red-500/20",
    confirmButton:
      "flex-1 px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 font-medium transition-all active:scale-95 border border-red-500/30",
    confirmText: "text-red-300",
  },
};

const STYLES = {
  overlay:
    "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fadeIn",
  container:
    "bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-scaleIn",
  iconContainer: "w-12 h-12 rounded-full flex items-center justify-center mb-4",
  title: "text-xl font-bold text-white mb-2",
  description: "text-white/70 mb-6 leading-relaxed",
  buttonGroup: "flex gap-3",
  cancelButton:
    "flex-1 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all active:scale-95",
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * A reusable confirmation modal component with multiple variants
 *
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onCancel - Callback when cancel button is clicked
 * @param {function} onConfirm - Callback when confirm button is clicked
 * @param {string} title - Modal title
 * @param {string} description - Modal description text
 * @param {string} confirmText - Text for confirm button (default: "Confirm")
 * @param {string} cancelText - Text for cancel button (default: "Cancel")
 * @param {string} variant - Modal style variant: 'danger', 'delete', 'warning', 'info', 'success', 'logout' (default: 'danger')
 * @param {boolean} showIcon - Whether to show icon (default: true)
 * @param {React.Component} customIcon - Custom icon component to override default
 * @param {boolean} loading - Shows loading state on confirm button (default: false)
 */
const ConfirmModal = ({
  isOpen,
  onCancel,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  showIcon = true,
  customIcon = null,
  loading = false,
}) => {
  if (!isOpen) return null;

  const variantStyles = MODAL_VARIANTS[variant] || MODAL_VARIANTS.danger;
  const IconComponent = customIcon || variantStyles.icon;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className={STYLES.overlay} onClick={handleOverlayClick}>
      <div className={STYLES.container}>
        {showIcon && (
          <div className={`${STYLES.iconContainer} ${variantStyles.iconBg}`}>
            <IconComponent className={`w-6 h-6 ${variantStyles.iconColor}`} />
          </div>
        )}

        <h3 className={STYLES.title}>{title}</h3>
        <p className={STYLES.description}>{description}</p>

        <div className={STYLES.buttonGroup}>
          <button
            onClick={onCancel}
            disabled={loading}
            className={STYLES.cancelButton}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={variantStyles.confirmButton}
          >
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Loading...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
