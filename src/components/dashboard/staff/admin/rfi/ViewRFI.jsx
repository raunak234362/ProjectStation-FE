import React, {useState, useEffect} from 'react'
import { Button } from "../../../../index";
import Service from "../../../../../config/Service";
import api from "../../../../../config/api";
import { useSelector } from "react-redux";
import { use } from 'react';


const ViewRFI = ({ onClose, rfiId }) => {
  //   console.log(rfiId, "iddddddddddddddd");
  const [rfi, setRFI] = useState();

  const handleClose = async () => {
    onClose(true);
  };
  //route here->RFI/rfi/addResponse/${rfiId}-post
  //route here->RFI/rfi/getResponse/${rfiId}-get

  const fetchRFI = async () => {
    try {
      const rfi = await api.get(`/api/rfi/rfi/${rfiId}`);
      console.log(rfi);
      if (rfi) {
        setRFI(rfi.data.data);
      } else {
        console.log("RFI not found");
      }
    } catch (error) {
      console.log("Error fetching RFI:", error);
    }
  };
    //rfiresponseID
    const [response, setResponse] = useState(null);
    const fetchRFIResponse = async () => {
        try {
            const response = await Service.getSentRFIResponse(rfiId);
            console.log("Response data", response);
            setResponse(response.data);
        } catch (error) {
            console.error("Error fetching response", error);
        }
    };
    console.log("response", response);
    useEffect(() => {
        fetchRFIResponse();
    }, [rfiId]);

    
console.log(rfi, "rrrrrrrrrrrrrrrrfi");
  const fabricatorData = useSelector((state) =>
    state.fabricatorData.fabricatorData.find(
      (fab) => fab.id === rfi?.fabricator_id
    )
  );
   const clientData = useSelector((state) =>
     state.fabricatorData.clientData.find(
       (client) => client.id === rfi?.recepient_id
     )
   );
    console.log("clientData", clientData);
    console.log("fabricatorData", fabricatorData);
  useEffect(() => {
    fetchRFI();
  }, [rfiId]);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white h-[80%] md:p-5 rounded-lg shadow-lg w-11/12 max-w-4xl">
          <div className="self-end">
            <Button className="bg-red-500" onClick={handleClose}>
              Close
            </Button>
          </div>
          <h2 className="w-full px-2 py-2 m-5 text-xl font-bold text-center text-white bg-teal-400 rounded-lg">
            RFI Details
          </h2>
          <div className="p-5 h-[88%] overflow-y-auto rounded-lg shadow-lg">
            <div className="p-5 rounded-lg shadow-md bg-gray-100/50">
              <h2 className="mb-4 text-lg font-semibold">Client Details</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {[
                  { label: "Client Name", value: rfi?.recepients.f_name },
                  { label: "Email", value: rfi?.recepients.email },
                  {
                    label: "Fabricator",
                    value: rfi?.recepients?.fabricator?.fabName,
                  },
                  {
                    label: "Branch Address",
                    value: rfi?.recepients?.fabricator?.headquaters?.address,
                  },
                  { label: "Country", value: rfi?.recepients?.country },
                  { label: "State", value: rfi?.recepients?.state },
                  { label: "City", value: rfi?.recepients?.city },
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

            <div className="p-5 mt-5 rounded-lg shadow-md bg-gray-100/50">
              <h2 className="mb-4 text-lg font-semibold">RFI Information</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {[
                  { label: "Subject", value: rfi?.subject },
                  { label: "Description", value: rfi?.description },
                  { label: "Date", value: rfi?.date },
                  {
                    label: "Status",
                    value: rfi?.status ? "No Reply" : "Replied",
                                  },
                  //need to see
                  {
                    label: "Files",
                    value: Array.isArray(rfi?.files)
                      ? rfi?.files?.map((file, index) => (
                          <a
                            key={index}
                            href={`${
                              import.meta.env.VITE_BASE_URL
                            }/api/RFI/rfi/viewfile/${rfiId}/${file.id}`} // Use the file path with baseURL
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
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewRFI