import React from 'react'
import { useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import * as ConfigManager from "../../../utils/configManager";
import { Session,SessionDetail } from '../../../utils/session'; 
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { updateFeedbackGroupe } from '../../../utils/configManager';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { Stack } from '@mui/system';
const drawerWidth = 240


function GetOption({phase,handleColoration,handleRelecture,groupe}){
    if (phase==1){
        return <FormControlLabel control={<Checkbox checked={groupe.configuration["phase"+phase].coloration==1} onChange={handleColoration(groupe)} />} label="Coloration" />
    }
    if (phase>=2){
        return (
            <Stack direction="row">
                <FormControlLabel control={<Checkbox defaultChecked onChange={handleColoration(groupe)} />} label="Coloration" />
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Relecture des refus</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={handleRelecture(groupe,"pourcentageRelectureRefus")}
                    label="Relecture des dossiers acceptés"
                     value={groupe.configuration["phase"+phase].pourcentageRelectureRefus}
                    >
                    <MenuItem value={0}>0%</MenuItem>
                    <MenuItem value={25}>25%</MenuItem>
                    <MenuItem value={50}>50%</MenuItem>
                    <MenuItem value={75}>75%</MenuItem>
                    <MenuItem value={100}>100%</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Relecture acceptés</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={handleRelecture(groupe,"pourcentageRelectureAcceptation")}
                    label="Relecture des dossiers acceptés"
                    value={groupe.configuration["phase"+phase].pourcentageRelectureAcceptation}
                    >
                     <MenuItem value={0}>0%</MenuItem>
                    <MenuItem value={25}>25%</MenuItem>
                    <MenuItem value={50}>50%</MenuItem>
                    <MenuItem value={75}>75%</MenuItem>
                    <MenuItem value={100}>100%</MenuItem>
                    </Select>
                </FormControl>
            </Stack>)
    }
}

 

export default function ConfigurationSession ({token,nb,groupes,updater}) {
    const [phase,setPhase] = React.useState(nb)
    const [update,setUpdater] = React.useState(0)


    useEffect(() => {
         
        console.log('conf session',groupes)
          
       
      
        return () => {
          // this now gets called when the component unmounts
        };
      }, [groupes,update]);


      const handleOpenLecture= (e)=>async(g)=>{
        console.log("update",e)
        
        let x = await ConfigManager.updatePhaseGroupe(token,e,"phase"+nb,"lecture",g.target.checked?1:0)
        updater()
      }

      const handleColoration= (e)=>async(g)=>{
        console.log("handleColoration",e)
        
        let x = await ConfigManager.updatePhaseGroupe(token,e,"phase"+nb,"coloration",g.target.checked?1:0)
        updater()
      }

      const handleRelecture= (e,type)=>async(g)=>{
        console.log("handleRelecture",type,e)
        
        let x = await ConfigManager.updatePhaseGroupe(token,e,"phase"+nb,type,g.target.value)
        updater()
      }

  if (token.rank!=0)
    return <></>

  return (
     <>
     
     <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <colgroup>
    <col width="5%" />
    <col width="5%" />
    <col width="5%" />
    <col width="5%" />
    <col width="10%" />
    <col width="55%" />
</colgroup>
        <TableHead>
          <TableRow>
            <TableCell>Groupe</TableCell>
            <TableCell align="center">dossiers</TableCell>
            <TableCell align="center">avancement</TableCell>
            <TableCell align="center">relecteurs</TableCell>
            <TableCell align="center">Lecture</TableCell>
            <TableCell align="center">Option</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groupes.map((row,i) => (
             
                
            
            <TableRow
              key={row.nom}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.nom}
              </TableCell>
              <TableCell align="center">{row["nbDossierPhase"+nb]}</TableCell>
              <TableCell align="center">{row.avancement== undefined || 0==row["nbDossierPhase"+nb]?"-":(100*row.avancement["phase"+nb] / row["nbDossierPhase"+nb]).toFixed(0)+'%'}</TableCell>
              <TableCell align="center">{row.nbLecteur}</TableCell>
              <TableCell align="center"> <Switch checked={row.configuration["phase"+nb].lecture==1} onChange={handleOpenLecture(row)}/></TableCell>
              <TableCell align="left"><GetOption phase={nb} handleColoration={handleColoration} handleRelecture={handleRelecture} groupe={row}/></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
 
     </>
  )
}
