import React from "react";
import DailyAttendance from "../daily_attendance/DailyAttendance";
import { useState, useEffect } from "react";
import Home from "./Home";
import MonthlyAttendancePage from "../monthly_attendance/MonthlyAttendancePage";
import ApprovalSetupPage from "../approval_setup/ApprovalSetupPage";
import { Link,useNavigate, useParams } from "react-router-dom";

import {
  gray500,
  gray100,
  red500,
  gray300,
  gray400,
  green100,
  green600,
} from "../../utils/colors";
import AddEmployeePage from "../add_employee/AddEmployeePage";

import AdminInfoService from "../../services/AdminInfoService";
import getPropicService from "../../services/PropicService";
import AddLatLong from "../add_lat_long/AddLatLong";
import EmployeeInfoPage from "../employee_info/EmployeeInfoPage";
import StickyHeadTable from "../employee_info/EmployeeInfoPage2";
import GeoFencePage from "../add_lat_long/GeoFencePage";
import AddOfficeTimePage from "../add_office_time/AddOfficeTimePage";
import OfficeTimePage from "../add_office_time/OfficeTimePage";
import HolidayUploadPage from "../../upload/component/HolidayUploadPage";
import CompanyWisePlant from "../company_plant/CompanyWisePlant";
import CreateNoticePage from "../../notice/component/CreateNoticePage";
import YearlyLeavePage from "../../leave/compoent/YearlyLeavePage";
import CreateMoveOrderPage from "../../move_order/component/CreateMoveOrderPage";
import DailyMealOffListPage from "../../meal/component/DailyMealOffListPage";
import MyMoveOrderPage from "../../move_order/component/MyMoveOrderPage";
import MoveOrderHomePage from "../../move_order/component/MoveOrderHomePage";
import { MoveOrderProvider } from "../../move_order/context/MoveContext";
import CreateIouPage from "../../iou/component/CreateIouPage";
import MyIouPage from "../../iou/component/MyIouPage";
import MyIouHome from "../../iou/component/MyIouHome";
import { IouProvider } from "../../iou/context/IouContext";
import CreateRequisitionPage from "../../requisition/component/CreateRequisitionPage";
import { RequisitionProvider } from "../../requisition/context/RequisitionContext";
import MyRequisitionHome from "../../requisition/component/MyRequisitionHome";
import { baseUrl } from "../../utils/path";
import FrontDeskReportPage from "../../front_desk_report/component/FrontDeskReportPage";
import RequisitionPage from "../../requisition/component/RequisitionPage";
import { useHomePageContext } from "./HomePageContext";
import IouPage from "../../iou/component/IouPage";
import MoveOrderPage from "../../move_order/component/MoveOrderPage";
import RoleManagementPage from "../../role_management/component/RoleManagementPage";
import CreateRolePage from "../../role_creation/component/CreateRolePage";
import UserRoleMenuAssignmentPage from "../../user_role_menu/component/UserRoleMenuAssignmentPage";
import FrontDeskAccessPage from "../../front_desk_access/component/FrontDeskAccessPage";
import SiteAttendanceUploadPage from "../../site_attendance/component/SiteAttendanceUploadPage";
import SyncPositionPage from "../../syncPosition/component/SyncPositionPage";
import JobSyncPage from "../../job_sync/component/JobSyncPage";
import UserRolePage from "../../role_access/component/UserRolePage";
// import UserRoleAccessPage from "../../role_access/component/UserRoleAccessPage";
import { tabUrl } from "../../utils/tabUrl";
import { tab } from "@testing-library/user-event/dist/tab";
import RequisitionReportPage from "../../requisition_report/component/RequisitionReportPage";
import DailyAttendanceReportPage from "../daily_attendance_report/component/DailyAttendanceReportPage";
import MoveOrderReportPage from "../../move_order_report/component/MoveOrderReportPage";
import LeaveHistoryPage from "../../leave_history/component/LeaveHistoryPage";
import { LeaveProvider } from "../../leave_history/context/LeaveContext";
import MonthlyAttendanceReport from "../../monthly_attendance/components/MonthlyAttendanceReport";
const infoUrl = `${baseUrl}my_info`;
// const getImageUrl = `${baseUrl}employee_propic/`;
const getImageUrl = `${baseUrl}get_emp_propic`;

const menuIcons = {
  3000: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25",
  4000: "M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25",
  5000: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10",
  6000: "M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z",
  7000: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
  8000: "M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25",
  9000: "M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z",
  10000: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
  11000:
    "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5",
  12000:
    "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99",
  1000: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
  13000:
    "M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z",
  14000:
    "M8.25 7.5l.415-.207a.75.75 0 011.085.67V10.5m0 0h6m-6 0h-1.5m1.5 0v5.438c0 .354.161.697.473.865a3.751 3.751 0 005.452-2.553c.083-.409-.263-.75-.68-.75h-.745M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  15000:
    "M8.25 7.5l.415-.207a.75.75 0 011.085.67V10.5m0 0h6m-6 0h-1.5m1.5 0v5.438c0 .354.161.697.473.865a3.751 3.751 0 005.452-2.553c.083-.409-.263-.75-.68-.75h-.745M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  2000: "M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25",
  17000: "M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z",
  18000:
    "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6",
  19000:
    "M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z",
  21000:
    "M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.003-2.024a.668.668 0 01.198-.471 1.575 1.575 0 10-2.228-2.228 3.818 3.818 0 00-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0116.35 15m.002 0h-.002",
  23000:
    "M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5",
  24000:
    "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z",
  25000:
    "M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z",
  // 26000:
  //   "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z",
  27000:
    "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z",
  28000:
    "M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z",
  29000:
    "M8.25 7.5l.415-.207a.75.75 0 011.085.67V10.5m0 0h6m-6 0h-1.5m1.5 0v5.438c0 .354.161.697.473.865a3.751 3.751 0 005.452-2.553c.083-.409-.263-.75-.68-.75h-.745M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  31000:
    "M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z",
  32000:
    "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",

};

export default function HomePage() {
  // const [menu, setMenu] = useState('daily');
  const [userId, setUserId] = useState("");
  const [adminDetails, setAdminDetails] = useState([]);
  const [isAdminLoading, setIsAdminLoading] = useState(true);
  const [picture, setPicture] = useState({});
  const [picUrl, setPicUrl] = useState(null);
  const [showMoveOrderMenu, setShowMoveOrderMenu] = useState(false);
  const [showIouMenu, setShowIouMenu] = useState(false);
  const [showReqMenu, setShowReqMenu] = useState(false);
  const [showReportMenu, setShowReportMenu] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { menu, setMenu } = useHomePageContext();

  const [openClose, setOpenClose] = useState(false);

  const [profileInfo, setProfileInfo] = useState(false);

  const [eId, setEId] = useState("");
  const [eName, setEName] = useState("");
  const [forceRender, setForceRender] = useState(false);
  const { mId } = useParams();

  const [searchMenu, setSearchMenu] = useState('');

  useEffect(() => {
    const id = localStorage.getItem("userId");
    console.log("local id: ", id)
    setUserId(id);
    getAdminInfo(id);
   
    
  }, []);

  useEffect(() => {
    console.log(`menu in home ${mId}`);
    // Check if the id is present in the URL params
    const menuId = parseInt(mId ?? '', 10);

    // If the id is valid, set the menu
    if (!isNaN(menuId) && menuId >= 3000 && menuId <= 100000) {
        setMenu(menuId);
    } else {
        // If id is not valid, set a default menu (e.g., 1)
        setMenu(3000);
    }
}, [mId]);

  const logOut = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("empId");
    localStorage.removeItem("designation");
    localStorage.removeItem("token");
    // localStorage.removeItem("menuCode");
    setMenu(3000);
    setTimeout(() => {
      navigate("/");
    }, 200);
  };

  const base64ToImageUrl = (base64String) => {
    const blob = base64ToBlob(base64String);
    const url = URL.createObjectURL(blob);
    setPicUrl(url);
  };

  const base64ToBlob = (base64String) => {
    const byteCharacters = atob(base64String);
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }

    const blob = new Blob([new Uint8Array(byteArrays)], {
      type: "image/png",
    });
    return blob;
  };

  const propic = async (url, empId, propicName) => {
    const pic = await getPropicService(url, empId, propicName);
    setPicture(pic);
    console.log(pic.propic_id);
    base64ToImageUrl(pic["PROPIC"]);
    setIsAdminLoading(false);
  };

  const [menuList, setMenuList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const getAdminInfo = async (uid) => {
    setIsLoading(true);
    const admin = await AdminInfoService(infoUrl, uid);
    console.log("admin info: ", admin)
    setAdminDetails(admin.EMP_DETAILS);
    console.log(admin.MENU_DETAILS);
    setMenuList(admin.MENU_DETAILS);
    // const eId = admin.EMP_DETAILS[0].EMPLOYEE_ID;
    // const eName = admin.EMP_DETAILS[0].EMPLOYEE_NAME;
    console.log(admin.EMP_DETAILS[0].EMPLOYEE_ID);
    setEId(admin.EMP_DETAILS[0].EMPLOYEE_ID);
    setEName(admin.EMP_DETAILS[0].EMPLOYEE_NAME);

    console.log(eId);
    console.log(eName);

    const picName = admin.EMP_DETAILS[0].PROPIC_NAME;
    const designation = admin.EMP_DETAILS[0].DESIGNATION;
    // console.log(designation);
    propic(
      getImageUrl,
      admin.EMP_DETAILS[0].EMPLOYEE_ID,
      admin.EMP_DETAILS[0].PROPIC_NAME
    );

    localStorage.setItem("empId", admin.EMP_DETAILS[0].EMPLOYEE_ID);
    localStorage.setItem("designation", designation);
    setIsLoading(false);
  };

  // const saveMenu = (menuCode) => {
  //   localStorage.setItem("menuCode", menuCode);
  //   setMenu(menuCode);
  // };

  const changeMenu = (menu) => {
    setMenu(menu);
    // navigate(`/home/${menu}`);
    // saveToLocal(menu);
};

  const [openIndex, setOpenIndex] = useState(-1);

  const toggleCollapse = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const filteredMenuList = menuList.filter(menu => menu.MENU_NAME.toLowerCase().includes(searchMenu.toLowerCase()));

  return (
    <div key={forceRender}>
      {/* navbar start */}

      <div className="  h-16 w-full  bg-white shadow-sm flex flex-row items-center justify-between fixed top-0 z-10">
        <div className=" flex flex-row space-x-6 ml-14">
          <img
            src="/images/logo.png"
            alt="logo"
            className=" h-8 w-8 rounded-full"
          />
          {/* {picUrl} */}
          <h4 className={`text-lg font-medium text-${gray500}`}>WE</h4>
        </div>
        <div className="mr-14 flex flex-row space-x-6">
          <div className="menu menu-horizontal w-44 ">
            <li className="w-full flex justify-end" tabIndex={0}>
              <div
                className={`h-12 w-12 rounded-full bg-${gray100} flex p-1 items-center justify-center`}
                onClick={() => setProfileInfo(!profileInfo)}
              >
                {/* <img src="/images/logo.png" alt="logo" className=' h-8 w-8 rounded-full' />  */}
                <div
                  className={`h-13 w-13 rounded-full flex justify-center items-center`}
                >
                  <img
                    src={picUrl}
                    alt="logo"
                    className="h-9 w-9 rounded-full"
                  />
                </div>
              </div>

              {profileInfo && (
                <ul
                  className={`rounded-md shadow-sm flex justify-start bg-white border-[1px]`}
                >
                  <li className="space-y-1">
                    <div className="flex flex-col text-left space-y-0 bg-white cursor-text w-full">
                      <p className="w-full">{`ID: ${eId}`}</p>
                      <p className="w-full">{`Name: ${eName}`}</p>
                    </div>

                    <hr className="border-[1px] rounded-none bg-white w-10/12 mx-auto space-y-0 cursor-default" />

                    <div className="w-full h-11 flex justify-center hover:bg-white">
                      <p
                        onClick={() => {
                          setOpenClose(true);
                        }}
                        className={`bg-${red500} hover:bg-red-600 text-white font-bold w-full h-9 rounded-md flex items-center justify-center `}
                      >
                        Log Out
                      </p>
                    </div>
                  </li>
                </ul>
              )}
            </li>
          </div>
        </div>
      </div>

      {/* navbar end */}

      {/* body start */}

      <div className="flex flex-row  w-full mt-1 overflow-hidden ">
        {/* left side */}
        <div
          style={{ width: isMenuOpen ? "90px" : "240px" }}
          className=" md:w-64 w-64 h-screen overflow-y-auto "
        >
          <div
            style={{
              width: isMenuOpen ? "90px" : "240px",
              transition: "width 0.2s ease-in-out",
            }}
            className={`fixed w-64 md:w-64 h-screen no-scrollbar  overflow-y-auto overflow-x-hidden  bg-white  p-4  border-r border-dotted border-${gray300} border-spacing-4 bg-fixed  mt-16`}
          >
            <div className=" w-full flex flex-col space-y-2 items-start">
              {
                // isAdminLoading ?
                //   <progress className="progress w-1/5"></progress> :

                <div
                  className={`h-15 w-15 bg-${gray100} rounded-md items-center p-3 flex flex-row space-x-3`}
                  style={{
                    transition: "background-color 0.2s ease-in-out", // Add this line for transition
                  }}
                >
                  {/* <div className={`h-12 w-12 rounded-full bg-${gray300} p-2  items-center`}>
                      <img src={picUrl} alt="logo" className=' h-8 w-8 rounded-full' />
                    </div> */}
                  {
                    <div className=" flex flex-col items-center w-full h-full justify-center">
                      {/* <p className=' text-black font-medium text-sm'>{adminDetails[0].EMPLOYEE_NAME?adminDetails[0].EMPLOYEE_NAME:"N/A"}</p> */}
                      {/* <p className={`text-${gray400} font-medium text-xs`}>{adminDetails[0].DESIGNATION}</p> */}
                      <div
                        className="cursor-pointer text-xl"
                        onClick={toggleMenu}
                      >
                        {isMenuOpen ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-8 h-8"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-8 h-8"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  }
                </div>
              }

              <div className="h-1"></div>

              <input type="text" value={searchMenu} onChange={(e) => setSearchMenu(e.target.value)}  className="w-full px-3 h-[42px] rounded-md border-[0.2px] bg-white border-gray-300 placeholder:text-sm placeholder:text-gray-400 focus:outline-none" placeholder="Search menu..."
              />

              <div className="h-1"></div>


              {/* menu item */}

              {isLoading ? (
                <div className=" w-full h-screen flex justify-center items-center">
                  <span className="loading loading-ring loading-lg"></span>
                </div>
              ) : (
                filteredMenuList.map((m, index) => (
                  <div className=" w-full flex flex-col items-start">
                 
                    <Link
                      key={index}
                      to={`/home/${m.MENU_ID}`}
                      onClick={(e) => {
                        e.preventDefault();
                        changeMenu(m.MENU_ID);
                        // setMenu(m.MENU_ID);
                        toggleCollapse(index);

                        if (m.MENU_ID === 13000) {
                          setShowIouMenu(false);
                          setShowReqMenu(false);
                          setShowReportMenu(false)
                          setShowMoveOrderMenu(!showMoveOrderMenu);
                        } else if (m.MENU_ID === 14000) {
                          setShowMoveOrderMenu(false);
                          setShowReqMenu(false);
                          setShowReportMenu(false)
                          setShowIouMenu(!showIouMenu);
                        } else if (m.MENU_ID === 15000) {
                          setShowIouMenu(false);
                          setShowMoveOrderMenu(false);
                          setShowReportMenu(false)
                          setShowReqMenu(!showReqMenu);
                        } 
                        // else if(m.MENU_ID === 26000){
                        //   setShowIouMenu(false);
                        //   setShowMoveOrderMenu(false);
                        //   setShowReqMenu(false);
                        //   setShowReportMenu(!showReportMenu);
                        // } 
                        else {
                          setShowIouMenu(false);
                          setShowMoveOrderMenu(false);
                          setShowReqMenu(false);
                          setShowReportMenu(false)
                        }
                      }}
                      className={` h-12 w-full  ${
                        menu === m.MENU_ID ? `bg-${green100}` : "bg-white"
                      } rounded-md hover:bg-${gray100} p-4 flex flex-row space-x-3 items-center hover:no-underline active:no-underline focus:no-underline`}
                      // Add href to the button dfwef
                      href={tabUrl}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={`w-6 h-6 ${
                          menu === m.MENU_ID
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d={menuIcons[m.MENU_ID]}
                        />
                      </svg>

                      {/* <p
                        style={{
                          display: isMenuOpen ? "none" : "block",
                        }}
                        className={`${
                          menu === m.MENU_ID
                            ? `text-${green600} font-bold`
                            : `text-${gray500} font-medium`
                        } text-sm text-start  `}
                      >
                        {m.MENU_NAME}
                      </p> */}

                      <p
                        style={{
                          display: isMenuOpen ? "none" : "block",
                        }}
                        className={`text-sm text-start ${menu === m.MENU_ID ? `font-bold text-${green600}` : `font-medium text-${gray500}`}`}
                      >
                        {m.MENU_NAME.split(new RegExp(`(${searchMenu})`, 'gi')).map((part, i) => (
                          part.toLowerCase() === searchMenu.toLowerCase() ? <strong key={i} className="text-[#11B76A]">{part}</strong> : part
                        ))}
                      </p>
                    </Link>

                    <div className="h-3"></div>
                    {openIndex === index && (
                      <div className=" w-full">
                        {showMoveOrderMenu ? (
                          <div className=" w-full flex flex-col items-start space-y-2">
                           
                          </div>
                        ) : null}

                        {showIouMenu ? (
                          <div className=" w-full flex flex-col items-start space-y-2">
                            
                                                     
                          </div>
                        ) : null}

                        {showReqMenu ? (
                          <div className=" w-full flex flex-col items-start space-y-2">
                           
                          </div>
                        ) : null}

                        {/* {showReportMenu ? (
                          <div className=" w-full flex flex-col items-start space-y-2">
                            <button onClick={() => { setMenu('dailyAttn') }} className={`flex flex-row space-x-2 items-center rounded-md hover:bg-${gray100} ${menu === 'dailyAttn' ? `bg-${green100}` : "bg-slate-50"} h-9 w-full`}>
                              <p className={`text-sm pl-8 ${menu === 'dailyAttn' ? `text-${green600}` : `text-${gray500} `}`}>1. Daily Attendance Report</p>
                            </button> */}
                          {/* </div>
                        ) : null} */}
                      </div>
                    )}
                  </div>
                ))
              )}

              {/* <button
                onClick={() => {
                  setMenu(33000);
                }}
                className="text-sm"
              >
                <h5>Requisition Report</h5>
              </button> */}

              {/* <button
                onClick={() => {
                  setMenu(31000);
                }}
                className="text-sm"
              >
                <h5>Daily Attendance Report</h5>
              </button> */}

              {/* <button
                onClick={() => {
                  setMenu(32000);
                }}
                className="text-sm"
              >
                <h5>Monthly Report</h5>
              </button> */}


              {/* <button
                onClick={() => {
                  setMenu(34000);
                }}
                className="text-sm"
              >
                <h5>Leave History</h5>
              </button> */}

              {/* end menu item
              {/* menu item */}

              <div className=" h-40 "></div>
            </div>
          </div>
        </div>

        {/* end left side */}
        {/* middle */}

        {/* end middle */}
        {/* lg:w-3/4 md:w-3/4 w-1/3 */}
        {/* lg:w-3/4 md:w-3/4 w-1/3 */}

        <div className="flex-1  overflow-y-auto">
          {(() => {
            switch (menu) {
              case 3000:
                return <Home />;
              case 6000:
                return <ApprovalSetupPage />;
              case 5000:
                return <DailyAttendance />;
              case 7000:
                return <MonthlyAttendancePage />;
              // case 'el':
              //   return <YearlyLeavePage />
              case 8000:
                return <GeoFencePage />;
              case 10000:
                return <OfficeTimePage />;
              case 9000:
                return <StickyHeadTable />;
              case 11000:
                return <HolidayUploadPage />;
              case 12000:
                return <CompanyWisePlant />;
              case 1000:
                return <CreateNoticePage />;
              case 13000:
                return (
                  <MoveOrderProvider>
                    <MoveOrderHomePage />
                  </MoveOrderProvider>
                );

              // case "cmv":
              //     return <CreateMoveOrderPage />;
              // // case 'meal':
              // //   return <DailyMealOffListPage />
              // case "mmv":
              //     return (
              //         <MoveOrderProvider>
              //             <MoveOrderHomePage />
              //         </MoveOrderProvider>
              //     );
              case 14000:
                return (
                  <IouProvider>
                    <MyIouHome />
                  </IouProvider>
                );
              // case "ciou":
              //     return (

              //             <CreateIouPage />

              //     );
              // case "miou":
              //     return (

              //             <MyIouHome />

              //     );

              case 15000:
                return (
                  <RequisitionProvider>
                    <MyRequisitionHome />
                  </RequisitionProvider>
                );

              // case "creq":
              //     return (
              //         <RequisitionProvider>
              //             <CreateRequisitionPage />
              //         </RequisitionProvider>
              //     );
              // case "mreq":
              //     return (
              //         <RequisitionProvider>
              //             <MyRequisitionHome />
              //         </RequisitionProvider>
              //     );
              case 4000:
                return <FrontDeskReportPage />;
              case 2000:
                return <RoleManagementPage />;
              case 17000:
                return <CreateRolePage />;
              case 18000:
                return <UserRoleMenuAssignmentPage />;
              case 19000:
                return <FrontDeskAccessPage />;
              case 21000:
                return <SiteAttendanceUploadPage />;
              case 23000:
                return <SyncPositionPage />;
              case 24000:
                return <JobSyncPage />;
              case 25000:
                return <UserRolePage />;
              // case 33000:
              //   return <RequisitionReportPage />;
              // case 26000:
              //   return <DailyAttendanceReportPage />;
              // case 'dailyAttn':
              //   return <DailyAttendanceReportPage />;
              case 27000:
                return <DailyAttendanceReportPage />;
              case 28000:
                return <MoveOrderReportPage />;
              case 29000:
                return <RequisitionReportPage />;
              case 31000:
                return (
                  <LeaveProvider>
                    <LeaveHistoryPage />
                  </LeaveProvider>
                )
              case 32000:
                return <MonthlyAttendanceReport />

              default:
                return null;
            }
          })()}
          {/* <DailyAttendance/> */}
        </div>
      </div>

      {/* body end */}

      <input
        type="checkbox"
        id="my-modal-11"
        className="modal-toggle"
        checked={openClose}
      />
      <div className="modal">
        <div className="modal-box w-96 bg-white">
          <div className=" w-full h-48 flex items-center flex-col justify-center bg-white">
            {/* logout image add here */}

            <div className=' flex justify-center'>
                <img src="/images/logout_icon.png" alt="delete" className='w-14 h-14' />
            </div>
            
            <div className="h-4"></div>

            <p className="text-black font-semibold text-[18px] ">
            
              Do you want to log out ?
            </p>
            <div className="h-7"></div>
            <div className=" w-full flex flex-row justify-between items-center">
              <button
                onClick={() => {
                  setOpenClose(false);
                }}
                className=" px-4 w-36 py-2 mr-2 text-gray-600 bg-white border-[0.5px] border-gray-700 rounded-lg"
              >
                NO
              </button>
              <button
                onClick={() => {
                  logOut();
                }}
                className=" px-4 w-36 py-2 bg-red-500 text-white rounded-lg"
              >
                YES
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
