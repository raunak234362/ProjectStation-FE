/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { AlertCircle, FileText } from "lucide-react";
import Service from "../../config/Service";

// Custom UI Components (Copied from ProjectDashboard for consistency)
const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
        {children}
    </div>
);

const Badge = ({ children, variant = "default", className = "" }) => {
    const variants = {
        warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
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
                    className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </nav>
    </div>
);

const ActionCenter = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [RFI, setRFI] = useState([]);
    const [count, setCount] = useState(0);
    const [noreplyRFI, setNoReplyRFI] = useState([]);
    const [submittals, setSubmittals] = useState([]);
    const [subCount, setSubCount] = useState(0);
    const [noreplySubmittals, setNoreplySubmittals] = useState([]);
    const [itemType, setItemType] = useState("rfi");

    // Fetch RFI and Submittals
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [rfiResponse, submittalResponse] = await Promise.all([
                    Service.inboxRFI(),
                    Service.reciviedSubmittal(),
                ]);
                setRFI(rfiResponse?.data || []);
                setSubmittals(submittalResponse?.data || []);
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load dashboard data");
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Process RFI and Submittals
    useEffect(() => {
        const pendingRFI = RFI.filter((rfi) => rfi?.rfiresponse === null);
        setCount(pendingRFI.length);
        setNoReplyRFI(pendingRFI);

        const pendingSubmittals = submittals.filter((sub) => sub?.submittalsResponse === null);
        setSubCount(pendingSubmittals.length);
        setNoreplySubmittals(pendingSubmittals);
    }, [RFI, submittals]);

    // Skeleton Renderer
    const renderActionCenterSkeleton = useCallback(() => (
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
    ), []);

    if (error) {
        return (
            <Card className="p-6 text-red-600 text-center">
                {error}
            </Card>
        );
    }

    return (
        <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
            {isLoading ? renderActionCenterSkeleton() : (
                <Card className="p-3">
                    <h2 className="text-base font-semibold text-gray-900 mb-2">Action Center</h2>
                    <hr />
                    <Tabs
                        tabs={[
                            { id: "rfi", label: `RFI (${count})` },
                            { id: "submittals", label: `Submittals (${subCount})` },
                            { id: "CO", label: `Change Order (${subCount})` },
                            { id: "rfq", label: `RFQ (${subCount})` },
                        ]}
                        activeTab={itemType}
                        onChange={setItemType}
                        className="mb-4"
                    />
                    <div className="space-y-3 h-64 overflow-y-auto">
                        {itemType === "rfi" ? (
                            noreplyRFI?.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                    <p>No pending RFI responses</p>
                                </div>
                            ) : (
                                noreplyRFI?.map((rfi, index) => (
                                    <div
                                        key={index}
                                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900 text-sm line-clamp-1">{rfi?.subject || "No Subject"}</h3>
                                                <p className="text-xs text-gray-500 mt-1">{rfi?.description || "No description provided"}</p>
                                            </div>
                                            <Badge variant="warning">Pending</Badge>
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="text-xs text-gray-500">
                                                {rfi?.createdAt ? new Date(rfi.createdAt).toLocaleDateString() : "No date"}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )
                        ) : noreplySubmittals?.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p>No pending submittals</p>
                            </div>
                        ) : (
                            noreplySubmittals?.map((sub, index) => (
                                <div
                                    key={index}
                                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-purple-300 transition-all cursor-pointer"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900 text-sm line-clamp-1">{sub?.subject || "No Subject"}</h3>
                                            <p className="text-xs text-gray-500 mt-1">{sub?.description || "No description provided"}</p>
                                        </div>
                                        <Badge variant="warning">Pending</Badge>
                                    </div>
                                    <div className="flex items-center justify-between mt-3">
                                        <div className="text-xs text-gray-500">
                                            {sub?.createdAt ? new Date(sub.createdAt).toLocaleDateString() : "No date"}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            )}
        </SkeletonTheme>
    );
};

export default ActionCenter;