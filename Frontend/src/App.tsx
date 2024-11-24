import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Home from "./Pages/Home/Home";
import Root from "./Root";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root/>}>
        <Route path="/" element={ <Home/> }  >
        
        
        
        </Route>
        

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;