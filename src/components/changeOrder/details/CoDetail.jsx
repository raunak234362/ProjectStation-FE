/* eslint-disable react/prop-types */
const InfoItem = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="font-medium text-gray-700">{label}:</span>
    <span className="text-gray-600">{value || "Not available"}</span>
  </div>
);

const CoDetail = ({ selectedCO }) => {
  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-md">
      <div className="sticky top-0 z-10 flex flex-row items-center justify-between p-2 bg-gradient-to-r from-teal-400 to-teal-100 border-b rounded-md">
        <h3 className="text-lg font-semibold text-white">
          Change Order Request Details
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-3">
        <InfoItem label="Subject" value={selectedCO?.remarks} />
        <InfoItem label="Description" value={selectedCO?.description} />
        <InfoItem label="Change Order No." value={selectedCO?.changeOrder} />
        <InfoItem
          label="Point of Contact"
          value={`${selectedCO?.Recipients?.f_name} ${selectedCO?.Recipients?.l_name}`}
        />
        <InfoItem label="Sent Date" value={selectedCO?.sentOn} />
        <InfoItem label="Status" value={selectedCO?.status} />
      </div>
    </div>
  );
};

export default CoDetail;
