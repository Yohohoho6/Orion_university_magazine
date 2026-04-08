import { useState, useMemo } from "react";
import { useGetNotifications } from "../hooks/useGetNotifications";
import { useBulkDeleteNotifications } from "../hooks/useBulkDeleteNotifications";
import { useMarkAllAsRead } from "../hooks/useMarkAllAsRead";
import { NotificationCard } from "./NotificationCard";
import { toast } from "react-toastify";

export const NotificationList = () => {
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const { data: notificationsData, isPending, error: notificationsError, refetch } = useGetNotifications(page);
  const bulkDeleteNotifications = useBulkDeleteNotifications();
  const markAllAsRead = useMarkAllAsRead();

  const notifications = useMemo(() => notificationsData?.data?.data || [], [notificationsData]);
  const pagination = {
    currentPage: notificationsData?.data?.current_page,
    totalPages: notificationsData?.data?.last_page,
    total: notificationsData?.data?.total,
    perPage: notificationsData?.data?.per_page,
  };

  const isAllSelected = useMemo(() => {
    return notifications.length > 0 && notifications.every(n => selectedIds.includes(n.id));
  }, [notifications, selectedIds]);

  const handleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(notifications.map(n => n.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} notification(s)?`)) {
      bulkDeleteNotifications.mutate(selectedIds, {
        onSuccess: () => {
          toast.success(`Successfully deleted ${selectedIds.length} notification(s)`);
          setSelectedIds([]);
          setIsSelectionMode(false);
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Failed to delete notifications");
        }
      });
    }
  };

  const handleCancelSelection = () => {
    setSelectedIds([]);
    setIsSelectionMode(false);
  };

  const handleMarkAllAsRead = () => {
    if (window.confirm("Are you sure you want to mark all notifications as read?")) {
      markAllAsRead.mutate(undefined, {
        onSuccess: () => {
          toast.success("All notifications marked as read");
          refetch();
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Failed to mark all as read");
        }
      });
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
          <div className="text-gray-500 dark:text-gray-400">Loading notifications...</div>
        </div>
      </div>
    );
  }

  if (notificationsError) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="text-red-500 dark:text-red-400 font-medium mb-1">Failed to load notifications</div>
        <div className="text-gray-500 dark:text-gray-400 text-sm">{notificationsError?.message || "Please try again later"}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-blue-950/50">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Notifications</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {pagination.total || 0} total notification{pagination.total !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isSelectionMode ? (
              <>
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={markAllAsRead.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors disabled:opacity-50 font-medium text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {markAllAsRead.isPending ? "Marking..." : "Mark all read"}
                </button>
                <button
                  onClick={() => setIsSelectionMode(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Select
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleCancelSelection}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={selectedIds.length === 0 || bulkDeleteNotifications.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  {bulkDeleteNotifications.isPending ? "Deleting..." : `Delete (${selectedIds.length})`}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bulk action bar */}
      {isSelectionMode && selectedIds.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl p-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 dark:text-blue-300 font-medium">
              {selectedIds.length} notification{selectedIds.length !== 1 ? 's' : ''} selected
            </span>
            <button
              onClick={handleSelectAll}
              className="text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-200 text-sm font-medium"
            >
              {isAllSelected ? "Deselect all" : "Select all"}
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {notifications.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">No notifications yet</h3>
          <p className="text-gray-500 dark:text-gray-400">You're all caught up! Check back later for updates.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Select all row */}
          {isSelectionMode && (
            <div
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={handleSelectAll}
            >
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleSelectAll}
                className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 accent-blue-600"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isAllSelected ? "Deselect all" : "Select all on this page"}
              </span>
            </div>
          )}

          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              isSelected={selectedIds.includes(notification.id)}
              onSelect={handleSelect}
              showCheckbox={isSelectionMode}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {notifications.length} of {pagination.total} notifications
          </div>

          <div className="flex items-center gap-1">
            {/* Previous */}
            <button
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1 || !notificationsData?.data?.prev_page_url}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Page numbers */}
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1)
              .map((p, index, arr) => {
                if (index > 0 && p - arr[index - 1] > 1) {
                  return (
                    <span key={`ellipsis-${p}`} className="px-2 text-gray-400 dark:text-gray-500">...</span>
                  );
                }
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`
                      min-w-10 h-10 rounded-lg font-medium text-sm transition-colors
                      ${page === p
                        ? "bg-blue-900 dark:bg-blue-600 text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }
                    `}
                  >
                    {p}
                  </button>
                );
              })}

            {/* Next */}
            <button
              onClick={() => setPage(prev => Math.min(pagination.totalPages, prev + 1))}
              disabled={page === pagination.totalPages || !notificationsData?.data?.next_page_url}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};