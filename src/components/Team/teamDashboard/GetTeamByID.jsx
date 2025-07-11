/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Button, CustomSelect } from "../../index";
import toast from "react-hot-toast";
import Service from "../../../config/Service";

const GetTeamByID = ({ team, isOpen, onClose }) => {
  const [segregatedMembers, setSegregatedMembers] = useState({});
  const [teamMembers, setTeamMembers] = useState([]);
  const [memberOptions, setMemberOptions] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const staffData = useSelector((state) => state?.userData?.staffData);

  // ✅ Fix Redux Selector: Ensure `team.id` is correctly checked
  const taskData = useSelector((state) =>
    state?.userData?.teamData?.data?.find((t) => t?.id === team)
  );
  console.log("Team Data:", teamMembers);

  // Move fetchTeamData outside so it can be reused
  const fetchTeamData = async () => {
    if (!team) return; // Prevent API calls if team is undefined
    try {
      const response = await Service.getTeamById(team);
      setTeamMembers(response?.data || []);
      if (response?.data) {
        const membersByRole = response.data.members.reduce((acc, member) => {
          const role = member.role || "MEMBER";
          if (!acc[role]) acc[role] = [];
          acc[role].push(member);
          return acc;
        }, {});
        setSegregatedMembers(membersByRole);
      }
    } catch (error) {
      console.error("Error fetching team data:", error);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, [team]);

  // ✅ Fix Staff Fetching: Ensure `staffData` is available
  useEffect(() => {
    if (!staffData?.length) return;
    const memberOptions = staffData
      ?.map((staff) => {
        const name = `${staff?.f_name || ""} ${staff?.m_name || ""} ${
          staff?.l_name || ""
        }`.trim();
        return name ? { label: name, value: staff?.id } : null;
      })
      .filter(Boolean)
      .sort((a, b) => a.label.localeCompare(b.label));

    setMemberOptions(memberOptions);
  }, [staffData]);

  const addMembers = async (data) => {
    try {
      await Service.addTeamMember(team, data);
      fetchTeamData()
      toast.success("Team member has been added successfully!");
    } catch (error) {
      toast.error("Failed to add team member");
      console.error("Error adding team member:", error);
    }
  };

  if (!isOpen) return null;

  const renderMembers = () => {
    return Object.entries(segregatedMembers).map(([role, members]) => (
      <div key={role} className="mb-3">
        <strong className="text-gray-700">{role}:</strong>
        <div className="ml-4">
          {members.map((member) => {
            const staff = staffData?.find((staff) => staff?.id === member?.id);
            return (
              <div key={member.id} className="text-gray-600">
                {staff?.f_name} {staff?.l_name}
              </div>
            );
          })}
        </div>
      </div>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
       <div className="bg-white h-fit overflow-y-auto p-4 md:p-6 rounded-lg shadow-lg w-11/12 md:w-10/12">
        <div className="flex justify-between p-2 my-5 rounded-lg bg-gradient-to-r from-teal-400 to-teal-100">
          <h2 className="text-2xl font-bold">Manage Team</h2>
          <button
            className="px-5 text-xl font-bold text-white rounded-lg bg-teal-500/50 hover:bg-teal-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="h-[50vh] overflow-y-auto p-4 rounded-lg">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
            {/* ✅ Left Side: Team Details */}
            <div className="bg-teal-100/70 rounded-lg p-5">
              <div>
                <div className="my-2">
                  <strong className="text-gray-700">Team Name:</strong>{" "}
                  {teamMembers?.name}
                </div>
                <p className="mb-2">
                  <strong className="text-gray-700">Manager:</strong>{" "}
                  {
                    staffData?.find((staff) => staff?.id === teamMembers?.managerID)?.f_name
                  } {
                    staffData?.find((staff) => staff?.id === teamMembers?.managerID)?.l_name
                  }
                </p>
                <div className="mb-2">
                  <strong className="text-gray-700">
                    Team Members by Role:
                  </strong>
                  {renderMembers()}
                </div>
              </div>
            </div>

            {/* ✅ Right Side: Add Team Member */}
            <div className="bg-teal-100/50 p-5 overflow-y-auto rounded-lg my-1">
              <strong className="text-gray-700 text-lg">
                Add Team Member:
              </strong>
              <div className="h-[50vh]">
                <form onSubmit={handleSubmit(addMembers)}>
                  <div className="my-2">
                    <CustomSelect
                      label="Select Member:"
                      name="employee"
                      options={[
                        { label: "Select User", value: "" },
                        ...memberOptions,
                      ]}
                      {...register("employee")}
                      onChange={setValue}
                    />
                  </div>
                  <div className="my-2">
                    <CustomSelect
                      label="Select Role:"
                      name="role"
                      options={[
                        { label: "Select Role", value: "" },
                        { label: "GUEST", value: "GUEST" },
                        { label: "MODELER", value: "MODELER" },
                        { label: "DETAILER", value: "DETAILER" },
                        { label: "ERECTION", value: "ERECTION" },
                        { label: "CHECKER", value: "CHECKER" },
                        { label: "DESIGNER", value: "DESIGNER" },
                      ]}
                      {...register("role")}
                      onChange={setValue}
                      disabled={!watch("employee")}
                    />
                  </div>
                  <div className="my-2">
                    <Button type="submit">Add Member</Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetTeamByID;
