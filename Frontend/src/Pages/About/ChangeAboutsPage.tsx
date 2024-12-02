import { useState } from "react";
import AboutSite from "./AboutSite/Site";
import Team from "./ATeam/Team";

const ChangeAboutsPage = () => {
const [ about , setAbout ] = useState<boolean>(true);
    return (
        <>
        {about ? <AboutSite setAbout={setAbout}/> : <Team setAbout={setAbout}/> }
        </>
    );
}
export default ChangeAboutsPage ;