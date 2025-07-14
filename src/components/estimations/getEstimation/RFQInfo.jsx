/* eslint-disable react/prop-types */
const RFQInfo = ({ data }) => {
  if (!data) return null;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold text-teal-700 mb-3">RFQ Details</h2>
      <div className="text-sm space-y-1">
        <div>
          <strong>Project Name:</strong> {data.projectName}
        </div>
        <div>
          <strong>Subject:</strong> {data.subject}
        </div>
        <div>
          <strong>Description:</strong> {data.description}
        </div>
        <div>
          <strong>Status:</strong> {data.status}
        </div>
        <div>
          <strong>Created At:</strong>{" "}
          {new Date(data.createdAt).toLocaleString()}
        </div>
      </div>

      {data.files?.length > 0 && (
        <div className="mt-4">
          <h3 className="text-md font-semibold mb-2">Attached Files</h3>
          <div className="flex flex-wrap gap-4">
            {data.files.map((file) => (
              <div
                key={file.id}
                className="border rounded-md p-2 max-w-[200px] shadow-sm"
              >
                  <a
                    href={`${import.meta.env.VITE_BASE_URL}/api/RFQ/rfq/${
                      data.id
                    }/${file.id}`}
                    alt={file.originalName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 underline hover:text-blue-800"
                  >{file.originalName || "Unnamed File"}</a>
               
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RFQInfo;
