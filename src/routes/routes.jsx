/* eslint-disable no-unused-vars */
//For WBT-Admin
import {
  AddProject,
  AddVendor,
  EditProject,
  ErrorBoundary,
  MainContent,
  ManageTeam,
  Vendor,
  AllVendors,
  ChangePassword,
  AllVendorUser,
  AddVendorUser,
  RFI,
  CreateRFI,
  AllSentRFI,
  AllReceivedRFI,
  Submittals,
  SendSubmittals,
  AllReceivedSubmittals,
  AllSubmittals,
  CO,
  SendCO,
  AllReceivedCO,
  AllSentCO,
  ProjectDashboard,
  RFQ,
  AllRFQ,
  Chats,
} from "../components/index.js";

//For Client-Admin
import {
  Dashboard as ClientDashboard,
  Project as ClientProject,
  ClientAllProjects,
  ClientCreateRFI,
  AllReceivedRFI as ClientAllReceivedRFI,
  AllSentRFI as ClientAllSentRFI,
  ChangeOrder as ClientCO,
  //to see add AllCO here
  AllCO as ClientAllCO,
  Team as ClientTeam,
  Submittals as ClientSubmittals,
  AllReceivedSubmittals as ClientAllReceivedSubmittals,
  AllSubmittals as ClientAllSubmittals,
  GetSentSubmittals as ClientGetSentSubmittals,
  SendSubmittals as ClientSendSubmittals,
  Project,
  AddRFQ,
} from "../components/dashboard/client/clientIndex.js";

//For Sales-Admin
import {
  Dashboard as SalesDashboard,
  Project as SalesProject,
  SalesRFQ,
} from "../components/dashboard/staff/sales/salesIndex.js";


import LoginContent from "../view/login/LoginContent";
import App from "../App.jsx";
import TeamDashboard from "../components/Team/teamDashboard/TeamDashboard.jsx";
import RequireAuth from "../middleware/RequireAuth.jsx";
import FabricatorView from "../view/fabricator/FabricatorView.jsx";
import ProjectView from "../view/project/ProjectView.jsx";
import HomeView from "../view/homeView/HomeView.jsx";


//For Sales-Admin
// import {Dashboard as SalesDashboard} from './components/dashboard/staff/sales/dashboard/Dashboard.jsx'

const routes = [
  {
    path: "/",
    element: <LoginContent />,
  },
  {
    path: "/change-password/",
    element: <ChangePassword />,
  },

  {
    element: <RequireAuth />,
    children: [
      {
        path: "/dashboard",
        element: <App />,
        children: [
          {
            path: "",
            element: <HomeView />,
          },
          {
            path: "profile",
            element: <MainContent />,
          },
          {
            path: "project",
            element: <ProjectView />,
          },
          {
            path: "fabricator",
            element: <FabricatorView />,
          },
          {
            path: "chats",
            element: <Chats />,
          },
          {
            path: "vendor",
            element: <Vendor />,
            children: [
              { path: "add-vendor", element: <AddVendor /> },
              { path: "all-vendors", element: <AllVendors /> },
              { path: "all-vendor-user", element: <AllVendorUser /> },
              { path: "add-vendor-user", element: <AddVendorUser /> },
            ],
          },
          {
            path: "team",
            element: <ManageTeam />,
            
          },
          {
            path: "rfi",
            element: <RFI />,
            children: [
              { path: "create-rfi", element: <CreateRFI /> },
              { path: "all-sent-rfi", element: <AllSentRFI /> },
              { path: "all-received-rfi", element: <AllReceivedRFI /> },
            ],
          },
          {
            path: "submittals",
            element: <Submittals />,
            children: [
              { path: "send-submittals", element: <SendSubmittals /> },
              {
                path: "all-received-submittals",
                element: <AllReceivedSubmittals />,
              },
              { path: "all-submittals", element: <AllSubmittals /> },
            ],
          },
          {
            path: "change-order",
            element: <CO />,
            children: [
              { path: "send-co", element: <SendCO /> },
              { path: "all-received-co", element: <AllReceivedCO /> },
              { path: "all-sent-co", element: <AllSentCO /> },
            ],
          },
          {
            path: "rfq",
            element: <RFQ />,
            children: [
              { path: "all-rfq", element: <AllRFQ /> },
              { path: "add-rfq", element: <AddRFQ /> },
            ],
          },
        ],
      },
      {
        path: "/department-manager",
        element: <App />,
      },
      {
        path: "/client",
        element: <App />,
        children: [
          {
            path: "profile",
            element: <MainContent />,
          },
          {
            path: "dashboard",
            element: <ClientDashboard />,
          },
          {
            path: "project",
            element: <ClientProject />,
            children: [
              { path: "projects", element: <ClientAllProjects /> },
              // {path:'create-project',element:<CreateProject/>},
            ],
          },
          {
            path: "rfq",
            element: <RFQ />,
            
          },
          {
            path: "rfi",
            element: <RFI />,
            children: [
              { path: "create-rfi", element: <ClientCreateRFI /> },
              { path: "all-sent-rfi", element: <ClientAllSentRFI /> },
              { path: "all-received-rfi", element: <ClientAllReceivedRFI /> },
            ],
          },
          {
            path: "submittals",
            element: <ClientSubmittals />,
            children: [
              { path: "all-submittals", element: <ClientAllSubmittals /> },
              { path: "send-submittals", element: <ClientSendSubmittals /> },
              {
                path: "all-received-submittals",
                element: <ClientAllReceivedSubmittals />,
              },
              { path: "get-sent-submittals", element: <ClientGetSentSubmittals /> },
            ],
          },
          {
            path: "change-order",
            element: <ClientCO />,
            children: [{ path: "all-co", element: <ClientAllCO /> }],
          },
          {
            path: "team",
            element: <ClientTeam />,
          },
        ],
      },
      {
        path: "sales",
        element: <App />,
        children: [
          {
            path: "dashboard",
            element: <SalesDashboard />,
          },
          {
            path: "profile",
            element: <MainContent />,
          },
          {
            path: "project",
            element: <SalesProject />,
            children: [
              { path: "projects", element: <ProjectDashboard /> },
              { path: "add-project", element: <AddProject /> },
              { path: "edit-project", element: <EditProject /> },
            ],
          },
          {
            path: "fabricator",
            element: <FabricatorView />,
          },
          {
            path: "rfq",
            element: <SalesRFQ />,
            children: [
              { path: "", element: <AllRFQ /> },
              // { path: "add-rfq", element: <AddRFQ /> },
            ],
          },
          {
            path: "rfi",
            element: <RFI />,
            children: [
              { path: "create-rfi", element: <CreateRFI /> },
              { path: "all-sent-rfi", element: <AllSentRFI /> },
              { path: "all-received-rfi", element: <AllReceivedRFI /> },
            ],
          },
          {
            path: "submittals",
            element: <Submittals />,
            children: [
              { path: "send-submittals", element: <SendSubmittals /> },
              {
                path: "all-received-submittals",
                element: <AllReceivedSubmittals />,
              },
              { path: "all-submittals", element: <AllSubmittals /> },
            ],
          },
          {
            path: "change-order",
            element: <CO />,
            children: [
              { path: "send-co", element: <SendCO /> },
              { path: "all-received-co", element: <AllReceivedCO /> },
              { path: "all-sent-co", element: <AllSentCO /> },
            ],
          },
        ],
      },
    ]
  },

  { path: "*", element: <ErrorBoundary /> },
];

export default routes;
