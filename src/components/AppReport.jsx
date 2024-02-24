import { DatePicker } from "rsuite";
import Datepicker from "react-tailwindcss-datepicker";
import React, { useEffect } from "react";
import { useState } from "react";
// import Loading from "../../components/loader/Loading";
import moment from "moment";
import Papa from 'papaparse';
// import { baseUrl } from "../../utils/path";
// import getCompanyList from "../../services/CompanyListService";
// import getPlantList from "../../services/PlantListService";
// import AppUseReportService from "../service/AppUseReportService";

import { CSVLink } from "react-csv";
import AppUseReportService from "../Service/AppUseReportService";
import Loading from "../../loader/Loading";
import { baseUrl } from "../../../utils/path";
import getCompanyList from "../../../services/CompanyListService";
import getPlantList from "../../../services/PlantListService";

const companyUrl = `${baseUrl}getCompanyList`;
const moduleUrl = `${baseUrl}approval_module_types`;
const plantUrl = `${baseUrl}get_plant_details`;


export default function AppUseReportPage() {

  const [sateStatusCnt, setStageStatusCnt] = useState('');
  const [userStatusCnt, setUserStatusCnt] = useState('A');
  const [uId, setUid] = useState('');
  const [page, setPage] = useState(0);
  const [selectedValue, setSelectedValue] = useState(10);
  let limit = 10;
  let totalLimit = 100000;
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [totalPage, setTotalPage] = useState(null);
  const [pageCount, setPageCount] = useState(1)
  const [empId, setEmpId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearch, setIsSearch] = useState(false);
  let [pageCountSearch, setPageCountSearch] = useState(1);
  let [pageSearch, setPageSearch] = useState(0);
  const [startEndDate, setStartEndDate] = useState({ startDate: null, endDate: null, });
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [companyCode, setCompanyCode] = useState('');
  const [plantCode, setPlantCode] = useState('');
  const [selectedCompanyname, setSelectedCompanyName] = useState('');
  const [selectedPlantname, setSelectedPlantName] = useState('');
  const [isCompanyLoading, setIsCompanyLoading] = useState(true);
  const [company, setCompany] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [isPlantVisible, setIsPlantVisible] = useState(false);
  const [plant, setPlant] = useState([]);
  const [isPlantLoading, setIsPlantLoading] = useState(true);
  const [searchById, setSearchById] = useState('');
  const [processedData, setProcessedData] = useState([]);
  const [allProcessedData, setAllProcessedData] = useState([]);
  const todayDate = moment(Date()).format('YYYY-MM-DD');
  const [today, setToday] = useState('');
  const [dateValue, setDateValue] = React.useState(null);
  const [startDate, setStartDate] = useState('');
  const [moveOrderStatus, setMoveOrderStatus] = useState('');
  const statusActive = 1;
  const statusInactive = 0;
  const UserActiveStatus = 3;
  const UserInactiveStatus = 0;

  useEffect(() => {
    setToday(todayDate);
    setStartDate(today)
    const id = localStorage.getItem('userId');
    setUid(id);
    getAll();
    allDownloadData(todayDate, todayDate, "", "", "", "");
    // getPlanMaster();
    // stageStatusRef.current.value = "A";
    // userStatusRef.current.value = "A";
    setStageStatusCnt("A");
    setUserStatusCnt("A");

  }, []);

  useEffect(() => {
    const getCompanyName = async () => {
      const result = await getCompanyList(companyUrl);
      setCompanyList(result.items);
      setIsCompanyLoading(false);
    };
    getCompanyName();
  }, []);

  // initially get all data
  const getAll = async () => {
    const result = await AppUseReportService("", "", "", "", "", statusActive, UserActiveStatus, page, selectedValue);
    const result2 = await AppUseReportService("", "", "", "", "", statusInactive, UserInactiveStatus, page, selectedValue);

    dividePage(result.Total_Count);
    // console.log("Move Order", result.ATTENDANCE_DETAILS);

    setData(result.ACTIVE_INACTIVE_EMPLOYEES);
    setData2(result2.ACTIVE_INACTIVE_EMPLOYEES);
    processData(result.ACTIVE_INACTIVE_EMPLOYEES);
    setIsLoading(false);
  };

  const allDownloadData = async (stDate, eDate, compCode, plantCode, searchId, orderStatus) => {
    setIsLoading(true);

    console.log("stDate: ", stDate);
    console.log("eDate: ", eDate);
    console.log("compCode: ", compCode);
    console.log("plantCode: ", plantCode);
    console.log("searchId: ", searchId);

    const result = await AppUseReportService(searchId ? searchId : "", compCode ? compCode : "", plantCode ? plantCode : "", stDate ? stDate : todayDate, eDate ? eDate : todayDate, statusActive, UserActiveStatus, page, totalLimit, selectedValue);
    const result2 = await AppUseReportService(searchId ? searchId : "", compCode ? compCode : "", plantCode ? plantCode : "", stDate ? stDate : todayDate, eDate ? eDate : todayDate, statusInactive, UserInactiveStatus, page, totalLimit, selectedValue);

    allProcessData(result.ACTIVE_INACTIVE_EMPLOYEES);
    setIsLoading(false);
  };

  // divided page number to allPage (for pagination)
  const dividePage = (number) => {
    console.log(number);
    if (typeof number !== 'number') {
      throw new Error('Input must be a number');
    }

    const re = Math.ceil(number / selectedValue);
    setTotalPage(re);
  };

  // go to next page
  const next = async () => {
    // setPage((page)=>page+10);
    const newPage = parseInt(page) + parseInt(selectedValue);
    setPage(newPage);
    console.log(`page here ${newPage}`);
    setPageCount((pre) => pre + 1);

    setIsLoading(true);
    setData([]);
    setData2([])

    const result = await AppUseReportService(searchById, companyCode, plantCode, fromDate ? fromDate : "", toDate ? toDate : "", statusActive, UserActiveStatus, newPage, selectedValue)
    const result2 = await AppUseReportService(searchById, companyCode, plantCode, fromDate ? fromDate : "", toDate ? toDate : "", statusInactive, UserInactiveStatus, newPage, selectedValue)

    dividePage(result.Total_Count);
    setData(result.ACTIVE_INACTIVE_EMPLOYEES);
    setData2(result2.ACTIVE_INACTIVE_EMPLOYEES);
    processData(result.ACTIVE_INACTIVE_EMPLOYEES);
    setIsLoading(false);

    console.log('clicked');
  }

  // after Searching next page
  const searchNext = async () => {
    // setPage((page)=>page+10);
    const newPage = pageSearch + selectedValue;
    setPageSearch(newPage);
    console.log(`page here ${newPage}`);
    setPageCountSearch((pre) => pre + 1);

    setIsLoading(true);
    setData([]);
    setData2([]);

    const result = await AppUseReportService(searchById, companyCode, plantCode, fromDate ? fromDate : "", toDate ? toDate : "", statusActive, UserActiveStatus, newPage, selectedValue);
    const result2 = await AppUseReportService(searchById, companyCode, plantCode, fromDate ? fromDate : "", toDate ? toDate : "", statusInactive, UserInactiveStatus, newPage, selectedValue);

    dividePage(result.Total_Count);

    setData(result.ACTIVE_INACTIVE_EMPLOYEES);
    setData2(result2.ACTIVE_INACTIVE_EMPLOYEES);
    processData(result.ACTIVE_INACTIVE_EMPLOYEES);
    setIsLoading(false);
  }

  // back to previous page
  const previous = async () => {

    // setPage((pre)=>pre-10);
    const newPage = page - selectedValue;
    setPage(newPage);
    console.log(`page here ${newPage}`);
    setPageCount((pre) => pre - 1);

    console.log('previous button clicked');
    setIsLoading(true);
    setData([]);
    setData2([]);

    const result = await AppUseReportService(searchById, companyCode, plantCode, fromDate ? fromDate : "", toDate ? toDate : "", statusActive, UserActiveStatus, newPage, selectedValue);
    const result2 = await AppUseReportService(searchById, companyCode, plantCode, fromDate ? fromDate : "", toDate ? toDate : "", statusInactive, UserInactiveStatus, newPage, selectedValue);

    dividePage(result.Total_Count);

    setData(result.ACTIVE_INACTIVE_EMPLOYEES);
    setData2(result2.ACTIVE_INACTIVE_EMPLOYEES);
    processData(result.ACTIVE_INACTIVE_EMPLOYEES);
    setIsLoading(false);
  }

  // after Searching back previous
  const searchPrevious = async () => {
    const newPage = pageSearch - selectedValue;
    setPageSearch(newPage);
    console.log(`page here ${newPage}`);
    setPageCountSearch((pre) => pre - 1);

    console.log('clicked');
    setIsLoading(true);
    setData([]);
    setData2([]);

    const result = await AppUseReportService(searchById, companyCode, plantCode, fromDate ? fromDate : "", toDate ? toDate : "", statusActive, UserActiveStatus, newPage, selectedValue);
    const result2 = await AppUseReportService(searchById, companyCode, plantCode, fromDate ? fromDate : "", toDate ? toDate : "", statusInactive, UserInactiveStatus, newPage, selectedValue);

    dividePage(result.Total_Count);
    setData(result.ATTENDANCE_DETAILS);
    setData2(result2.ATTENDANCE_DETAILS);
    processData(result.ATTENDANCE_DETAILS);
    setIsLoading(false);
  }

  // convert date by day/month/year
  const convertDate = (dateString) => {
    const dateObject = new Date(dateString);
    const day = String(dateObject.getUTCDate()).padStart(2, '0');
    const month = String(dateObject.getUTCMonth() + 1).padStart(2, '0');
    const year = dateObject.getUTCFullYear();

    return `${day}/${month}/${year}`;
  };

  // using for see more and see less for description
  const [seeMore, setSeeMore] = useState(-1);

  const handleSeeMoreDetails = (index) => {
    setSeeMore(index === seeMore ? -1 : index);
  };

  // date select
  // const handleDateChange = async (newDate) => {
  //   console.log("start:", moment(newDate.startDate).format("YYYY-MM-DD"));
  //   console.log("end:", moment(newDate.endDate).format("YYYY-MM-DD"));
  //   setStartEndDate(newDate);

  //   setFromDate(newDate.startDate);
  //   setToDate(newDate.endDate);

  //   console.log("select date new: ", fromDate);
  //   setIsLoading(true);
  //   setData([]);

  //   const result = await AppUseReportService("", "", "", newDate.startDate, newDate.endDate, page, limit);

  //   dividePage(result.Total_Count);
  //   setData(result.ATTENDANCE_DETAILS);
  //   processData(result.ATTENDANCE_DETAILS);
  //   allDownloadData(newDate.startDate, newDate.endDate, "", "", "");
  //   setIsLoading(false);
  // }

  // company data
  const handleCompany = async (e) => {
    const selectedCode = e.target.value;
    const selectedName = companyList.find(c => c.company_code === selectedCode)?.company_name || '';

    console.log("Selected company code: ", selectedCode)

    setCompanyCode(selectedCode);
    setSelectedCompanyName(selectedName);
    getPlant(selectedCode);

    setIsLoading(true);
    setData([]);
    setData2([]);

    const result = await AppUseReportService("", selectedCode, "", fromDate ? fromDate : "", toDate ? toDate : "", statusActive, UserActiveStatus, page, selectedValue);
    const result2 = await AppUseReportService("", selectedCode, "", fromDate ? fromDate : "", toDate ? toDate : "", statusInactive, UserInactiveStatus, page, selectedValue);

    dividePage(result.Total_Count);
    setData(result.ACTIVE_INACTIVE_EMPLOYEES);
    setData2(result2.ACTIVE_INACTIVE_EMPLOYEES);
    processData(result.ACTIVE_INACTIVE_EMPLOYEES);
    allDownloadData(fromDate ? fromDate : todayDate, toDate ? toDate : todayDate, selectedCode, "", "",);
    setIsPlantVisible(true);
    setIsLoading(false);
  };
  // console.log(data)


  // plant data 
  const handlePlant = async (e) => {
    // handleDropDown(e);
    // setPlantName(e.PLANT_NAME);

    const selectedPlantCode = e.target.value;
    setPlantCode(selectedPlantCode);

    const selectedName = plant.find(c => c.PLANT_CODE === selectedPlantCode)?.PLANT_NAME || '';
    setSelectedPlantName(selectedName);

    setIsLoading(true);
    setData([]);
    setData2([]);

    const result = await AppUseReportService("", companyCode, selectedPlantCode, fromDate ? fromDate : "", toDate ? toDate : "", statusActive, UserActiveStatus, page, selectedValue);
    const result2 = await AppUseReportService("", companyCode, selectedPlantCode, fromDate ? fromDate : "", toDate ? toDate : "", statusInactive, UserInactiveStatus, page, selectedValue);

    dividePage(result.Total_Count);
    setData(result.ACTIVE_INACTIVE_EMPLOYEES);
    setData2(result2.ACTIVE_INACTIVE_EMPLOYEES);
    processData(result.ACTIVE_INACTIVE_EMPLOYEES);
    allDownloadData(fromDate ? fromDate : todayDate, toDate ? toDate : todayDate, companyCode, selectedPlantCode, "");
    setIsLoading(false);
  };

  // plant list here
  const getPlant = async (code) => {
    const plant = await getPlantList(plantUrl, code);
    console.log("plant:=", plant);
    setPlant(plant.PLANT_DETAILS);

    setIsPlantLoading(false);
  }

  // for searching by employee id
  const searchEmpId = async () => {
    setIsLoading(true);
    setData([]);
    setData2([]);

    const result = await AppUseReportService(searchById, companyCode, plantCode, fromDate ? fromDate : "", toDate ? toDate : "", statusActive, UserActiveStatus, page, selectedValue);
    const result2 = await AppUseReportService(searchById, companyCode, plantCode, fromDate ? fromDate : "", toDate ? toDate : "", statusInactive, UserInactiveStatus, page, selectedValue);

    dividePage(result.Total_Count);
    setData(result.ACTIVE_INACTIVE_EMPLOYEES);
    setData2(result2.ACTIVE_INACTIVE_EMPLOYEES);
    processData(result.ACTIVE_INACTIVE_EMPLOYEES);
    allDownloadData(fromDate ? fromDate : todayDate, toDate ? toDate : todayDate, companyCode, plantCode, searchById);
    setIsLoading(false);

    // setSearchById('');
  }

  const processData = (data) => {
    console.log(data)
    // if (data && data.length > 0) {
    //   const newData = data.map((obj) => {
    //     const newDate = new Date(obj.REQUISITION_LOADING_DATE);
    //     const formattedDate = moment(newDate).format("DD/MM/YYYY");
    //     const convertTime = formatDate(obj.MOVE_ORDER_DATE);

    //     return { ...obj, REQUISITION_LOADING_DATE: formattedDate, MOVE_ORDER_DATE: convertTime };
    //   });
    //   setProcessedData(newData);
    //   console.log("processed Data: ", processedData)
    // } 

    // else {
    //   console.log("Data is empty or undefined");
    // }
  };

  const allProcessData = (data) => {
    console.log(data)
    // if (data && data.length > 0) {
    //   const newData = data.map((obj) => {
    //     const newDate = new Date(obj.REQUISITION_LOADING_DATE);
    //     const formattedDate = moment(newDate).format("DD/MM/YYYY");
    //     const convertTime = formatDate(obj.MOVE_ORDER_DATE);

    //     return { ...obj, REQUISITION_LOADING_DATE: formattedDate, MOVE_ORDER_DATE: convertTime };
    //   });
    //   setAllProcessedData(newData);
    // } 

    // else {
    //   console.log("Data is empty or undefined");
    // }
  };

  const headers = [
    { label: "PLANT", key: "PLANT_NAME" },
    { label: "EMPLOYEE ID", key: "EMPLOYEE_ID" },
    { label: "EMPLOYEE NAME", key: "EMPLOYEE_NAME" },
    { label: "POSITION", key: "POSITION_NAME" },

  ];

  const headers2 = [
    { label: "PLANT", key: "PLANT_NAME" },
    { label: "EMPLOYEE ID", key: "EMPLOYEE_ID" },
    { label: "EMPLOYEE NAME", key: "EMPLOYEE_NAME" },
    { label: "POSITION", key: "POSITION_NAME" },

  ];

  // let fileName = moment(Date()).format("DD/MM/YYYY");

  const [fileName, setFileName] = useState(moment(Date()).format("DD/MM/YYYY"));

  // single date select
  const handleDateChange2 = async (newDate) => {
    console.log("new Date", newDate)
    const startDateFormatted = moment(newDate.startDate).format("YYYY-MM-DD");
    const endDateFormatted = moment(newDate.endDate).format("YYYY-MM-DD");

    console.log("start:", startDateFormatted);
    console.log("end:", endDateFormatted);

    setStartEndDate(newDate);

    // setStartEndDate(newDate);
    setDateValue(newDate);
    setFromDate(newDate.startDate);
    setToDate(newDate.endDate);

    console.log("select date new: ", fromDate);
    setIsLoading(true);
    setStartDate(startDateFormatted);
    setData([]);
    setData2([]);
    setCompanyCode([]);
    setPlantCode([]);
    setSearchById('');
    setPageCountSearch(1);
    setPageCount(1);
    // setPage(0);
    const p = 0;
    setPage(p);

    const allDataDate = {
      startDate: moment(newDate.startDate), // Replace with your actual start date
      endDate: moment(newDate.endDate),   // Replace with your actual end date
    };

    // Check if start date and end date are the same
    const useStartDate = allDataDate.startDate.isSame(allDataDate.endDate, 'day');

    // Update fileName to include the selected date or fallback to today's date
    const newFileName = useStartDate ? allDataDate.startDate.format("DD/MM/YYYY") : moment(Date()).format("DD/MM/YYYY");
    setFileName(newFileName);

    const result = await AppUseReportService("", "", "", newDate.startDate ? newDate.startDate : "", newDate.endDate ? newDate.endDate : "", statusActive, UserActiveStatus, p, selectedValue);
    const result2 = await AppUseReportService("", "", "", newDate.startDate ? newDate.startDate : "", newDate.endDate ? newDate.endDate : "", statusInactive, UserInactiveStatus, p, selectedValue);

    console.log("total: ", result.Total_Count)
    dividePage(result.Total_Count);
    setData(result.ACTIVE_INACTIVE_EMPLOYEES);
    setData2(result2.ACTIVE_INACTIVE_EMPLOYEES);
    processData(result.ACTIVE_INACTIVE_EMPLOYEES);
    // getTotalReport(startDateFormatted)
    allDownloadData(startDateFormatted, endDateFormatted, "", "", "");
    setIsLoading(false);
  }

  // cancel date
  // const handleCleanDate = () => {
  //   console.log("clean date clicked")

  //   setIsLoading(true);
  //   setPageCountSearch(1);
  //   setPageCount(1);
  //   setData([]);
  //   setData2([]);
  //   console.log("before: ", page);
  //   const p = 0;
  //   setPage(p);
  //   // setPage(0);

  //   // Update fileName to today's date
  //   setFileName(moment(Date()).format("DD/MM/YYYY")); 

  //   console.log("after: ", page);
  //   setStartDate(today);
  //   getAll(today, today, p);
  //   // getTotalReport(today);
  //   allDownloadData(today, today, "", "", "");
  //   setIsLoading(false);
  //   setDateValue(null);
  // }

  // format time
  const format12HourTime = (hour, minute) => {
    if (!hour || !minute) return "N/A";

    const formattedHour = (parseInt(hour, 10) % 12 || 12).toString().padStart(2, '0');
    const formattedMinute = parseInt(minute, 10).toString().padStart(2, '0');

    const period = parseInt(hour, 10) < 12 ? 'AM' : 'PM';
    return `${formattedHour}:${formattedMinute} ${period}`;
  };

  const formatDate = (dateTimeString) => {
    if (!dateTimeString) return "N/A";

    const formattedDate = moment.utc(dateTimeString).format("YYYY-MM-DD hh:mm A");
    return formattedDate;
  };


  // Handler function to update state when the dropdown value changes
  const handleSelectChange = (event) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    console.log("Selected value:", newValue);
  };

  useEffect(() => {
    setIsLoading(true)
    setPage(0)
    setPageCount(1)
    getAll()
    setIsLoading(false)


  }, [selectedValue])

  const handleDownload = () => {
    // Filter data based on headers
    const filteredData = data.map(item => ({
      PLANT_NAME: item.PLANT_NAME,
      EMPLOYEE_ID: item.EMPLOYEE_ID,
      EMPLOYEE_NAME: item.EMPLOYEE_NAME,
      POSITION_NAME: item.POSITION_NAME
    }));
  
    const filteredData2 = data2.map(item => ({
      PLANT_NAME: item.PLANT_NAME,
      EMPLOYEE_ID: item.EMPLOYEE_ID,
      EMPLOYEE_NAME: item.EMPLOYEE_NAME,
      POSITION_NAME: item.POSITION_NAME
    }));
  
    // Create Blob objects for each CSV data
    const blob1 = new Blob([Papa.unparse(filteredData, { header: true })], { type: 'text/csv' });
    const blob2 = new Blob([Papa.unparse(filteredData2, { header: true })], { type: 'text/csv' });
  
    // Create temporary anchor elements and trigger downloads
    const downloadFile = (blob, filename) => {
      const anchor = document.createElement('a');
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.href = window.URL.createObjectURL(blob);
      anchor.download = filename;
      anchor.click();
      document.body.removeChild(anchor);
    };
  
    downloadFile(blob1, `App_Use_Report_Active.csv`);
    downloadFile(blob2, `App_Use_Report_InActive.csv`);
  };

  // const handleDownload = () => {

  //     const filteredData = data.map(item => ({
  //     PLANT_NAME: item.PLANT_NAME,
  //     EMPLOYEE_ID: item.EMPLOYEE_ID,
  //     EMPLOYEE_NAME: item.EMPLOYEE_NAME,
  //     POSITION_NAME: item.POSITION_NAME
  //   }));
  
  //   const filteredData2 = data2.map(item => ({
  //     PLANT_NAME: item.PLANT_NAME,
  //     EMPLOYEE_ID: item.EMPLOYEE_ID,
  //     EMPLOYEE_NAME: item.EMPLOYEE_NAME,
  //     POSITION_NAME: item.POSITION_NAME
  //   }));

  //   // Convert data and data2 to CSV format
  //   const csvContent1 = Papa.unparse(filteredData, { header: true });
  //   const csvContent2 = Papa.unparse(filteredData2, { header: true });
  
  //   // Combine CSV content into a single file with two sheets
  //   const combinedCsvContent = `Active Employee\n${csvContent1}\n\n\nInActive Employee\n${csvContent2}`;
  
  //   // Create a Blob object from the combined CSV content
  //   const blob = new Blob([combinedCsvContent], { type: 'text/csv' });
  
  //   // Create temporary anchor element to trigger download
  //   const anchor = document.createElement('a');
  //   anchor.style.display = 'none';
  //   document.body.appendChild(anchor);
  //   anchor.href = window.URL.createObjectURL(blob);
  //   anchor.download = `App_Use_Report`;
  //   anchor.click();
  //   document.body.removeChild(anchor);
  // };

  
  


  return (
    <div className="mx-8 my-20 bg-white">
      <div className='w-full bg-white'>
        <h4 className=' text-black font-semibold lg:text-lg md:text-sm text-xs'>App Use Employee</h4>

        <div className="h-5"></div>

        {
          isLoading ? (
            <Loading />
          ) : (
            <>
              <div className="flex items-center space-x-3">
                <div className="w-1/4">
                  {/* <Datepicker
                    popoverDirection="down"
                    placeholder="Date From-To         "
                    showFooter={true}
                    primaryColor={"green"}
                    showShortcuts={true}
                    value={startEndDate}
                    onChange={handleDateChange}
                    displayFormat={"DD/MM/YYYY"}
                    onClean={handleCleanDate}
                    toggleClassName={`absolute rounded-r-lg text-[#7F7F7F] right-0 h-full px-3 text-gray-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed`}
                    // inputClassName="w-full rounded-md focus:ring-0 font-normal bg-green-100 dark:bg-green-900 dark:placeholder:text-green-100"
                    // containerClassName=" border border-[1px] border-gray-400 w-80 rounded-md"
                    // toggleClassName=" text-gray-400"
                    inputClassName={`outline-buttonColor w-full rounded-r-lg h-[48px] border-[1px] border-gray-300 rounded-md px-3`}
                    // containerClassName="  "
                  /> */}

                  <Datepicker
                    popoverDirection="down"
                    placeholder="Date From-To         "
                    showFooter={true}
                    primaryColor={"green"}
                    showShortcuts={true}
                    value={startEndDate}
                    onChange={handleDateChange2}
                    displayFormat={"DD/MM/YYYY"}
                    toggleClassName={`absolute rounded-r-lg text-[#7F7F7F] right-0 h-full px-3 text-gray-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed`}
                    inputClassName={`outline-buttonColor bg-white w-full rounded-r-lg h-[48px] border-[1px] border-gray-300 rounded-md px-3`}
                  // style={{ width: 335, height: 50 }}
                  />
                </div>

                <div className="w-1/4">
                  {
                    <select
                      placeholder='Select Company'
                      value={companyCode}
                      onChange={handleCompany}
                      className="w-full border bg-white h-[42px] rounded-lg px-2 focus:outline-none"
                    >
                      <option value='' disabled selected>Select Company</option>
                      {
                        companyList.map((e, index) =>
                          <option key={index} value={e.company_code}>
                            {e.company_name}({e.company_code})
                          </option>
                        )
                      }
                    </select>
                  }
                </div>

                <div className="w-1/4">
                  {isPlantVisible && (
                    <select
                      value={plantCode}
                      onChange={handlePlant}
                      className="w-full border bg-white h-[42px] rounded-lg px-2 focus:outline-none"
                    >
                      <option value="" disabled selected>Select Plant</option>
                      {
                        isPlantLoading ?
                          <p>loading.....</p>
                          : plant.map((e, index) =>
                            <option value={e.PLANT_CODE} key={index}>{e.PLANT_NAME}({e.PLANT_CODE})</option>
                          )
                      }
                    </select>
                  )}
                </div>

                <div className="flex flex-row space-x-2 items-center w-1/4">
                  <input onChange={(e) => { setSearchById(e.target.value) }} onKeyPress={(e) => { if (e.key === 'Enter') searchEmpId(); }} value={searchById} type="text" className="w-full px-3 h-[42px] rounded-lg border-[0.2px] bg-white border-gray-300 placeholder:text-sm placeholder:text-gray-400 focus:outline-none" placeholder='Search by Id or Name' />

                  <button onClick={() => { searchEmpId() }} className="bg-[#013E0E] h-[42px] w-[87px] px-3 flex justify-center items-center text-white rounded-lg">
                    {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg> */}

                    Search
                  </button>
                </div>
              </div>

              <div className="h-7"></div>

              {/* <div className='flex items-center justify-between space-x-4 w-full'>
                    
                    <div className='flex items-center justify-between w-1/3 h-24 rounded-l-md shadow-sm pl-2 pr-4 border-l-4 border-buttonColor'>
                      <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" dataSlot="icon" className="w-6 h-6 text-buttonColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                        </svg>

                        <p className="text-[#333439]">Number of Active Employee Today</p>
                      </div>

                      <p className="text-3xl font-semibold text-[#012308]">35</p>

                    </div>

                    <div className='flex items-center justify-between w-1/3 h-24 rounded-l-md shadow-sm pl-2 pr-4 border-l-4 border-[#E20000]'>
                      <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" dataSlot="icon" className="w-6 h-6 text-[#E20000]">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>


                        <p className="text-[#333439]">Monthly Average</p>
                      </div>

                      <p className="text-3xl font-semibold text-[#4B0000]">25</p>

                    </div>

                    <div className='flex items-center justify-between w-1/3 h-24 rounded-l-md shadow-sm pl-2 pr-4 border-l-4 border-[#FBCC16]'>
                      <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" dataSlot="icon" className="w-6 h-6 text-[#FBCC16]">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                        </svg>


                        <p className="text-[#333439]">Total Number of Active Employee</p>
                      </div>

                      <p className="text-3xl font-semibold text-[#54431A]">50</p>

                    </div>
                  </div> */}

              <div className="h-10"></div>

              {/* <button onClick={downloadExcel} className="bg-[#013E0E] h-[48px] w-[87px] px-3 flex justify-center items-center text-white rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" dataSlot="icon" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>

                <p>Download</p>
              </button> */}

              <div className="flex items-center justify-end space-x-2">
                {data.length === 0 ? null : (
                  <div>
                  <button onClick={handleDownload} className={`w-[180px] h-[48px] flex justify-center items-center bg-[#E6E1DD] px-2 rounded-lg shadow-sm text-[#013E0E] space-x-2 no-underline`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" dataSlot="icon" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    <h2 className="lg:text-sm md:text-xs text-xs">
                      Download
                    </h2>
                  </button>
            
                  {/* CSVLink components */}
                  <CSVLink data={data} headers={[]} filename={`App_Use_Report_Active.csv`} className={`hidden`}></CSVLink>
                  <CSVLink data={data2} headers={[]} filename={`App_Use_Report2_InActive.csv`} className={`hidden`}></CSVLink>
                </div>
                )}

                {data.length === 0 ? null : (
                  <CSVLink data={allProcessedData} headers={headers} filename={`ALL_App_Use_Report${fileName}.csv`}>
                    <button className={` w-[180px] h-[48px] flex justify-center items-center bg-[#E6E1DD] px-2 rounded-lg shadow-sm text-[#013E0E] space-x-2`}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" dataSlot="icon" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>

                      <h2 className=" lg:text-sm md:text-xs text-xs">
                        Download All
                      </h2>
                    </button>
                  </CSVLink>
                )}
              </div>

              <div className="h-5"></div>

              <div className="w-full">
                {
                  (data2.length == 0 && data.length == 0) ? (
                    <div className=" flex justify-center items-center w-full h-[300px]">
                      <h1 className=" text-red-600 font-bold text-2xl">
                        No Data Found
                      </h1>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <div className="h-[50px] text-base font-bold text-black bg-[#9AAB9B] grid grid-cols-2 pt-2">
                          <span className="text-center">ACTIVE EMPLOYEE</span>
                          <span className="text-center mt-0">INACTIVE EMPLOYEE</span>
                        </div>
                        <div className="overflow-x-auto" style={{ display: 'flex', alignItems: 'flex-start' }}>
                          <table className="w-full rounded-lg border-r-[.5px] border-b-[.5px] border-l-[.5px] border-gray-200">
                            <thead className="bg-bgTableHeader text-tableHeaderText shadow-sm h-14 rounded-lg">
                              <tr>
                                <th className="px-6 py-3 text-left text-sm uppercase tracking-wider">PLANT</th>
                                <th className="px-6 py-3 text-left text-sm uppercase tracking-wider">EMPLOYEE ID</th>
                                <th className="px-6 py-3 text-left text-sm uppercase tracking-wider">EMPLOYEE NAME</th>
                                <th className="px-6 py-3 text-left text-sm uppercase tracking-wider">POSITION</th>
                              </tr>
                            </thead>
                            <tbody className="w-full divide-y divide-borderColor">
                              {data.map(((e, index) => (
                                <tr key={index} className="">
                                  <td className="px-6 h-12 whitespace-nowrap ">{e.PLANT_NAME}{e.PLANT_CODE}</td>
                                  <td className="px-6 h-12 whitespace-nowrap ">{e.EMPLOYEE_ID}</td>
                                  <td className="px-6 h-12 whitespace-nowrap ">{e.EMPLOYEE_NAME}</td>
                                  <td className="px-6 h-12 whitespace-nowrap ">{e.POSITION_NAME}</td>
                                </tr>
                              )))}

                              {/* Fill remaining rows with empty data */}
                              {Array(Math.max(0, data2.length - data.length)).fill('').map((_, index) => (
                                <tr key={index + data.length} className="">
                                  <td className="px-6 h-12 whitespace-nowrap"></td>
                                  <td className="px-6 h-12 whitespace-nowrap"></td>
                                  <td className="px-6 h-12 whitespace-nowrap"></td>
                                  <td className="px-6 h-12 whitespace-nowrap"></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <table className="w-full rounded-lg border-r-[.5px] border-b-[.5px] border-gray-200">
                            <thead className="bg-bgTableHeader text-tableHeaderText shadow-sm h-14 rounded-lg">
                              <tr>
                                <th className="px-6 py-3 text-left text-sm uppercase tracking-wider">PLANT</th>
                                <th className="px-6 py-3 text-left text-sm uppercase tracking-wider">EMPLOYEE ID</th>
                                <th className="px-6 py-3 text-left text-sm uppercase tracking-wider">EMPLOYEE NAME</th>
                                <th className="px-6 py-3 text-left text-sm uppercase tracking-wider">POSITION</th>
                              </tr>
                            </thead>
                            <tbody className="w-full divide-y divide-borderColor">
                              {data2.map(((e, index) => (
                                <tr key={index} className="">
                                  <td className="px-6 h-12 whitespace-nowrap">{e.PLANT_NAME || ''}{e.PLANT_CODE || ''}</td>
                                  <td className="px-6 h-12 whitespace-nowrap">{e.EMPLOYEE_ID || ''}</td>
                                  <td className="px-6 h-12 whitespace-nowrap">{e.EMPLOYEE_NAME || ''}</td>
                                  <td className="px-6 h-12 whitespace-nowrap">{e.POSITION_NAME || ''}</td>
                                </tr>
                              )))}
                              {/* Fill remaining rows with empty data */}
                              {Array(Math.max(0, data.length - data2.length)).fill('').map((_, index) => (
                                <tr key={index + data2.length} className="">
                                  <td className="px-6 h-12 whitespace-nowrap"></td>
                                  <td className="px-6 h-12 whitespace-nowrap"></td>
                                  <td className="px-6 h-12 whitespace-nowrap"></td>
                                  <td className="px-6 h-12 whitespace-nowrap"></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )
                }
              </div>
            </>
          )
        }


        {/* pagination start here */}

        <div className="h-5"></div>
        <div className="text-base font-bold">
          <label htmlFor="numbers">Show Data Per Page:</label>
          <select name="numbers" id="numbers" value={selectedValue} onChange={handleSelectChange}>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        <div className="h-5"></div>

        {data.length > 0 && (
          <div className='flex flex-row space-x-4 justify-center items-end mt-4 mb-3 lg:w-full md:w-3/4 sm:w-96 pr-6'>
            <button disabled={page === 0 && pageSearch === 0 ? true : false} onClick={() => { isSearch ? searchPrevious() : previous() }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 font-bold ${page === 0 && pageSearch === 0 ? 'text-white' : `text-gray-600`} font-bold`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            <p className={`text- text-[18px] font-bold`}>
              Page {isSearch ? pageCountSearch : pageCount} Of {totalPage}
            </p>

            <button disabled={(isSearch ? pageCountSearch : pageCount) === totalPage || data.length === 0} onClick={() => { isSearch ? searchNext() : next() }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 font-bold ${((isSearch ? pageCountSearch : pageCount) === totalPage || data.length === 0) ? 'text-white' : 'text-gray-500'} font-bold`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        )}
      </div>


    </div>
  )
}
