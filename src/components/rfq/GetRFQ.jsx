/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useCallback } from "react";
import Button from "../fields/Button";
// import ResponseRFQ from "./ResponseRFQ";
// import ViewRFQResponse from "./ViewRFQResponse";

const GetRFQ = ({ data, onClose, isOpen }) => {
  const [responseModal, setResponseModal] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRfqId, setSelectedRfqId] = useState(null);

  const handleModalClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleResponse = useCallback((rfq) => {
    setSelectedRfqId(rfq?.id);
    setResponseModal(true);
  }, []);

  const handleResponseClose = useCallback(() => {
    setResponseModal(false);
    setSelectedRfqId(null);
  }, []);

  const handleViewModalClose = useCallback(() => {
    setViewModalOpen(false);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="relative w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl p-6">
        <Button
          className="absolute top-4 right-4 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition font-semibold w-10 h-10 flex items-center justify-center"
          onClick={handleModalClose}
        >
          ✕
        </Button>

        <h2 className="mb-6 pb-2 text-2xl font-extrabold text-teal-600 border-b border-teal-300">
          RFQ Details
        </h2>

        <section className="mb-8">
          <h3 className="px-3 py-2 mt-3 font-bold text-white bg-teal-400 rounded-lg shadow-md md:text-2xl">
            RFQ Information
          </h3>
          <div className="p-5 space-y-4 text-gray-700 rounded-lg shadow-inner bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="font-bold">Subject:</span>
              <span className="sm:pl-4">{data?.subject || "N/A"}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="font-bold">Description:</span>
              <span className="sm:pl-4 whitespace-pre-wrap">
                {data?.description || "N/A"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="font-bold">Date:</span>
              <span className="sm:pl-4">
                {data?.date ? new Date(data.date).toLocaleString() : "N/A"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="font-bold">Status:</span>
              <span className="sm:pl-4">{data?.status || "N/A"}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="font-bold">Files:</span>
              <div className="flex flex-wrap gap-3">
                {data?.files?.length ? (
                  data.files.map((file) => (
                    <a
                      key={file.id}
                      href={`${import.meta.env.VITE_BASE_URL}/api/RFQ/rfq/${data.id}/${file.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800 transition"
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

        <Button
          onClick={() => handleResponse(data)}
          className="mb-8 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Submit Response
        </Button>

        <section>
          <h3 className="px-3 py-2 mt-3 font-bold text-white bg-teal-400 rounded-lg shadow-md md:text-2xl">
            RFQ Responses
          </h3>
          <div className="p-5 rounded-lg shadow-inner bg-gray-50 min-h-[100px]">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-center text-gray-700 border-collapse rounded-xl">
                <thead>
                  <tr className="bg-teal-200/90">
                    <th className="px-2 py-2 border-2 whitespace-nowrap">Sl.no</th>
                    <th className="px-2 py-2 border-2 whitespace-nowrap">Files</th>
                    <th className="px-2 py-2 border-2 whitespace-nowrap">Description</th>
                    <th className="px-2 py-2 border-2 whitespace-nowrap">Status</th>
                    <th className="px-2 py-2 border-2 whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.response?.length === 0 ? (
                    <tr className="bg-white">
                      <td colSpan="5" className="px-2 py-2 text-center">
                        No responses found
                      </td>
                    </tr>
                  ) : (
                    data?.response.map((response, index) => (
                      <tr key={response.id} className="bg-white">
                        <td className="px-2 py-2 border-2">{index + 1}</td>
                        <td className="px-2 py-2 border-2">
                          {response?.files?.length ? (
                            response.files.map((file) => (
                              <a
                                key={file.id}
                                href={`${import.meta.env.VITE_BASE_URL}/api/RFQ/rfq/${data.id}/${file.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline hover:text-blue-800 transition block"
                              >
                                {file.originalName || "Unnamed File"}
                              </a>
                            ))
                          ) : (
                            <span className="text-gray-500">No files available</span>
                          )}
                        </td>
                        <td className="px-2 py-2 border-2">{response.description || "N/A"}</td>
                        <td className="px-2 py-2 border-2">{response.status || "N/A"}</td>
                        <td className="px-2 py-2 border-2">
                          <Button
                            onClick={() => setViewModalOpen(true)}
                            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-1 px-2 rounded"
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* {responseModal && (
          <ResponseRFQ onClose={handleResponseClose} rfqID={selectedRfqId} />
        )}
        {viewModalOpen && <ViewRFQResponse onClose={handleViewModalClose} />} */}
      </div>
    </div>
  );
};


export default GetRFQ;