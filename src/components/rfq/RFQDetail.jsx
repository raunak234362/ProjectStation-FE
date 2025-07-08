/* eslint-disable react/prop-types */
const RFQDetail = ({ data }) => {
  const info = [
    { label: "Subject", value: data?.subject },
    { label: "Description", value: data?.description },
    {
      label: "Date",
      value: data?.createdAt ? new Date(data.createdAt).toLocaleString() : "N/A",
    },
    { label: "Status", value: data?.status },
  ];

  return (
    <div className="w-full max-w-3xl bg-white p-4 rounded-lg shadow-md">
      <div className="sticky top-0 z-10 flex flex-row items-center justify-between p-2 bg-gradient-to-r from-teal-400 to-teal-100 border-b rounded-md">
        <h3 className="text-lg font-semibold text-white">RFQ Information</h3>
      </div>
      <div className="bg-gray-50 shadow-inner rounded-lg p-4 space-y-3">
        {info.map(({ label, value }) => (
          <div
            key={label}
            className="flex justify-between text-sm text-gray-700"
          >
            <span className="font-medium">{label}:</span>
            <span className="text-right whitespace-pre-wrap">
              {value || "N/A"}
            </span>
          </div>
        ))}
        <div className="flex justify-between">
          <span className="font-medium text-sm text-gray-700">Files:</span>
          <div className="flex flex-wrap justify-end gap-2 max-w-[60%]">
            {data?.files?.length ? (
              data.files.map((file) => (
                <a
                  key={file.id}
                  href={`${import.meta.env.VITE_BASE_URL}/api/RFQ/rfq/${
                    data.id
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
        </div>
      </div>
    </div>
  );
};

export default RFQDetail;
