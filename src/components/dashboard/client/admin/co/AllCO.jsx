import React, { useMemo, useEffect, useState } from 'react'
import Service from '../../../../../config/Service';
import Button from '../../../../fields/Button';
import { useSelector } from 'react-redux';
import ViewCOTable from './ViewCOTable';
import DataTable from '../../../../DataTable';

const AllSentCO = () => {
  const [loading, setLoading] = useState(true);
  const [click, setClick] = useState(false)
  const [CO, setCO] = useState([]);
  const [filteredCO, setFilteredCO] = useState(null)

  const projectInfo = useSelector((state) => state.projectData.projectData || []);

  const fetchSentCO = async () => {
    try {
      setLoading(true);
      const response = await Service.clientRecievedData();
      setCO(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching COs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSentCO();
  }, []);

  const handleClick = (coId) => {
    setFilteredCO(coId)
    setClick(true);
  };

  const handleClose = () => {
    setFilteredCO(null)
    setClick(false);
  };

  const columns = useMemo(
    () => [
      {
        header: "Sl.No",
        cell: (info) => info.row.index + 1,
      },
      {
        header: "Project Name",
        accessorFn: (row) => {
          const project = projectInfo.find((proj) => proj.id === row?.project);
          return project?.name || "N/A";
        },
        id: "project",
        filterType: "select",
        filterOptions: [...new Set(CO.map(c => {
          const project = projectInfo.find((proj) => proj.id === c?.project);
          return project?.name;
        }).filter(Boolean))].sort().map(val => ({ label: val, value: val })),
      },
      {
        header: "Subject Remarks",
        accessorKey: "remarks",
      },
      {
        header: "Change Order No",
        accessorKey: "changeOrder",
      },
      {
        header: "Date",
        accessorKey: "sentOn",
        cell: (info) => info.getValue() ? new Date(info.getValue()).toLocaleDateString() : "N/A",
      },
      {
        header: "Actions",
        id: "actions",
        cell: (info) => (
          <Button onClick={() => handleClick(info.row.original.id)}>View</Button>
        ),
      },
    ],
    [CO, projectInfo]
  );

  return (
    <div className="p-4 bg-white/70 rounded-lg md:w-full w-[90vw]">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">All Change Orders</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={CO}
          searchPlaceholder="Search by Change order"
        />
      )}

      {click && <ViewCOTable onClose={handleClose} COdata={filteredCO} />}
    </div>
  );
}

export default AllSentCO;