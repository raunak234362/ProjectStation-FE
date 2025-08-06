/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { AlertCircle, FileText } from "lucide-react";
import Service from "../../config/Service";

// Custom UI Components
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}
  >
    {children}
  </div>
);

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

const Tabs = ({ tabs, activeTab, onChange, className = "" }) => (
  <div className={`border-b border-gray-200 ${className}`}>
    <nav className="flex -mb-px space-x-8 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
            activeTab === tab.id
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  </div>
);

const ActionCenter = () => {
  const userType = sessionStorage.getItem("userType");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [rfiList, setRFIList] = useState([]);
  const [submittalList, setSubmittalList] = useState([]);
  const [rfqList, setRFQList] = useState([]);

  const [itemType, setItemType] = useState("rfi");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [rfiRes, subRes] = await Promise.all([
        Service.inboxRFI(),
        Service.reciviedSubmittal(),
      ]);
      let rfqDetail;
      if (userType === "client") {
        rfqDetail = await Service.sentRFQ();
      } else {
        rfqDetail = await Service.inboxRFQ();
      }
      console.log("RFQ Response:", rfqDetail);
      setRFIList(rfiRes?.data || []);
      setSubmittalList(subRes?.data || []);
      setRFQList(rfqDetail || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  console.log("RFI List:", rfiList);
  useEffect(() => {
    fetchData();
  }, []);

  const pendingItems = {
    rfi: rfiList.filter((item) => item?.rfiresponse === null),
    submittals: submittalList.filter(
      (item) => item?.submittalsResponse === null
    ),
      rfq: rfqList.filter((item) => (item.response?.length > 0)),
    co: [], // Placeholder if Change Orders added later
  };

  console.log("Pending Items:", pendingItems?.rfq?.status);

  const renderItemCard = (item, type) => (
    <div
      key={item.id}
      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 text-sm line-clamp-1">
            {item?.subject || "No Subject"}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {item?.description || "No description provided"}
          </p>
        </div>
        <Badge variant="warning">Pending</Badge>
      </div>
      <div className="flex items-center justify-between mt-3">
        <div className="text-xs text-gray-500">
          {item?.createdAt
            ? new Date(item.createdAt).toLocaleDateString()
            : "No date"}
        </div>
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-8 text-gray-500">
      {itemType === "rfi" ? (
        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
      ) : (
        <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
      )}
      <p>No pending {itemType} items</p>
    </div>
  );

  const renderActionCenterSkeleton = useCallback(
    () => (
      <Card className="p-6">
        <Skeleton height={20} width={150} />
        <Skeleton height={20} width={100} className="mt-4" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 border border-gray-200 rounded-lg mt-3">
            <Skeleton height={15} width="80%" />
            <Skeleton height={12} width="60%" className="mt-2" />
            <Skeleton height={12} width="40%" className="mt-2" />
          </div>
        ))}
      </Card>
    ),
    []
  );

  if (error) {
    return <Card className="p-6 text-red-600 text-center">{error}</Card>;
  }

  const tabItems = [
    { id: "rfi", label: `RFI (${pendingItems.rfi.length})` },
    {
      id: "submittals",
      label: `Submittals (${pendingItems.submittals.length})`,
    },
    { id: "co", label: `Change Order (0)` },
    { id: "rfq", label: `RFQ (${pendingItems.rfq.length})` },
  ];

  return (
    <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
      {isLoading ? (
        renderActionCenterSkeleton()
      ) : (
        <Card className="p-3">
          <h2 className="text-base font-semibold text-gray-900 mb-2">
            Action Center
          </h2>
          <hr />
          <Tabs
            tabs={tabItems}
            activeTab={itemType}
            onChange={setItemType}
            className="mb-4"
          />
          <div className="space-y-3 h-[40vh] overflow-y-auto">
            {pendingItems[itemType]?.length
              ? pendingItems[itemType].map((item) =>
                  renderItemCard(item, itemType)
                )
              : renderEmptyState()}
          </div>
        </Card>
      )}
    </SkeletonTheme>
  );
};

export default ActionCenter;
