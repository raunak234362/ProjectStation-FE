/* eslint-disable react/prop-types */
const RFQDetail = ({ data }) => {
  const info = [
    { label: "Subject", value: data?.subject },
    {
      label: "Date",
      value: data?.createdAt ? new Date(data.createdAt).toLocaleString() : "N/A",
    },
    { label: "Status", value: data?.status },
  ];

  return (
    <div className="w-full max-w-3xl bg-white p-5 rounded-lg shadow-lg border">
      <div className="sticky top-0 z-10 flex flex-row items-center justify-between p-3 bg-gradient-to-r from-teal-500 to-teal-300 border-b rounded-t-lg">
        <h3 className="text-lg font-bold text-white tracking-wider">RFQ Information</h3>
      </div>
      <div className="bg-gray-50 shadow-inner rounded-b-lg px-6 py-6 space-y-5">
        {info.map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center text-sm md:text-base">
            <span className="font-medium text-gray-800">{label}:</span>
            <span className="text-gray-700 text-right whitespace-pre-wrap">{value || "N/A"}</span>
          </div>
        ))}

        <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
          <div className="font-medium text-gray-800">Description:</div>
          <br/>
          <div
            className="text-gray-700 w-full text-sm md:text-base whitespace-normal text-right sm:text-left"
            dangerouslySetInnerHTML={{ __html: data?.description || "N/A" }}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <span className="font-medium text-gray-800">Files:</span>
          <div className="flex flex-wrap justify-end gap-3 max-w-[70%]">
            {data?.files?.length ? (
              data.files.map((file) => (
                <a
                  key={file.id}
                  href={`${import.meta.env.VITE_BASE_URL}/api/RFQ/rfq/${data.id}/${file.id}`}
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
