import { useEffect } from "react";
import Service from "../../../config/Service";


const EstimationTaskList = () => {

  const fetchEstimationTasks = async () => {
    try {
      const response = await Service.allEstimationTasks();
      console.log("Estimation Tasks:", response.data);
    } catch (error) {
      console.error("Error fetching estimation tasks:", error);
    }
  }

  useEffect(() => {
    fetchEstimationTasks();
  }, []);

  return (
    <div>
      <h2>Estimation Task List</h2>
      
    </div>
  )
}

export default EstimationTaskList
