/* eslint-disable react/prop-types */


const ClientProjectStatus = ({projectId}) => {
    console.log("Selected Project ID:", projectId);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-5 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white h-[90vh] overflow-y-auto p-4 md:p-6 rounded-lg shadow-lg w-11/12 md:w-10/12">
      Client Project Detail</div>
    </div>
  )
}

export default ClientProjectStatus
