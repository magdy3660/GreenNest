import { useState } from "react";
import SignIn from "../SignIn/SignIn";
import Register from "../Register/Register";

interface Changeaccount {
    setIfaccount: (arg0: boolean) => void; // Define the type for the setChange prop
  }
const UserProfile = ({setIfaccount} : Changeaccount) => {

    const [ inorout , setInorout ] = useState<boolean>(false);

    return (
        <>
        {inorout ? <SignIn setInorout={setInorout} setIfaccount={setIfaccount}/> : <Register setInorout={setInorout} setIfaccount={setIfaccount}/>}
     
        </>
    );
};
export default UserProfile