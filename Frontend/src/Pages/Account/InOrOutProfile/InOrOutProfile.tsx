import { useState } from "react";
import UserProfile from "../UserProfile/UserProfile";
import UserDashBoard from "../UserDashBoard/UserDashBoard";

const InOrOutProfile = () => {

const [ ifaccount , setIfaccount ] = useState<boolean>(false) ;


    return (
        <>
        {ifaccount? <UserDashBoard setIfaccount={setIfaccount}/>  : <UserProfile setIfaccount={setIfaccount}/>     }
        
        
        
        
        </>
    );
}
export default InOrOutProfile ; 