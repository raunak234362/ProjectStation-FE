/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useForm } from "react-hook-form";
import Button from "../fields/Button";
import MultipleFileUpload from "../fields/MultipleFileUpload";
import Input from "../fields/Input";
import { useCallback, useEffect, useState } from "react";
import Service from "../../config/Service";
import { toast } from "react-toastify";
import { CustomSelect } from "..";
import { X } from "lucide-react";
import UpdateResponseDetail from "./responses/UpdateResponseDetail";
import UpdateResponseSend from "./responses/UpdateResponseSend";
import ResponseFromClient from "./responses/ResponseFromClient";

const UpdateStatus = ({ rfqID, rfqResponseId, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rfqResponseDetails, setRfqResponseDetails] = useState(null);
  const [files, setFiles] = useState([]);

  const rfqId = rfqID;
  const fetchRFQresponseDetails = useCallback(async () => {
    try {
      const response = await Service.fetchRFQOfResponseById(rfqResponseId);
      setRfqResponseDetails(response);
    } catch (error) {
      console.error("Error fetching RFQ response details:", error);
      toast.error("Failed to fetch RFQ response details.");
    }
  }, [rfqResponseId]);

  useEffect(() => {
    if (rfqID) {
      fetchRFQresponseDetails();
    }
  }, [rfqID, fetchRFQresponseDetails]);

  const handleViewModal = () => {
    onClose();
  };
  const responseId = rfqResponseId;

  console.log("RFQ  ID:", rfqId);
  console.log("RFQ  Response ID:", responseId);
  const userType = sessionStorage.getItem("userType");
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black bg-opacity-60">
        <div className="relative space-y-4 bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto p-6 sm:w-[90%] md:w-[70%] h-auto">
          <div className="sticky top-0 z-10 flex justify-between items-center p-2 bg-gradient-to-r from-teal-400 to-teal-100 border-b rounded-md">
            <div className="text-lg text-white">
              <span className="font-bold">Recieved On:</span>{" "}
              {rfqResponseDetails?.createdAt
                ? (() => {
                    const date = new Date(rfqResponseDetails.createdAt);
                    const mm = String(date.getMonth() + 1).padStart(2, "0");
                    const dd = String(date.getDate()).padStart(2, "0");
                    const yyyy = date.getFullYear();
                    const hh = String(date.getHours()).padStart(2, "0");
                    const min = String(date.getMinutes()).padStart(2, "0");
                    return `${mm}:${dd}:${yyyy} ${hh}:${min}`;
                  })()
                : ""}
            </div>
            <button
              className="p-2 text-gray-800 transition-colors bg-gray-200 rounded-full hover:bg-gray-300"
              onClick={handleViewModal}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div>
            <UpdateResponseDetail responseDetail={rfqResponseDetails} />
          </div>
          {userType === "client" ? (
            <div>
              <UpdateResponseSend
                rfqID={rfqId}
                responseId={responseId}
                onClose={onClose}
              />
            </div>
          ) : (
            <div>
              <ResponseFromClient responseDetail={rfqResponseDetails} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UpdateStatus;
