import { useState } from "react";
import { AddFabricator, AllFabricator } from "../../components";


const FabricatorView = () => {
    const [activeTab, setActiveTab] = useState('allFabricator');
    return (
        <div className="w-full">
            <div className="flex flex-col w-full h-full">
                <div className="px-3 flex flex-col justify-between items-start bg-gradient-to-t from-teal-100 to-teal-400 border-b rounded-md ">
                    <h1 className="text-2xl py-2 font-bold text-white">Fabricators Details</h1>
                    <div className="flex space-x-2 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('addFabricator')}
                            className={`px-1.5 md:px-4 py-2 rounded-lg rounded-b ${activeTab === 'addFabricator' ? 'text-base md:text-base bg-teal-500 text-white font-semibold' : 'md:text-base text-sm bg-white'}`}
                        >
                            Add Fabricator
                        </button>
                        <button
                            onClick={() => setActiveTab('allFabricator')}
                            className={`px-1.5 md:px-4 py-2 rounded-lg rounded-b ${activeTab === 'allFabricator' ? 'text-base md:text-base bg-teal-500 text-white font-semibold' : 'md:text-base text-sm bg-white'}`}
                        >
                            All Fabricator
                        </button>
                    </div>
                </div>
                <div className="flex-grow p-2 h-[89vh] flex flex-col">
                    {activeTab === 'addFabricator' && (
                        <div className="flex-1 overflow-auto">
                            <AddFabricator />
                        </div>
                    )}
                    {activeTab === 'allFabricator' && (
                        <div className="flex-1 h-full">
                            <AllFabricator />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FabricatorView
