/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "../../../../index";

const GetVendor = ({ vendorId, isOpen, onClose }) => {
  const [vendor, setVendor] = useState();

  const vendorData = useSelector((state) => state.vendorData?.vendorData);

  const fetchVendor = async () => {
    try {
      const vendor = vendorData.find((ven) => ven.id === vendorId);
      if (vendor) {
        setVendor(vendor);
      } else {
        console.log("Vendor not found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchVendor();
  }, [vendorId]);

  const handleClose = async () => {
    onClose(true);
  };

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
              Vendor: {vendor?.name || "Unknown"}
            </div>
          </div>
        </div>

        {/* Container */}
        <div className="p-5 h-[88%] overflow-y-auto rounded-lg shadow-lg">
          <div className="bg-gray-100 rounded-lg shadow-md p-5">
            <h2 className="text-lg font-semibold mb-4">Head Office Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Address", value: vendor?.address },
                { label: "City", value: vendor?.city },
                { label: "State", value: vendor?.state },
                { label: "Country", value: vendor?.country },
                { label: "Zipcode", value: vendor?.zip_code },
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

          {/* Branch Details */}
          {vendor?.branch?.length > 0 && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-4">Branch Details</h2>
              {vendor.branch.map((branch, index) => (
                <div key={index} className="bg-gray-100 rounded-lg shadow-md p-5 mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: "Address", value: branch?.address },
                      { label: "City", value: branch?.city },
                      { label: "State", value: branch?.state },
                      { label: "Country", value: branch?.country },
                      { label: "Zipcode", value: branch?.zip_code },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex flex-col">
                        <span className="font-medium text-gray-700">
                          {label}:
                        </span>
                        <span className="text-gray-600">
                          {value || "Not available"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetVendor;
