//Authentication
import Login from "./login/Login";

//Dashboard
import Dashboard from "./dashboard/staff/admin/dashboard/Dashboard";
import MainContent from "./dashboard/main/MainContent";
import ChangePassword from "./dashboard/main/ChangePassword";
import Sidebar from "./sidebar/Sidebar.jsx";
import Header from "./dashboard/header/Header";

//Project
import AddProject from "./project/AddProject.jsx";
import EditProject from "./dashboard/staff/admin/Project/EditProject";
import GetProject from "./dashboard/staff/admin/Project/GetProject";
import AddFiles from "./dashboard/staff/admin/Project/AddFiles";
import ProjectDashboard from "./dashboard/staff/admin/Project/ProjectDashboard";
//Work Breakdown
import AddWB from "./dashboard/staff/admin/Project/wb/AddWB";
import JobStudy from "./dashboard/staff/admin/Project/wb/JobStudy";
import SelectedWBTask from "./dashboard/staff/admin/Project/wb/SelectedWBTask";

//RFQ
import RFQ from "./dashboard/staff/admin/rfq/RFQ";
import AllRFQ from "./dashboard/staff/admin/rfq/AllRFQ.jsx";
import SendRFQ from "./dashboard/staff/admin/rfq/SendRFQ.jsx";
import ShowRFQResponse from "./dashboard/staff/admin/rfq/ShowRFQResponse.jsx";

//Fabricator
import AddFabricator from "./fabricator/AddFabricator.jsx";
import AddClient from "./fabricator/AddClient.jsx";
import GetFabricator from "./fabricator/GetFabricator.jsx";
import AllFabricator from "./fabricator/AllFabricator.jsx";
//Team
import AllTeam from "./dashboard/staff/admin/Team/AllTeam.jsx";
import AddTeam from "./dashboard/staff/admin/Team/AddTeam";
import ManageTeam from "./dashboard/staff/admin/Team/ManageTeam";
import AddEmployee from "./dashboard/staff/admin/Team/AddEmployee";
import AllEmployees from "./dashboard/staff/admin/Team/AllEmployees";
import AllDepartment from "./dashboard/staff/admin/Team/AllDepartment";
import AddDepartment from "./dashboard/staff/admin/Team/AddDepartment";

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
import RFI from "./dashboard/staff/admin/rfi/RFI";
import CreateRFI from "./dashboard/staff/admin/rfi/CreateRFI";
import AllSentRFI from "./dashboard/staff/admin/rfi/AllSentRFI";
import AllReceivedRFI from "./dashboard/staff/admin/rfi/AllReceivedRFI";
import GetSentRFI from "./dashboard/staff/admin/rfi/GetSentRFI";

//Submittals
import Submittals from "./dashboard/staff/admin/submittals/Submittals";
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
  Input,
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
  EditProject,
  AddWB,
  RFQ,
  AllRFQ,
  Chats,
  SendRFQ,
  ShowRFQResponse,
  JobStudy,
  SelectedWBTask,
  ProjectDashboard,
  ManageTeam,
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
