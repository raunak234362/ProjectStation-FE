/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useCallback } from "react";
import Button from "../fields/Button";
import { X } from "lucide-react";
import RFQDetail from "./RFQDetail";
import ResponseRFQ from "./ResponseRFQ";
// import ResponseRFQ from "./ResponseRFQ";
// import ViewRFQResponse from "./ViewRFQResponse";

const GetRFQ = ({ data, onClose, isOpen }) => {
  const userType = sessionStorage.getItem("userType");
  const [responseModal, setResponseModal] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRfqId, setSelectedRfqId] = useState(null);
  console.log("GetRFQ data:", data);
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
    <div className="fixed inset-0 bg-black bg-opacity-5 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white h-[90vh] overflow-y-auto p-4 md:p-6 rounded-lg shadow-lg w-11/12 md:w-10/12">
        <div className="sticky top-0 z-10 flex flex-row items-center justify-between p-2 bg-gradient-to-r from-teal-400 to-teal-100 border-b rounded-md">
          <div className="text-lg text-white">
            <span className="font-bold">Subject:</span> {data?.subject}
          </div>
          <button
            className="p-2 text-gray-800 transition-colors bg-gray-200 rounded-full hover:bg-gray-300"
            onClick={handleModalClose}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <section className={`mb-8 grid  gap-4 ${userType !== "client" ? "grid-cols-1 md:grid-cols-2" : ""}`}>
          <RFQDetail data={data} />
          {userType !== "client" ? (
            <ResponseRFQ onClose={handleResponseClose} rfqID={data.id} />
          ): (null)}
        </section>

        <section>
          <h3 className="px-3 py-2 mt-3 font-bold text-white bg-teal-400 rounded-lg shadow-md md:text-2xl">
            RFQ Responses
          </h3>
          <div className="p-5 rounded-lg shadow-inner bg-gray-50 min-h-[100px]">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-center text-gray-700 border-collapse rounded-xl">
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
                      Status
                    </th>
                    <th className="px-2 py-2 border-2 whitespace-nowrap">
                      Action
                    </th>
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
                                href={`${
                                  import.meta.env.VITE_BASE_URL
                                }/api/RFQ/rfq/${data.id}/${file.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline hover:text-blue-800 transition block"
                              >
                                {file.originalName || "Unnamed File"}
                              </a>
                            ))
                          ) : (
                            <span className="text-gray-500">
                              No files available
                            </span>
                          )}
                        </td>
                        <td className="px-2 py-2 border-2">
                          {response.description || "N/A"}
                        </td>
                        <td className="px-2 py-2 border-2">
                          {response.status || "N/A"}
                        </td>
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
