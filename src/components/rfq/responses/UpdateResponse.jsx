/* eslint-disable react/prop-types */

const UpdateResponse = ({ responseDetail = [] }) => {
  console.log("UpdateResponse Detail:", responseDetail);

  if (!Array.isArray(responseDetail) || responseDetail.length === 0) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg text-gray-500 text-sm">
        No responses available.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 bg-blue-gray-200/50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2">Responded Details</h2>

      {responseDetail.map((childResponse) => (
        <div
          key={childResponse.id}
          className="bg-white p-4 rounded-md border border-gray-200 shadow-sm"
        >
          <div className="mb-2">
            <h3 className="text-lg font-semibold">Status</h3>
            <p className="text-gray-600">{childResponse.status || "N/A"}</p>
          </div>

          <div className="mb-2">
            <h3 className="text-lg font-semibold">Description</h3>
            <p className="text-gray-600">
              {childResponse?.description || "No description available."}
            </p>
          </div>

          <div className="mb-2">
            <h4 className="text-md font-semibold">Files</h4>
            <ul className="mt-2 list-disc list-inside space-y-1">
              {childResponse?.files?.length ? (
                childResponse.files.map((file) => (
                  <li key={file.id}>
                    <a
                      href={`${
                        import.meta.env.VITE_BASE_URL
                      }/api/RFQ/rfqResponse/${childResponse.id}/${file.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 underline hover:text-blue-800"
                    >
                      {file.originalName || "Unnamed File"}
                    </a>
                  </li>
                ))
              ) : (
                <span className="text-gray-400 text-sm">No files attached</span>
              )}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UpdateResponse;
