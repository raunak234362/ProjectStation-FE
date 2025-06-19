/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Button from "../../../../fields/Button";
import ResponseRFQ from "./ResponseRFQ";
import ViewRFQResponse from "./ViewRFQResponse";

const ViewRFQ = ({ data, onClose, isOpen }) => {
  
  const [responseModal, setResponseModal] = useState(false);
  const [rfqData, setRfqData] = useState("");
  // const [fetchResponse, setFetchResponse] = useState([])

  
  const rfqDetails = data;
  console.log("rfqDetails", data);
  

  const responses = rfqDetails?.response
  // console.log("ressssssssssssssssssssssss--->", responses)
  
  
  const handleModalClose = () => {
    onClose();
  }
  
  const handleResponse = (rfq) => {
    setRfqData(rfq?.id);
    setResponseModal(true);
  };
  // console.log("----------------------------id:", rfqData);
 
    const handleResponseClose = () => {
      setResponseModal(false);
    };
  
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const handleViewModal = () => {
      setViewModalOpen(false)
    };
  
  


  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <div className="relative bg-white rounded-lg shadow-xl w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto p-6">
          {/* Close Button */}
          <Button
            className="absolute flex items-center text-white transition bg-red-600 rounded-full shadow-md justify-centerfont-semibold top-4 right-4 hover:bg-red-700"
            onClick={handleModalClose}
          >
            Close
          </Button>

          {/* RFQ Details Header */}
          <h2 className="pb-2 mb-6 text-2xl font-extrabold text-teal-600 border-b border-teal-300">
            RFQ Details
          </h2>

          {/* RFQ Information Section */}
          <section className="mb-8">
            <h3 className="px-3 py-2 mt-3 font-bold text-white bg-teal-400 rounded-lg shadow-md md:px-4 md:text-2xl">
              RFQ Information
            </h3>
            <div className="p-5 space-y-4 text-gray-700 rounded-lg shadow-inner bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="font-bold">Subject:</span>
                <span className="sm:pl-4">{rfqDetails?.subject || "N/A"}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="font-bold">Description:</span>
                <span className="whitespace-pre-wrap sm:pl-4">
                  {rfqDetails?.description || "N/A"}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="font-bold">Date:</span>
                <span className="sm:pl-4">
                  {rfqDetails?.date
                    ? new Date(rfqDetails.date).toLocaleString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="font-bold">Status:</span>
                <span className="sm:pl-4">{rfqDetails?.status}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="mb-1 font-bold">Files:</span>
                <div className="flex flex-wrap gap-3">
                  {rfqDetails?.files?.length ? (
                    rfqDetails.files.map((file) => (
                      <a
                        key={file.id}
                        href={`${import.meta.env.VITE_BASE_URL}/api/RFQ/rfq/${
                          rfqDetails.id
                        }/${file.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline transition hover:text-blue-800"
                      >
                        {file.originalName || "Unnamed File"}
                      </a>
                    ))
                  ) : (
                    <span className="text-gray-400">No files attached</span>
                  )}
                </div>
              </div>
            </div>
          </section>
          <div>
            <Button onClick={() => handleResponse(rfqDetails)}>Response</Button>
          </div>

          {/* RFQ Response Section */}
          <section>
            <h3 className="px-3 py-2 mt-3 font-bold text-white bg-teal-400 rounded-lg shadow-md md:px-4 md:text-2xl">
              RFQ Response
            </h3>
            <div className="bg-gray-50 p-5 rounded-lg shadow-inner min-h-[100px] text-gray-700">
              <div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-center text-black border-collapse md:text-lg rounded-xl">
                    <thead>
                      <tr className="bg-teal-200/90">
                        <th className="px-2 py-2 border-2 whitespace-nowrap">
                          Sl.no
                        </th>
                        <th className="px-2 py-2 border-2 whitespace-nowrap">
                          Files
                        </th>
                        <th className="px-2 py-2 border-2 whitespace-nowrap">
                          Description
                        </th>
                        <th className="px-2 py-2 border-2 whitespace-nowrap">
                          RFQ Status
                        </th>
                        <th className="px-2 py-2 border-2 whitespace-nowrap">
                          Client Response
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rfqDetails?.response?.length === 0 ? (
                        <tr className="bg-white">
                          <td colSpan="6" className="text-center">
                            No sent RFI Found
                          </td>
                        </tr>
                      ) : (
                        rfqDetails?.response.map((response, index) => (
                          <tr key={response.id}>
                            <td className="px-2 py-2 border-2">{index + 1}</td>
                            <td className="px-2 py-2 border-2">
                              {response?.files?.length ? (
                                response?.files?.map((file) => (
                                  // <a
                                  //   key={file.id}
                                  //   href={`${
                                  //     import.meta.env.VITE_BASE_URL
                                  //   }/api/RFQ/rfq/${rfqDetails.id}/${file.id}`}
                                  //   target="_blank"
                                  //   rel="noopener noreferrer"
                                  //   className="text-blue-600 underline transition hover:text-blue-800"
                                  // >
                                  //   {file.originalName || "Unnamed File"}
                                  // </a>
                                  <a>Files</a>
                                ))
                              ) : (
                                <div className="bg-gray-500">
                                  No files available
                                </div>
                              )}
                            </td>
                            <td className="px-2 py-2 border-2">
                              {response.description}
                            </td>
                            <td className="px-2 py-2 border-2">
                              {response.status}
                            </td>
                            <td className="px-2 py-2 border-2">
                              <Button
                                className="px-2 py-2 border-2"
                                onClick={() => setViewModalOpen(true)}
                              >
                                client--View
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {viewModalOpen && <ViewRFQResponse onClose={handleViewModal} />}
            {responseModal && (
              <ResponseRFQ onClose={handleResponseClose} data={rfqData} />
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default ViewRFQ;
