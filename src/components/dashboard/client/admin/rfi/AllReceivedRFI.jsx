/* eslint-disable no-unused-vars */
import React from "react";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import Service from "../../../../../config/Service";
import Button from "../../../../fields/Button";
import GetSentRFI from "./GetSentRFI";


const AllReceivedRFI = () => {
  const [RFI, setRFI] = useState([]);
  const [selectedRFI, setSelectedRFI] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchREceivedRfi = async () => {
    try {
      const rfi = await Service.inboxRFI();
      console.log(rfi);
      if (rfi) {
        setRFI(rfi.data);
      } else {
        console.log("RFI not found");
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchREceivedRfi();
  }, [])

  const handleViewClick = async (fabricatorId) => {

    setSelectedRFI(fabricatorId)
    setIsModalOpen(true)
  }

  console.log(selectedRFI)

  const handleModalClose = async () => {
    setSelectedRFI(null)
    setIsModalOpen(false)
  }


  return (
    <div className="bg-white/70 rounded-lg md:w-full w-[90vw]">
      <div className="h-auto p-4 mt-5">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-center border-collapse md:text-lg rounded-xl">
            <thead>
              <tr className="bg-teal-200/70">
                <th className="px-2 py-1">S.No</th>
                <th className="px-2 py-1">Project Name</th>
                <th className="px-2 py-1">Mail ID</th>
                <th className="px-2 py-1">Subject/Remarks</th>
                <th className="px-2 py-1">Date</th>
                <th className="px-2 py-1">RFI Status</th>
                {/* <th className="px-2 py-1">RFI Forward</th> */}
                <th className="px-2 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {RFI?.length === 0 ? (
                <tr className="bg-white">
                  <td colSpan="9" className="text-center">
                    No received RFI Found
                  </td>
                </tr>
              ) : (
                RFI?.map((rfi, index) => (
                  <tr key={rfi?.id} className="border hover:bg-blue-gray-100">
                    <td className="px-2 py-1 text-left border">{index + 1}</td>

                    <td className="px-2 py-1 border">
                      {rfi?.project.name || "N/A"}
                    </td>
                    <td className="px-2 py-1 border">
                      {rfi?.recepients.email || "N/A"}
                    </td>
                    <td className="px-2 py-1 border">
                      {rfi?.subject || "No remarks"}
                    </td>
                    <td className="px-2 py-1 border">
                      {new Date(rfi?.date).toDateString() || "N/A"}
                    </td>
                    <td className="px-2 py-1 border">
                      {rfi?.rfiresponse === null ? "No Reply" : "Replied"}
                    </td>
                    {/* <td className="px-2 py-1 border">
                      <button className="px-2 py-1 bg-teal-300 rounded">
                        Forward
                      </button>
                    </td> */}
                    <td className="px-2 py-1 border">
                      <Button onClick={() => handleViewClick(rfi.id)}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {selectedRFI && (
          <GetSentRFI
            rfiId={selectedRFI}
            isOpen={isModalOpen}
            onClose={handleModalClose}
          />
        )}
      </div>
    </div>
  );
};

export default AllReceivedRFI;
