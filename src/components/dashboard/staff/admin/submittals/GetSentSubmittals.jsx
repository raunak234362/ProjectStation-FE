/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "../../../../index";
import Service from "../../../../../config/Service";
import { set } from "react-hook-form";

const GetSentSubmittals = ({ submittalId, isOpen, onClose }) => {
  const [rfi, setRFI] = useState();
  const [response, setResponse] = useState([]);
  const RFI = useSelector((state) => state?.projectData?.rfiData);
  const id = submittalId;

  const fetchRFI = async () => {
    try {
      const submittals = await Service.getSentSubmittals(id);
      setRFI(submittals);
    } catch (error) {
      console.log("Error fetching submittals", error);
    }
  };
  useEffect(() => {
    let responseId = rfi?.submittalsResponse?.id;
    const fetchResponse = async () => {
      if (responseId) {
        try {
          const responseData = await Service.fetchSubmittalsResponse(
            responseId
          );
          setResponse(responseData.data);
        } catch (error) {
          console.error("Error fetching response", error);
        }
      }
    };

    fetchResponse();
  }, [rfi]);

  const handleClose = async () => {
    onClose(true);
  };

  const fabricatorData = useSelector((state) =>
    state.fabricatorData.fabricatorData.find(
      (fab) => fab.id === rfi?.fabricator_id
    )
  );
  const clientData = useSelector((state) =>
    state.fabricatorData.clientData.find(
      (client) => client.id === rfi?.recepient_id
    )
  );

  useEffect(() => {
    fetchRFI();
  }, [submittalId]);

const [click, setClick] = useState(false);
const handleClientDetails = () => {
  setClick(true);
};
const handleClientDetailsClose = () => {
  setClick(false);
};
  
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

        <div className="p-5 h-[88%] overflow-y-auto rounded-lg shadow-lg">
          <div className="p-5 rounded-lg shadow-md bg-gray-100/50">
            <h2 className="mb-4 text-lg font-semibold">
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
            </h2>

            {click && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {[
                  { label: "Client Name", value: clientData?.f_name },
                  { label: "Email", value: clientData?.email },
                  { label: "Fabricator", value: fabricatorData?.fabName },
                  {
                    label: "Branch Address",
                    value: fabricatorData?.headquaters?.address,
                  },
                  {
                    label: "Country",
                    value: fabricatorData?.headquaters?.country,
                  },
                  { label: "State", value: fabricatorData?.headquaters?.state },
                  { label: "City", value: fabricatorData?.headquaters?.city },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col">
                    <span className="font-medium text-gray-700">{label}:</span>
                    <span className="text-gray-600">
                      {value || "Not available"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-5 mt-5 rounded-lg shadow-md bg-gray-100/50">
            <h2 className="mb-4 text-lg font-semibold">
              Submittals Information
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[
                { label: "Subject", value: rfi?.subject },
                { label: "Description", value: rfi?.description },
                {
                  label: "Date",
                  value: new Date(rfi?.date).toLocaleDateString(),
                },
                {
                  label: "Status",
                  value:
                    rfi?.submittalsResponse === null
                      ? "Not Replied"
                      : "Replied",
                },
                {
                  label: "Files",
                  value: Array.isArray(rfi?.files)
                    ? rfi?.files?.map((file, index) => (
                        <a
                          key={index}
                          href={`${
                            import.meta.env.VITE_BASE_URL
                          }/api/submittals/submittals/${rfi?.id}/${file.id}`} // change route
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          <div>{file.originalName || `File ${index + 1}`}</div>
                        </a>
                      ))
                    : "Not available",
                },
                {
                  label: "Stage",
                  value: rfi?.Stage || "Not Available",
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

          <div className="p-5 mt-5 rounded-lg shadow-md bg-gray-100/50">
            <h2 className="mb-4 text-lg font-semibold">Submittals Response</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[
                {
                  label: "Date of Response",
                  value: response?.respondedAt
                    ? new Date(response.respondedAt).toLocaleString()
                    : "Not available",
                },
                {
                  label: "Status",
                  value: response?.status || "Not Approved",
                },
                { label: "Reason", value: response?.reason || "Not available" },
                {
                  label: "Files",
                  value: response?.files?.length
                    ? response.files.map((file) => (
                        <a
                          key={file.id}
                          href={`${
                            import.meta.env.VITE_BASE_URL
                          }/api/submittalsResponse/${response.id}/${file.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline transition hover:text-blue-800"
                        >
                          <div>{file.originalName || "Unnamed File"}</div>
                        </a>
                      ))
                    : "No files attached",
                },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col">
                  <span className="font-medium text-gray-700">{label}:</span>
                  <span className="text-gray-600">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetSentSubmittals;
