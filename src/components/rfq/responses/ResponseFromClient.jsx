/* eslint-disable react/prop-types */

const ResponseFromClient = ({ responseDetail }) => {
  const childResponse = responseDetail?.childResponses[0] || {};
  console.log("Response Detail:", responseDetail);
  return (
    <div>
      <div className="bg-gray-100 rounded-md p-4">
        <h3 className="text-lg font-semibold">Description</h3>
        <p className="mt-2 text-gray-600">
          {childResponse?.description || "No description available."}
        </p>
        <h2>Status</h2>
        <p className="mt-2 text-gray-600">
          {childResponse?.status || "No status available."}
        </p>
        <h4 className="text-md font-semibold">Files</h4>
        <ul className="mt-2 list-disc list-inside">
          {childResponse?.files?.length ? (
            childResponse.files.map((file) => (
              <a
                key={file.id}
                href={`${import.meta.env.VITE_BASE_URL}/api/RFQ/rfqResponse/${
                  childResponse?.id
                }/${file?.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 underline hover:text-blue-800"
              >
                {file?.originalName || "Unnamed File"}
              </a>
            ))
          ) : (
            <span className="text-gray-400 text-sm">No files attached</span>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ResponseFromClient;
