/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "../../../../index";

const GetVendorUser = ({ vendorUserId, onClose }) => {
  const [vendorUser, setVendorUser] = useState();

  const vendorUserData = useSelector(
    (state) => state.vendorData?.vendorUserData
  );
  console.log(vendorUserData);

  const fetchVendorUser = async () => {
    try {
      const vendorUser = vendorUserData.find((ven) => ven.id === vendorUserId);
      if (vendorUser) {
        setVendorUser(vendorUser);
      } else {
        console.log("Vendor User not found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchVendorUser();
  }, [vendorUserId]);

  const handleClose = async () => {
    onClose(true);
  };

  console.log(vendorUser);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white h-[80%] md:p-5 rounded-lg shadow-lg w-11/12 max-w-4xl">
      <div className="flex flex-row justify-between">
          <Button className="bg-red-500" onClick={handleClose}>
            Close
          </Button>
          <Button>
            Edit
          </Button>
        </div>
        {/* Header */}
        <div className="top-2 w-full flex justify-center z-10">
          <div className="mt-2">
            <div className="bg-teal-400 text-white px-3 md:px-4 py-2 md:text-2xl font-bold rounded-lg shadow-md">
              Vendor: {vendorUser?.vendor?.name || "Unknown"}
            </div>
          </div>
        </div>

        {/* Container */}
        <div className="p-5 h-[88%] overflow-y-auto rounded-lg shadow-lg">
          <div className="bg-gray-100 rounded-lg shadow-md p-5">
            <h2 className="text-lg font-semibold mb-4">
              Point of Contact Details:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Username", value: vendorUser?.username },
                { label: "Name", value: vendorUser?.f_name },
                { label: "Designation", value: vendorUser?.designation },
                { label: "Email", value: vendorUser?.email },
                { label: "Contact Number", value: vendorUser?.phone },
                { label: "Landline Number", value: vendorUser?.landline },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col">
                  <span className="font-medium text-gray-700">{label}:</span>
                  <span className="text-gray-600">
                    {value || "Not available"}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2">
            <h2 className="text-lg font-semibold mb-4">Location:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Address", value: vendorUser?.vendor?.address },
                { label: "City", value: vendorUser?.vendor?.city },
                { label: "State", value: vendorUser?.vendor?.state },
                { label: "Country", value: vendorUser?.vendor?.country },
                { label: "Zipcode", value: vendorUser?.vendor?.zip_code },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col">
                  <span className="font-medium text-gray-700">{label}:</span>
                  <span className="text-gray-600">
                    {value || "Not available"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetVendorUser;
