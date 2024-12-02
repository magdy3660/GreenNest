import style from "./Contact.module.css"
const ContactUs = () => {

    return (
        <>
<section className={style.sectionAll}>



<div className={style.formContact}>

<h1>Contact Us</h1>

<div className={style.dears}>
    <h2>Share your experience with us</h2>
</div>

<div className={style.nameContact}>
    <label>Your Name</label>
    <input type="text"  />
</div>

<div className={style.emailContact}>
    <label>Your Email</label>
    <input type="email"  />
</div>


<div className={style.SuggestContact}>
    <label>Your Suggests</label>
    <textarea className={style.textareasc}  placeholder="write your suggest"/>
</div>


<div className={style.btnContact}>

<button>Send</button>

</div>




</div>



</section>



        </>
    );
}
export default ContactUs ; 