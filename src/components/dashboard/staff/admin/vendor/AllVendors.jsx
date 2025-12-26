import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Button, GetVendor } from "../../../../index";
import DataTable from "../../../../DataTable";

const AllVendors = () => {
  const vendors = useSelector((state) => state.vendorData?.vendorData || []);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewClick = (vendorId) => {
    setSelectedVendor(vendorId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedVendor(null);
    setIsModalOpen(false);
  };

  const columns = useMemo(
    () => [
      {
        header: "S.no",
        cell: (info) => info.row.index + 1,
      },
      {
        header: "Vendor Name",
        accessorKey: "name",
      },
      {
        header: "City",
        accessorKey: "city",
        filterType: "select",
        filterOptions: [...new Set(vendors.map(v => v.city).filter(Boolean))].sort().map(val => ({ label: val, value: val })),
      },
      {
        header: "State",
        accessorKey: "state",
        filterType: "select",
        filterOptions: [...new Set(vendors.map(v => v.state).filter(Boolean))].sort().map(val => ({ label: val, value: val })),
      },
      {
        header: "Country",
        accessorKey: "country",
        filterType: "select",
        filterOptions: [...new Set(vendors.map(v => v.country).filter(Boolean))].sort().map(val => ({ label: val, value: val })),
      },
      {
        header: "Actions",
        id: "actions",
        cell: (info) => (
          <Button onClick={() => handleViewClick(info.row.original.id)}>
            View
          </Button>
        ),
      },
    ],
    [vendors]
  );

  return (
    <div className="bg-white/70 rounded-lg md:w-full w-[90vw] p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">All Vendors</h2>
      <DataTable
        columns={columns}
        data={vendors}
        searchPlaceholder="Search by name, city, state or country"
      />
      {selectedVendor && (
        <GetVendor
          vendorId={selectedVendor}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default AllVendors;
