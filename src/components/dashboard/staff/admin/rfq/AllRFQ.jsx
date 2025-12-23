/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import Button from "../../../../fields/Button";
import Service from "../../../../../config/Service";
import ViewRFQ from "./ViewRFQ";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

function AllRFQ() {

  const [rfq, setRfq] = useState([]);


  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    fabricator: "",
    project: "",
    status: "",
  });

  const [viewData, setViewData] = useState(null);
  const [click, setClick] = useState(false);
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const fetchInboxRFQ = async () => {
    try {
      const rfqDetail = await Service.inboxRFQ();
      setRfq(rfqDetail);
      console.log("Inbox RFQ:", rfqDetail);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchInboxRFQ();
  }, []);

  useEffect(() => {
    const filteredData = rfq?.filter((item) => {
      //search filter
      const matchedSearchTerm =
        item.fabricatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.clientName.toLowerCasnsole().includes(searchTerm.toLowerCase()) ||
        item.projectName.toLowerCase().includes(searchTerm.toLowerCase());
      //filter dropdown fabricator
      const matchedFabricator =
        !filters.fabricator ||
        item.fabricatorName.toLowerCase() === filters.fabricator.toLowerCase();
      //filter dropdown project
      const matchedProject =
        !filters.project ||
        item.projectName.toLowerCase() === filters.project.toLowerCase();
      //filter dropdown status
      const matchedStatus =
        !filters.status ||
        item.status.toLowerCase() === filters.status.toLowerCase();

      return (
        matchedSearchTerm &&
        matchedFabricator &&
        matchedProject &&
        matchedStatus
      );
    });

    setRfq(filteredData);
  }, [searchTerm, filters]);

  const [selectedRFQ, setSelectedRFQ] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalClose = async () => {
    setSelectedRFQ(null);
    setIsModalOpen(false);
  };
  const handleViewClick = (rfq) => {
    console.log(rfq);
    const updatedRfq = { ...rfq, status: "Opened" };
    setRfq((prevRfq) =>
      prevRfq.map((item) => (item.id === rfq.id ? updatedRfq : item))
    );

    setSelectedRFQ(updatedRfq);
    setIsModalOpen(true);
  };

  // const handleViewClick = (data) => {
  //   setViewData(data);
  //   setClick(true);
  // };

  const clientData = useSelector((state) => state?.fabricatorData?.clientData);
  // console.log("------------------>cd", clientData);

  rfq?.map((data) => {
    const matchedClient = clientData.find(
      (client) =>
        client.email === data.sender_id || client.id === data.sender_id
    );

    return (
      <tr key={data.id} className="bg-white">
        <td className="px-2 py-1">{data.projectName}</td>
        <td className="px-2 py-1">
          {matchedClient ? matchedClient.email : data.sender_id}
        </td>
        <td className="px-2 py-1">{data.subject}</td>
        <td className="px-2 py-1">{data.date}</td>
        <td className="px-2 py-1">{data.rfqStatus}</td>
        <td className="px-2 py-1">
          <Button onClick={() => handleViewClick(data)}>View</Button>
        </td>
      </tr>
    );
  });


  //GET DATA FROM RESPONSE_rfq CHECK IF RESPONSE IS TRUE IF TRUE STATUS IS RESPONDED



  return (
    <>
      <div className="flex items-center justify-center w-full bg-white/80">
        <div className="w-full h-[89vh] overflow-y-hidden mx-5">
          <input
            type="text"
            placeholder="Search by remarks or recipient"
            className="w-[96%] px-2 py-1 m-5 border border-gray-300 rounded "
            onChange={handleSearch}
          />
          <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-3">
            <div className="px-2 py-1 border border-gray-300 rounded">
              <select
                name="fabricator"
                onChange={handleFilter}
                className="px-2 py-1 border border-gray-300 rounded"
              >
                <option value="">Filter by Fabricator</option>
                <option value="Fabricator 1">Fabricator 1</option>
              </select>
            </div>
            <div className="px-2 py-1 border border-gray-300 rounded">
              <select
                name="project"
                onChange={handleFilter}
                className="px-2 py-1 border border-gray-300 rounded"
              >
                <option value="">Filter by Project</option>
                <option value="Project 1">Project 1</option>
              </select>
            </div>
            <div className="px-2 py-1 border border-gray-300 rounded">
              <select
                name="status"
                onChange={handleFilter}
                className="px-2 py-1 border border-gray-300 rounded"
              >
                <option value="">Filter by Status</option>
                <option value="Closed">Closed</option>
                <option value="Open">Open</option>
              </select>
            </div>
          </div>

          <table className="min-w-full text-sm text-center border-collapse md:texport default AllRFQ;ext-lg rounded-xl">
            <thead>
              <tr className="bg-teal-200/70">
                <th className="px-2 py-1 border-2">Project Name</th>
                <th className="px-2 py-1 border-2">Mail ID</th>
                <th className="px-2 py-1 border-2">Subject/Remarks</th>
                <th className="px-2 py-1 border-2">Date</th>
                <th className="px-2 py-1 border-2">RFQ Status</th>
                <th className="px-2 py-1 border-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {rfq?.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-2 py-1 text-center">
                    No RFQ Found
                  </td>
                </tr>
              ) : rfq?.map((data) => {
                const matchedClient = clientData.find(
                  (client) =>
                    client.email === data.sender_id || client.id === data.sender_id
                );
                return (
                  <tr key={data.id} className="bg-white">
                    <td className="px-2 py-1 border-2">
                      {data.projectName}
                    </td>
                    <td className="px-2 py-1 border-2">
                      {matchedClient ? matchedClient.email : data.sender_id}
                    </td>
                    <td className="px-2 py-1 border-2">{data.subject}</td>
                    <td className="px-2 py-1 border-2">{data.date}</td>
                    <td className="px-2 py-1 border-2">{data.status}</td>
                    <td className="px-2 py-1 border-2">
                      <Button onClick={() => handleViewClick(data)}>
                        View
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {selectedRFQ && (
        <ViewRFQ
          data={selectedRFQ}
          isOpen={selectedRFQ}
          onClose={handleModalClose}
        />
      )}
    </>
  );
}

export default AllRFQ;
