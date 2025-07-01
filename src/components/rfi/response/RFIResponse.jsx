/* eslint-disable react/prop-types */
const InfoItem = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="font-medium text-gray-700">{label}:</span>
    <span className="text-gray-600">{value || "Not available"}</span>
  </div>
);

const FileLinks = ({ files, rfiId, isResponse = false, responseId = null }) => {
  if (!Array.isArray(files)) return "Not available";

  const baseURL = import.meta.env.VITE_BASE_URL;

  return files.map((file, index) => {
    const fileUrl = isResponse
      ? `${baseURL}/api/RFI/rfi/response/viewfile/${responseId}/${file.id}`
      : `${baseURL}/api/RFI/rfi/viewfile/${rfiId}/${file.id}`;

    return (
      <a
        key={index}
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-teal-600 hover:underline"
      >
        {file.originalName || `File ${index + 1}`}
      </a>
    );
  });
};
const RFIResponse = ({rfi}) => {
    console.log("RFI Response Component Rendered with rfi:", rfi);
  return (
    <div className="p-5 rounded-lg shadow bg-gray-100/50">
      <h2 className="mb-4 text-lg font-semibold">RFI Response</h2>
      {rfi?.response ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem
            label="Date"
            value={new Date(rfi?.response?.createdAt).toLocaleDateString()}
          />
          <InfoItem label="Description" value={rfi?.response?.reason} />
          <InfoItem label="Status" value={rfi?.response?.responseState} />
          <InfoItem
            label="Files"
            value={
              <FileLinks
                files={rfi?.response?.files}
                rfiId={rfi?.id}
                isResponse
                responseId={rfi?.response?.id}
              />
            }
          />
        </div>
      ) : (
        <div className="text-gray-600 italic">No response available yet.</div>
      )}
    </div>
  );
};

export default RFIResponse;
