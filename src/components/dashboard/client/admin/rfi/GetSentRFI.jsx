/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Input, MultipleFileUpload, Toggle } from "../../../../index";
import Service from "../../../../../config/Service";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";


const GetSentRFI = ({ rfiId, data, isOpen, onClose }) => {
  const [rfi, setRFI] = useState();
  const [submit, setSubmit] = useState(false);
  const [fileData, setFileData] = useState([]);
  const RFI = useSelector((state) => state?.projectData?.rfiData);
  const {
    register,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm();
console.log(data)
  const [, setFiles] = useState([]);
  const fetchReceivedRfi = async () => {
    try {
      const rfi = await Service.fetchRFIById(data);
      console.log(rfi);
      if (rfi) {
        setRFI(rfi.data);
      } else {
        console.log("RFI not found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRFI = async () => {
    try {
      const rfi = RFI.find((rfi) => rfi.id === rfiId);
      if (rfi) {
        setRFI(rfi);
      } else {
        console.log("RFI not found");
      }
    } catch (error) {
      console.log("Error fetching RFI:", error);
    }
  };

  const handleClose = async () => {
    onClose(true);
  };

  const [response, setResponse] = useState("COMPLETE");

  // const handleResponse = () => {
  //   setResponse(true)
  //   console.log("responded")
  // }

  useEffect(() => {
    fetchReceivedRfi();
    fetchRFI();
  }, [rfiId]);

  const handleResponseChange = (e) => {
    setResponse(e.target.value);
  };

  const onFilesChange = (files) => {
    setFileData(files);
  };

  const onSubmit = async (data) => {
    if (fileData.length === 0) {
      toast.error("Please select at least one file.");
      return;
    }

    const formData = new FormData();
    formData.append("reason", data.description || "");
    formData.append("responseState", response || "");

    fileData.forEach((file) => {
      formData.append("files", file);
    });

    try {
      setSubmit(true);
      await Service.respondRFI(rfiId, formData);
      toast.success("RFI sent successfully");
      setSubmit(false);
      handleClose();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload files. Please try again.");
      setSubmit(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white h-[60%] md:p-5 rounded-lg shadow-lg w-11/12 max-w-4xl">
        <div className="flex flex-row justify-between">
          <Button className="bg-red-500" onClick={handleClose}>
            Close
          </Button>
        </div>
        <div></div>
        {/* header */}
        <div className="z-10 flex justify-center w-full top-2">
          <div className="mt-2">
            <div className="px-3 py-2 font-bold text-white bg-teal-400 rounded-lg shadow-md md:px-4 md:text-2xl">
              Subject/Remarks: {rfi?.subject || "Unknown"}
            </div>
          </div>
        </div>

        <div className="p-5 h-[80%] overflow-y-auto rounded-lg shadow-lg">
          <div className="p-5 mt-5 rounded-lg shadow-md bg-gray-100/50">
            <h2 className="mb-4 text-lg font-semibold">RFI Information</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[
                { label: "Subject", value: rfi?.subject },
                { label: "Description", value: rfi?.description },
                {
                  label: "Date",
                  value: rfi?.date
                    ? new Date(rfi?.date).toDateString()
                    : "Not available",
                },
                // { label: "Status", value: rfi?.status === "seen" ? "Seen" : "Not Seen" },
                {
                  label: "Files",
                  value: Array.isArray(rfi?.files)
                    ? rfi?.files?.map((file, index) => (
                        <a
                          key={index}
                          href={`${
                            import.meta.env.VITE_BASE_URL
                          }/api/RFI/rfi/viewfile/${rfi.id}/${file.id}`} // Use the file path with baseURL
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
          {rfi?.rfiresponse === null ? (
            <form
              className="w-full p-5 mt-5 rounded-lg shadow-md bg-gray-100/50"
              onSubmit={handleSubmit(onSubmit)}
            >
              <h2 className="pb-2 mb-6 text-2xl font-extrabold text-teal-600 border-b border-teal-300">
                Respond to RFI
              </h2>

              {/* Status Section */}
              {/* <div className="w-full mb-2 border-b border-gray-300">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="w-full mb-4">
                  <RadioGroup
                    row
                    aria-labelledby="status-radio-buttons-label"
                    name="status"
                    value={response}
                    onChange={handleResponseChange}
                  >
                    <FormControlLabel
                      value="PARTIAL"
                      control={<Radio />}
                      label="Partial Response"
                      name="response"
                    />
                    <FormControlLabel
                      value="COMPLETE"
                      control={<Radio />}
                      label="Complete Response"
                      name="response"
                    />
                  </RadioGroup>
                </div>
              </div> */}

              {/* Description Section */}
              <div className="w-full mb-4 border-b border-gray-300">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Description
                </label>
                <Input
                  type="textarea"
                  label="Description:"
                  // placeholder="Please enter the reason (optional)"
                  className="w-full mb-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-teal-400"
                  rows={2}
                  {...register("description")}
                />
              </div>

              {/* Attach Files Section */}
              <div className="w-full mb-4 border-b border-gray-300">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Attach Files
                </label>
                <MultipleFileUpload
                  label="Select Files"
                  onFilesChange={onFilesChange}
                  files={fileData}
                  accept="image/*,application/pdf,.pdf,.pptx,.txt,.doc,.docx"
                  {...register("files")}
                />
                {errors.files && (
                  <div className="text-red-500">This field is required</div>
                )}
              </div>

              {/* Submit Button */}
              <div className="w-full mt-4">
                <Button type="submit" className="">
                  Send Message
                </Button>
              </div>
            </form>
          ) : (
            <div className="p-5 mt-5 rounded-lg shadow-md bg-gray-100/50">
              <h2 className="mb-4 text-lg font-semibold">
                RFI Response Information
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {[
                  { label: "Reason", value: rfi?.rfiresponse?.reason },
                  {
                    label: "Response State",
                    value: rfi?.rfiresponse?.responseState,
                  },
                  {
                    label: "Date of Response",
                    value: rfi?.rfiresponse?.createdAt
                      ? new Date(rfi?.rfiresponse?.createdAt).toLocaleString()
                      : "Not available",
                  },
                  // { label: "Status", value: rfi?.status === "seen" ? "Seen" : "Not Seen" },
                  {
                    label: "Files",
                    value: Array.isArray(rfi?.rfiresponse?.files)
                      ? rfi?.rfiresponse?.files?.map((file, index) => (
                          <a
                            key={index}
                            href={`${
                              import.meta.env.VITE_BASE_URL
                            }/api/RFI/rfi/viewfile/${rfi?.rfiresponse?.id}/${
                              file.id
                            }`} // Use the file path with baseURL
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
          )}
        </div>
      </div>
    </div>
  );
};

export default GetSentRFI;
