import style from "./Sign.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight , faSeedling , faMobileScreenButton , faCamera} from "@fortawesome/free-solid-svg-icons";
interface Changeaccount {
    setIfaccount: (arg0: boolean) => void; // Define the type for the setChange prop
    setInorout: (arg0: boolean) => void ;
  }
const Register = ({setIfaccount , setInorout} : Changeaccount) => {

    const changeToSign = () => {
        setInorout(false)
    }
    return (
        <>
        <section className={style.sectionContentRegister}>



<div className={style.form}>
    <h1>Sign in</h1>





<div className={style.emailField}>
    <label>Email</label>
    <input type="email" />
</div>


<div className={style.passwordField}>
<label>Password</label>
<input type="password" />
</div>




<div className={style.btns}>
    <button>Sign in</button>
</div>

<span onClick={changeToSign} className={style.changeSignIn}>Create Account
<FontAwesomeIcon className={style.iconArrow} icon={faArrowRight} />
</span>


</div>



        </section>

        <section className={style.secontSection}>


<h2>
    
    Welcome to GreenNest
At GreenNest, we are committed to empowering farmers and plant enthusiasts with cutting-edge technology to ensure healthier crops and a sustainable future. Simply upload a photo of your plant, and our advanced diagnostic tool will identify potential diseases and offer tailored solutions. With our mobile app and Join us to use our site to discover your plant, you can access this innovative service anytime, anywhere. Join us in cultivating healthier plants and stronger communities today!"

Feel free to customize the tone or details to better fit your project. Let me know if you'd like help refining this further!</h2>


<div className={style.iconss}>

<span><FontAwesomeIcon className={style.oneIcon} icon={faCamera} /></span>
<span><FontAwesomeIcon className={style.twoIco} icon={faMobileScreenButton} /></span>
<span><FontAwesomeIcon className={style.threeIco} icon={faSeedling} /></span>
</div>

</section>

        </>
    );
};
export default Register ;