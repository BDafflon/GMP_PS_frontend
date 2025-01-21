

import * as React from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

import Stack from '@mui/material/Stack';


 

export default function AddUser(props) {
  const [nom, setNom] = React.useState("");
  const [prenom, setPrenom] = React.useState("");
  const [mail, setMail] = React.useState("");
  const [mail2, setMail2] = React.useState("");
  const [mdp, setMdp] = React.useState("");
  const [mdp2, setMdp2] = React.useState("");
  const [erreurId, setErreurId] = React.useState("")
  const [erreurMail, setErreurMail] = React.useState("")
  const [erreurMdp, setErreurMdp] = React.useState("")

  const isEmail = (email) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

  const handleUser = () =>{
    console.log("re")
    if (nom=="" || prenom =="")
      setErreurId("Erreur identifiant")
    else
      setErreurId("")
    if (mail=="" || mail2=="" || mail != mail2 || !isEmail(mail))
      setErreurMail("Erreur d'adresse mail")
    else
      setErreurMail("")
 
    if (mdp=="" || mdp2=="" || mdp != mdp2 )
      setErreurMdp("Mots de passe differents")
    else
      setErreurMdp("")

  }

  return (
    <>
     <Box>
     <Typography  variant="button" >Nouvel Utilisateur </Typography>
     <Stack spacing={2}>
      {
        erreurId==""?<></>:<Alert severity="error">{erreurId}</Alert>
      }
     

     <Stack direction="row" spacing={2}>
     <TextField id="standard-basic" label="Nom" value={nom} onChange={e=>setNom(e.target.value)} variant="standard" />
     <TextField id="standard-basic" label="Prenom" value={prenom} onChange={e=>setPrenom(e.target.value)} variant="standard" />
     </Stack>
     {
        erreurMail==""?<></>:<Alert severity="error">{erreurMail}</Alert>
      }
     <Stack direction="row" spacing={2}>
     <TextField id="standard-basic"  label="Mail" value={mail} onChange={e=>setMail(e.target.value)}  variant="standard" />
     <TextField id="standard-basic" label="Mail confirmation" value={mail2} onChange={e=>setMail2(e.target.value)}  variant="standard" />
     </Stack> 
     {
        erreurMail==""?<></>:<Alert severity="error">{erreurMdp}</Alert>
      }
     <Stack direction="row" spacing={2}>
     <TextField id="standard-basic" label="Mot de passe" value={mdp} onChange={e=>setMdp(e.target.value)}  variant="standard" type='password' />
     <TextField id="standard-basic" label="Mot de passe confirmation" value={mdp2} onChange={e=>setMdp2(e.target.value)}  variant="standard" type='password' />
     </Stack> 
     <Button variant="contained" onClick={handleUser}>Enregistrer l'utilisateur</Button>

    </Stack>

     </Box>
    </>
  );
}