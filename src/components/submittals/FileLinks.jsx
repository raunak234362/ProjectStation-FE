/* eslint-disable react/prop-types */
const FileLinks = ({ files, submittalId, isResponse = false, responseId }) => {
  const baseURL = import.meta.env.VITE_BASE_URL;

  // Handle case: no files
  if (!Array.isArray(files) || files.length === 0) {
    return <span className="text-sm text-gray-500">Not available</span>;
  }

  return files.map((file, index) => {
    const fileUrl = isResponse
      ? `${baseURL.replace(/\/$/, "")}/api/Submittals/submittalsResponse/${responseId}/${file.id}`
      : `${baseURL.replace(/\/$/, "")}/api/Submittals/submittals/${submittalId}/${file.id}`;

    return (
      <a
        key={file.id || index}
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-teal-600 hover:underline block"
      >
        {file.originalName || `File ${index + 1}`}
      </a>
    );
  });
};

export default FileLinks;
