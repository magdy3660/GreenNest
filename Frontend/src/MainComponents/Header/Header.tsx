import style from "./Header.module.css"
import "./Header.css"
import imgIcon from "../../../public/icon.png"
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";



function Header() {

return (

    <nav>
  
<div className={style.leftSide}>

{/* ============================================================================================================================= */}
{/* ============================================================================================================================= */}


<button className="btn listSides " type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
<FontAwesomeIcon className="fontAwsemList"  icon={faBars} />
</button>

<div className="offcanvas offcanvas-start" tabIndex={-1} id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
  <div className="offcanvas-header">
    <h5 className="offcanvas-title" id="offcanvasExampleLabel">Offcanvas</h5>
    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div className="offcanvas-body">
   
     
  </div>
</div>


{/* =================================================================================================================================
=========================================================================================================================== */}

    <span className={style.IconTittle}>
        <img src={imgIcon}/>
    <h1 className="fontTiltle">GreenNest</h1>
    </span>

<div className={style.ilnksContent
}>
<Link className={style.linkNav} to={""}>Library</Link>
<Link className={style.linkNav} to={""}>Contact Us</Link>
<Link className={style.linkNav} to={""}>Account</Link>

<div className="dropdown d-block">
  <button className="btn  dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    Dropdown button
  </button>
  <ul className="dropdown-menu ">
    <li><a className="dropdown-item " href="#">Services</a></li>
    <li><a className="dropdown-item" href="#">About Us</a></li>
  </ul>
</div>


</div>



    
</div>


<div className={style.rightSide}>
    <button className={style.btnGetApp}>Get The APP</button>
</div>

    </nav>
);
}
export default Header ;