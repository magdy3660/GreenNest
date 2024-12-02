import styless from "./Team.module.css"
interface Changeaccount {
    setAbout: (arg0: boolean) => void; 
    
  }
const Team = ({setAbout}:Changeaccount) => {

    const toTeam = () => {
        setAbout(false)
        }
        const ToSite = () => {
        setAbout(true)
        }

    return (
        <>
        <body className={styless.bodyies}>
        <div className={styless.sideBar}>
<div className={styless.linksContentSide}>
{/* <a className={styless.onelink} href="#oopp">Overview</a>
<a className={styless.twolink} href="#whyy">Why GreenNest</a>
<a className={styless.threelink} href="#whatt">What we offer</a>

<a className={styless.fourlink} href="">How use App</a> */}
</div>

</div>


<section className={styless.oneabout}>

<div className={styless.navTop}>

<button onClick={ToSite} className={styless.oneBtn}>About Company</button>
<button onClick={toTeam} className={styless.twoBtn}>Our Team</button>

</div>



</section>


</body>
        </>
    );
}
export default Team ; 