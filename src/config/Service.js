import api from "./api";
const token = sessionStorage.getItem("token");

export const createShareLink = async (table, parentId, fileId) => {
  try {
    const response = await api.post(
      `/api/share/${table}/${parentId}/${fileId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error creating share link:", error);
    throw error;
  }
};

export const downloadShare = async (token) => {
  try {
    const response = await api.get(`/api/shareLink/${token}`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.log("Error downloading shared file:", error);
    throw error;
  }
};

class Service {
  // BASE_URL is stored as a constant

  // Fetch the logged-in user - updated
  static async getCurrentUser(token) {
    try {
      const response = await api.post(`/api/auth/getuserbytoken`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error finding Current user:", error);
      throw error;
    }
  }
  static async getUsersStats(id) {
    try {
      const response = await api.get(`/api/employee/stats/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error finding Current user:", error);
      throw error;
    }
  }

  static async getRecipients() {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(`/api/employee/employee`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.log("Error fetching recipients:", error);
      throw error;
    }
  }

  // Disable Employee -- updated
  static async disableEmployee(employeeID) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.patch(
        `/api/auth//disable/${employeeID}`,
        {},
        {
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error disabling employee:", error.response?.data || error);
      throw error;
    }
  }

  // Add a new employee (staff) -- updated
  static async addEmployee(updatedData) {
    try {
      const formData = { ...updatedData };
      const response = await api.post(`/api/employee/employee`, formData, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error adding staff:", error.response?.data || error);
      throw error;
    }
  }

  //Edit Employee
  static async editEmployee(employeeID, updatedData) {
    const token = sessionStorage.getItem("token");
    try {
      const formData = { ...updatedData };
      const response = await api.patch(
        `/api/employee/employee/${employeeID}`,
        formData,
        {
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error editing staff:", error.response?.data || error);
      throw error;
    }
  }

  static async editDepartment(departmentID, updatedData) {
    const token = sessionStorage.getItem("token");
    try {
      const formData = { ...updatedData };
      const response = await api.patch(
        `/api/department/department/${departmentID}`,
        formData,
        {
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error editing department:", error.response?.data || error);
      throw error;
    }
  }

  // Change password-updated -- updated
  static async changePassword(token, data) {
    try {
      const response = await api.post(`/api/auth/resetpassword/`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
      console.log("Change Password Response:", response);
      return response;
    } catch (error) {
      console.log("Error changing password:", error);
      return error;
    }
  }

  //Dashboard Counts
  static async getDashboardCounts() {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(`/api/stats/dashBoardStats`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error fetching dashboard counts:", error);
      throw error;
    }
  }

  // Fetch all employees (staff) -- updated
  static async allEmployee() {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(`/api/employee/employee`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.log("Error fetching employees:", error);
      throw error;
    }
  }

  // Fetch all departments -- updated
  static async allDepartment(token) {
    try {
      const response = await api.get(`/api/department/department`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.log("Error fetching departments:", error);
      throw error;
    }
  }

  // Add new department -- updated
  static async addDepartment(data) {
    const token = sessionStorage.getItem("token");
    try {
      const departmentData = { ...data };

      const response = await api.post(
        `/api/department/department`,
        departmentData,
        {
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error adding department:", error);
      throw error;
    }
  }

  // Add new fabricator -- updated
  static async addFabricator(fabricatorData) {
    try {
      const token = sessionStorage.getItem("token");
      const formData = { ...fabricatorData };
      const response = await api.post(`/api/fabricator/fabricator/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "Application/json",
        },
      });

      return response.data;
    } catch (error) {
      console.log("Error in adding Fabricator: ", error);
      throw error;
    }
  }

  //Add Fabricator Branch -- updated
  static async addFabricatorBranch(fabricatorBranchData, id) {
    try {
      const formData = { ...fabricatorBranchData };
      const response = await api.post(
        `/api/fabricator/fabricator/${id}/addbranch/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "Application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error in adding Fabricator Branch: ", error);
      throw error;
    }
  }

  // Fetch all fabricators -- updated
  static async allFabricator() {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.get(`/api/fabricator/fabricator`, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.log("Error fetching fabricators:", error);
      throw error;
    }
  }

  // Fetch Fabricator -- updated
  static async getFabricator(id) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.get(`/api/fabricator/fabricator/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error fetching fabricators:", error);
      throw error;
    }
  }

  // Edit Fabricator by ID -- updated
  static async editFabricator(id, data) {
    const formData = { ...data };
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.patch(
        `/api/fabricator/fabricator/${id}/updatefabricator`,
        formData,
        {
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error editing fabricator:", error);
      throw error;
    }
  }

  //delete project by ID -- updated
  static async deleteFabricator(id) {
    try {
      const response = await api.delete(`/api/fabricator/fabricator/${id}`, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error deleting project:", error);
      throw error;
    }
  }

  // Add Client user -- updated
  static async addClient(data) {
    try {
      const token = sessionStorage.getItem("token");
      const clientData = { ...data };
      const response = await api.post(
        `/api/client/client/${data.fabricator}/addclient/`,
        clientData,
        {
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.log("Error adding client:", error);
      throw error;
    }
  }

  //Fetch Client By ID -- updated
  static async getClientById(clientId) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.get(`/api/client/Client/${clientId}`, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error fetching client:", error);
      throw error;
    }
  }

  //Delete Client By ID -- updated
  static async deleteClient(clientId) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.delete(
        `/api/client/client/${clientId}/deleteClient`,
        {
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error deleting client:", error);
      throw error;
    }
  }

  // Add all Project File --updated
  static async addFabricatorFile(formData, id) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.post(
        `/api/fabricator/fabricator/${id}/add_file`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error uploading files:", error);
      throw error;
    }
  }

  // Fetch all clients -- updated
  static async allClient() {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.get(`/api/client/client/getallclients`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.log("Error fetching clients:", error);
      throw error;
    }
  }

  // Add new vendor
  static async addVendor(data) {
    try {
      const vendorData = new FormData();

      Object.keys(data).forEach((key) => {
        if (data[key]) vendorData.append(key, data[key]);
      });
      vendorData.append("role", "VENDOR");
      const response = await api.post(`/api/vendor/`, vendorData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${sessionStorage.getItem("token")}`,
        },
      });
      return response;
    } catch (error) {
      console.log("Error adding vendor:", error);
      throw error;
    }
  }
  // Add new vendor user
  static async addVendorUser(data) {
    try {
      const vendorUserData = new FormData();

      Object.keys(data).forEach((key) => {
        if (data[key]) vendorUserData.append(key, data[key]);
      });
      vendorUserData.append("role", "VENDOR");
      const response = await api.post(
        `/api/vendor/${data["vendor"]}/users/`,
        vendorUserData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${sessionStorage.getItem("token")}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.log("Error adding vendor:", error);
      throw error;
    }
  }

  // Fetch all vendor users
  static async allVendorUser(token) {
    try {
      const response = await api.get(`/api/user/vendor/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error fetching vendors:", error);
      throw error;
    }
  }
  // Fetch all Vendors
  static async allVendor(token) {
    try {
      const response = await api.get(`/api/vendor/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error fetching vendors:", error);
      throw error;
    }
  }

  //Add new project -- updated
  static async addProject(projectData) {
    const token = sessionStorage.getItem("token");
    try {
      const formData = { ...projectData };
      const response = await api.post(`/api/project/projects`, formData, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response?.data?.data;
    } catch (error) {
      console.log("Error adding project:", error);
      throw error;
    }
  }

  // Fetch all projects --updated
  static async allprojects(token) {
    try {
      const response = await api.get(`/api/project/projects`, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error fetching projects:", error);
      throw error;
    }
  }

  // Fetch all projects --updated
  static async fetchProjectByID(id) {
    try {
      const response = await api.get(`/api/project/projects/${id}`, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.log("Error fetching projects:", error);
      throw error;
    }
  }

  // Edit project by ID -- updated
  static async editProject(id, data) {
    try {
      const response = await api.patch(`/api/project/projects/${id}`, data, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error editing project:", error);
      throw error;
    }
  }

  //delete project by ID -- updated
  static async deleteProject(id) {
    try {
      const response = await api.delete(`/api/project/projects/${id}`, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error deleting project:", error);
      throw error;
    }
  }

  // Fetch all Project File --updated
  static async addProjectFile(formData, id) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.post(
        `/api/project/projects/${id}/add_file`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error uploading files:", error);
      throw error;
    }
  }

  // Fetch all Project File --updated
  static async allProjectFile(projectID, fileID) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(
        `/api/project/projects/viewfile/${projectID}/${fileID}`,
        {
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error fetching projects:", error);
      throw error;
    }
  }

  //Add Estimations
  static async addEstimation(estData) {
    const data = new FormData();
    for (let i = 0; i < estData.files.length; i++) {
      data.append("files", estData.files[i]);
    }
    // data.append("files", estData.files);
    data.append("rfqId", estData.rfqId);
    data.append("description", estData.description);
    data.append("projectName", estData.projectName);
    data.append("fabricatorId", estData.fabricatorId);
    data.append("estimateDate", estData.estimateDate);
    data.append("estimationNumber", estData.estimationNumber);
    data.append("tools", estData.tools);

    const token = sessionStorage.getItem("token");
    try {
      const response = await api.post(`/api/Estimation/addEstimation`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error fetching estimations:", error);
      throw error;
    }
  }

  // Fetch all estimations
  static async allEstimations() {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(`/api/Estimation/getAllEstimations`, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error fetching estimations:", error);
      throw error;
    }
  }

  // Fetch estimation by ID
  static async getEstimationById(estimationId) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(
        `/api/Estimation/getEstimation/${estimationId}`,
        {
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.log("Error fetching estimation by ID:", error);
      throw error;
    }
  }

  //Add Estimation Task
  static async addEstimationTask(estimationId, taskData) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.post(
        `/api/EstimationTask/assignTask/${estimationId}/task`,
        taskData,
        {
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error adding estimation task:", error);
      throw error;
    }
  }

  //Fetch all estimation tasks
  static async allEstimationTasks() {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(`/api/EstimationTask/getAllTasks`, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error fetching all estimation tasks:", error);
      throw error;
    }
  }

  // Fetch all estimation tasks by estimation ID
  static async getEstimationTasksById(estimationTaskId) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(
        `/api/EstimationTask/task/${estimationTaskId}`,
        {
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.log("Error fetching estimation tasks by ID:", error);
      throw error;
    }
  }
  // Fetch all estimation tasks by estimation ID
  static async editEstimationTasksById(estimationTaskId) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(
        `/api/EstimationTask/task/${estimationTaskId}`,
        {
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.log("Error fetching estimation tasks by ID:", error);
      throw error;
    }
  }

  //update Estimation Task Line Items by ID
  static async updateEstimationTaskLineItemsById(lineItemID, lineItemData) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.patch(
        `/api/Estimation/estimationLineItems/${lineItemID}`,
        lineItemData,
        {
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error updating line items:", error);
      throw error;
    }
  }

  // Add JobStudy
  static async addJobStudy(jobData) {
    const formData = { ...jobData };
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.post(`/api/br/addJobStudy`, formData, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error adding job study:", error);
      throw error;
    }
  }

  //All JobStudy
  static async allJobStudy(projectId) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(`/api/br/getJobStudy/${projectId}`, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.log("Error fetching all job studies:", error);
      throw error;
    }
  }

  static async allSubTasks(projectId, wbActivityId, projectStage) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(
        `/api/st/${projectId}/${wbActivityId}/${projectStage}`,
        {
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data?.data;
    } catch (error) {
      console.log("Error fetching all job studies:", error);
      throw error;
    }
  }

  //Add WorkBreakdown
  static async addWorkBreakdown(projectId, wbActivityId, workBreakdownData) {
    const formData = { ...workBreakdownData };
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.post(
        `/api/st/add/${projectId}/${wbActivityId}`,
        formData,
        {
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error adding work breakdown:", error);
      throw error;
    }
  }
  //Add More Subtasks
  static async addOneSubTask(projectId, wbActivityId, workBreakdownData) {
    const formData = { ...workBreakdownData };
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.post(
        `/api/st/oneSubtask/${projectId}/${wbActivityId}`,
        formData,
        {
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.log("Error adding work breakdown:", error);
      throw error;
    }
  }

  //Add More Subtasks
  static async editOneSubTask(subtaskId, subtask) {
    const formData = { ...subtask };
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.patch(`/api/st/${subtaskId}`, formData, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.log("Error adding work breakdown:", error);
      throw error;
    }
  }

  // Add Teams -- updated
  static async addTeam(teamData) {
    try {
      const formData = { ...teamData };
      const response = await api.post(`/api/team/teams`, formData, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error adding team:", error);
      throw error;
    }
  }

  // Fetch all teams -- updated
  static async allteams() {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.get(`/api/team/teams`, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error fetching teams:", error);
      throw error;
    }
  }

  // Fetch team by ID -- updated
  static async getTeamById(teamId) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.get(`/api/team/teams/${teamId}`, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.log("Error fetching team:", error);
      throw error;
    }
  }

  //
  static async addTeamMember(teamID, data) {
    const formData = { ...data };
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.patch(
        `/api/team/teams/${teamID}/addmember`,
        formData,
        {
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error adding team member:", error);
      throw error;
    }
  }

  // Add CO#---> CO/coTable/coid
  static async addCO(coData) {
    const data = new FormData();

    // Append files
    for (let i = 0; i < coData?.files.length; i++) {
      data.append("files", coData?.files[i]);
    }
    // Append other fields
    // data.append("fabricator_id", coData?.fabricator_id);
    // data.append("changeOrderNumber", parseInt(coData?.changeOrderNumber));
    data.append("project", coData?.project_id);
    data.append("recipients", coData?.recipient_id);
    data.append("remarks", coData?.remark);
    data.append("Stage", coData?.stage);
    data.append("description", coData?.description);
    // data.append("rows", coData?.rows);

    try {
      const token = sessionStorage.getItem("token");
      const response = await api.post(`/api/CO/addco`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error adding CO:", error);
      throw error;
    }
  }

  //Add CO table
  static async addCOTable(coTable, id) {
    const coTableData = { ...coTable };
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.post(`/api/CO/coTable/${id}`, coTableData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error adding row to CO:", error);
      throw error;
    }
  }

  static async getListOfAllCOByProjectId(projectID) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.get(`/api/co/${projectID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching all COs:", error);
      throw error;
    }
  }

  //submitting co
  static async submitStatusOfCO(coId, formData) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.put(`api/co/updateStatus/${coId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading files:", error);
      throw error;
    }
  }

  //Update Co Detail
  static async updateCO(coId, formData) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.put(`api/co/changeorder/${coId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating CO:", error);
      throw error;
    }
  }

  //Update CO Table
  static async updateCOTable(coId, formData) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.put(
        `api/co/changeordertable/${coId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating CO Table:", error);
      throw error;
    }
  }

  //view CO table
  static async fetchCOTable(id) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.get(`/api/co/coRow/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/form-data",
        },
      });
      return response.data.data;
    } catch (error) {
      console.log("Error fetching CO:", error);
      throw error;
    }
  }

  //response of CO from client end-
  static async respondCO(coId, responseData) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.post(
        `/api/co/addResponse/${coId}`,
        responseData,
        {
          headers: {
            Authorizatiwwwwwwwwwon: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error responding to CO:", error);
      throw error;
    }
  }

  //view in admin
  static async allSentCO() {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.get(`/api/CO/sents`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error fetching CO:", error);
      throw error;
    }
  }
  static async allReceivedCO() {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.get(`/api/CO/receives`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error fetching CO:", error);
      throw error;
    }
  }

  static async getRFIByProjectId(projectId) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.get(`/api/RFI/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error fetching RFI:", error);
      throw error;
    }
  }

  static async inboxCO() {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.get(`/api/CO/receives`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error fetching RFI:", error);
      throw error;
    }
  }

  static async sentCO() {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.get(`/api/CO/sents`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (error) {
      console.log("Error fetching CO:", error);
      throw error;
    }
  }

  static async clientRecievedData() {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.get(`/api/CO/receives`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (error) {
      console.log("Error fetching CO:", error);
      throw error;
    }
  }

  //RFI
  static async addRFI(rfiData) {
    const data = new FormData();

    // Append files
    for (let i = 0; i < rfiData?.files.length; i++) {
      data.append("files", rfiData?.files[i]);
    }

    // Append other fields
    // Append other fields
    data.append("fabricator_id", rfiData?.fabricator_id);
    data.append("project_id", rfiData?.project_id);
    data.append("recipient_id", rfiData?.recipient_id);
    data.append("subject", rfiData?.subject);
    data.append("description", rfiData?.description);

    try {
      const token = sessionStorage.getItem("token");
      const response = await api.post(`/api/rfi/rfi/addrfi`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error adding RFI:", error);
      throw error;
    }
  }

  // respond RFI
  static async respondRfi(rfiId, responseData) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.post(
        `/api/RFI/rfi/addResponse/${rfiId}`,
        responseData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading files:", error);
      throw error;
    }
  }

  //fetch RFI response by ID
  static async fetchRFIResponseById(id) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.get(`/api/RFI/rfi/getResponse/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching RFI response:", error);
      throw error;
    }
  }

  static async inboxRFI() {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.get(`/api/RFI/rfi/inbox`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error fetching RFI:", error);
      throw error;
    }
  }

  static async sentRFI() {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.get(`/api/RFI/rfi/sent`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error fetching RFI:", error);
      throw error;
    }
  }

  //Fetch RFI by ID
  static async fetchRFIById(id) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.get(`/api/RFI/rfi/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error fetching RFI:", error);
      throw error;
    }
  }

  //Response of response of RFI
  static async respondWBTRfi(rfiID, responseData) {
    console.log("Response Data:", responseData);
    const data = new FormData();
    // Append files
    for (let i = 0; i < responseData?.files?.length; i++) {
      data.append("files", responseData?.files[i]);
    }
    // Append other fields
    data.append("reason", responseData?.reason);
    data.append("parentResponseId", responseData?.parentResponseId || null);
    data.append("status", responseData?.status || null);

    try {
      const token = sessionStorage.getItem("token");
      const response = await api.post(
        `/api/RFI/rfi/addresponse/${rfiID}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading files:", error);
      throw error;
    }
  }

  //Inbox RFQ
  static async inboxRFQ() {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.get(`/api/RFQ/rfq/inbox`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/form-data",
        },
      });
      return response.data.data;
    } catch (error) {
      console.log("Error fetching RFI:", error);
      throw error;
    }
  }
  //Sent RFQ
  static async sentRFQ() {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.get(`/api/RFQ/rfq/sent`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/form-data",
        },
      });
      return response.data.data;
    } catch (error) {
      console.log("Error fetching RFI:", error);
      throw error;
    }
  }

  // Fetch rfq response
  static async fetchRFQResponseById(id) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.get(`/api/RFQ/getResponse/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error fetching RFQ Response:", error);
      throw error;
    }
  }
  // Fetch rfq response
  static async fetchRFQOfResponseById(id) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.get(`/api/RFQ/getResponse/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/form-data",
        },
      });
      return response.data?.data;
    } catch (error) {
      console.log("Error fetching RFQ Response:", error);
      throw error;
    }
  }

  //Add RFQ

  static async addRFQ(RFQData) {
    console.log(RFQData);
    const data = new FormData();

    // Append files
    for (let i = 0; i < RFQData?.files?.length; i++) {
      data.append("files", RFQData?.files[i]);
    }

    data.append("fabricatorId", RFQData?.fabricatorId || "");
    data.append("projectName", RFQData?.projectName || "");
    data.append("projectNumber", RFQData?.projectNumber || "");
    data.append(
      "detailingMain",
      typeof RFQData?.detailingMain === "boolean"
        ? RFQData?.detailingMain
        : !!RFQData?.detailingMain || false
    );
    data.append(
      "detailingMisc",
      typeof RFQData?.detailingMisc === "boolean"
        ? RFQData?.detailingMisc
        : !!RFQData?.detailingMisc || false
    );
    data.append(
      "connectionDesign",
      typeof RFQData?.connectionDesign === "boolean"
        ? RFQData?.connectionDesign
        : !!RFQData?.connectionDesign || false
    );
    data.append(
      "miscDesign",
      typeof RFQData?.miscDesign === "boolean"
        ? RFQData?.miscDesign
        : !!RFQData?.miscDesign || false
    );
    data.append(
      "customer",
      typeof RFQData?.customer === "boolean"
        ? RFQData?.customer
        : !!RFQData?.customer || false
    );
    data.append("recepient_id", RFQData?.recipient_id || "");
    data.append("subject", RFQData?.subject || "");
    data.append("description", RFQData?.description || "");
    data.append("bidPrice", RFQData?.bidPrice || "");
    data.append("salesPersonId", RFQData?.salesPersonId || "");
    data.append("sender_id", RFQData?.sender_id || "");
    data.append("estimationDate", RFQData?.estimationDate || "");

    console.log("Form Data Entries:");
    for (let [key, value] of data.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const token = sessionStorage.getItem("token");
      const response = await api.post(`/api/RFQ/rfq/addrfq`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error fetching RFI:", error);
      throw error;
    }
  }

  //Respond rfq

  static async respondRfq(rfqId, formData) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.post(
        `/api/RFQ/addresponse/${rfqId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading files:", error);
      throw error;
    }
  }
  //Respond rfq

  static async respondClientRfq(rfqID, responseData) {
    const data = new FormData();
    // Append files
    for (let i = 0; i < responseData?.files?.length; i++) {
      data.append("files", responseData?.files[i]);
    }
    // Append other fields
    data.append("description", responseData?.description);
    data.append("parentResponseId", responseData?.parentResponseId || null);
    data.append("status", responseData?.status || null);

    try {
      const token = sessionStorage.getItem("token");
      const response = await api.post(`/api/RFQ/addresponse/${rfqID}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading files:", error);
      throw error;
    }
  }

  // Submittals
  static async addSubmittal(submittals) {
    const data = new FormData();

    // Append files
    for (let i = 0; i < submittals?.files.length; i++) {
      data.append("files", submittals?.files[i]);
    }

    // Append other fields
    data.append("fabricator_id", submittals?.fabricator_id);
    data.append("project_id", submittals?.project_id);
    data.append("recepient_id", submittals?.recepient_id);
    data.append("subject", submittals?.subject);
    data.append("description", submittals?.description);

    try {
      const token = sessionStorage.getItem("token");
      const response = await api.post(`/api/submittals/submittals`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error adding RFI:", error);
      throw error;
    }
  }
  // Get sent Submittals
  static async getSentSubmittals(submittalsId) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.get(
        `/api/submittals/getSubmittals/${submittalsId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.log("Error adding RFI:", error);
      throw error;
    }
  }

  static async getSubmittalByProjectId(projectId) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.get(`/api/Submittals/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error fetching RFI:", error);
      throw error;
    }
  }

  //get sent rfi response
  static async getSentRFIResponse(rfiId) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.get(`/api/RFI/getResponse/${rfiId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error adding RFI:", error);
      throw error;
    }
  }

  // Fetch submittals
  // Fetch sent submittals
  static async sentSubmittal() {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.get(`/api/submittals/submittals/sent`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.data;
    } catch (error) {
      console.log("Error adding RFI:", error);
      throw error;
    }
  }

  // Fetch recivied Submittal
  static async reciviedSubmittal() {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.get(`/api/submittals/submittals/recieved`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error adding RFI:", error);
      throw error;
    }
  }
  // Fetch submittal response client->admin
  static async fetchSubmittalsResponse(submittalResponseId) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.get(
        `/api/submittals/getResponse/${submittalResponseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error adding RFI:", error);
      throw error;
    }
  }

  static async respondSubmittals(submittalsId, formData) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.post(
        `/api/submittals/addresponse/${submittalsId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading files:", error);
      throw error;
    }
  }

  // Edit Submittal
  static async editSubmittal(submittalId, formData) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.put(
        `/api/submittals/update/${submittalId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading files:", error);
      throw error;
    }
  }

  //update Rfi
  static async updateRFI(rfiId, formData) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.put(
        `/api/RFI/update/${rfiId}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading files:", error);
      throw error;
    }
  }

  //response rfi
  static async respondRFI(rfiId, formData) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.post(
        `/api/RFI/rfi/addResponse/${rfiId}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading files:", error);
      throw error;
    }
  }

  // Update Job Study
  static async updateJobStudy(jobStudyId, data) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.patch(
        `/api/br/putJobStudy/${jobStudyId}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error updating job study:", error);
      throw error;
    }
  }

  //Fetch workBreakdown Activity
  static async fetchWorkBreakdownActivity(
    selectedTask,
    projectId,
    projectStage
  ) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(
        `/api/wbs/wbs/${selectedTask}/${projectId}/${projectStage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.log("Error fetching work breakdown activity:", error);
    }
  }
  //Fetch workBreakdown Activity
  static async fetchWorkBreakdownHours(selectedTask, projectId, projectStage) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(
        `/api/wbs/wbs/totalHours/${selectedTask}/${projectId}/${projectStage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.log("Error fetching work breakdown activity:", error);
    }
  }
  static async fetchWorkBreakdownTotalHours(projectId, projectStage) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(
        `/api/wbs/totalWbsHours/${projectId}/${projectStage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.log("Error fetching work breakdown activity:", error);
    }
  }

  static async getAllTask() {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(`/api/task/tasks/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response?.data?.data;
    } catch (error) {
      console.log("Error in getting Task: ", error);
      throw error;
    }
  }

  //add Group for groupchatting
  static async addGroup(groupData) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.post(`/api/chat/createGroup`, groupData, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.log("Error in adding Group: ", error);
      throw error;
    }
  }

  //add Group Member
  static async addGroupMember(groupId, memberIds) {
    const formData = [...memberIds];
    try {
      const response = await api.post(
        `/api/chat/group/addMember/${groupId}`,
        formData,
        {
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error in adding Group Member: ", error);
      throw error;
    }
  }

  // Fetch all groups members
  static async getGroupMembers(groupId) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(`/api/chat/getGroupMembers/${groupId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.log("Error in getting Group Members: ", error);
      throw error;
    }
  }

  // Delete Group Member
  static async deleteGroupMember(groupId, memberId) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.delete(
        `/api/chat/removeMember/${groupId}/${memberId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error in deleting Group Member: ", error);
      throw error;
    }
  }

  // Fetch the Chat by GroupID
  static async getChatByGroupId(groupId, lastMsgId) {
    const params = new URLSearchParams();

    if (lastMsgId) {
      params.append("lastMessageId", lastMsgId);
    }

    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(
        `/api/chat/groupMessages/${groupId}?${params.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.log("Error in getting Group Chat: ", error);
      throw error;
    }
  }

  // Fetch all chats
  static async getAllChats() {
    try {
      const response = await api.get(`/api/chat/recent-chats`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.log("Error in getting all chats: ", error);
      throw error;
    }
  }

  //Delete member by ID
  static async deleteMemberById(memberId, groupId) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.delete(
        `/api/chat/removeMember/${groupId}/${memberId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error in deleting member: ", error);
      throw error;
    }
  }

  //Export CSV
  static async exportCSV() {
    try {
      const response = await api.get(`/api/auth/exports/projects`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error in exporting CSV: ", error);
      throw error;
    }
  }

  //Notes
  static async addNotes(noteData, projectID) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.post(
        `/api/Note/addNote/${projectID}`,
        noteData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error in adding Notes: ", error);
      throw error;
    }
  }

  //list of notes by project ID
  static async getNotesByProjectId(projectID) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(`/api/Note/notes/${projectID}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error in getting Notes: ", error);
      throw error;
    }
  }

  //adding milestone
  static async addMilestone(milestoneData, projectID, fabricatorID) {
    console.log(milestoneData, projectID, fabricatorID);
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.post(
        `/api/Milestone/add/${projectID}/${fabricatorID}`,
        milestoneData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error in adding Milestone: ", error);
      throw error;
    }
  }

  //fetching all milestones
  static async getAllMilestones() {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(`/api/Milestone/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error in fetching all Milestones: ", error);
      throw error;
    }
  }

  //fetching milestone by project ID
  static async getMilestoneByProjectId(projectID) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(`/api/Milestone/project/${projectID}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error in fetching Milestones by project ID: ", error);
      throw error;
    }
  }

  //fetch milestone by ID
  static async getMilestoneById(milestoneID) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(`/api/Milestone/${milestoneID}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error in fetching Milestone by ID: ", error);
      throw error;
    }
  }

  //update milestone by ID
  static async updateMilestoneById(milestoneID, milestoneData) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.patch(
        `/api/Milestone/update/${milestoneID}`,
        milestoneData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error in updating Milestone by ID: ", error);
      throw error;
    }
  }

  //delete milestone by ID
  static async deleteMilestoneById(milestoneID) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.delete(
        `/api/Milestone/delete/${milestoneID}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error in deleting Milestone by ID: ", error);
      throw error;
    }
  }

  //adding files by Project ID
  static async addFilesByProjectId(projectID, documentData) {
    const data = new FormData();
    for (let i = 0; i < documentData?.files.length; i++) {
      data.append("files", documentData?.files[i]);
    }
    data.append("description", documentData?.description);
    data.append("stage", documentData?.stage);

    const token = sessionStorage.getItem("token");
    try {
      const response = await api.post(
        `/api/designDrawings/designdrawing/add/${projectID}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error in adding Files by Project ID: ", error);
      throw error;
    }
  }

  //get files by Project ID
  static async getFilesByProjectId(projectID) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(
        `/api/designDrawings/designdrawing/project/${projectID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error in getting Files by Project ID: ", error);
      throw error;
    }
  }

  //viewFiles by Project ID
  static async viewFilesByProjectId(fileID, projectID) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(
        `/api/designDrawings/designdrawing/viewfile/${fileID}/${projectID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error in viewing Files by Project ID: ", error);
      throw error;
    }
  }

  //viewFiles by Fabricator ID

  static async fetchNotification() {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get(`/api/notifications/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.log("Error in fetching Notification: ", error);
      throw error;
    }
  }

  //route to update the status of Notification
  static async UpdateNotification(id) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.patch(`/api/notifications/read/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.log("Error in fetching Notification: ", error);
      throw error;
    }
  }

  static async AddInvoice(invoiceData) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.post(`/api/invoice/`, invoiceData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);

      return response?.data;
    } catch (error) {
      console.log(error, "Error while adding invoice");
    }
  }
  static async AllInvoice() {
    try {
      const response = await api.get(`/api/invoice`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error, "Error while adding invoice");
    }
  }
  static async InvoiceByID(id) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/api/invoice/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error, "error while fetching the invoice");
    }
  }
  // static async AddBankData(bankData) {
  //   const token = sessionStorage.getItem("token");
  //   try {
  //     const response = await api.post(`/api/invoice/${id}/account`, bankData, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     console.log(response.data);

  //     return response?.data;
  //   } catch (error) {
  //     console.log(error, "Error while adding bankdetails");
  //   }
  // }
  static async AddBankAccount(payload) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(`/api/invoice/accountInfo`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error adding bank account:", error);
      throw error;
    }
  }
  static async FetchAllBanks() {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/api/invoice/accounts/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error, "failed to load the all the bank accounts ");
      throw error;
    }
  }
  static async FetchBankById(id) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/api/invoice//account/${id}/account`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error, "failed to load the bank detail ");
      throw error;
    }
  }
  static async deleteInvoiceByID(id) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.delete(`/api/invoice/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error in deleting Invoice by ID: ", error);
      throw error;
    }
  }
  static async deleteBankByID(id) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.delete(`/api/invoice/account/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error in deleting bank by ID: ", error);
      throw error;
    }
  }
}

export default Service;
