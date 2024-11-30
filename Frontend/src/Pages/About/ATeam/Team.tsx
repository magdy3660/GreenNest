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
<section className={styless.oneabout}>

<div className={styless.navTop}>

<button onClick={ToSite} className={styless.oneBtn}>About Company</button>
<button onClick={toTeam} className={styless.twoBtn}>Our Team</button>

</div>


<h1> Hello Team</h1>

</section>
        </>
    );
}
export default Team ; 