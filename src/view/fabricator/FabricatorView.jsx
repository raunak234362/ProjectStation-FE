import { useState } from "react";
import { AddClient, AddFabricator } from "../../components";


const FabricatorView = () => {
    const [activeTab, setActiveTab] = useState('allClient');
    return (
        <div className="w-full overflow-y-hidden">
            <div className="flex flex-col w-full h-full">
                <div className="flex justify-between items-center overflow-x-auto p-4 bg-gray-200">
                    <h1 className="text-xl font-bold">Fabricator View</h1>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setActiveTab('addFabricator')}
                            className={`px-4 py-2 rounded ${activeTab === 'addFabricator' ? 'bg-teal-500 text-white' : 'bg-gray-300'}`}
                        >
                            Add Fabricator
                        </button>
                        <button
                            onClick={() => setActiveTab('addClient')}
                            className={`px-4 py-2 rounded ${activeTab === 'addClient' ? 'bg-teal-500 text-white' : 'bg-gray-300'}`}
                        >
                            Add Client
                        </button>
                        <button
                            onClick={() => setActiveTab('allFabricator')}
                            className={`px-4 py-2 rounded ${activeTab === 'allFabricator' ? 'bg-teal-500 text-white' : 'bg-gray-300'}`}
                        >
                            All Fabricator
                        </button>
                        <button
                            onClick={() => setActiveTab('allClient')}
                            className={`px-4 py-2 rounded ${activeTab === 'allClient' ? 'bg-teal-500 text-white' : 'bg-gray-300'}`}
                        >
                            All Client
                        </button>
                    </div>
                </div>
                <div className="flex-grow p-4 h-[85vh] overflow-y-auto">
                    {activeTab === 'addFabricator' && (
                        <div>
                            <AddFabricator />
                        </div>
                    )}
                    {activeTab === 'addClient' && (
                        <div>
                            <AddClient />
                        </div>
                    )}
                    {activeTab === 'addClient' && (
                        <div>
                            <AddClient />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FabricatorView
