import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Home from "./Pages/Home/Home";
import Root from "./Root";
import UserProfile from "./Pages/Account/UserProfile/UserProfile";
import SignIn from "./Pages/Account/SignIn/SignIn";
import Register from "./Pages/Account/Register/Register";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root/>}>
        <Route path="/" element={ <Home/> } />
        <Route path="/account" element={<UserProfile/>}>
        <Route path="/account/signin" element={<SignIn/>}/>
        <Route path="/account/createaccount" element={<Register/>}/> 
        </Route>
        
        
        
        

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;