import { Share2, Download } from "lucide-react";
import { createShareLink } from "../../config/Service";
import toast from "react-hot-toast";

const FileLinks = ({ files, submittalId, isResponse = false, responseId, table = "submittals" }) => {
  const baseURL = import.meta.env.VITE_BASE_URL;

  // Handle case: no files
  if (!Array.isArray(files) || files.length === 0) {
    return <span className="text-sm text-gray-500">Not available</span>;
  }

  const handleShare = async (e, file) => {
    e.preventDefault();
    e.stopPropagation();
    // Determine parentId based on context
    const parentId = isResponse ? responseId : submittalId;

    try {
      const response = await createShareLink(table, parentId, file.id);
      if (response.shareLink) {
        navigator.clipboard.writeText(response.shareLink);
        toast.success("Link copied to clipboard!");
      } else {
        toast.error("Failed to generate link");
      }
    } catch (error) {
      console.error("Error sharing file:", error);
      toast.error("Error generating share link");
    }
  };

  const handleDownload = (e, fileUrl) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(fileUrl, "_blank");
  };

  return files.map((file, index) => {
    const fileUrl = isResponse
      ? `${baseURL.replace(/\/$/, "")}/api/Submittals/submittalsResponse/${responseId}/${file.id}`
      : `${baseURL.replace(/\/$/, "")}/api/Submittals/submittals/${submittalId}/${file.id}`;

    return (
      <div key={file.id || index} className="flex items-center gap-2 group">
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-teal-600 hover:underline block"
        >
          {file.originalName || `File ${index + 1}`}
        </a>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => handleShare(e, file)}
            className="p-1 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-colors"
            title="Share Link"
          >
            <Share2 size={14} />
          </button>
          <button
            onClick={(e) => handleDownload(e, fileUrl)}
            className="p-1 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-colors"
            title="Download"
          >
            <Download size={14} />
          </button>
        </div>
      </div>
    );
  });
};

export default FileLinks;
