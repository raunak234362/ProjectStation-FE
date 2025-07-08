import { useState } from "react";
import {  AllFabricator } from "../../components";
import Estimations from "../../components/estimations/Estimations";
import AddEstimation from "../../components/estimations/AddEstimation";


const EstimationView = () => {
    const [activeTab, setActiveTab] = useState('Estimations');
    return (
        <div className="w-full overflow-y-hidden">
            <div className="flex flex-col w-full h-full">
                <div className="px-3 flex flex-col justify-between items-start bg-gradient-to-t from-teal-100 to-teal-400 border-b rounded-md ">
                    <h1 className="text-2xl py-2 font-bold text-white">Estimation Dashboard</h1>
                    <div className="flex space-x-2 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('Estimations')}
                            className={`px-1.5 md:px-4 py-2 rounded-lg rounded-b ${activeTab === 'Estimations' ? 'text-base md:text-base bg-teal-500 text-white font-semibold' : 'md:text-base text-sm bg-white'}`}
                        >
                            Estimations
                        </button>
                        <button
                            onClick={() => setActiveTab('addEstimation')}
                            className={`px-1.5 md:px-4 py-2 rounded-lg rounded-b ${activeTab === 'addEstimation' ? 'text-base md:text-base bg-teal-500 text-white font-semibold' : 'md:text-base text-sm bg-white'}`}
                        >
                            Add Estimation
                        </button>
                        <button
                            onClick={() => setActiveTab('allEstimation')}
                            className={`px-1.5 md:px-4 py-2 rounded-lg rounded-b ${activeTab === 'allEstimation' ? 'text-base md:text-base bg-teal-500 text-white font-semibold' : 'md:text-base text-sm bg-white'}`}
                        >
                            All Estimation
                        </button>
                    </div>
                </div>
                <div className="flex-grow h-[85vh] overflow-y-auto">
                    {activeTab === 'Estimations' && (
                        <div>
                            <Estimations />
                        </div>
                    )}
                    {activeTab === 'addEstimation' && (
                        <div>
                            <AddEstimation />
                        </div>
                    )}
                    {activeTab === 'allEstimation' && (
                        <div>
                            <AllFabricator />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default EstimationView
