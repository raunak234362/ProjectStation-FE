/* eslint-disable react/prop-types */
import {
  FileText,
  CalendarDays,
  Info,
  ClipboardList,
  DollarSign,
  File,
} from "lucide-react";
import { MdOutlineDescription } from "react-icons/md";
import RenderFiles from "../RenderFiles";

const RFQDetail = ({ data }) => {

  const renderScope = (title, main, misc, custom) => (
    <div className="bg-gray-50 p-4 rounded-lg border shadow-sm space-y-2">
      <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-wide border-b pb-1">
        {title}
      </h4>
      <div className="grid grid-cols-3 text-sm gap-y-2">
        <div>
          <span
            className={`font-semibold ${main
              ? "text-green-600 bg-green-100 rounded-full px-2 py-1"
              : "text-red-600 bg-red-100 rounded-full px-2 py-1"
              }`}
          >
            Main Design
          </span>
        </div>
        <div>
          <span
            className={`font-semibold ${misc
              ? "text-green-600 bg-green-100 rounded-full px-2 py-1"
              : "text-red-600 bg-red-100 rounded-full px-2 py-1"
              }`}
          >
            Misc Design
          </span>{" "}
        </div>
        {custom !== undefined && (
          <div>
            <span
              className={`font-semibold ${custom
                ? "text-green-600 bg-green-100 rounded-full px-2 py-1"
                : "text-red-600 bg-red-100 rounded-full px-2 py-1"
                }`}
            >
              Connection Design
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-teal-500 to-teal-100 text-white px-5 py-3 rounded-t-lg shadow-sm">
        <h3 className="text-lg font-bold tracking-wide">RFQ Information</h3>
        <FileText className="w-5 h-5 opacity-90" />
      </div>

      {/* Details Section */}
      <div className="bg-gray-50 rounded-b-lg px-6 py-6 space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
          {/* {info.map(({ label, value, icon }) => (
            <div
              key={label}
              className="flex items-center bg-white p-3 rounded-lg border hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                {icon}
                <span className="font-medium text-gray-800">{label}:</span>
              </div>
              <span className="text-gray-700 text-right">{value}</span>
            </div>
          ))} */}
          {/* {Subject} */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Info className="text-blue-500 w-4 h-4" />
              <span className="font-semibold text-gray-800">Subject</span>
            </div>
            <div className="text-gray-700 text-sm md:text-base leading-relaxed prose max-w-none">
              {data?.subject}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <CalendarDays className="text-blue-500 w-4 h-4" />
              <span className="font-semibold text-gray-800">Date</span>
            </div>
            <div className="text-gray-700 text-sm md:text-base leading-relaxed prose max-w-none">
              {new Date(data.createdAt).toLocaleString()}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <ClipboardList className="text-blue-500 w-4 h-4" />
              <span className="font-semibold text-gray-800">Status</span>
            </div>
            <div className="text-gray-700 text-sm md:text-base leading-relaxed prose max-w-none">
              {data?.status}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <MdOutlineDescription className="text-blue-500 w-5 h-5" />
            <span className="font-semibold text-gray-800">Description</span>
          </div>
          <div
            className="text-gray-700 text-sm md:text-base leading-relaxed prose max-w-none"
            dangerouslySetInnerHTML={{ __html: data?.description || "N/A" }}
          />
        </div>

        {/* Scopes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderScope(
            "Connection Design Scope",
            data?.connectionDesign,
            data?.miscDesign,
            data?.customerDesign
          )}
          {renderScope(
            "Detailing Scope",
            data?.detailingMain,
            data?.detailingMisc
          )}
        </div>

        {/* Bid Price */}
        <div className="bg-white p-4 rounded-lg border shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="text-green-500 w-5 h-5" />
            <span className="font-semibold text-gray-800">
              Project Bid Price:
            </span>
          </div>
          <span className="text-gray-700 text-base font-medium">
            {data?.bidPrice || "N/A"}
          </span>
        </div>

        {/* Files */}
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <File className="text-blue-500 w-5 h-5" />
            <span className="font-semibold text-gray-800">Files</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <RenderFiles files={data.files} table="rFQ" parentId={data.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RFQDetail;
