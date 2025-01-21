import React from 'react'
import { useEffect } from 'react';

import {
  Box,
  Grid,
  Typography,
  Stack
} from "@mui/material";
import List from '@mui/material/List';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import IconButton from '@mui/material/IconButton';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import DragDropFile from '../../utils/dragndrop';
import { getAllGroupe } from '../../utils/groupeManager';
import { GroupePicker } from '../../utils/groupeManager';
import { CircularProgressWithLabel } from '../../utils/circularProgressWithLabel';
import { BootstrapDialog, BootstrapDialogTitle } from '../../utils/bootstrapdialog';
import { MultipleGroupePicker } from '../../utils/groupeManager';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { addUser,addUsers,delUsers,getAllUser,exportUsers,removePermissions, updatePermissions } from '../../utils/usersManager';
import LecteurList from './components/lecteurList';
import Item from '../../utils/item';
import DeleteIcon from '@mui/icons-material/Delete';
import IosShareIcon from '@mui/icons-material/IosShare';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';



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

export default function Lecteur ({token}) {
    const [open, setOpen] = React.useState(false);
    const [lecteurs,setLecteurs]= React.useState([]); 
    const [lecteursAdd,setLecteursAdd]= React.useState([]); 
    const [openPerm, setOpenPerm] = React.useState(false);

    const [lecteursFiltre,setLecteursFiltre]= React.useState([]); 
    const [groupes,setGroupes]= React.useState([]);
    const [udpater,setUpdater]= React.useState(0);
    const [uploading,setUploading]= React.useState(false);
    const [udpaterChild,setUpdaterChild]= React.useState(0);
    const [selectedGroupe, setSelectedGroupe] = React.useState([]);
    const [files,setFile]= React.useState([])
    const [progression, setProgression] =  React.useState(0);
    const [selectedLecteurForAction,setSelectedLecteurForAction]= React.useState([]);

  
     

    useEffect(() => {
    (async () => {
        
        const groupe = await getAllGroupe(token.token)
        setGroupes(groupe)
        const user = await getAllUser(token)
        setLecteurs(user)
        setLecteursFiltre(user)

    })();
    
    return () => {
        // this now gets called when the component unmounts
    };
    }, [udpater]);

    const handleGroupeChange = (event) => {
        console.log(event.target)
        const {
            target: { value },
          } = event;
          setSelectedGroupe(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
          );
      };

    const handleClickOpen = () => {
        setOpen(true);
      };
      const handleClose = () => {
        setOpen(false);
        setOpenPerm(false)
      };  

      const handleCloseAndValidePerm =async()=>{
        setOpenPerm(false)
        let x = await updatePermissions(token,selectedLecteurForAction,selectedGroupe)
        setUpdater(udpater+1)
      }

      const handleFiles = (f)=>{
        console.log("f",f)
        setFile([...files,...f])
        const reader = new FileReader()
        reader.onload = async (f) => { 
            const text = (f.target.result)
            let data = text.split('\n').slice(1)
            let users=[]
            data.forEach(element => {
                let u=element.split(";").slice(0,4)
                if(u[0]!="")
                    users.push(u)
                
            });
            setLecteursAdd(users)
            console.log(users)
            
        };
        reader.readAsText(f[0])
      }

      
      const handleSendandClose=async()=>{
       
        setUploading(true)
        addUsers(token,lecteursAdd,selectedGroupe)
        setLecteursAdd([])
        setUpdater(udpater+1)
        setUploading(false)
        setOpen(false)
        
      }



      const handleSelectionLecteurForAction=e=>{
        
        let data=[]

        let cloneLecteur = structuredClone(lecteurs);
        cloneLecteur = cloneLecteur.sort(function(a,b){
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
            cloneLecteur.forEach(d =>{
            if(element == d.id){
              data.push(d)
              return
            }
            if (element < d.id)
              return;

          }    
        )
            
        });
        setSelectedLecteurForAction(data)
        setUpdater(udpater+1)
        
      }

      const handleResetLecteurs=()=>{
        setLecteursAdd([])
      }

      const handleSupprimer = async() =>{

        let data = await delUsers(token,selectedLecteurForAction)
        console.log(data)
        setUpdater(udpater+1)
    }

     
    
    const handleExporter  = async() =>{
      console.log(selectedLecteurForAction)
      let data = await exportUsers(token,selectedLecteurForAction)
      
    }

    const handleResetPerm  = async() =>{
        console.log(selectedLecteurForAction)
        let data = await removePermissions(token,selectedLecteurForAction)
        setUpdater(udpater+1)
      }


    const handleUpdatePerm =()=>{
        setSelectedGroupe([])
        setOpenPerm(true)
    }
  
const forceUpdate =()=>{
    setUpdater(udpater+1)
}

  if (token.rank!=0)
    return <></>

  return (
     <>
     <Typography variant="h4" gutterBottom sx={{m:2}}>Gestion des lecteurs
     <IconButton color="primary" aria-label="add to shopping cart" size="large" onClick={handleClickOpen}>
        <FileUploadIcon fontSize="inherit" />
    </IconButton>
    </Typography>



    <Box sx={{ flexGrow: 1 }}>
    <Grid container spacing={2} >
      <Grid item xs={8} >
        <Box sx={{ml:2}}>
        <LecteurList groupes={groupes} token={token} lecteurs={lecteursFiltre} setSelectedLecteurForAction={handleSelectionLecteurForAction} udpater={udpaterChild} forceUpdate={forceUpdate}/>
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
          >Actions (sur la selection)</Typography>
          <Button sx={{m:1}} variant="outlined" startIcon={<RestartAltIcon />} disabled={selectedLecteurForAction.length==0} onClick={handleResetPerm}>
            Supprimer les permissions
          </Button>
          <Button sx={{m:1}} variant="outlined" startIcon={<UpgradeIcon />} disabled={selectedLecteurForAction.length==0} onClick={handleUpdatePerm}>
            Modifier les permissions
          </Button>
          <Button sx={{m:1}} variant="outlined" startIcon={<DeleteIcon />} disabled={selectedLecteurForAction.length==0} onClick={handleSupprimer}>
            Supprimer
          </Button>
          <Button sx={{m:1}}  variant="outlined" startIcon={<IosShareIcon />} disabled={selectedLecteurForAction.length==0} onClick={handleExporter}>
            Exporter
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
          Ajouter des lecteurs
        </BootstrapDialogTitle>
        <DialogContent dividers>

        <Grid container spacing={2}>
        <Grid item xs={12} md={4}> 
          <Stack justifyContent="space-around" spacing={2}>
          <MultipleGroupePicker   label="Permission" groupes={groupes} selectedGroupe={selectedGroupe} handleGroupeChange={handleGroupeChange}/>

        
         
          

          </Stack>
        
        </Grid>
        <Grid item xs={12} md={4}> 
        <DragOrUp handleFiles={handleFiles} uploading={uploading} progression={progression}/>
        
        </Grid>

        <Grid item xs={12} md={4}> 
        <Typography sx={{mb:2}}>Nombre de lecteurs :{lecteursAdd.length} 
        <IconButton color="primary" aria-label="add to shopping cart" size="small" onClick={handleResetLecteurs}>
            <RestartAltIcon fontSize="inherit" />
        </IconButton>
        </Typography>
        <Box
      sx={{ width: '100%', bgcolor: 'background.paper', maxHeight: 200, overflow: 'auto'}}
    >
        <List dense>
          
            {
                lecteursAdd.map(l=>{
                    return (
                        <ListItem>
                        <ListItemText primary={l[0]+" "+l[1]}/>
                        </ListItem>
                    )
                   
                })
            }
        
              
            </List>
            </Box>
        </Grid>

        </Grid>

 
        </DialogContent>
        <DialogActions>
         
          
        <Button autoFocus onClick={handleSendandClose} disabled={uploading || selectedGroupe.length==0 || selectedGroupe == undefined}>
            Envoyer
          </Button>
          <Button autoFocus onClick={handleClose} disabled={uploading}>
            Fermer
          </Button>
        </DialogActions>
      </BootstrapDialog>



      <Dialog
        open={openPerm}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Permissiojn"}
        </DialogTitle>
        <DialogContent>
        <Stack>
            <Typography>Supprime et remplace les permissions pour la selection</Typography>
        <MultipleGroupePicker   label="Permission" groupes={groupes} selectedGroupe={selectedGroupe} handleGroupeChange={handleGroupeChange}/>
        </Stack>
        
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Fermer</Button>
          <Button onClick={handleCloseAndValidePerm} autoFocus>
            Valider
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
