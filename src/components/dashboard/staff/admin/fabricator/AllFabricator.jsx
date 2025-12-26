import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, GetFabricator } from "../../../../index.js";
import Service from "../../../../../config/Service.js";
import { loadFabricator } from "../../../../../store/fabricatorSlice.js";
import DataTable from "../../../../DataTable";

const AllFabricator = () => {
  const fabricators = useSelector((state) => state?.fabricatorData?.fabricatorData || []);
  const [selectedFabricator, setSelectedFabricator] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const getAllFabricators = async () => {
    try {
      setLoading(true);
      const response = await Service.allFabricator();
      dispatch(loadFabricator(response));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllFabricators();
  }, []);

  const handleViewClick = (id) => {
    setSelectedFabricator(id);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedFabricator(null);
    setIsModalOpen(false);
  };

  // Columns for DataTable
  const columns = useMemo(() => [
    {
      header: "S.No",
      cell: (info) => info.row.index + 1,
    },
    {
      header: "Name",
      accessorKey: "fabName",
    },
    {
      header: "City",
      accessorFn: (row) => row?.headquaters?.city || "N/A",
      id: "city",
      filterType: "select",
      filterOptions: [...new Set(fabricators.map(f => f.headquaters?.city).filter(Boolean))].sort().map(val => ({ label: val, value: val })),
    },
    {
      header: "State",
      accessorFn: (row) => row?.headquaters?.state || "N/A",
      id: "state",
      filterType: "select",
      filterOptions: [...new Set(fabricators.map(f => f.headquaters?.state).filter(Boolean))].sort().map(val => ({ label: val, value: val })),
    },
    {
      header: "Country",
      accessorFn: (row) => row?.headquaters?.country || "N/A",
      id: "country",
      filterType: "select",
      filterOptions: [...new Set(fabricators.map(f => f.headquaters?.country).filter(Boolean))].sort().map(val => ({ label: val, value: val })),
    },
    {
      header: "Actions",
      id: "actions",
      cell: (info) => (
        <Button onClick={() => handleViewClick(info.row.original.id)}>View</Button>
      ),
    },
  ], [fabricators]);

  return (
    <div className="bg-white/70 rounded-lg md:w-full w-[90vw] p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">All Fabricators</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={fabricators}
          searchPlaceholder="Search by name, city, state or country"
        />
      )}

      {selectedFabricator && (
        <GetFabricator
          fabricatorId={selectedFabricator}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default AllFabricator;
