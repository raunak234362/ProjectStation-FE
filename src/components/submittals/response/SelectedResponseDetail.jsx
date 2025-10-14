/* eslint-disable react/prop-types */
const SelectedResponseDetail = ({ responseDetail }) => {
  console.log("SelectedResponseDetail component rendered with responseDetail:", responseDetail);
  return (
    <div className="bg-gray-100 rounded-md p-4 h-fit">
      <h3 className="text-lg font-semibold">Description</h3>
      <p className=" text-gray-600">
        {responseDetail?.description || "No description available."}
      </p>
        <h4 className="text-md font-semibold">Files</h4>
      <ul className=" list-disc list-inside">
        {responseDetail?.files?.length ? (
          responseDetail.files.map((file) => (
            <a
              key={file.id}
              href={`${import.meta.env.VITE_BASE_URL}/api/Submittals/submittalsResponse/${
                responseDetail.id
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
      </ul>
      <h4 className="text-md font-semibold">Status</h4>
      <p className=" text-gray-600">
        {responseDetail?.status || "No status available."}
      </p>
          
    </div>
  );
};

export default SelectedResponseDetail;
