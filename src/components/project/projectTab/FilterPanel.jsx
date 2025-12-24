/* eslint-disable react/prop-types */
import { CustomSelect } from "../../index";
import DateFilter from "../../../util/DateFilter";

const FilterPanel = ({
    isFilterOpen,
    userData,
    filterUserId,
    setFilterUserId,
    filterStatus,
    setFilterStatus,
    filterType,
    setFilterType,
    dateFilter,
    setDateFilter,
    uniqueTypes,
}) => {
    if (!isFilterOpen) return null;

    console.log("FilterPanel: dateFilter =", dateFilter); // Debug: Log dateFilter state

    return (
        <div className="grid grid-cols-1 gap-4 p-4 mb-6 rounded-lg bg-gray-50 md:grid-cols-4">
            <div>
                <CustomSelect
                    label="User"
                    value={filterUserId}
                    onChange={(_, value) => setFilterUserId(value)}
                    options={[
                        { label: "All Users", value: "all" },
                        ...(userData?.map((user) => ({
                            label: `${user.f_name} ${user.l_name}`,
                            value: user.id,
                        })) || []),
                    ]}
                />
            </div>
            <div>
                <CustomSelect
                    label="Stage"
                    name="stage"
                    color="blue"
                    options={[
                        { label: "Select Stage", value: "all" },
                        { label: "(RFI) Request for Information", value: "RFI" },
                        { label: "(IFA) Issue for Approval", value: "IFA" },
                        { label: "(BFA) Back from Approval/Returned App", value: "BFA" },
                        { label: "(BFA-M) Back from Approval - Markup", value: "BFA_M" },
                        { label: "(RIFA) Re-issue for Approval", value: "RIFA" },
                        { label: "(RBFA) Return Back from Approval", value: "RBFA" },
                        { label: "(IFC) Issue for Construction/DIF", value: "IFC" },
                        { label: "(BFC) Back from Construction/Drawing Revision", value: "BFC" },
                        { label: "(RIFC) Re-issue for Construction", value: "RIFC" },
                        { label: "(REV) Revision", value: "REV" },
                        { label: "(CO#) Change Order", value: "CO#" },
                    ]}
                    value={filterStatus}
                    onChange={(value) => setFilterStatus(value)}
                />
            </div>
            <div>
                <CustomSelect
                    label="Task Type"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={filterType}
                    onChange={(_, value) => setFilterType(value)}
                    options={[
                        { label: "All Types", value: "all" },
                        ...(uniqueTypes?.map((type) => ({
                            label: type,
                            value: type,
                        })) || []),
                    ]}
                />
            </div>
            <div>
                <DateFilter dateFilter={dateFilter} setDateFilter={setDateFilter} />
            </div>
        </div>
    );
};

export default FilterPanel;