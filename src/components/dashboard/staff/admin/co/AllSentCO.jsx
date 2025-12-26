/* eslint-disable no-unused-vars */
import React, { useMemo, useEffect, useState } from 'react'
import Service from '../../../../../config/Service';
import { Button } from '../../../../index';
import DataTable from '../../../../DataTable';
import { useSelector } from 'react-redux';

const AllSentCO = () => {
  const [CO, setCO] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSentCO = async () => {
    try {
      const response = await Service.sentCO();
      setCO(response?.data?.data || []);
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSentCO();
  }, []);

  const clientData = useSelector((state) => state.fabricatorData.clientData || [])
  const projectInfo = useSelector((state) => state.projectData.projectData || [])

  const columns = useMemo(
    () => [
      {
        header: "Client Name",
        accessorFn: (row) => {
          const client = clientData.find(
            (client) => client.id === row?.recipients
          );
          return client ? `${client.f_name} ${client.m_name || ""} ${client.l_name}` : "-";
        },
        id: "recipients",
        filterType: "select",
        filterOptions: [...new Set(clientData.map(c => `${c.f_name} ${c.m_name || ""} ${c.l_name}`))].sort().map(val => ({ label: val, value: val })),
      },
      {
        header: "Project Name",
        accessorFn: (row) => {
          const project = projectInfo.find((proj) => proj.id === row?.project);
          return project?.name || "-";
        },
        id: "project",
        filterType: "select",
        filterOptions: [...new Set(projectInfo.map(p => p.name))].sort().map(val => ({ label: val, value: val })),
      },
      {
        header: "Subject Remarks",
        accessorKey: "remarks",
      },
      {
        header: "Change Order No",
        accessorKey: "changeOrder",
        enableColumnFilter: true,
      },
      {
        header: "Date",
        accessorKey: "sentOn",
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => <Button className="bg-teal-500 text-white px-3 py-1 text-xs">View</Button>,
      },
    ],
    [clientData, projectInfo]
  );

  return (
    <div className="p-4">
      <DataTable
        columns={columns}
        data={CO}
        searchPlaceholder="Search by Change order..."
      />
    </div>
  );
}

export default AllSentCO