import React from 'react'
import { useEffect } from 'react';

import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles';
import {
  Box,
  Grid,
  Typography,
  Stack
} from "@mui/material";
import IosShareIcon from '@mui/icons-material/IosShare';
import DeleteIcon from '@mui/icons-material/Delete';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import SendIcon from '@mui/icons-material/Send';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import  * as  DossierManager from '../../utils/dossierManager';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import IconButton from '@mui/material/IconButton';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import DragDropFile from '../../utils/dragndrop';
import { getAllGroupe, addGroupe, trashGroupe } from '../../utils/groupeManager';
import TextField from '@mui/material/TextField';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {upload, uploading } from '../../utils/upload';
import DossierList from "./components/dossierList";
import { GetResultats } from '../../utils/dossierManager';
import Item from '../../utils/item';
import { GroupePicker } from '../../utils/groupeManager';
import { CircularProgressWithLabel } from '../../utils/circularProgressWithLabel';
import { BootstrapDialog, BootstrapDialogTitle } from '../../utils/bootstrapdialog';
const drawerWidth = 240




function DragOrUp({uploading,handleFiles,progression}){

  if(uploading){
    return  <Box>
      <Stack sx={{ color: 'grey.500' }} direction="column"
  justifyContent="center"
  alignItems="center" 
  spacing={2}>
    <CircularProgressWithLabel value={progression} />
      
    </Stack>
      </Box>

  }
  else{
    return <DragDropFile setFile={handleFiles}  />
  }

}

export default function Dossier ({token}) {
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



   

        useEffect(() => {
         (async () => {
           const dossier = await DossierManager.getAllDossier(token.token);
           setDossier(dossier);
           setDossierFiltrer(dossier)
           const groupe = await getAllGroupe(token.token)
           console.log(dossier)
           setGroupes(groupe)
   
         })();
       
         return () => {
           // this now gets called when the component unmounts
         };
       }, [udpater,udpaterChild]);

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
        setUpdater(udpater+1)
      }
      
      const handleExporter  = async() =>{
        console.log(selectedDosserForAction)
        let data = await DossierManager.exportDossiers(token,selectedDosserForAction)
        
      }

      const handleSelectionDossierForAction=e=>{
        
        let data=[]

        let cloneDossier = structuredClone(dossiers);
        cloneDossier = cloneDossier.sort(function(a,b){
          // here a , b is whole object, you can access its property
          //convert both to lowercase
             let x = a.id;
             let y = b.id;
       
          //compare the word which is comes first
             if(x>y){return 1;} 
             if(x<y){return -1;}
             return 0;
           });

        e.forEach(element => {
          cloneDossier.forEach(d =>{
            if(element == d.id){
              data.push(d)
              return
            }
            if (element < d.id)
              return;

          }    
        )
            
        });
        setSelectedDosserForAction(data)
        
      }

      const handleSendandClose=async()=>{
       
        setUploading(true)
        let x=0
        const r = await Promise.all(
          files.map(async (element) => {
              

               upload(element,selectedGroupe, token.token).then((d)=>{
                x=x+1
                setProgression(100*x/files.length)
                 
                console.log("setprogression",progression)
                if(100*x/files.length>=100){
                 setUploading(false)
                 
                 setOpen(false)
                 setFile([])
                 setProgression(0)
                 
               }
                
               })
               

          }) 
      ) 
      console.log(" Promise.all ", Promise.all)
      
      
      }

      const handleFiltreGroup = e =>{
        console.log('filtre',e)
        let data=[]
        dossiers.forEach(element => {
          if(element.nomGroupe.id==e.target.value || e.target.value==-1)
              data.push(element)
        });
        setDossierFiltrer(data)
        
      }
      const handleClick =async()=>{
        
          let rep = await addGroupe(token.token,groupeName)
          setGroupes([...groupes,rep])
          setGroupeName("")
          setSelectedGroupe(rep.id)

         
      }

      const handleUserName =e =>{

        console.log(e.target.value)
        let data=[]
        dossiers.forEach(element => {
          if(element.nom.toUpperCase().startsWith(e.target.value.toUpperCase()))
            data.push(element)
        });
        setDossierFiltrer(data)

      }
      const handleFiles = (f)=>{
        setFile([...files,...f])
      }
      const handleClickTrash =async()=>{
        
        let rep = await trashGroupe(token.token,selectedGroupeTrash)
        
       setUpdater(udpater+1)

       
    }

  if (token.rank!=0)
    return <></>

  return (
     <>
     <Typography variant="h4" gutterBottom sx={{m:2}}>Gestion des dossiers
     <IconButton color="primary" aria-label="add to shopping cart" size="large" onClick={handleClickOpen}>
        <FileUploadIcon fontSize="inherit" />
    </IconButton>
    </Typography>
    <Box sx={{ flexGrow: 1 }}>
    <Grid container spacing={2} >
      <Grid item xs={8} >
        <Box sx={{ml:2}}>
        <DossierList  token={token} dossiers={dossiersFiltrer} setSelectedDosserForAction={handleSelectionDossierForAction} udpater={udpaterChild}/>
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Stack>
        <Item sx={{mr:2}}>
          <Stack>
          <Typography
          sx={{ flex: "1 1 100%",mb:2 }}
          variant="h6"
          id="tableTitle"
          component="div"
          align='left'
          >Filtres</Typography>

          <GroupePicker label="Groupe" groupes={[{nom:"Tous",id:-1},...groupes]}  handleGroupeChange={handleFiltreGroup}/>
          <TextField sx={{width: 215, mt:2}} id="outlined-basic"  label="Nom" variant="outlined" onChange={handleUserName} />


          </Stack>
         
        </Item>
        <Item sx={{mr:2, mt:2}}>
          <Stack>
          <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
          align='left'
          >Actions</Typography>
          <Button sx={{m:1}} variant="outlined" startIcon={<DeleteIcon />} disabled={selectedDosserForAction.length==0} onClick={handleSupprimer}>
            Supprimer
          </Button>
          <Button sx={{m:1}}  variant="outlined" startIcon={<IosShareIcon />} disabled={selectedDosserForAction.length==0} onClick={handleExporter}>
            Exporter
          </Button>
          <Button sx={{m:1}}  variant="outlined" startIcon={<RestartAltIcon />} disabled={selectedDosserForAction.length==0} onClick={handleReset}> 
            Effacer les relectures
          </Button>

          </Stack>
        </Item>
        </Stack>
       
      </Grid>
    </Grid>
    </Box>



    <BootstrapDialog
         
        aria-labelledby="customized-dialog-title"
        maxWidth="md"
        open={open}
        fullWidth
      >
        <BootstrapDialogTitle id="customized-dialog-title" >
          Ajouter des dossiers
        </BootstrapDialogTitle>
        <DialogContent dividers>

        <Grid container spacing={2}>
        <Grid item xs={12} md={4}> 
          <Stack justifyContent="space-around" spacing={2}>
          <GroupePicker  label="Groupe" groupes={groupes} selectedGroupe={selectedGroupe} handleGroupeChange={handleGroupeChange}/>

        <Stack direction="row" >
        <TextField fullWidth id="outlined-basic" value={groupeName} label="Ajouter un groupe" variant="outlined" onChange={e=>{setGroupeName(e.target.value)}} />
        <Button   endIcon={<SendIcon />} onClick={handleClick}>
          
        </Button>
        
        </Stack>
        
          <Stack direction="row" >

          <GroupePicker label="Supprimer un groupe" groupes={groupes} selectedGroupe={selectedGroupeTrash} handleGroupeChange={handleGroupeTrashChange}/>

                   

        <Button  sx={{ml:4}} endIcon={<DeleteForeverIcon />} onClick={handleClickTrash}>
          
          </Button>
          </Stack>
          

          </Stack>
        
        </Grid>
        <Grid item xs={12} md={4}> 
        <DragOrUp handleFiles={handleFiles} uploading={uploading} progression={progression}/>
        
        </Grid>

        <Grid item xs={12} md={4}> 
        <Typography sx={{mb:2}}>Nombre de dossiers :{files.length} </Typography>
        <Box
      sx={{ width: '100%', bgcolor: 'background.paper', maxHeight: 200, overflow: 'auto'}}
    >
        <List dense>
          
        {
          files.map(f=>{
            //console.log('map',f)
            return <ListItem>
            <ListItemText primary={f.name}/>
            </ListItem>
          })
        }
        
              
            </List>
            </Box>
        </Grid>

        </Grid>

 
        </DialogContent>
        <DialogActions>
         
          
        <Button autoFocus onClick={handleSendandClose} disabled={uploading || selectedGroupe == undefined}>
            Envoyer
          </Button>
          <Button autoFocus onClick={handleClose} disabled={uploading}>
            Fermer
          </Button>
        </DialogActions>
      </BootstrapDialog>
     </>
  )
}
