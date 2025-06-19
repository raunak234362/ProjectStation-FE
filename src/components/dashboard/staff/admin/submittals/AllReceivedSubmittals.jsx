import React, { useEffect, useState } from "react";
import Service from "../../../../../config/Service";
import Button from "../../../../fields/Button";
import GetSentSubmittals from "./GetSentSubmittals";

const AllReceivedSubmittals = () => {
  const [submittals, setSubmittals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubmittals, setSelectedSubmittals] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await Service.reciviedSubmittal();
        setSubmittals(response.data);
        console.log("Submittals:", response.data);
      } catch (error) {
        console.error("Failed to fetch submittals:", error);
      }
    })();
  }, []);

  const handleViewClick = (data) => {
    console.log("View button clicked for:", data);
    setSelectedSubmittals(data);
    console.log("Selected Submittal ID:", selectedSubmittals);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedSubmittals(null);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white/70 rounded-lg md:w-full w-[90vw]">
      <div className="h-auto p-4 mt-5">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-center border-collapse md:text-lg rounded-xl">
            <thead>
              <tr className="bg-teal-200/70">
                <th scope="col" className="px-2 py-1 text-left">
                  Fabricator Name
                </th>
                <th scope="col" className="px-2 py-1 text-left">
                  Project Name
                </th>
                <th scope="col" className="px-2 py-1">
                  Subject/Remarks
                </th>
                <th scope="col" className="px-2 py-1">
                  Recipients
                </th>
                <th scope="col" className="px-2 py-1">
                  Date
                </th>
                <th scope="col" className="px-2 py-1">
                  RFI Status
                </th>
                <th scope="col" className="px-2 py-1">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {submittals.length === 0 ? (
                <tr className="bg-white">
                  <td colSpan="7" className="text-center">
                    No sent RFI Found
                  </td>
                </tr>
              ) : (
                submittals.map((project) => (
                  <tr
                    key={project.id}
                    className="border hover:bg-blue-gray-100"
                  >
                    <td className="px-2 py-1 text-left border">
                      {project.fabricator?.fabName}
                    </td>
                    <td className="px-2 py-1 border">{project.project.name}</td>
                    <td className="px-2 py-1 border">{project.subject}</td>
                    <td className="px-2 py-1 border">
                      {project.sender.username}
                    </td>
                    <td className="px-2 py-1 border">
                      {new Date(project.date).toLocaleDateString()}
                    </td>
                    <td className="px-2 py-1 border">Open</td>
                    <td className="px-2 py-1 border">
                      <Button onClick={() => handleViewClick(project)}>
                        View
                      </Button>
                      {isModalOpen && (
                        <GetSentSubmittals
                          data={project.id}
                          onClose={handleModalClose}
                        />
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllReceivedSubmittals;
