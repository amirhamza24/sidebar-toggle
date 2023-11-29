import React, { useState } from 'react';
import {
    FaTh,
    FaBars,
    FaUserAlt,
    FaRegChartBar,
    FaCommentAlt,
    FaShoppingBag,
    FaThList
}from "react-icons/fa";
import { NavLink } from 'react-router-dom';


const Sidebar = ({children}) => {
    const[isOpen ,setIsOpen] = useState(false);
    const toggle = () => setIsOpen (!isOpen);
    // let [pageCount,setPage]=useState(1);
    // let [page,setPg]=useState(0);
    // const limit = 10;
    // const [isLoading, setIsLoading] = useState(false);
    // const [attReportList, setAttReportList] = useState([]);
    // const [attReportList2, setAttReportList2] = useState([]);
    // const [totalPage,setTotalPage]=useState(null);

    const menuItem=[
        {
            path:"/",
            name:"Dashboard",
            icon:<FaTh/>
        },
        {
            path:"/about",
            name:"About",
            icon:<FaUserAlt/>
        },
        {
            path:"/analytics",
            name:"Analytics",
            icon:<FaRegChartBar/>
        },
        {
            path:"/comment",
            name:"Comment",
            icon:<FaCommentAlt/>
        },
        {
            path:"/product",
            name:"Product",
            icon:<FaShoppingBag/>
        },
        {
            path:"/productList",
            name:"Product List",
            icon:<FaThList/>
        }
    ]

    // const next=async()=>{
    //     // setPage((page)=>page+10);
    //     const newPage = page + limit;
    //     setPg(newPage);
    //     console.log(`page here ${newPage}`);
    //     setPage((pre)=>pre+1);
      
    //     setIsLoading(true);
    //     setAttReportList([]);
    //     setAttReportList2([]);
      
    //     // submit(newPage);
    //     setIsLoading(false);
        
    //     console.log('clicked');
    // }
    
    // const previous=async()=>{
    //     // setPage((pre)=>pre-10);
    //     const newPage = page - limit;
    //     setPg(newPage);
    //     console.log(`page here ${newPage}`);
    //     setPage((pre)=>pre-1);
        
    //     console.log('clicked');
    //     setIsLoading(true);
    //     setAttReportList([]);
    //     setAttReportList2([]);
        
    //     // submit(newPage);
    //     setIsLoading(false);
    //     // console.log(result.ATTENDANCE_DETAILS);
    // }

    // const divideAndCeil = (number) => {
    //     if (typeof number !== 'number') {
    //       throw new Error('Input must be a number');
    //     }
      
    //     const re= Math.ceil(number / limit);
    //     setTotalPage(re);
    // }

    return (
        <div className="container">
           <div style={{width: isOpen ? "200px" : "50px"}} className="sidebar">
               <div className="top_section flex items-center">
                   <div style={{marginLeft: isOpen ? "0px" : "0px"}} className="bars">
                       <FaBars onClick={toggle}/>
                   </div>
                   {/* <div className='flex justify-end'>
                        <h1 style={{display: isOpen ? "block" : "none"}} className="logo">Logo</h1>
                   </div> */}
               </div>
               {
                   menuItem.map((item, index)=>(
                       <NavLink to={item.path} key={index} className="link" activeclassName="active">
                           <div className="icon">{item.icon}</div>
                           <div style={{display: isOpen ? "block" : "none"}} className="link_text">{item.name}</div>
                       </NavLink>
                   ))
               }
           </div>

            
            {/* pagination 
           <div className=' flex flex-row space-x-4 justify-center items-end mt-4 mb-3 lg:w-full md:w-3/4 sm:w-96 pr-6'>
                <button  disabled={ page===0 ?true:false} onClick={()=>{previous()}}>
                    <svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6  font-bold  ${page ===0 ?'text-white':`text-gray-500`} font-bold`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                
                <p className={`text-gray-500 text-[18px] font-bold`}>
                    {pageCount} Of {totalPage}
                </p> 


                <button disabled={attReportList.length ===0 || pageCount===totalPage? true:false} onClick={()=>{next()}}>
                    <svg   xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6  font-bold  ${attReportList.length ===0 || pageCount===totalPage?'text-white':`text-gray-500`} font-bold`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div> */}

            <main>{children}</main>
        </div>
    );
};

export default Sidebar;