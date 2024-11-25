import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";




const CheckAuth:React.FC = () => {

    const token = localStorage.getItem("TOKEN") || ""
    const navigate = useNavigate()
    const [auth,setAuth] = useState<Boolean>(false)

    useEffect(() => {
        axios.post(`${process.env.REACT_APP_BASE_URL}/api/checkAuth`,{},{
            headers : {
                Authorization: `Bearer ${token}`, 
            },
        })
         .then(response => {
            setAuth(true)
        })
        .catch(error => {
            localStorage.setItem("TOKEN","")
            localStorage.setItem("USERNAME","")
            navigate("/")
         });
        console.log("a")
        


    },[])

    return (
        <div>
            {auth && <Outlet/>}
        </div>    
    )
}

export default CheckAuth;
