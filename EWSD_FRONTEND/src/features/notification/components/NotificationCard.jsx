import { useDeleteNotification } from "../hooks/useDeleteNotification";
import { useMarkAsRead } from "../hooks/useMarkAsRead";
import { formatDate } from "@/utils/helpers";
import { toast } from "react-toastify";

export const NotificationCard = ({ 
  notification, 
  isSelected, 
  onSelect, 
  showCheckbox = false 
}) => {
  const deleteNotification = useDeleteNotification();
  const markAsRead = useMarkAsRead();

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this notification?")) {
      deleteNotification.mutate(notification.id, {
        onError: (error) => {
          toast.error(error.response?.data?.message || "Failed to delete notification");
        }
      });
    }
  };

  const handleMarkAsRead = (e) => {
    e.stopPropagation();
    markAsRead.mutate(notification.id, {
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to mark as read");
      }
    });
  };

  const isReminder = notification.remind === false;

  return (
    <div 
      className={`
        group relative p-5 rounded-xl border transition-all duration-200 cursor-pointer
        ${isReminder 
          ? "bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-orange-200 dark:border-orange-800 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-lg hover:shadow-orange-100 dark:hover:shadow-orange-950/20" 
          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg hover:shadow-blue-50 dark:hover:shadow-blue-950/20"
        }
      `}
      onClick={() => showCheckbox && onSelect(notification.id)}
    >
      {/* Reminder indicator */}
      {isReminder && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-orange-500 dark:bg-orange-400 rounded-r-full" />
      )}

      <div className="flex items-start gap-4">
        {/* Checkbox for bulk selection */}
        {showCheckbox && (
          <div className="shrink-0 pt-1" onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelect(notification.id)}
              className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
            />
          </div>
        )}

        {/* Notification icon */}
        <div className="shrink-0">
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center
            ${isReminder 
              ? "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400" 
              : "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
            }
          `}>
            {isReminder ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="font-semibold text-base truncate text-gray-900 dark:text-gray-100">
              {notification.name}
            </h3>

            {/* Action buttons */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={handleMarkAsRead}
                disabled={markAsRead.isPending}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-lg transition-colors disabled:opacity-50"
                title="Mark as read"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteNotification.isPending}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-lg transition-colors disabled:opacity-50"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
            {notification.description}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
            <div className="flex items-center gap-3">
              {isReminder && (
                <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-medium">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Reminder
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatDate(notification.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};