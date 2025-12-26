/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useMemo, useCallback } from "react";
import Service from "../../config/Service";
import GetSubmittals from "./GetSubmittals";
import DataTable from "../DataTable";

const AllSubmittals = ({ projectData }) => {
    const [submittalsData, setSubmittalsData] = useState([]);
    const [selectedSubmittal, setSelectedSubmittal] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const projectId = projectData?.id;

    const fetchSubmittalsByProjectId = async () => {
        try {
            const response = await Service.getSubmittalByProjectId(projectId);
            console.log("Fetched Submittals:", response.data);
            setSubmittalsData(response.data || []);
        } catch (error) {
            console.error("Error fetching Submittals:", error);
            setSubmittalsData([]);
        }
    };

    useEffect(() => {
        if (projectId) fetchSubmittalsByProjectId();
    }, [projectId]);

    const columns = useMemo(
        () => [
            {
                header: "Subject",
                accessorKey: "subject",
                enableColumnFilter: true,
            },
            {
                header: "Date",
                accessorKey: "date",
                cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
            },
            {
                header: "Sender",
                accessorFn: (row) => row?.sender?.username || "-",
                id: "sender",
            },
            {
                header: "Recepient",
                accessorFn: (row) => row?.recepients?.username || "-",
                id: "recepient",
            },
            {
                header: "Status",
                accessorKey: "status",
                cell: ({ getValue }) =>
                    getValue() ? (
                        <span className="text-red-600 font-semibold">Not Replied</span>
                    ) : (
                        <span className="text-green-500 font-semibold">Replied</span>
                    ),
            },
        ],
        []
    );

    const handleRowClick = useCallback((submittal) => {
        setSelectedSubmittal(submittal);
        setIsModalOpen(true);
    }, []);

    const handleModalClose = useCallback(() => {
        setSelectedSubmittal(null);
        setIsModalOpen(false);
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">All Submittals</h2>
            <DataTable
                columns={columns}
                data={submittalsData}
                onRowClick={handleRowClick}
                searchPlaceholder="Search submittals..."
            />
            {selectedSubmittal && (
                <GetSubmittals submittalId={selectedSubmittal.id} isOpen={isModalOpen} onClose={handleModalClose} />
            )}
        </div>
    );
};

export default AllSubmittals;
