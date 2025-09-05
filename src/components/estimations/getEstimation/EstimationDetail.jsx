/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Service from "../../../config/Service";
import LineItemTable from "./LineItemTable";
import RFQInfo from "./RFQInfo";

const EstimationDetail = ({ estimationId }) => {
  const [estimation, setEstimation] = useState(null);

  const getEstimation = async () => {
    try {
      const data = await Service.getEstimationById(estimationId);
      setEstimation(data);
    } catch (error) {
      console.error("Error fetching estimation:", error);
    }
  };

  console.log("Estimation Detail Data:", estimation);

  useEffect(() => {
    if (estimationId) {
      getEstimation();
    }
  }, [estimationId]);

  if (!estimation) return <div>Loading estimation...</div>;

  return (
    <div className="p-4 h-[80vh] overflow-y-auto bg-white rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-teal-700">Estimation Detail</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <strong>Estimation Number:</strong> {estimation.estimationNumber}
        </div>
        <div>
          <strong>Project Name:</strong> {estimation.projectName}
        </div>
        <div>
          <strong>Tools Used:</strong> {estimation.tools}
        </div>
        <div>
          <strong>Status:</strong> {estimation.status}
        </div>
        <div>
          <strong>Estimate Date:</strong>{" "}
          {new Date(estimation.estimateDate).toLocaleDateString()}
        </div>
        {estimation.finalHours && (
          <div>
            <strong>Final Hours:</strong> {estimation.finalHours}
          </div>
        )}
        {estimation.finalPrice && (
          <div>
            <strong>Final Price:</strong> {estimation.finalPrice}
          </div>
        )}
        {estimation.finalWeeks && (
          <div>
            <strong>Final Weeks:</strong> {estimation.finalWeeks}
          </div>
        )}
      </div>
      <div className="flex">
        <strong>Estimation Detail:</strong>{" "}
        <div
          className="w-full  whitespace-normal text-right sm:text-left"
          dangerouslySetInnerHTML={{ __html: estimation.description || "N/A" }}
        />
      </div>
      <div>
        <strong>Files:</strong>

        {estimation?.files?.length ? (
          estimation.files.map((file) => (
            <a
              key={file.id}
              href={`${import.meta.env.VITE_BASE_URL}/api/RFQ/rfq/${
                estimation.rfqId
              }/${file.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 underline hover:text-blue-800"
            >
              {file.originalName || "Unnamed File"}
            </a>
          ))
        ) : (
          <span className="text-gray-400 text-sm">No files attached</span>
        )}
      </div>

      <div className="mt-4">
        <h3 className="font-semibold text-lg mb-2">Fabricator</h3>
        {estimation.fabricators ? (
          <div className="text-sm space-y-1">
            <div>
              <strong>Name:</strong> {estimation.fabricators.fabName}
            </div>
            <div>
              <strong>Website:</strong>{" "}
              <a
                href={estimation.fabricators.website}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                {estimation.fabricators.website}
              </a>
            </div>
          </div>
        ) : (
          <div className="text-sm">No fabricator information.</div>
        )}
      </div>

      <div className="mt-4">
        <RFQInfo data={estimation.rfq} />
      </div>

      <div className="mt-4">
        <h3 className="font-semibold text-lg mb-2">Created By</h3>
        <div className="text-sm space-y-1">
          <div>
            <strong>Name:</strong> {estimation.createdBy?.f_name}{" "}
            {estimation.createdBy?.l_name}
          </div>
          <div>
            <strong>Email:</strong> {estimation.createdBy?.email}
          </div>
          <div>
            <strong>Username:</strong> {estimation.createdBy?.username}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <LineItemTable items={estimation.lineItems} />
      </div>
    </div>
  );
};

export default EstimationDetail;
