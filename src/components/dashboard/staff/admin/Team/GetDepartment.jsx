/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import Button from "../../../../fields/Button";
import { useSelector } from "react-redux";
import EditDepartment from "./EditDepartment";

const GetDepartment = ({ departmentID, onClose }) => {
  console.log(departmentID);
  const [selectedEditDepartment, setSelectedEditDepartment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const departmentData = useSelector((state) =>
    state?.userData?.departmentData.find(
      (employee) => employee.id === departmentID
    )
  );

  const handleClose = async () => {
    onClose(true);
  };

  const handleEditClick = () => {
    setIsModalOpen(true);
    setSelectedEditDepartment(departmentData);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEditDepartment(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-85 flex justify-center items-center z-50">
      <div className="bg-white h-fit overflow-y-auto p-5 md:p-5 rounded-lg shadow-lg w-11/12 md:w-6/12 ">
        <div className="flex flex-row justify-between">
          <Button className="bg-red-500" onClick={handleClose}>
            Close
          </Button>
          <Button onClick={handleEditClick}>Edit</Button>
        </div>
        {/* header */}
        <div className="top-2 w-full flex justify-center z-10">
          <div className="mt-2">
            <div className="bg-teal-400 text-white px-3 md:px-4 py-2 md:text-2xl font-bold rounded-lg shadow-md">
              Department: {departmentData?.name || "Unknown"}
            </div>
          </div>
        </div>

        <div className=" h-fit overflow-y-auto rounded-lg shadow-lg">
          <div className="bg-gray-100/50 rounded-lg shadow-md p-5">
            <div className="gap-6 overflow-x-hidden overflow-y-hidden py-10">
              <div className="flex flex-col items-center justify-center w-full">
                <div>
                  <p>Manager : {departmentData?.manager?.username}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedEditDepartment && (
        <EditDepartment
          department={selectedEditDepartment}
          onClose={handleModalClose}
          handleClose={handleClose}
        />
      )}
    </div>
  );
};

export default GetDepartment;
