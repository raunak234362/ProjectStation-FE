/* eslint-disable react/prop-types */

import { useState } from "react";
import { useEffect } from "react";
import Service from "../../../../../config/Service";
import { Users, TrendingUp, Calendar, User, Building2, Wrench, Target, GitBranch, CheckCircle2, Clock, AlertCircle, BarChart3 } from "lucide-react";

const ProjectDetails = ({ data }) => {
  const [project, setProject] = useState([]);
  const id = data;
  console.log(id);
  
  const fetchProject = async () => {
    const response = await Service.fetchProjectByID(data);
    setProject(response.data);
    console.log(response.data);
  };

  useEffect(() => {
    fetchProject();
  }, [id]);
  
  console.log("iiiiiiiiiiiiiiiiii", project);
  const teamMembers = new Set(project?.tasks?.map((task) => task.user_id));
  const teamMembersCount = teamMembers.size;

  const CompletedProject = project?.tasks?.filter(
    (task) => task?.status === "COMPLETE"
  ).length;
  console.log("CompletedProject", CompletedProject);

  const progressPercentage = project?.tasks?.length === 0 || !project?.tasks
    ? 0
    : ((CompletedProject / project?.tasks?.length) * 100);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'complete':
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'in_progress':
      case 'in progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-emerald-500';
    if (percentage >= 50) return 'bg-blue-500';
    if (percentage >= 25) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className=" mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{project?.name || 'Project Details'}</h1>
              <p className="text-slate-600 max-w-2xl">{project?.description}</p>
            </div>
            <div className={`px-4 py-2 rounded-full border font-medium ${getStatusColor(project?.status)}`}>
              {project?.status}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Progress Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Progress</h3>
              </div>
              <span className="text-2xl font-bold text-slate-900">
                {progressPercentage.toFixed(0)}%
              </span>
            </div>
            
            <div className="space-y-3">
              {/* <div className="flex justify-between text-sm text-slate-600">
                <span>Completed Tasks</span>
                <span>{CompletedProject} / {project?.tasks?.length || 0}</span>
              </div> */}
              
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${getProgressColor(progressPercentage)}`}
                  style={{
                    width: `${progressPercentage}%`,
                  }}
                ></div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-slate-600">
                {progressPercentage === 0 ? (
                  <>
                    <Clock className="w-4 h-4" />
                    <span>Not started</span>
                  </>
                ) : progressPercentage === 100 ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-600">Complete</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    <span>In progress</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Team Members Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Team Members</h3>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 mb-2">{teamMembersCount}</div>
              <div className="text-sm text-slate-600">Active contributors</div>
            </div>
          </div>

          {/* Tasks Overview Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Total Tasks</h3>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 mb-2">{project?.tasks?.length || 0}</div>
              <div className="text-sm text-slate-600">Project tasks</div>
            </div>
          </div>
        </div>

        {/* Project Information */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Project Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                <Target className="w-5 h-5 text-slate-600 mt-1" />
                <div>
                  <div className="font-medium text-slate-900">Project Name</div>
                  <div className="text-slate-600 mt-1">{project?.name}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-slate-600 mt-1" />
                <div>
                  <div className="font-medium text-slate-900">Status</div>
                  <div className="text-slate-600 mt-1">{project?.status}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                <Calendar className="w-5 h-5 text-slate-600 mt-1" />
                <div>
                  <div className="font-medium text-slate-900">Stage</div>
                  <div className="text-slate-600 mt-1">{project?.stage}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                <Users className="w-5 h-5 text-slate-600 mt-1" />
                <div>
                  <div className="font-medium text-slate-900">Team Name</div>
                  <div className="text-slate-600 mt-1">{project?.team?.name}</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                <Wrench className="w-5 h-5 text-slate-600 mt-1" />
                <div>
                  <div className="font-medium text-slate-900">Tools</div>
                  <div className="text-slate-600 mt-1">{project?.tools}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                <User className="w-5 h-5 text-slate-600 mt-1" />
                <div>
                  <div className="font-medium text-slate-900">Manager Name</div>
                  <div className="text-slate-600 mt-1">{project?.manager?.f_name}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                <Building2 className="w-5 h-5 text-slate-600 mt-1" />
                <div>
                  <div className="font-medium text-slate-900">Department</div>
                  <div className="text-slate-600 mt-1">{project?.department?.name}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-slate-600 mt-1" />
                <div>
                  <div className="font-medium text-slate-900">Description</div>
                  <div className="text-slate-600 mt-1">{project?.description}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;