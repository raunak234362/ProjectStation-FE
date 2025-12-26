import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Button, GetVendorUser } from "../../../../index";
import DataTable from "../../../../DataTable";

const AllVendorUser = () => {
  const vendors = useSelector((state) => state.vendorData?.vendorUserData || []);
  const [selectedVendorUser, setSelectedVendorUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewClick = (vendorUserId) => {
    setSelectedVendorUser(vendorUserId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedVendorUser(null);
    setIsModalOpen(false);
  };

  const columns = useMemo(
    () => [
      {
        header: "Vendor",
        accessorFn: (row) => row?.vendor?.name || "N/A",
        id: "vendor",
        filterType: "select",
        filterOptions: [...new Set(vendors.map(v => v.vendor?.name).filter(Boolean))].sort().map(val => ({ label: val, value: val })),
      },
      {
        header: "Vendor P.O.Contact",
        accessorFn: (row) => `${row.f_name} ${row.m_name || ""} ${row.l_name}`.trim(),
        id: "contactName",
      },
      {
        header: "City",
        accessorFn: (row) => row?.vendor?.city || "N/A",
        id: "city",
        filterType: "select",
        filterOptions: [...new Set(vendors.map(v => v.vendor?.city).filter(Boolean))].sort().map(val => ({ label: val, value: val })),
      },
      {
        header: "State",
        accessorFn: (row) => row?.vendor?.state || "N/A",
        id: "state",
        filterType: "select",
        filterOptions: [...new Set(vendors.map(v => v.vendor?.state).filter(Boolean))].sort().map(val => ({ label: val, value: val })),
      },
      {
        header: "Country",
        accessorFn: (row) => row?.vendor?.country || "N/A",
        id: "country",
        filterType: "select",
        filterOptions: [...new Set(vendors.map(v => v.vendor?.country).filter(Boolean))].sort().map(val => ({ label: val, value: val })),
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">All Vendor Users</h2>
      <DataTable
        columns={columns}
        data={vendors}
        searchPlaceholder="Search by name, city, state or country"
      />
      {selectedVendorUser && (
        <GetVendorUser
          vendorUserId={selectedVendorUser}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default AllVendorUser;
