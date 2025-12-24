/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetFabricator } from "../index.js";
import DataTable from "../DataTable";
import Service from "../../config/Service.js";
import { loadFabricator } from "../../store/fabricatorSlice.js";

const AllFabricator = () => {
  const fabricators = useSelector(
    (state) => state?.fabricatorData?.fabricatorData || []
  );
  const [selectedFabricator, setSelectedFabricator] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const getAllFabricators = async () => {
    try {
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

  const handleViewClick = (row) => {
    setSelectedFabricator(row.id);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedFabricator(null);
    setIsModalOpen(false);
  };

  // Columns for DataTable
  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "fabName",
        enableColumnFilter: true,
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
    ],
    [fabricators]
  );

  return (
    <div className="bg-white/70 rounded-lg md:w-full w-[90vw] h-full">
      <div className="mt-5 bg-white h-full p-4">
        <DataTable
          columns={columns}
          data={fabricators}
          onRowClick={handleViewClick}
          searchPlaceholder="Search fabricators..."
        />

        {/* Modal */}
        {selectedFabricator && (
          <GetFabricator
            fabricatorId={selectedFabricator}
            isOpen={isModalOpen}
            onClose={handleModalClose}
          />
        )}
      </div>
    </div>
  );
};

export default AllFabricator;
