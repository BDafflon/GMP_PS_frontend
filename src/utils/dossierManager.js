import ConfigData from '../utils/configuration.json';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';


function GetResultats(res){
  if (res ==undefined)
  return <></>
  if(res.resultat < 0)
    return <CancelIcon color="error" />
  else
    if(res.resultat>0)
      return <CheckCircleOutlineIcon color="success" />
    
    
}

async function getDossier(token,dossier){
  const requestOptions = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'x-access-token': token.token,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ dossier: dossier})
  }
  const response = await fetch(
    ConfigData.SERVER_URL + '/dossier',
    requestOptions
  )
  if (!response.ok) {
    localStorage.removeItem('token')
    window.location.reload(false)
    //console.log(response)
  }
  if (response.status == 401) {
    localStorage.removeItem('token')
    window.location.reload(false)
  }

  const result = await response.text()
  return result
}


async function resetDossiers(token,dossiers,user){
  let data=[]
  dossiers.forEach(async(element) =>  {
    console.log("del ",element)
    let c = await resetDossier(token,element,user)
    data.push(c)
  });
  return data
}

async function resetDossier(token,dossier,user){
  const requestOptions = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'x-access-token': token.token,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ dossier: dossier,user:user})
  }
  const response = await fetch(
    ConfigData.SERVER_URL + '/resultats/delete',
    requestOptions
  )
  if (!response.ok) {
    localStorage.removeItem('token')
    window.location.reload(false)
    //console.log(response)
  }
  if (response.status == 401) {
    localStorage.removeItem('token')
    window.location.reload(false)
  }

  const result = await response.json()
  return result
}


async function exportDossiers(token,dossiers){

  const downloadTxtFile = (data) => {
    const element = document.createElement("a");
    const file = new Blob([data], {type: 'text/csv'});
    element.href = URL.createObjectURL(file);
    element.download = "export.csv";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  let data="id;numero;nom;groupe;relecteur;resultat1;motif;relecteur;resultat2;motif;relecteur;resultat3;motif;\n"

  dossiers.forEach(element => {
    let r1=";;"
    let r2=";;"
    let r3=";;"
    if (element.resultat1 != undefined){
      if (element.resultat1.motif==undefined) element.resultat1.motif="";
      r1=element.resultat1.relecteur.firstname+" "+element.resultat1.relecteur.lastname+";"+element.resultat1.resultat+";"+element.resultat1.motif.replace(/[\n\r]+/g, '.')
    }
    if (element.resultat2 != undefined){
      if (element.resultat2.motif==undefined) element.resultat2.motif="";
      r2=element.resultat2.relecteur.firstname+" "+element.resultat2.relecteur.lastname+";"+ element.resultat2.resultat+";"+element.resultat2.motif.replace(/[\n\r]+/g, '.')
    }
    if (element.resultat3 != undefined){
    if (element.resultat3.motif==undefined) element.resultat3.motif="";
      r3=element.resultat3.relecteur.firstname+" "+element.resultat3.relecteur.lastname+";"+ element.resultat3.resultat+";"+element.resultat3.motif.replace(/[\n\r]+/g, '.')
}
    data+=element.id+";"+element.numero+";"+element.nom+";"+element.groupe+";"+r1+";"+r2+";"+r3+"\n"
  });
  downloadTxtFile(data)

}

async function delDossiers(token, dossiers){
  let data=[]
  dossiers.forEach(async(element) =>  {
    console.log("del ",element)
    let c = await delDossier(token,element.id)
    data.push(c)
  });
  return data
}

async function delDossier(token, id){
  const requestOptions = {
    method: "DELETE",
    mode: "cors",
    headers: {
      "x-access-token": token.token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  const response = await fetch(
    ConfigData.SERVER_URL + "/dossier/trash/"+id,
    requestOptions
  );
  if (!response.ok) {
    localStorage.removeItem("token");
    window.location.reload(false);
    console.log(response);
  }
  if (response.status == 401) {
    localStorage.removeItem("token");
    window.location.reload(false);
  }
  const result = await response.json();
  return result
}



async function getDossierLecture(token,force){
  const requestOptions = {
    method: "GET",
    mode: "cors",
    headers: {
      "x-access-token": token.token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  const response = await fetch(
    ConfigData.SERVER_URL + "/dossier/lecture/"+force,
    requestOptions
  );
  if (!response.ok) {
    localStorage.removeItem("token");
    window.location.reload(false);
    //console.log(response)
  }
  if (response.status == 401) {
    localStorage.removeItem("token");
    window.location.reload(false);
  }
  console.log(response)
  const result = await response.text();
  //console.log('getMedia', result)
  return result;
}

async function getUserDossier(token){
  const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "x-access-token": token.token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(
      ConfigData.SERVER_URL + "/dossiers/user",
      requestOptions
    );
    if (!response.ok) {
      localStorage.removeItem("token");
      window.location.reload(false);
      //console.log(response)
    }
    if (response.status == 401) {
      localStorage.removeItem("token");
      window.location.reload(false);
    }
    console.log(response)
    const result = await response.json();
    //console.log('getMedia', result)
    return result;
  
}

async function getAllDossier(token){
    const requestOptions = {
        method: "GET",
        mode: "cors",
        headers: {
          "x-access-token": token,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(
        ConfigData.SERVER_URL + "/dossiers",
        requestOptions
      );
      if (!response.ok) {
        localStorage.removeItem("token");
        window.location.reload(false);
        //console.log(response)
      }
      if (response.status == 401) {
        localStorage.removeItem("token");
        window.location.reload(false);
      }
      console.log(response)
      const result = await response.json();
      //console.log('getMedia', result)
      return result;
    
}

async function setReponse(token,dossier,reponse){
  const requestOptions = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'x-access-token': token.token,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ dossier: dossier, reponse:reponse})
  }
  const response = await fetch(
    ConfigData.SERVER_URL + '/resultats/registration',
    requestOptions
  )
  if (!response.ok) {
    localStorage.removeItem('token')
    window.location.reload(false)
    //console.log(response)
  }
  if (response.status == 401) {
    localStorage.removeItem('token')
    window.location.reload(false)
  }

  const result = await response.text()
  return result
}

async function getMyDossier(token){
  const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "x-access-token": token.token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(
      ConfigData.SERVER_URL + "/myDossier",
      requestOptions
    );
    if (!response.ok) {
      localStorage.removeItem("token");
      window.location.reload(false);
      //console.log(response)
    }
    if (response.status == 401) {
      localStorage.removeItem("token");
      window.location.reload(false);
    }
    console.log(response)
    const result = await response.json();
    //console.log('getMedia', result)
    return result;
  
}

function getRatio(groupes,phase){
  let lu = 0
  let total = 0
  groupes.forEach(element => {
    console.log(element,element.avancement['phase'+phase])
    lu+=element.avancement['phase'+phase]
    total+=element.nbDossier
  });
  console.log(lu,total)
  return (100*lu/total).toFixed(0);

}


export { getAllDossier,delDossiers ,exportDossiers,resetDossiers,getDossierLecture,getMyDossier,setReponse,getUserDossier,GetResultats,getRatio,getDossier};
