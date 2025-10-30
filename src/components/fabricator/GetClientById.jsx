/* eslint-disable react/prop-types */

import { X } from "lucide-react";
import Service from "../../config/Service";
import { useEffect, useState } from "react";
import Button from "../fields/Button";

const GetClientById = ({ clientId, onClose }) => {
  const clientID = clientId || "";
  const [clientData, setClientData] = useState(null);
  const fetchClientById = async () => {
    try {
      const response = await Service.getClientById(clientID);
      setClientData(response.data);
    } catch (error) {
      console.error("Error fetching client by ID:", error);
      throw error;
    }
  };

  const handleDeleteClient = async () => {
    try {
      await Service.deleteClient(clientID);
      onClose();
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  useEffect(() => {
    fetchClientById();
  }, [clientID]);
  console.log("GetClientById component rendered with clientId:", clientId);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-5 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white h-[90%] md:h-[70%] overflow-y-hidden md:p-5 p-2 rounded-lg shadow-lg w-11/12 md:w-6/12 space-y-2 ">
        <div className="sticky top-0 z-10 flex flex-row items-center justify-between p-2 bg-gradient-to-r from-teal-400 to-teal-100 border-b rounded-md">
          <div className="text-lg font-semibold text-white">Client Detail</div>
          <button
            className="p-2 text-gray-800 transition-colors bg-gray-200 rounded-full hover:bg-gray-300"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-4 bg-gray-100/70 rounded-md text-lg">
          <span className="font-semibold">Name:</span> {clientData?.f_name}{" "}
          {clientData?.m_name} {clientData?.l_name} <br />
          <span className="font-semibold">Username:</span>{" "}
          {clientData?.username}
          <br />
          <span className="font-semibold">Email:</span>{" "}
          {clientData?.email || "N/A"} <br />
          <span className="font-semibold">Phone:</span>{" "}
          {clientData?.phone || "N/A"} <br />
          <span className="font-semibold">Landline:</span>{" "}
          {clientData?.landline || "N/A"} <br />
          <div className="">
            <span className="font-semibold">Location:</span>{" "}
            <div className="grid md:grid-cols-3 grid-cols-1 gap-1">
              <div>
                <span className="font-medium">City:</span>{" "}
                {clientData?.city || "N/A"} <br />{" "}
              </div>
              <div>
                <span className="font-medium">State:</span>{" "}
                {clientData?.state || "N/A"} <br />{" "}
              </div>
              <div>
                <span className="font-medium">Country:</span>{" "}
                {clientData?.country || "N/A"} <br />
              </div>
              <div>
                <span className="font-medium">Zip Code:</span>{" "}
                {clientData?.zip_code || "N/A"} <br />
              </div>
            </div>
          </div>
        </div>
        <div>
          <Button onClick={handleDeleteClient}>Delete Client</Button>
        </div>
      </div>
    </div>
  );
};

export default GetClientById;
