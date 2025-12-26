/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useMemo, useCallback } from "react";
import Service from "../../config/Service";
import GetRFI from "./GetRFI";
import { useSignals } from "@preact/signals-react/runtime";
import { rfiList, rfiLoading, rfiError, setRFIs } from "../../signals";
import DataTable from "../DataTable";

const AllRFI = ({ projectData }) => {
    useSignals();
    const [selectedRFI, setSelectedRFI] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const projectId = projectData?.id;

    const fetchRFIByProjectId = async () => {
        try {
            rfiLoading.value = true;
            const response = await Service.getRFIByProjectId(projectId);
            setRFIs(response.data || []);
            rfiError.value = null;
        } catch (error) {
            console.error("Error fetching RFIs:", error);
            setRFIs([]);
            rfiError.value = "Failed to fetch RFIs";
        } finally {
            rfiLoading.value = false;
        }
    };

    useEffect(() => {
        if (projectId) fetchRFIByProjectId();
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

    const handleRowClick = useCallback((rfi) => {
        console.log("Clicked RFI:", rfi);
        setSelectedRFI(rfi);
        setIsModalOpen(true);
    }, []);

    const handleModalClose = useCallback(() => {
        setSelectedRFI(null);
        setIsModalOpen(false);
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">All RFIs</h2>
            <DataTable
                columns={columns}
                data={rfiList.value}
                onRowClick={handleRowClick}
                searchPlaceholder="Search RFIs..."
            />
            {selectedRFI && (
                <GetRFI rfiId={selectedRFI.id} isOpen={isModalOpen} onClose={handleModalClose} />
            )}
        </div>
    );
};

export default AllRFI;
