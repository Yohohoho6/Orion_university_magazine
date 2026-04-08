// Profile Image Utilities
export const resolveProfileImageUrl = (profilePath) => {
  if (!profilePath) return "";
  if (profilePath.startsWith("http://") || profilePath.startsWith("https://")) {
    return profilePath;
  }

  const cleanPath = profilePath.replace(/^\/+/, "");
  return cleanPath.startsWith("storage/")
    ? `http://localhost:8000/${cleanPath}`
    : `http://localhost:8000/storage/${cleanPath}`;
};

// Form Data Utilities
export const toFormData = (data, formData = new FormData(), parentKey = null) => {
  if (data === null || data === undefined) return formData;

  if (typeof data !== "object" || data instanceof File || data instanceof Blob) {
    formData.append(parentKey, data);
    return formData;
  }

  Object.keys(data).forEach((key) => {
    const value = data[key];
    const fieldKey = parentKey ? `${parentKey}[${key}]` : key;

    if (value === null || value === undefined) return;

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const arrayKey = `${fieldKey}[${index}]`;
        toFormData(item, formData, arrayKey);
      });
    } else if (typeof value === "object" && !(value instanceof File)) {
      toFormData(value, formData, fieldKey);
    } else {
      formData.append(fieldKey, value);
    }
  });

  return formData;
};

// Date Utilities
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const daysSince = (date) => {
  if (!date) return null;
  const diff = Math.round((Date.now() - new Date(date).getTime()) / 86_400_000);
  return diff;
};

export const daysUntil = (date) => {
  if (!date) return null;
  return Math.ceil((new Date(date).getTime() - Date.now()) / 86_400_000);
};

export const getIsoWeek = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;

  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  return Math.ceil(((utcDate - yearStart) / 86_400_000 + 1) / 7);
};

// Dashboard Constants
export const TREND_COLORS = ["#378ADD", "#1D9E75", "#7F77DD", "#639922", "#D85A30", "#BA7517"];

export const STATUS_COLORS = {
  pending: "warning",
  commented: "primary",
  selected: "success",
  rejected: "danger",
};

export const STATUS_PIE_COLORS = {
  pending: "#f5a524",
  commented: "#9353d3",
  selected: "#17c964",
  rejected: "#f31260",
};

export const RADIAN = Math.PI / 180;

// String Utilities
export const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
