import * as React from "react";

import CssBaseline from "@mui/material/CssBaseline";
import {  Box,  Typography} from "@mui/material";
import AppNavBar from "../components/appBar";
import SidePanel from "../components/sidepanel";
import Dossier from "../dossier/dossier";
import Lecteur from "../lecteur/lecteur";
import Configuration from "../configuration/configuration";
import DashboardContent from "./components/dashbordContent"; 

function GetComponent({component,token}){
    if(component===0)
        return <DashboardContent token={token}/>
    if(component===1)
        return <Typography>Compte</Typography>
    if(component===2 && token.rank==0)
        return <Dossier token={token} />
    if(component===3 && token.rank==0)
        return <Lecteur token={token} />
    if(component===4 && token.rank==0)
        return <Configuration token={token} />
    
    return <Typography>Erreur</Typography>
  

}

export default function Dashboard({ token }) {
    const [component, setComponent] = React.useState(0);

    const handleComponent = (item) => {
        setComponent(item)
      };

  return (
    <Box sx={{ ml: "240px", my: 10, width: "auto" }}>
      <CssBaseline />
      <AppNavBar />
      <SidePanel token={token} handleComponent={handleComponent}/>
      <Box sx={{ my: 5, width: "auto" }}>
         <GetComponent component={component} token={token}/>
      </Box>
    </Box>
  );
}