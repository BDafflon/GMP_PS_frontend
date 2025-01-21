import React from 'react'
import { useEffect } from 'react';

import {
  Box,
  Grid,
  Typography,
  Stack,
  Button
} from "@mui/material";
import  * as  DossierManager from '../../utils/dossierManager';
import { updateFeedback ,updateColoration} from '../../utils/configManager';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import IconButton from '@mui/material/IconButton';
import DragDropFile from '../../utils/dragndrop';
import { getAllGroupe, addGroupe, trashGroupe } from '../../utils/groupeManager';
import {upload } from '../../utils/upload';
import { CircularProgressWithLabel } from '../../utils/circularProgressWithLabel';
import Item from '../../utils/item';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ConfigurationSession from './components/configurationSession';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { getRatio } from '../../utils/dossierManager';
const drawerWidth = 240



const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
  }));
  
  const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
      {...props}
    />
  ))(({ theme }) => ({
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, .05)'
        : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
      marginLeft: theme.spacing(1),
    },
  }));
  
  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
  }));


 

export default function Configuration ({token}) {
  const [files,setFile]= React.useState([])
   const [dossiers,setDossier]= React.useState([]);
   const [dossiersFiltrer,setDossierFiltrer]= React.useState([]);
   const [selectedDosserForAction,setSelectedDosserForAction]= React.useState([]);
   const [groupes,setGroupes]= React.useState([]);
   const [progression, setProgression] =  React.useState(0);
   const [open, setOpen] = React.useState(false);
   const [groupeName, setGroupeName] = React.useState('');
   const [userName, setUserName] = React.useState('');


  const [selectedGroupe, setSelectedGroupe] = React.useState();
  const [selectedGroupeTrash, setSelectedGroupeTrash] = React.useState('');
  const [udpater,setUpdater]= React.useState(0);
  const [uploading,setUploading]= React.useState(false);
  const [udpaterChild,setUpdaterChild]= React.useState(0);
  const [expanded, setExpanded] = React.useState('panel1');
  const [motifAcception, setMotifAcception] = React.useState('0');
  const [motifRefus, setMotifRefus] = React.useState('0');
  const [motsPositif , setMotsPositif]= React.useState('');
  const [motsNegatif , setMotsNegatif]= React.useState('');


  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };


   

        useEffect(() => {
         (async () => {
           const dossier = await DossierManager.getAllDossier(token.token);
           setDossier(dossier);
           
           setDossierFiltrer(dossier)
           const groupe = await getAllGroupe(token.token)
           console.log("groupe lead",groupe)
           if(groupe.length>0){
                setMotifAcception(groupe[0].configuration.feedbackAcceptation)
                setMotifRefus(groupe[0].configuration.feedbackRefus)
                setMotsPositif(groupe[0].configuration.motsPositif)
                setMotsNegatif(groupe[0].configuration.motsNegatif)
                

           }
           
           setGroupes(groupe)
   
         })();
       
         return () => {
           // this now gets called when the component unmounts
         };
       }, [udpater]);

      const handleGroupeChange = (event) => {
        setSelectedGroupe(event.target.value);
      };

      const handleGroupeTrashChange = (event) => {
        setSelectedGroupeTrash(event.target.value);
      };

      const handleClickOpen = () => {
        setOpen(true);
      };
      const handleClose = () => {
        setOpen(false);
      };  


      const handleSupprimer = async() =>{

          let data = await DossierManager.delDossiers(token,selectedDosserForAction)
          console.log(data)
          setUpdater(udpater+1)
      }

      const handleReset = async() =>{
        let data = await DossierManager.resetDossiers(token,selectedDosserForAction)
      }
      
      const handleExporter  = async() =>{
        console.log(selectedDosserForAction)
        let data = await DossierManager.exportDossiers(token,selectedDosserForAction)
        
      }

      
 
 
      const handleChangeAcceptation = async(event) => {
        setMotifAcception(event.target.value);
        let x = await updateFeedback(token,'feedbackAcceptation',event.target.value)
      };
      const handleChangeRefus = async(event) => {
        setMotifRefus(event.target.value);
        let x = await updateFeedback(token,'feedbackRefus',event.target.value)

      };

      const handleChangeMotsPositif=async(e)=>{
        console.log(e.target.value)
        setMotsPositif(e.target.value)
        let x = await updateFeedback(token,'motsPositif',e.target.value)

      }
      const handleChangeMotsNegatif=async(e)=>{
        console.log(e.target.value)
        setMotsNegatif(e.target.value)
        let x = await updateFeedback(token,'motsNegatif',e.target.value)

      }

      const handleUpdateColoration=async()=>{
        let x = await updateColoration(token)
      }
      
      const handleUpdate =()=>{
        setUpdater(udpater+1)
        console.log('force update')
      }
      const handleClickTrash =async()=>{
        
        let rep = await trashGroupe(token.token,selectedGroupeTrash)
        
       setUpdater(udpater+1)

       
    }

  if (token.rank!=0)
    return <></>

  return (
     <>
     <Typography variant="h4" gutterBottom sx={{m:2}}>Configuration de la session
     <IconButton color="primary" aria-label="add to shopping cart" size="large" onClick={handleClickOpen}>
        <FileUploadIcon fontSize="inherit" />
    </IconButton>
    </Typography>
    <Box sx={{ flexGrow: 1 }}>
    <Grid container spacing={2} >
      <Grid item xs={9} >
        <Box sx={{ml:2}}>
        <Item>
        <Accordion>
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography>Phase 1  - {getRatio(groupes,1)}%</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ConfigurationSession groupes={groupes} token={token} nb={1} updater={handleUpdate}/>
          </AccordionDetails>
        </Accordion>
        <Accordion >
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <Typography>Phase 2</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <ConfigurationSession groupes={groupes} token={token} nb={2} updater={handleUpdate}/>
        </AccordionDetails>
      </Accordion>
      <Accordion >
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <Typography>Phase 3</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <ConfigurationSession groupes={groupes} token={token} nb={3} updater={handleUpdate}/>
        </AccordionDetails>
      </Accordion>
        </Item>
        </Box>
      </Grid>
      <Grid item xs={3}>
      <Box sx={{ml:2}}>
    <Stack>
      <Item sx={{mb:2}}>
       <Stack>
        
        <Typography>Motif:</Typography>
        <Stack>
        <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label" align="left">En cas d'acceptation:</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={motifAcception}
        onChange={handleChangeAcceptation}
        a
      >
        <FormControlLabel value="2" control={<Radio />} label="Modif" />
        <FormControlLabel value="1   " control={<Radio />} label="Note" />
        <FormControlLabel value="0" control={<Radio />} label="Rien" />
      </RadioGroup>
    </FormControl>

    <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label" align="left">En cas de refut:</FormLabel>
      <RadioGroup
        row
        onChange={handleChangeRefus}

        value={motifRefus}
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group2"
        a
      >
        <FormControlLabel value="2" control={<Radio />} label="Modif" />
        <FormControlLabel value="1" control={<Radio />} label="Note" />
        <FormControlLabel value="0" control={<Radio />} label="Rien" />
      </RadioGroup>
    </FormControl>

        </Stack>
         
        
       </Stack>
       </Item>


        <Item sx={{mb:2}}>
            <Typography>Mots positifs</Typography>
            <TextareaAutosize
  aria-label="minimum height"
  onChange={handleChangeMotsPositif}
  value={motsPositif}
  minRows={5}
  placeholder="Minimum 3 rows"
  style={{ width: "100% "}}
/>
         
        <Box sx={{mb:2}}>
            <Typography>Mots negatifs</Typography>
            <TextareaAutosize
            onChange={handleChangeMotsNegatif}
            value={motsNegatif}
  aria-label="minimum height"
  minRows={5}
  placeholder="Minimum 3 rows"
  style={{ width: "100% "}}
/>
<Button fullWidth variant="contained" onClick={handleUpdateColoration}>Mettre a jour les dossiers</Button>

</Box>
        </Item>
       </Stack>
       </Box>
        
      </Grid>
    </Grid>
    </Box>

 
     </>
  )
}
