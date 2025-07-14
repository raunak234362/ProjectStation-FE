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

  const {
    estimationNumber,
    projectName,
    tools,
    status,
    estimateDate,
    finalHours,
    finalPrice,
    finalWeeks,
    fabricators,
    createdBy,
  } = estimation;

  return (
    <div className="p-4 h-[80vh] overflow-y-auto bg-white rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-teal-700">Estimation Detail</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <strong>Estimation Number:</strong> {estimationNumber}
        </div>
        <div>
          <strong>Project Name:</strong> {projectName}
        </div>
        <div>
          <strong>Tools Used:</strong> {tools}
        </div>
        <div>
          <strong>Status:</strong> {status}
        </div>
        <div>
          <strong>Estimate Date:</strong>{" "}
          {new Date(estimateDate).toLocaleDateString()}
        </div>
        {finalHours && (
          <div>
            <strong>Final Hours:</strong> {finalHours}
          </div>
        )}
        {finalPrice && (
          <div>
            <strong>Final Price:</strong> {finalPrice}
          </div>
        )}
        {finalWeeks && (
          <div>
            <strong>Final Weeks:</strong> {finalWeeks}
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className="font-semibold text-lg mb-2">Fabricator</h3>
        {fabricators ? (
          <div className="text-sm space-y-1">
            <div>
              <strong>Name:</strong> {fabricators.fabName}
            </div>
            <div>
              <strong>Website:</strong>{" "}
              <a
                href={fabricators.website}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                {fabricators.website}
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
            <strong>Name:</strong> {createdBy?.f_name} {createdBy?.l_name}
          </div>
          <div>
            <strong>Email:</strong> {createdBy?.email}
          </div>
          <div>
            <strong>Username:</strong> {createdBy?.username}
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
