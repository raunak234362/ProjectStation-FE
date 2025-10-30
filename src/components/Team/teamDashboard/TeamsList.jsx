/* eslint-disable react/prop-types */
const TeamsList = ({ filteredTeams, selectedTeam, onTeamSelect }) => {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Teams</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTeams && filteredTeams.length > 0 ? (
            filteredTeams.map((team) => (
              <div
                key={team.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedTeam === team.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
                }`}
                onClick={() => onTeamSelect(team.id)}
              >
                <h3 className="font-medium text-gray-800">{team.name}</h3>
                <div className="flex justify-between text-gray-600">
                  <div className="flex justify-between items-center mt-2 text-sm">
                    <span className="text-gray-600">{team.members?.length || 0} members</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500 italic">No teams found</div>
          )}
        </div>
      </div>
    );
  };
  
  export default TeamsList;