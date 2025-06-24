/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "../index";
import api from "../../config/api";
import { toast } from "react-toastify";
import { set } from "react-hook-form";

const GetRFI = ({ rfiId, isOpen, onClose }) => {
  const [rfi, setRFI] = useState();
  // const [response, setResponse] = useState(null);
  const RFI = useSelector((state) => state?.projectData?.rfiData);

  const fetchRFI = async () => {
    try {
      const rfi = await api.get(`/api/RFI/rfi/${rfiId}`);
      console.log(rfi);
      if (rfi) {
        setRFI(rfi.data.data);
      } else {
        console.log("RFI not found");
      }
    } catch (error) {
      console.log("Error fetching RFI:", error);
    }
  };
  console.log(rfi?.rfiresponse, "response");

  const handleClose = async () => {
    onClose(true);
  };
  const [click, setClick] = useState(false);
  const handleClientDetails = () => {
    setClick(true);
  };
  const handleClientDetailsClose = () => {
    setClick(false);
  };

  useEffect(() => {
    fetchRFI();
  }, [rfiId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white h-[80%] md:p-5 rounded-lg shadow-lg w-11/12 max-w-4xl">
        <div className="flex flex-row justify-between">
          <Button className="bg-red-500" onClick={handleClose}>
            Close
          </Button>
        </div>

        {/* header */}
        <div className="z-10 flex justify-center w-full top-2">
          <div className="mt-2">
            <div className="px-3 py-2 font-bold text-white bg-teal-400 rounded-lg shadow-md md:px-4 md:text-2xl">
              Subject/Remarks: {rfi?.remarks || "Unknown"}
            </div>
          </div>
        </div>

        <div className="p-5 h-[88%] overflow-y-auto rounded-lg shadow-lg space-y-5">
          <div className="p-5 rounded-lg shadow-md bg-gray-100/50">
            <h2 className="text-lg font-semibold ">
              Client Details
              {!click ? (
                <span
                  className="pl-5 text-sm text-gray-700 cursor-pointer font-s emibold"
                  onClick={handleClientDetails}
                >
                  Click for client details
                </span>
              ) : (
                <span
                  className="pl-5 text-sm font-semibold text-gray-700 cursor-pointer"
                  onClick={handleClientDetailsClose}
                >
                  Click to hide client details
                </span>
              )}
              {click && (
                <div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {[
                      { label: "Client Name", value: rfi?.recepients.f_name },
                      { label: "Email", value: rfi?.recepients.email },
                      {
                        label: "Fabricator",
                        value: rfi?.recepients.fabricator.fabName,
                      },
                      {
                        label: "Branch Address",
                        value: rfi?.recepients.fabricator.headquaters.address,
                      },
                      { label: "Country", value: rfi?.recepients.country },
                      { label: "State", value: rfi?.recepients.state },
                      { label: "City", value: rfi?.recepients.city },
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
              )}
            </h2>
          </div>

          <div className="p-5 rounded-lg shadow-md bg-gray-100/50">
            <h2 className="mb-4 text-lg font-semibold">RFI Information</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[
                { label: "Subject", value: rfi?.subject },
                { label: "Description", value: rfi?.description },
                { label: "Date", value: rfi?.date },
                {
                  label: "Status",
                  value: rfi?.status ? "No Reply" : "Replied",
                },
                {
                  label: "Files",
                  value: Array.isArray(rfi?.files)
                    ? rfi?.files?.map((file, index) => (
                        <a
                          key={index}
                          href={`${
                            import.meta.env.VITE_BASE_URL
                          }/api/RFI/rfi/viewfile/${rfi?.id}/${file.id}`}
                          target="_blank" // Open in a new tab
                          rel="noopener noreferrer"
                          className="px-5 py-2 text-teal-500 hover:underline"
                        >
                          {file.originalName || `File ${index + 1}`}
                        </a>
                      ))
                    : "Not available",
                },
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
          <div className="p-5 rounded-lg shadow-md bg-gray-100/50">
            <h2 className="mb-4 text-lg font-semibold">RFI Response</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[
                { label: "Date", value: rfi?.rfiresponse?.createdAt },
                { label: "Description", value: rfi?.rfiresponse?.reason },
                {
                  label: "Status",
                  value: rfi?.rfiresponse?.responseState,
                },
                {
                  label: "Files",
                  value: Array.isArray(rfi?.rfiresponse?.files)
                    ? rfi?.rfiresponse?.files?.map((file, index) => (
                        <a
                          key={index}
                          href={`${
                            import.meta.env.VITE_BASE_URL
                          }/api/RFI/rfi/response/viewfile/${
                            rfi?.rfiresponse?.id
                          }/${file.id}`} //change route
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2 text-teal-500 hover:underline"
                        >
                          {file.originalName || `File ${index + 1}`}
                        </a>
                      ))
                    : "Not available",
                },
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
          <div className="p-5 bg-gray-200 rounded-lg shadow-md">
            <div className="flex font-bold">Respond to Status</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetRFI;
