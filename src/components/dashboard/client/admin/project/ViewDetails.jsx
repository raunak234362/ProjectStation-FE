/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { AiOutlineCloseSquare } from "react-icons/ai";
import Button from "../../../../fields/Button";
import Service from "../../../../../config/Service";
import { useEffect } from "react";
import AllReceivedRFI from "../rfi/AllReceivedRFI";
import ProjectDetails from "./ProjectDetails";
import AllSubmittalls from "../submittals/AllReceivedSubmittals.jsx";
import AllCO from "../co/AllCO";
import RFIProject from "./RFIProject.jsx";
import COProject from "./COProject.jsx";
import SubmittalsProject from "./SubmittalsProject.jsx";
import { X } from "lucide-react";

const ViewDetails = ({ data, onClose }) => {
  const [project, setProject] = useState([]);
  const [activeTab, setActiveTab] = useState("projectDetails");
  const [selectedProject, setSelectedProject] = useState(null)
 const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }
  const handleClose = () => {
    onClose();
  };
  const id = data;
  console.log(id);
  const fetchproject = async () => {
    const response = await Service.fetchProjectByID(id);
    setProject(response.data);
    console.log(response.data);
  };

  useEffect(() => {
    fetchproject();
  }, [id]);

  return (
    <>
      <div className="absolute top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50">
        <div className="bg-white md:h-[80vh] h-screen w-screen md:w-[80%] overflow-y-auto rounded-2xl">
          <div className="sticky top-0 z-10 flex px-3 flex-col items-start justify-between py-2 bg-white border-b md:flex-row md:items-center">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:mb-0">
              <div className="px-4 py-2 text-lg font-bold text-white rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-blue-800 md:px-5 md:py-3 md:text-xl">
                {project?.name || "Unknown Project"}
              </div>
              <span className="text-xs text-gray-500 md:text-sm">
                {formatDate(project?.startDate)} - {formatDate(project?.endDate)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="p-2 text-gray-800 transition-colors bg-gray-200 rounded-full hover:bg-gray-300"
                onClick={onClose}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex gap-5 p-2 m-1 text-gray-600 border-b-2">
            <div
              onClick={() => setActiveTab("projectDetails")}
              className={`cursor-pointer ${activeTab === "projectDetails"
                  ? "border-b-2 border-teal-600 font-bold text-teal-600"
                  : ""
                }`}
            >
              Project Details
            </div>
            <div
              onClick={() => setActiveTab("team")}
              className={`cursor-pointer ${activeTab === "team"
                  ? "border-b-2 border-teal-600 font-bold text-teal-600"
                  : ""
                }`}
            >
              Team Members
            </div>
            <div
              onClick={() => setActiveTab("RFI")}
              className={`cursor-pointer ${activeTab === "RFI"
                  ? "border-b-2 border-teal-600 font-bold text-teal-600"
                  : ""
                }`}
            >
              RFI
            </div>
            <div
              onClick={() => setActiveTab("submittals")}
              className={`cursor-pointer ${activeTab === "submittals"
                  ? "border-b-2 border-teal-600 font-bold text-teal-600"
                  : ""
                }`}
              style={{
                borderBottom:
                  activeTab === "submittals" ? "2px solid teal" : "none",
              }}
            >
              Submittals
            </div>
            <div
              onClick={() => setActiveTab("co")}
              className={`cursor-pointer ${activeTab === "co"
                  ? "border-b-2 border-teal-600 font-bold text-teal-600"
                  : ""
                }`}
            >
              Change Order
            </div>
          </div>
          {activeTab === "projectDetails" && (
            <ProjectDetails data={id} className="overflow-y-auto h-[60vh]" />
          )}
          {activeTab === "RFI" && <RFIProject project={project} />}
          {activeTab === "submittals" && (
            <SubmittalsProject project={project} />
          )}
          {activeTab === "co" && <COProject project={project} />}
          {activeTab === "team" && (
            <div className="p-5 overflow-y-auto h-[60vh]">
              {/* <h2 className="p-5 text-2xl font-bold">Team Members</h2> */}
              <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
                {project?.team?.members?.map((member) => (
                  <div
                    key={member._id}
                    className="p-4 transition-shadow duration-300 bg-gray-100 rounded-lg shadow-md hover:shadow-lg"
                  >
                    <h3 className="font-bold">
                      {member.f_name} {member.l_name}
                    </h3>
                    <p className="text-sm text-gray-700">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewDetails;
