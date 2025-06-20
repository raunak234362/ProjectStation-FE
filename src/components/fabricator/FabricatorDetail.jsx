/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../index";
import AddBranch from "./AddBranch";

const GetFabricator = ({ fabricator }) => {
    const dispatch = useDispatch();
    //   const [fabricator, setFabricator] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showBranchModal, setShowBranchModal] = useState(false);
    const fabricatorData = useSelector((state) => state.fabricatorData?.fabricatorData);
    
    const handleAddBranchClose = async () => {
    // setSelectedFabricator(null);
    setShowBranchModal(false);
  };

    const renderInfo = (label, value) => (
        <div className="flex flex-col text-wrap">
            <span className="font-medium text-gray-700">{label}:</span>
            <span className="text-gray-600 break-words">{value || "Not available"}</span>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full rounded-lg p-4 md:p-6 shadow-lg overflow-y-auto">
            <div className="space-y-6">
                <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-3">Fabricator Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderInfo("Website", fabricator?.website ? (
                            <a href={fabricator.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                {fabricator.website}
                            </a>
                        ) : null)}

                        {renderInfo("Drive", fabricator?.drive ? (
                            <a href={fabricator.drive} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                {fabricator.drive}
                            </a>
                        ) : null)}

                        {renderInfo("Files", Array.isArray(fabricator?.files) && fabricator.files.length > 0 ? (
                            <div className="flex flex-col space-y-1">
                                {fabricator.files.map((file, index) => (
                                    <a
                                        key={index}
                                        href={`${import.meta.env.VITE_BASE_URL}/api/fabricator/fabricator/viewfile/${fabricator?.id}/${file.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-teal-600 hover:underline"
                                    >
                                        {file.originalName || `File ${index + 1}`}
                                    </a>
                                ))}
                            </div>
                        ) : null)}
                    </div>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-3">Head Office</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderInfo("Address", fabricator?.headquaters?.address)}
                        {renderInfo("City", fabricator?.headquaters?.city)}
                        {renderInfo("State", fabricator?.headquaters?.state)}
                        {renderInfo("Country", fabricator?.headquaters?.country)}
                        {renderInfo("Zipcode", fabricator?.headquaters?.zip_code)}
                    </div>
                </div>

            </div>
            <div>
                <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold">Branch Details</h3>
                        <Button onClick={() => setShowBranchModal(true)}>Add Branch</Button>
                    </div>
                {fabricator?.branches?.length > 0 ? (
                    fabricator.branches.map((branch, index) => (
                        <div key={index} className="rounded-lg ">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {renderInfo("Address", branch.address)}
                                {renderInfo("City", branch.city)}
                                {renderInfo("State", branch.state)}
                                {renderInfo("Country", branch.country)}
                                {renderInfo("Zipcode", branch.zip_code)}
                            </div>
                            <div className="text-right mt-3">
                                {/* <Button onClick={() => console.log("Edit Branch", inIdex)}>Edit</Button> */}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-600">No branches added.</p>
                )}
                </div>
                {showBranchModal && (
                    <AddBranch fabricator={fabricator} onBranchClose={handleAddBranchClose}/>
                )}
            </div>
        </div>
    );
};

export default GetFabricator;
