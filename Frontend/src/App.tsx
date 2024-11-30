import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Home from "./Pages/Home/Home";
import Root from "./Root";
import InOrOutProfile from "./Pages/Account/InOrOutProfile/InOrOutProfile";
import ChangeAboutsPage from "./Pages/About/ChangeAboutsPage";





function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root/>}>
        <Route path="/" element={ <Home/> } />
        <Route path="/account" element={<InOrOutProfile/>} />
        <Route path="/aboutus" element={<ChangeAboutsPage/>} />
        
        
        

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;