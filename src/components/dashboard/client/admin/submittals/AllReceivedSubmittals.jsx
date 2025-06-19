/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Service from "../../../../../config/Service";
import GetSentSubmittals from "../../../client/admin/submittals/GetSentSubmittals";
import Button from "../../../../fields/Button";

const AllReceivedSubmittals = () => {
  const [submittals, setSubmittals] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedSubmittal, setSelectedSubmittal] = useState(null);
  const handleViewClick = (submittal) => {
    setSelectedSubmittal(submittal);
    setResponse(true);
  };

  const handleModalClose = async () => {
    setSelectedSubmittal(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    (async () => {
      const response = await Service.reciviedSubmittal();
      setSubmittals(response.data);
    })();
  }, []);

  console.log("submiIIIIIIIIIIIIIIIIIIIIIIIttals", submittals);

  return (
    <div className="bg-white/70 rounded-lg md:w-full w-[90vw]">
      <div className="h-auto p-4 mt-5">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-center border-collapse md:text-lg rounded-xl">
            <thead>
              <tr className="bg-teal-200/70">
                <th className="px-2 py-1 border">Project Name</th>
                <th className="px-2 py-1 border">Subject/Remarks</th>
                <th className="px-2 py-1 border">Recipients</th>
                <th className="px-2 py-1 border">Date</th>
                <th className="px-2 py-1 border">RFI Status</th>
                <th className="px-2 py-1 border">Stage</th>
                <th className="px-2 py-1 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submittals?.length === 0 ? (
                <tr className="bg-white">
                  <td colSpan="7" className="text-center">
                    No sent RFI Found
                  </td>
                </tr>
              ) : (
                submittals?.map((project) => (
                  <tr
                    key={project.id}
                    className="border hover:bg-blue-gray-100"
                  >
                    <td className="px-2 py-1 border">{project.project.name}</td>
                    <td className="px-2 py-1 border">{project.subject}</td>
                    <td className="px-2 py-1 border">
                      {project.sender.username}
                    </td>
                    <td className="px-2 py-1 border">
                      {new Date(project.date).toLocaleDateString()}
                    </td>
                    <td className="px-2 py-1 border">{project.Stage}</td>
                    <td className="px-2 py-1 border">
                      {project.submittalsResponse === null
                        ? "Not Replied"
                        : "Replied"}
                    </td>
                    <td className="px-2 py-1 border">
                      <Button onClick={() => handleViewClick(project)}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {/* Render modal outside the table */}
            {selectedSubmittal && (
              <GetSentSubmittals
                submittalId={selectedSubmittal.id}
                onClose={handleModalClose}
              />
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllReceivedSubmittals;
