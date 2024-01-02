import React,{useState,useEffect,useRef} from 'react';
import LoginService from '../../services/LoginService';
import { useNavigate } from 'react-router-dom';

import { red500 } from '../../utils/colors';
import PrivateRoutes from '../../utils/PrivateRoutes';
import { baseUrl } from '../../utils/path';

const loginUrl=`${baseUrl}user_login`;



export default function LoginPage({ setToken }) {

  const [remmember,setRemember]=useState(false);
  const [username,setUsername]=useState( '');
  const [password,setPassword]=useState( '');
  const[isLoading,setIsloading]=useState(null);
  const [showAlert, setShowAlert] = useState(null);
  const [loginError,setLoginError]=useState({});
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  useEffect(()=>{
  const   savedUserName = localStorage.getItem('username');
const savedPassword = localStorage.getItem('password');
const savedRemember=localStorage.getItem('remember');

      if((savedUserName && savedPassword)===null ){
        console.log("save nai");
      }
      else{
        setUsername(savedUserName);
        setPassword(savedPassword);
        setRemember(savedRemember);
        usernameRef.current.value=savedUserName;
        passwordRef.current.value=savedPassword;
        // console.log(`username: ${savedUserName} password: ${savedPassword} remember: ${savedRemember}`);
      }
  },[])

  const addZerosToLeft = (str) => {
    const loginIdLength = 8 - str.length;
    return loginIdLength > 0 ? '0'.repeat(loginIdLength) + str : str;
  };

  const validateLogin=()=>{
    const loginError={};
    if(!username.trim()){
      loginError.username="Please Enter Username";
    }
    if(!password.trim()){
      loginError.password="Please Enter Password";
    }
    setLoginError(loginError);

      return Object.keys(loginError).length===0;
  }

 const [message,setMessage]=useState('');
  const login=async()=>{
    if(validateLogin()){
      setIsloading(true);
      const addUserId = addZerosToLeft(username);
    const log = await LoginService(loginUrl,addUserId,password);
    console.log(log.message);
    console.log("user id: ", addUserId);
    console.log("id length: ", addUserId.length);
    if(log.status ===true){
      localStorage.setItem('userId', addUserId);
      
      
      setIsloading(false);
      setShowAlert(true);
      setToken(true);
      // In your login method after successful login
localStorage.setItem('token', log.token);

     

      
    // Navigate to the home page after a delay
    setTimeout(() => {
      navigate('/home');
    }, 500); // Delay of 1 seconds
      
     
      
    }
    else{
      setIsloading(false);
      setShowAlert(false);
      setMessage(log.message);
      console.log("not successful");
    }
    }
    else{
      console.log('validation failed');
    }
  }

 const saveInfo=()=>{
  // Save email and password in local storage
localStorage.setItem('username', username);
localStorage.setItem('password', password);

console.log('save korlo');

  }

  const deleteInfo=()=>{
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    console.log('delete korlo');
  }
  const [isPass,setIsPass]=useState(true);

  const handleShow=()=>{
    setIsPass(!isPass);
   
  }
  return (
    <div className=' w-full flex justify-center h-screen items-center'>
          <div className=' md:w-1/2 w-[420px]  bg-gray-100 shadow-md rounded-lg p-8 flex flex-col items-center'>
          <img src="./images/logo.png" alt="logo"  className= ' h-20 w-20 rounded-full'/>
                <h1 className=' text-black font-bold text-2xl'>WEPL</h1>
    <div className=' w-96 flex flex-row space-x-1 p-2 border-[0.5px] border-gray-400 rounded-md mx-24 mt-6'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500 font-normal pt-2">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
</svg>

<input ref={usernameRef} type="text" onChange={(e)=>{
  setUsername(e.target.value)
}} required className=' border-none outline-none h-8  bg-transparent w-full'/>

                </div>
                {loginError.username && <span className={`text-${red500}`}>{loginError.username}</span>}
            <div className=' w-96 flex flex-row space-x-1 p-2 border-[0.5px] border-gray-400 rounded-md mx-24 mt-6'>
                

<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500 font-normal pt-2">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
</svg>


<input required ref={passwordRef} type={isPass?"password":"text"}  onChange={(e)=>{setPassword(e.target.value)}}  className=' border-none outline-none h-8  bg-transparent w-full'/>

{
  isPass
  ?
  <button onClick={handleShow} >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
</svg>

  </button>
  :
  <button onClick={handleShow}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
</svg>

  </button>
}
                </div>
                {loginError.password && <span className={`text-${red500}`}>{loginError.password}</span>}

<button onClick={()=>{
  let newRemember;
  if(remmember){
    newRemember=false;
  }
  else{
    newRemember=true;
  }

  setRemember(newRemember);
  
  console.log(newRemember);

  if(newRemember ===true){

    saveInfo();
    localStorage.setItem('remember',newRemember);
  }
  else{
    deleteInfo();
    localStorage.removeItem('remember',newRemember);
  }

}}>
<div className='w-96 flex flex-row space-x-2 mx-24 mt-6'>
      <div className={` h-[17px] w-[17px] ${remmember ? ' border-white': 'border-gray-400'} border-[0.5px] rounded-sm ${remmember ? 'bg-blue-700':'bg-gray-100'} justify-center items-center`}>

     {
      remmember ?
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-[14px] h-[14px] text-white font-bold`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>:
    <p></p>
     }


      </div>
      <p className=' text-gray-600 text-xs font-medium '>Remember username</p>
    </div>
</button>


{ isLoading?
<div
class="inline-block h-12 w-12  mt-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-info motion-reduce:animate-[spin_1.5s_linear_infinite]"
role="status">

</div>
 : <button onClick={()=>{login()}} className=' h-10 w-96  mx-24 mt-6 rounded-lg bg-blue-700 flex justify-center items-center'>

  <h4 className=' text-white font-semibold text-sm'> Sign In</h4>
  
  </button>
}
{
showAlert ===true?
<div className="alert alert-success shadow-lg mt-4">
<div>
<svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
<span className=' text-white font-semibold text-sm'>Login Successful</span>
</div>
</div>
:
showAlert ===false?
<button  onClick={()=>{setShowAlert(null)}} className="alert alert-error shadow-lg mt-4">
<div>
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
<path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>

<span className=' text-white font-semibold text-sm'>{message}</span>
</div>
</button>:
<p></p>

}
<div>

</div>
                
                
          </div>
    </div>
  )
//     <div className=' flex justify-center items-center w-full  '>

//         <div className=' bg-gray-100 shadow-xl rounded-lg w-1/2 h-3/4 p-8'>
//             <div className='flex justify-center items-center w-full flex-col space-y-4'>
//                 <img src="./images/logo.png" alt="logo"  className= ' h-20 w-20 rounded-full'/>
//                 <h1 className=' text-black font-bold text-2xl'>WEPL HRM</h1>
                
//                 {/* <div className=' w-96 h-10 rounded-md border-gray-400 border-[1px] justify-center items-start px-4 space-x-4 focus:border-blue-500'>
               


//         </div> */}
//             </div>

//             <div className=' w-full flex flex-row space-x-1 p-2 border-[0.5px] border-gray-400 rounded-md mx-24 mt-6'>
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500 font-normal pt-2">
//   <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
// </svg>

// <input ref={usernameRef} type="text" onChange={(e)=>{
//   setUsername(e.target.value)
// }} required className=' border-none outline-none h-8  bg-transparent w-full'/>

//                 </div>
//                 {loginError.username && <span className={`text-${red500}`}>{loginError.username}</span>}
//             <div className=' w-full flex flex-row space-x-1 p-2 border-[0.5px] border-gray-400 rounded-md mx-24 mt-6'>
                

// <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500 font-normal pt-2">
//   <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
// </svg>


// <input required ref={passwordRef} type="password" onChange={(e)=>{setPassword(e.target.value)}}  className=' border-none outline-none h-8  bg-transparent w-full'/>

//                 </div>
//                 {loginError.username && <span className={`text-${red500}`}>{loginError.username}</span>}

//                 <button onClick={()=>{
//                   let newRemember;
//                   if(remmember){
//                     newRemember=false;
//                   }
//                   else{
//                     newRemember=true;
//                   }

//                   setRemember(newRemember);
                  
//                   console.log(newRemember);

//                   if(newRemember ===true){

//                     saveInfo();
//                     localStorage.setItem('remember',newRemember);
//                   }
//                   else{
//                     deleteInfo();
//                     localStorage.removeItem('remember',newRemember);
//                   }

//                 }}>
//                 <div className=' flex flex-row space-x-2 mx-24 mt-6'>
//                       <div className={` h-[17px] w-[17px] ${remmember ? ' border-white': 'border-gray-400'} border-[0.5px] rounded-sm ${remmember ? 'bg-blue-700':'bg-gray-100'} justify-center items-center`}>

//                      {
//                       remmember ?
//                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-[14px] h-[14px] text-white font-bold`}>
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
//                     </svg>:
//                     <p></p>
//                      }


//                       </div>
//                       <p className=' text-gray-600 text-xs font-medium '>Remember username</p>
//                     </div>
//                 </button>

               
//             { isLoading?
//             <div
//             class="inline-block h-12 w-12  mt-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-info motion-reduce:animate-[spin_1.5s_linear_infinite]"
//             role="status">
           
//           </div>
//                  : <button onClick={()=>{login()}} className=' h-10 w-80  mx-24 mt-6 rounded-lg bg-blue-700 flex justify-center items-center'>

//                   <h4 className=' text-white font-semibold text-sm'> Sign In</h4>
                  
//                   </button>
//             }
//             {
//               showAlert ===true?
//               <div className="alert alert-success shadow-lg mt-4">
//   <div>
//     <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
//     <span className=' text-white font-semibold text-sm'>Login Successful</span>
//   </div>
// </div>
// :
// showAlert ===false?
// <button  onClick={()=>{setShowAlert(null)}} className="alert alert-error shadow-lg mt-4">
//   <div>
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
//   <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
// </svg>

//     <span className=' text-white font-semibold text-sm'>Login Failed. Try Again</span>
//   </div>
// </button>:
// <p></p>

//             }
               
//         </div>

        

//     </div>
  
}
