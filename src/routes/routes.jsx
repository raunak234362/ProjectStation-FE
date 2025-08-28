/* eslint-disable no-unused-vars */
//For WBT-Admin
import {
  ErrorBoundary,
  MainContent,
  ManageTeam,
  ChangePassword,

  Chats,
} from "../components/index.js";


import LoginContent from "../pages/login/LoginContent";
import App from "../App.jsx";
import RequireAuth from "../middleware/RequireAuth.jsx";
import FabricatorView from "../pages/fabricator/FabricatorView.jsx";
import ProjectView from "../pages/project/ProjectView.jsx";
import HomeView from "../pages/homeView/HomeView.jsx";
import RFQ from "../pages/rfq/RFQ.jsx";
import EstimationView from "../pages/estimation/EstimationView.jsx";
import CoListTable from "../components/changeOrder/details/CoListTable.jsx";
import CoListTablePage from "../pages/coListTable/CoListTablePage.jsx";

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
            path: "team",
            element: <ManageTeam />,
          },
          {
            path: "rfq",
            element: <RFQ />,
          },
          {
            path:"estimation",
            element:<EstimationView/>
          }
        ],
      },
      
    ],
  },
  {
    path:"/co-table",
    element:<CoListTablePage />
  },

  { path: "*", element: <ErrorBoundary /> },
];

export default routes;
