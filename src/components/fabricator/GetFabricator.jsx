/* eslint-disable react/prop-types */
import { X } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import FabricatorDetail from "./FabricatorDetail";
import AddClient from "./AddClient";
import AllClients from "./AllClients";
import EditFabricator from "./EditFabricator";


const GetFabricator = ({ fabricatorId, onClose }) => {
    const [activeTab, setActiveTab] = useState("fabDetails");

    const fabData = useSelector((state) => state.fabricatorData?.fabricatorData);

    const fabricator = fabData?.find(fab => fab.id === fabricatorId);
    const handleClose = () => {
        onClose(true);
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-5 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white h-[90%] md:h-[70%] overflow-y-hidden md:p-5 p-2 rounded-lg shadow-lg w-11/12 md:w-8/12 space-y-2 ">
                <div className="sticky top-0 z-10 flex flex-row items-center justify-between p-2 bg-gradient-to-r from-teal-400 to-teal-100 border-b rounded-md">
                    <div className="text-lg font-semibold text-white">
                        {fabricator?.fabName}
                    </div>
                    <button
                        className="p-2 text-gray-800 transition-colors bg-gray-200 rounded-full hover:bg-gray-300"
                        onClick={handleClose}
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex justify-between items-center overflow-x-auto border-b-2">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setActiveTab('fabDetails')}
                            className={`px-2 py-1 rounded ${activeTab === 'fabDetails' ? 'bg-teal-500 text-white font-semibold text-sm' : 'text-xs md:text-sm'}`}
                        >
                            Fabricator Detail
                        </button>
                        <button
                            onClick={() => setActiveTab('clientDetails')}
                            className={`px-2 py-1 rounded ${activeTab === 'clientDetails' ? 'bg-teal-500 text-white font-semibold text-sm' : 'text-xs md:text-sm'}`}
                        >
                            Client&#39;s Detail
                        </button>
                      
                        <button
                            onClick={() => setActiveTab('addClient')}
                            className={`px-2 py-1 rounded ${activeTab === 'addClient' ? 'bg-teal-500 text-white font-semibold text-sm' : 'text-xs md:text-sm'}`}
                        >
                            Add Client
                        </button>

                    </div>
                </div>
                <div className="flex-grow h-[90%] overflow-y-auto">
                    {activeTab === 'fabDetails' && (
                        <div className="text-sm text-gray-600">
                            <FabricatorDetail fabricator={fabricator} />
                        </div>
                    )}
                    {activeTab === 'addClient' && (
                        <div className="text-sm text-gray-600">
                            <AddClient fabricator={fabricator} />
                        </div>
                    )}
                    {activeTab === 'clientDetails' && (
                        <div className="text-sm text-gray-600">
                            <AllClients fabricator={fabricator} />
                        </div>
                    )}
                  
                </div>
            </div>
        </div>
    )
}

export default GetFabricator
