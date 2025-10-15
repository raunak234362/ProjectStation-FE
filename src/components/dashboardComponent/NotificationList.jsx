/* eslint-disable react/prop-types */

const NotificationsList = ({ notifications = [] }) => {
  console.log(notifications,"=--------=")
  return (
    <div className="space-y-3 bg-white p-2 rounded-lg mb-2 ">
      <h4 className="text-base font-semibold text-gray-800 mb-2">
        Notifications{" "}
        <span className="text-red-500 bg-red-100 px-2 py-1 rounded-full">
          {notifications.length}
        </span>
      </h4>
      <div className="h-[20vh] overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              className=" border border-gray-200 rounded-lg p-3 shadow-sm hover:bg-gray-50 transition-colors"
            >
              <p className="text-sm text-gray-800 font-medium">
                {n.payload?.message || "No message available"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </p>
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
