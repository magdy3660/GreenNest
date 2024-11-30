import style from "./Header.module.css"
import "./Header.css"
import imgIcon from "../../../public/icon.png"
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";



function Header() {
const navicate = useNavigate();

function goHome()  {
  navicate("/")
}

return (

    <nav>
  
<div className={style.leftSide}>

{/* ============================================================================================================================= */}
{/* ============================================================================================================================= */}

<span className={style.HideInNaturalState}>
<button className="btn listSides " type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
<FontAwesomeIcon className="fontAwsemList"  icon={faBars} />
</button>

<div className="offcanvas offcanvas-start" tabIndex={-1} id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
  <div className="offcanvas-header">

  <span  onClick={goHome} className={style.IconTittle}>
        <img src={imgIcon}/>
    <h1 className="fontTiltle">GreenNest</h1>
    </span>

    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div className="offcanvas-body">
   

  <div className={style.ilnksContents
}>
<Link className={style.linkNavs} to={""}>Library</Link>
<Link className={style.linkNavs} to={""}>Contact Us</Link>
<Link className={style.linkNavs} to={""}>Account</Link>

<div className="dropdown d-block">
  <button className="btn secondbtnf  dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    Company
  </button>
  <ul className="dropdown-menu ">
    <li><a className="dropdown-item " href="#">Services</a></li>
    <li><a className="dropdown-item" href="#">About Us</a></li>
  </ul>
</div>


</div>

{/* <div className={style.listdisplayBuuton}> */}
    <button className={style.btnGetAppp}>Get The APP</button>


     
  </div>
</div>
</span>

{/* =================================================================================================================================
=========================================================================================================================== */}

    <span  onClick={goHome} className={style.IconTittle}>
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
    Company
  </button>
  <ul className="dropdown-menu ">
    <li><Link className="dropdown-item " to="#">Services</Link></li>
    <li><Link className="dropdown-item" to="#">About Us</Link></li>
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