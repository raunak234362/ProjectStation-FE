//Authentication
import Login from "./login/Login";

//Dashboard
import Dashboard from "./dashboard/staff/admin/dashboard/Dashboard";
import WBTDashboard from "./dashboardComponent/WBTDashboard.jsx";
import ClientDashboard from "./dashboardComponent/ClientDashboard.jsx";
import SalesDashboard from "./dashboardComponent/SalesDashboard.jsx";
import MainContent from "./dashboard/main/MainContent";
import ChangePassword from "./dashboard/main/ChangePassword";
import Sidebar from "./sidebar/Sidebar.jsx";
import Header from "./dashboard/header/Header";

//Project
import AddProject from "./project/AddProject.jsx";
import AllProjects from "./project/AllProjects.jsx";
import ProjectStatus from "./project/projectTab/ProjectStatus.jsx";
import EditProject from "./dashboard/staff/admin/Project/EditProject";
import GetProject from "./project/projectTab/GetProject.jsx";
import AddFiles from "./dashboard/staff/admin/Project/AddFiles";
import ProjectDashboard from "./dashboard/staff/admin/Project/ProjectDashboard";
//Work Breakdown
import AddWB from "./dashboard/staff/admin/Project/wb/AddWB";
import JobStudy from "./dashboard/staff/admin/Project/wb/JobStudy";
import SelectedWBTask from "./dashboard/staff/admin/Project/wb/SelectedWBTask";
//RFQ
import AllRFQ from "./dashboard/staff/admin/rfq/AllRFQ.jsx";
import SendRFQ from "./dashboard/staff/admin/rfq/SendRFQ.jsx";
import ShowRFQResponse from "./dashboard/staff/admin/rfq/ShowRFQResponse.jsx";

//Fabricator
import AddFabricator from "./fabricator/AddFabricator.jsx";
import AddClient from "./fabricator/AddClient.jsx";
import GetFabricator from "./fabricator/GetFabricator.jsx";
import AllFabricator from "./fabricator/AllFabricator.jsx";
//Team
import ManageTeam from "../view/Team/ManageTeam.jsx"
import AllTeam from "./dashboard/staff/admin/Team/AllTeam.jsx";
import AddTeam from "./dashboard/staff/admin/Team/AddTeam";
import AddEmployee from "./Team/AddEmployee";
import AllEmployees from "./Team/AllEmployee";
import AllDepartment from "./Team/AllDepartment";
import AddDepartment from "./Team/AddDepartment";

//Vendor
import Vendor from "./dashboard/staff/admin/vendor/Vendor";
import AddVendor from "./dashboard/staff/admin/vendor/AddVendor";
import AllVendors from "./dashboard/staff/admin/vendor/AllVendors";
import AllVendorUser from "./dashboard/staff/admin/vendor/AllVendorUser";
import AddVendorUser from "./dashboard/staff/admin/vendor/AddVendorUser";
import GetVendor from "./dashboard/staff/admin/vendor/GetVendor";
import GetVendorUser from "./dashboard/staff/admin/vendor/GetVendorUser";
import AddVendorBranch from "./dashboard/staff/admin/vendor/AddVendorBranch";

//RFI
import RFI from "./rfi/RFI.jsx";
import CreateRFI from "./dashboard/staff/admin/rfi/CreateRFI";
import AllSentRFI from "./dashboard/staff/admin/rfi/AllSentRFI";
import AllReceivedRFI from "./dashboard/staff/admin/rfi/AllReceivedRFI";
import GetSentRFI from "./dashboard/staff/admin/rfi/GetSentRFI";

//RFQ 
import RFQ from "./rfq/RFQ.jsx";


//Submittals
import Submittals from "./submittals/Submittals.jsx";
import SendSubmittals from "./dashboard/staff/admin/submittals/SendSubmittals";
import AllReceivedSubmittals from "./dashboard/staff/admin/submittals/AllReceivedSubmittals";
import AllSubmittals from "./dashboard/staff/admin/submittals/AllSubmittals";

//Change Order
import CO from "./dashboard/staff/admin/co/CO";
import AllSentCO from "./dashboard/staff/admin/co/AllSentCO";
import AllReceivedCO from "./dashboard/staff/admin/co/AllReceivedCO";
import SendCO from "./dashboard/staff/admin/co/SendCO";
// import AllCO from "./dashboard/client/admin/co/AllCO.jsx"

//Chats
import Chats from "./dashboard/staff/admin/chats/Chats";

//Error Handling
import ErrorBoundary from "./error/ErrorBoundary";

// fields
import Button from "./fields/Button";
import Input from "./fields/Input";
import CustomSelect from "./fields/Select";
import Toggle from "./fields/Toggle";
import MultipleFileUpload from "./fields/MultipleFileUpload";

//utils
import ReusableTable from "../util/ReusableTable.jsx";
import DateFilter from "../util/DateFilter.jsx";
export {
  Button,
  WBTDashboard,
  RFQ,
  ClientDashboard,
  SalesDashboard,
  Input,
  ManageTeam,
  CustomSelect,
  Toggle,
  AddFiles,
  MultipleFileUpload,
  Login,
  Dashboard,
  AddFabricator,
  AddClient,
  GetFabricator,
  AllFabricator,
  ReusableTable,
  DateFilter,
  MainContent,
  ChangePassword,
  Sidebar,
  Header,
  AddProject,
  GetProject,
  AllProjects,
  ProjectStatus,
  EditProject,
  AddWB,
  AllRFQ,
  Chats,
  SendRFQ,
  ShowRFQResponse,
  JobStudy,
  SelectedWBTask,
  ProjectDashboard,
  AddEmployee,
  AllEmployees,
  AllDepartment,
  AddDepartment,
  Vendor,
  AddVendor,
  AllVendors,
  AllVendorUser,
  GetVendor,
  AddVendorUser,
  GetVendorUser,
  AddVendorBranch,
  RFI,
  CreateRFI,
  AllSentRFI,
  AllReceivedRFI,
  GetSentRFI,
  Submittals,
  SendSubmittals,
  AllReceivedSubmittals,
  AllSubmittals,
  CO,
  // AllCO,
  AllSentCO,
  AllReceivedCO,
  SendCO,
  AllTeam,
  AddTeam,
  ErrorBoundary,
};
