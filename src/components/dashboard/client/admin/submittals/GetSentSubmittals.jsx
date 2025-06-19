/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "../../../../index";
import api from "../../../../../config/api";
import ResponseSubmitals from "./ResponseSubmitals";

const GetSentSubmittals = ({ submittalId, isOpen, onClose }) => {
  const [rfi, setRFI] = useState();
  const RFI = useSelector((state) => state?.projectData?.rfiData);

  const handleClose = async () => {
    onClose(true);
  };

  useEffect(() => {
    console.log("11111111111111111111111", submittalId);
    const fetchSubmittals = async () => {
      try {
        const rfi = await api.get(
          `/api/submittals/getSubmittals/${submittalId}`
        );
        // console.log("1111111111111111111",rfi);
        if (rfi) {
          setRFI(rfi.data.data);
        } else {
          console.log("RFI not found");
        }
      } catch (error) {
        console.log("Error fetching RFI:", error);
      }
    };
    // console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrr", rfi)
    fetchSubmittals();
  }, [submittalId]);

  console.log("22222222222222222222:", rfi);

  const [clickResponse, setClickResponse] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [changes, setChanges] = useState()
  const handleResponseClick = () => {
    setClickResponse(true);
    setIsModalOpen(true);
  };
  // console.log("rfiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii", rfi?.id)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white h-[70%] md:p-5 rounded-lg shadow-lg w-11/12 max-w-4xl">
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
                  value: rfi?.files?.length
                    ? rfi.files.map((file) => (
                        <a
                          key={file.id}
                          href={`${import.meta.env.VITE_BASE_URL}api/RFi/rfi/${
                            rfi.id
                          }/${file.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline transition hover:text-blue-800"
                        >
                          <div>{file.originalName || "Unnamed File"}</div>
                        </a>
                      ))
                    : "No files attached",
                },
                { label: "Stage", value: rfi?.Stage },
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
          <div>
            {rfi?.submittalsResponse ? (
              <div className="p-5 mt-5 rounded-lg shadow-md bg-gray-100/50">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {[
                    {
                      label: "Date of Response",
                      value: new Date(
                        rfi?.submittalsResponse?.createdAt
                      ).toLocaleString(),
                    },
                    {
                      label: "Reason",
                      value: rfi?.submittalsResponse?.reason,
                    },
                    {
                      label: "Files",
                      value: rfi?.submittalsResponse?.files?.length
                        ? rfi?.submittalsResponse?.files.map((file) => (
                            <a
                              key={file.id}
                              href={`${
                                import.meta.env.VITE_BASE_URL
                              }/api/RFi/rfi/${rfi?.submittalsResponse?.id}/${
                                file.id
                              }`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline transition hover:text-blue-800"
                            >
                              <div>{file.originalName || "Unnamed File"}</div>
                            </a>
                          ))
                        : "No files attached",
                    },
                    { label: "Status", value: rfi?.submittalsResponse?.status },
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
            ) : (
              <Button className="mt-5" onClick={handleResponseClick}>
                Response
              </Button>
            )}
          </div>
        </div>
      </div>
      {!rfi?.submittalsResponse && clickResponse && (
        <ResponseSubmitals submittalsID={rfi.id} onClose={onClose} />
      )}
    </div>
  );
};

export default GetSentSubmittals;
