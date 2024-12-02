import styless from "./Site.module.css"
interface Changeaccount {
    setAbout: (arg0: boolean) => void; 
    
  }
const AboutSite = ({setAbout}:Changeaccount) => {

const toTeam = () => {
setAbout(false)
}
const ToSite = () => {
setAbout(true)
}
 

    return (
        <body className={styless.bodyies}>

<div className={styless.sideBar}>
<div className={styless.linksContentSide}>
<a className={styless.onelink} href="#oopp">Overview</a>
<a className={styless.twolink} href="#whyy">Why GreenNest</a>
<a className={styless.threelink} href="#whatt">What we offer</a>

<a className={styless.fourlink} href="">How use App</a>
</div>

</div>


<section className={styless.oneabout}>

<div className={styless.navTop}>

<button onClick={ToSite} className={styless.oneBtn}>About Company</button>
<button onClick={toTeam} className={styless.twoBtn}>Our Team</button>

</div>


<div className={styless.contentPage}>

<h1 id="oopp">OverView</h1>

<p className={styless.overviewdetails}>
At GreenNest, our mission is to build trust and deliver the best experience to our customers and users through our website and application. We believe that plants and greenery are essential to life, which is why we are dedicated to helping you care for your plants. Our platform enables you to easily diagnose plant diseases and learn effective treatment methods in a clear and organized manner. Simply take a photo of your plant's affected leaf or upload an existing image, and our system will identify the issue and provide detailed information about the disease, or confirm if it's not a disease. Additionally, you can describe your plant's symptoms by selecting from a range of suggestions, offering another convenient way to receive help.
</p>


<img className={styless.firsImagesAbout} src="../../../../public/Images/aboutImages.jpg" />


<h2 id="whyy" className={styless.whyi}>Why GreenNest</h2>

<p className={styless.whyDetails}>
Let me tell you why GreenNest is the right choice for you. We provide highly accurate information backed by a team of experts dedicated to helping you keep your plants in excellent condition. Whether you prefer using mobile apps or websites, we cater to both preferences. Our website is user-friendly and easy to navigate, featuring service pages, an introduction to our team, and a library for exploring plant types and related topics. To access our photo upload and detection service, simply create an account and join us.  

For those who prefer mobile solutions, our app is available on the Google Play Store. It’s lightweight, easy to use, and requires no account creation to access any service. Just one click, and you’re ready to enjoy the most seamless and valuable plant care experience!
</p>

<p className={styless.secoWhyDeatails}> 
Botany is a vast field, and diagnosing plant diseases demands precision and extensive expertise in understanding the nature of these diseases, their progression, and the most effective treatments. At GreenNest, we offer all this and more. Whether you're a farmer, landowner, or simply passionate about plants, we are here to help you care for your greenery with confidence. Join us on this exciting journey to ensure the health of your plants and land. This is the perfect place for you and your botanical needs!
</p>


<p className={styless.secoWhyDeatails}>The site was developed with cutting-edge technologies, including React.js with TypeScript, Vite, and various other libraries. The application incorporates advanced filtering techniques and is seamlessly integrated with machine learning, image processing, and a robust backend—all crafted by experts in their respective fields. For more details, don’t hesitate to reach out and send us a message!</p>



<div className={styless.threeImagesAbo}>

<img src="../../../../public/Images/pp.jpg" />

<img src="../../../../public/Images/oo.jpg" />

<img src="../../../../public/Images/ii.jpg" />

</div>

<h2 className={styless.whyi} id="whatt">What We Offer</h2>

<p className={styless.poi}>We offer exactly what you need! Join us now to explore our website, where you can identify your plant or download our app for added convenience. Discover our extensive library for in-depth research, and let expert services and AI technology give you peace of mind about your plant’s health.</p>

<button className={styless.btnGetAppAbou}>Download App</button>

<h2 className={styless.whyi}>How use App</h2>


</div>





</section>


        </body>
    );
}
export default AboutSite ; 