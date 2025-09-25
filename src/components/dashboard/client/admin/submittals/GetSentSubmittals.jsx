/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "../../../../index";
import Service from "../../../../../config/Service";
import ResponseSubmitals from "./ResponseSubmitals";

const GetSentSubmittals = ({ submittalId, isOpen, onClose, userRole = "client" }) => {
  const [submittal, setSubmittal] = useState(null);
  const [response, setResponse] = useState(null);
  const [showClientDetails, setShowClientDetails] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redux selectors for admin
  const fabricatorData = useSelector((state) =>
    userRole === "admin" && submittal?.fabricator_id
      ? state.fabricatorData?.fabricatorData?.find((fab) => fab.id === submittal.fabricator_id)
      : null
  );
  const clientData = useSelector((state) =>
    userRole === "admin" && submittal?.recepient_id
      ? state.fabricatorData?.clientData?.find((client) => client.id === submittal.recepient_id)
      : null
  );

  // Fetch submittal data
  const fetchSubmittal = async () => {
    if (!submittalId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await Service.getSubmittal(submittalId);
      if (!response.ok) throw new Error(`Failed to fetch submittal: ${response.status}`);
      const data = await response.json();
      console.log("Fetched Submittal:", data);
      setSubmittal(data.data || data); // Handle nested data or flat response
    } catch (err) {
      setError("Failed to load submittal data");
      console.error("Error fetching submittal:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch submittal response (admin only)
  const fetchSubmittalResponse = async (responseId) => {
    if (!responseId || userRole !== "admin") return;
    try {
      const responseData = await Service.fetchSubmittalResponse(responseId);
      if (!responseData.ok) throw new Error(`Failed to fetch response: ${responseData.status}`);
      const data = await responseData.json();
      console.log("Fetched Submittal Response:", data);
      setResponse(data.data || data);
    } catch (err) {
      console.error("Error fetching submittal response:", err);
    }
  };

  useEffect(() => {
    if (isOpen && submittalId) {
      fetchSubmittal();
    }
  }, [submittalId, isOpen]);

  useEffect(() => {
    if (submittal?.submittalsResponse?.id && userRole === "admin") {
      fetchSubmittalResponse(submittal.submittalsResponse.id);
    }
  }, [submittal, userRole]);

  const handleClose = () => {
    onClose(true);
    setShowResponseModal(false);
  };

  const toggleClientDetails = () => {
    setShowClientDetails((prev) => !prev);
  };

  const handleResponseClick = () => {
    setShowResponseModal(true);
  };

  // Helper to render data fields
  const renderField = (label, value) => (
    <div key={label} className="flex flex-col">
      <span className="font-medium text-gray-700">{label}:</span>
      <span className="text-gray-600">{value || "Not available"}</span>
    </div>
  );

  // File download URL based on role
  const getFileUrl = (file, submittalId, responseId = null) => {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    if (userRole === "admin") {
      return responseId
        ? `${baseUrl.replace(/\/$/, "")}/api/submittalsResponse/${responseId}/${file.id}`
        : `${baseUrl.replace(/\/$/, "")}/api/submittals/submittals/${submittalId}/${file.id}`;
    }
    return `${baseUrl}/api/RFi/rfi/${responseId || submittalId}/${file.id}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white h-[80%] md:p-5 rounded-lg shadow-lg w-11/12 max-w-4xl">
        {/* Header */}
        <div className="flex flex-row justify-between p-4">
          <div className="flex justify-center w-full">
            <div className="px-3 py-2 font-bold text-white bg-teal-400 rounded-lg shadow-md md:px-4 md:text-2xl">
              Subject/Remarks: {submittal?.remarks || "Unknown"}
            </div>
          </div>
          <Button className="bg-red-500 text-white" onClick={handleClose}>
            Close
          </Button>
        </div>

        {/* Content */}
        <div className="p-5 h-[calc(100%-4rem)] overflow-y-auto">
          {loading && (
            <div className="p-4 bg-blue-50 text-blue-700 rounded-lg text-center">
              Loading submittal data...
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg text-center">
              {error}
            </div>
          )}
          {!loading && !error && submittal && (
            <>
              {/* Client Details (Admin Only) */}
              {userRole === "admin" && (
                <div className="p-5 rounded-lg shadow-md bg-gray-100/50">
                  <h2 className="mb-4 text-lg font-semibold flex items-center">
                    Client Details
                    <span
                      className="pl-5 text-sm font-semibold text-gray-700 cursor-pointer"
                      onClick={toggleClientDetails}
                    >
                      {showClientDetails ? "Hide" : "Show"} client details
                    </span>
                  </h2>
                  {showClientDetails && (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {[
                        { label: "Client Name", value: clientData?.f_name },
                        { label: "Email", value: clientData?.email },
                        { label: "Fabricator", value: fabricatorData?.fabName },
                        { label: "Branch Address", value: fabricatorData?.headquaters?.address },
                        { label: "Country", value: fabricatorData?.headquaters?.country },
                        { label: "State", value: fabricatorData?.headquaters?.state },
                        { label: "City", value: fabricatorData?.headquaters?.city },
                      ].map(({ label, value }) => renderField(label, value))}
                    </div>
                  )}
                </div>
              )}

              {/* Submittal Information */}
              <div className="p-5 mt-5 rounded-lg shadow-md bg-gray-100/50">
                <h2 className="mb-4 text-lg font-semibold">Submittal Information</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {[
                    { label: "Subject", value: submittal?.subject },
                    { label: "Description", value: submittal?.description },
                    {
                      label: "Date",
                      value: submittal?.date
                        ? new Date(submittal.date).toLocaleDateString()
                        : null,
                    },
                    {
                      label: "Status",
                      value: submittal?.submittalsResponse ? "Replied" : "Not Replied",
                    },
                    {
                      label: "Files",
                      value: Array.isArray(submittal?.files) && submittal.files.length ? (
                        submittal.files.map((file) => (
                          <a
                            key={file.id}
                            href={getFileUrl(file, submittal.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            <div>{file.originalName || `File ${file.id}`}</div>
                          </a>
                        ))
                      ) : (
                        "No files attached"
                      ),
                    },
                    { label: "Stage", value: submittal?.Stage || submittal?.stage },
                  ].map(({ label, value }) => renderField(label, value))}
                </div>
              </div>

              {/* Submittal Response */}
              {(submittal?.submittalsResponse || userRole === "client") && (
                <div className="p-5 mt-5 rounded-lg shadow-md bg-gray-100/50">
                  <h2 className="mb-4 text-lg font-semibold">Submittal Response</h2>
                  {submittal?.submittalsResponse ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {[
                        {
                          label: "Date of Response",
                          value: userRole === "admin" && response?.respondedAt
                            ? new Date(response.respondedAt).toLocaleString()
                            : submittal.submittalsResponse?.createdAt
                            ? new Date(submittal.submittalsResponse.createdAt).toLocaleString()
                            : null,
                        },
                        {
                          label: "Status",
                          value: userRole === "admin"
                            ? response?.status
                            : submittal.submittalsResponse?.status,
                        },
                        {
                          label: "Reason",
                          value: userRole === "admin"
                            ? response?.reason
                            : submittal.submittalsResponse?.reason,
                        },
                        {
                          label: "Files",
                          value: (userRole === "admin" ? response?.files : submittal.submittalsResponse?.files)?.length ? (
                            (userRole === "admin" ? response.files : submittal.submittalsResponse.files).map((file) => (
                              <a
                                key={file.id}
                                href={getFileUrl(file, submittal.id, submittal.submittalsResponse.id)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                <div>{file.originalName || `File ${file.id}`}</div>
                              </a>
                            ))
                          ) : (
                            "No files attached"
                          ),
                        },
                      ].map(({ label, value }) => renderField(label, value))}
                    </div>
                  ) : (
                    userRole === "client" && (
                      <Button className="mt-2 bg-teal-500 text-white" onClick={handleResponseClick}>
                        Respond
                      </Button>
                    )
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Response Modal (Client Only) */}
        {userRole === "client" && !submittal?.submittalsResponse && showResponseModal && (
          <ResponseSubmitals submittalsID={submittal?.id} onClose={handleClose} />
        )}
      </div>
    </div>
  );
};

export default GetSentSubmittals;