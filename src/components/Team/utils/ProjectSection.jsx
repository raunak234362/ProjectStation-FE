/* eslint-disable react/prop-types */
const ProjectsSection = ({ projects }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-md font-medium text-gray-800">Assigned Projects</h3>
        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
          {projects.length} projects
        </span>
      </div>
      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-3">
              <h4 className="font-medium text-gray-800">
                {project.name || `Project ${index + 1}`}
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                {project.description?.substring(0, 100) || "No description"}
                {project.description?.length > 100 ? "..." : ""}
              </p>
              <div className="flex justify-between mt-2 text-xs">
                <span className="text-gray-500">
                  Status:{" "}
                  <span className="font-medium">
                    {project.status || "Unknown"}
                  </span>
                </span>
                <span className="text-gray-500">
                  Deadline:{" "}
                  <span className="font-medium">
                    {project.deadline
                      ? new Date(project.deadline).toLocaleDateString()
                      : "N/A"}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center py-4">
          No projects found for the selected period
        </p>
      )}
    </div>
  );
};

export default ProjectsSection;
