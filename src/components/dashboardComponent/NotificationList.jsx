/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Service from "../../config/Service";

const NotificationsList = ({ notifications = [] }) => {
  const [localNotifications, setLocalNotifications] = useState(notifications);

  // Update when prop changes
  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  // Update a single notification's status
  const updateStatus = async (id) => {
    try {
      const response = await Service.UpdateNotification(id);
      console.log("Updated:", response);

      // Remove the notification locally for instant UI feedback
      setLocalNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  return (
    <div className="space-y-3 bg-white p-2 rounded-lg mb-2">
      <h4 className="text-base font-semibold text-gray-800 mb-2 flex items-center justify-between">
        <span>
          Notifications{" "}
          <span className="text-red-500 bg-red-100 px-2 py-1 rounded-full">
            {localNotifications.length}
          </span>
        </span>
      </h4>

      <div className="h-[20vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        {localNotifications.length > 0 ? (
          localNotifications.map((n) => (
            <div
              key={n.id}
              className="border border-gray-200 rounded-lg p-3 shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <div>
                {n.payload?.type === "GroupMessages" ? (
                  <p className="text-sm text-blue-600 font-medium">
                    Group: {n.payload?.content || "No group message"}
                  </p>
                ) : (
                  <p className="text-sm text-gray-800 font-medium">
                    {n.payload?.message || "No message available"}
                  </p>
                )}

                <p className="text-xs text-gray-500 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Mark as Read Button */}
              <button
                onClick={() => updateStatus(n.id)}
                className="ml-4 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition"
              >
                Mark as Read
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            No notifications yet
          </p>
        )}
      </div>
    </div>
  );
};

export default NotificationsList;
