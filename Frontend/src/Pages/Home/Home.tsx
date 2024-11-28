import styles from "./Home.module.css"
import "./Home.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMobileScreenButton , faCamera , faSeedling } from "@fortawesome/free-solid-svg-icons";


const Home = () => {


    


    return (
        <>
        <section className={styles.FirstSection}>

<h1 className={styles.headOneMain}>Embark on a journey of discovery with your plants , nurture them with confidence and become part of an amazing experience with us</h1>

<button className={styles.btnJoinUs}>
Join our journey
</button>

        </section>


<section className={styles.secontSection}>


<h2>
    
    Welcome to GreenNest
At GreenNest, we are committed to empowering farmers and plant enthusiasts with cutting-edge technology to ensure healthier crops and a sustainable future. Simply upload a photo of your plant, and our advanced diagnostic tool will identify potential diseases and offer tailored solutions. With our mobile app and Join us to use our site to discover your plant, you can access this innovative service anytime, anywhere. Join us in cultivating healthier plants and stronger communities today!"

Feel free to customize the tone or details to better fit your project. Let me know if you'd like help refining this further!</h2>


<div className={styles.iconss}>

<span><FontAwesomeIcon className="oneIcon" icon={faCamera} /></span>
<span><FontAwesomeIcon className="twoIco" icon={faMobileScreenButton} /></span>
<span><FontAwesomeIcon className="threeIco" icon={faSeedling} /></span>
</div>

</section>


<section className={styles.thirdSection}>

<img className={styles.oneImagesl} src="../../../public/Images/doctorPImages.webp" alt=""  />
<img className={styles.twoImagesL} src="../../../public/Images/usePhoApp.png" />

<img className={styles.mopilePho} src="../../../public/Images/phonePho.png" />

</section>


<section className={styles.fourthSection}>


<div className={styles.contentFourthSection}>

<img src="../../../public/Images/farmersImages.webp" alt="the Farmer " />

<div className={styles.aboutMan}> 
<h3>This app provided excellent analysis and solutions for my plant diseases. I highly recommend it to anyone looking to improve their crop health!</h3>
<p className="nameOffarmer">Juan Lopez</p>
<p>Farmer, Mexico</p>
</div>
</div>





</section>


        </>
    );

}
export default Home ;