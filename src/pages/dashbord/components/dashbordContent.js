import React from 'react'
import {useRef, useEffect } from 'react';
import {ListItemButton, TextareaAutosize,Typography, Grid, Box, Stack, Switch, Dialog,AppBar,Toolbar,Button } from '@mui/material';
import { getUser,updatePref, } from '../../../utils/usersManager';
import { getDossierLecture,getMyDossier,setReponse,getUserDossier, GetResultats } from '../../../utils/dossierManager';
import { getConfig } from '../../../utils/configManager';
import Item from '../../../utils/item';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import Slide from '@mui/material/Slide';
import CloseIcon from '@mui/icons-material/Close';
import Slider from '@mui/material/Slider';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Rating from '@mui/material/Rating';
import {
  DialogProps as MuiDialogProps
} from '@material-ui/core';

import DeleteIcon from '@mui/icons-material/Delete';
import  * as  DossierManager from '../../../utils/dossierManager';


type CloseReason = 'backdropClick' | 'escapeKeyDown' | 'closeButtonClick';

interface DialogProps extends MuiDialogProps {
  onClose: (reason: CloseReason) => void;
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

export default function DashboardContent ({token}) {
    const [updater,setUpdater] = React.useState(0)
    const [userDetail,setUserDetail] = React.useState()
    const [open, setOpen] = React.useState(false);
    const [openRank, setOpenRank] = React.useState(false);
    const [openMotif, setOpeMotif] = React.useState(false);
    const [dossier,setDossier] = React.useState();
    const [dosserContent,setDossierContent] = React.useState({});
    const [value,setValue] = React.useState();
    const [rankValue,setRankValue] = React.useState();
    const [motif,setMotif] = React.useState();
    const [res,setRes] = React.useState();
    const [myDossier,setMyDossier] = React.useState();
    const [configuration, setConfiguration]= React.useState();
    const [pause,setPause]= React.useState(false);
    const ref = useRef(null);

  function waitingDossier(){
    setPause(false)
  }
  

  const handleClickOpen = async() => {
    let d = await getDossierLecture(token,0)
    let c = await getConfig(token,-1)
    let myDossier = await getMyDossier(token)

    console.log("myDossier",myDossier)
    console.log("conf",c)
    setDossierContent(d)
    setConfiguration(c)
    setDossier(myDossier)
    console.log("content",dosserContent)
    setOpen(true);
  };

  const handleClose = (value: CloseReason) => {
    console.log(value)
    setOpen(false);
    setUpdater(updater+1)
  };




    useEffect(() => {
      (async () => {
        const items = localStorage.getItem('zoom');
      if (items) {
        setValue(items);
      }
      getUser(token).then(data=>setUserDetail(data))

      console.log("user",userDetail)
      let data=await getUserDossier(token)
      setMyDossier(data)
      console.log("mydosier",data)

      })();
      
      


    return () => {
        // this now gets called when the component unmounts
    };
    }, [updater,token]);

    const handleLecture = (perm) => async  e =>{
        console.log(perm,e)
        let x = await updatePref(token,userDetail,perm.preference,e.target.checked?1:0)
        setUpdater(updater+1)
        
    }

    const handleAccepter = async ()=>{
      setPause(true)
      console.log("handle accepté",configuration)
      
      setRes(1)
      if(configuration.feedbackAcceptation==0){
        console.log("handle feedbackAcceptation")
        let r = await setReponse(token,dossier,{resultat:1})
        let d = await getDossierLecture(token,0)
        let myDossier = await getMyDossier(token)
        

        setDossierContent(d)
        setDossier(myDossier)
      }

      if(configuration.feedbackAcceptation==1){
         setOpenRank(true)
      }
      if(configuration.feedbackAcceptation==2){
        setOpeMotif(true)
     }

      
     
      
     setPause(false)
     setUpdater(updater+1)

    }

    const handleAutre = async ()=>{
      setPause(true)
      let d = await getDossierLecture(token,1)
      let myDossier = await getMyDossier(token)
      setDossierContent(d)
      setDossier(myDossier)
      setPause(false)
    }

    const handleRefus = async ()=>{
      setRes(-1)
      setPause(true)
    
      if(configuration.feedbackRefus==0){
        
        let r = await setReponse(token,dossier,{resultat:-1})
        let d = await getDossierLecture(token,0)
        let myDossier = await getMyDossier(token)
        setDossierContent(d)
        setDossier(myDossier)
      }

      if(configuration.feedbackRefus==1){
         setOpenRank(true)
      }
      if(configuration.feedbackRefus==2){
        setOpeMotif(true)
     }
     setPause(false)
     setUpdater(updater+1)
    }
    

    const handleCloseRank=()=>{
      setOpenRank(false)
      setOpeMotif(false)
    }

    const handleCloseAndSendMotif=async()=>{
      const element = ref.current;
      console.log(element.value);
      if(element.value=="")
        {
          return
        }
      setOpenRank(false)
      setOpeMotif(false)
      setMotif("")
      let r = await setReponse(token,dossier,{resultat:res,motif:element.value})
      setOpeMotif(undefined)
      let d = await getDossierLecture(token,0)
      let myDossier = await getMyDossier(token)
      setDossierContent(d)
      setDossier(myDossier)
      element.value=""

 


    }

    const handleCloseAndSendRank=async()=>{
      setOpenRank(false)
      let r = await setReponse(token,dossier,{resultat:res,motif:rankValue})
      setRankValue(undefined)
      let d = await getDossierLecture(token,0)
      let myDossier = await getMyDossier(token)
      setDossierContent(d)
      setDossier(myDossier)
   


    }
    const handleChangeMotif=(e)=>{
      
      setMotif(e.target.value)

    }

    const handleActionDossier=()=>{

    }
    const handleTrashResult=async(d)=>{
	let data = await DossierManager.resetDossiers(token,[d],token.id)
        setUpdater(updater+1)
}
    const handleChange = (event, newValue) => {
      setValue(newValue);
      localStorage.setItem('zoom',newValue)
    };

    const styles = { 
      transform: 'scale('+value+')',
      "margin-top": (value-1)*110+"px",
      
      display:"block", 
      height: "100vh", 
      width: "100vw"
  };
  
    if(userDetail==undefined || myDossier==undefined)
        return <Typography>Wait</Typography>
   

  return (
     <>
     <Typography variant="h4" gutterBottom sx={{m:2}}>Dashboard
     <IconButton color="primary" aria-label="add to shopping cart" size="large"  onClick={handleClickOpen}>
        <FileOpenIcon fontSize="inherit" />
    </IconButton>
    </Typography>
 

     <Box sx={{ flexGrow: 1 }}>
    <Grid container spacing={2} >
      <Grid item xs={8} >
        <Box sx={{ml:2}}>
        <Item>
            <Typography textAlign="left">Historique : {myDossier.length} lecture(s)</Typography>
            <List dense  sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {myDossier.map((value) => {
        const labelId = `checkbox-list-secondary-label-${value}`;
        return (
          <ListItem
            key={value}
            secondaryAction={
              GetResultats(value.resultat)
            }
            disablePadding
          >
            <ListItemButton>
              
              <ListItemText id={labelId} primary={value.numero} /> {value.resultat.motif}
            
 <IconButton aria-label="delete" onClick={()=>(handleTrashResult(value))} >
        <DeleteIcon />
      </IconButton>
</ListItemButton>
          </ListItem>
        );
      })}
    </List>
            

        </Item>
        </Box>
      </Grid>
      <Grid item xs={4}>
         
        <Item sx={{mr:2}}>
           <Typography textAlign="left">Preference </Typography>
          {
            
            userDetail.permission==undefined?<></>:
            (
           <List dense>
             {
                userDetail.permission.map(perm =>{
                    return (

                        <ListItem
                        secondaryAction={
                          <Switch
                             checked={perm.preference.lecture==1}
                              inputProps={{ 'aria-label': 'controlled' }}
                              onChange={handleLecture(perm)}
                              />
                        }
                      >
                        
                        <ListItemText
                          primary={perm.nom}
                         
                        />
                      </ListItem>
                    )

                })
             }
                
                
                   
             
                
           
            </List>
            )
}
         
        </Item>
         
      </Grid>
    </Grid>
    </Box>






    <Dialog

        fullScreen
        open={open}
        onClose={handleClose}
        disableEscapeKeyDown
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Dossier - {dossier==undefined?"####":dossier.numero}
            </Typography>
            <Box sx={{ width: 200, mr:4 }}>
              <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                <ZoomOutIcon />
                <Slider color="secondary" aria-label="Volume" value={value} onChange={handleChange}  step={0.1}
  marks
  min={1}
  max={2.5}
  />
                <ZoomInIcon    />
              </Stack>
             </Box>
             <Button sx={{mr:1}} autoFocus variant="contained" color="success" disabled={pause||Object.keys(dosserContent).length === 0} onClick={handleAccepter}>
              Accepter
            </Button>
            <Button sx={{mr:1}}  autoFocus variant="contained" color="error" disabled={pause||Object.keys(dosserContent).length === 0} onClick={handleRefus}>
              Refuser
            </Button>
            <Button sx={{mr:1}}  autoFocus variant="contained" color="warning" disabled={pause||Object.keys(dosserContent).length === 0} onClick={handleAutre}>
              Autre dossier
            </Button>
           
          </Toolbar>
          
        </AppBar>
        
        {
          pause||Object.keys(dosserContent).length === 0?<Typography>{pause?"Chargement":"Il n'y a plus de dossier"}</Typography>: <iframe  id="frame" style={styles} srcdoc={dosserContent}></iframe>
        }
       
        

         
      </Dialog>
  
      <Dialog
        sx={{ zIndex: '7000 !important',}}
        open={openRank}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Notation du dossier"}</DialogTitle>
        <DialogContent>
        <Box
      sx={{
        '& > legend': { mt: 2 },
      }}
    >
      <Typography component="legend">Note</Typography>
      <Rating
        name="simple-controlled"
        value={rankValue}
        onChange={(event, newValue) => {
          setRankValue(newValue);
        }}
      />
       
    </Box>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRank}>Fermer</Button>
          <Button onClick={handleCloseAndSendRank} disabled={rankValue==undefined}>Valider</Button>
        </DialogActions>
      </Dialog>


      <Dialog
        sx={{ zIndex: '7000 !important',}}
        open={openMotif}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Notation du dossier"}</DialogTitle>
        <DialogContent>
        <Box
      sx={{
        '& > legend': { mt: 2 },
      }}
    >
      <Typography component="legend">Motif</Typography>
      <TextareaAutosize
      
      ref={ref} 
      id="box"
 
    
        minRows={5}
      
        style={{ width: "100% "}}
      />
       
    </Box>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRank}>Fermer</Button>
          <Button onClick={handleCloseAndSendMotif} >Valider</Button>
        </DialogActions>
      </Dialog>

    </>
  )
}
