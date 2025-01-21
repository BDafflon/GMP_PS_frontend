import ConfigData from '../utils/configuration.json';


async function getLecteurByGroup(token,id){
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
        ConfigData.SERVER_URL + "/permission/groupe/"+id,
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

async function getDossierByGroup(token,id){
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
        ConfigData.SERVER_URL + "/dossier/groupe/"+id,
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


async function getConfig(token,groupe){
    const requestOptions = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'x-access-token': token.token,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: groupe.id })
      }
      const response = await fetch(
        ConfigData.SERVER_URL + '/configuration/groupe',
        requestOptions
      )
      if (!response.ok) {
        localStorage.removeItem('token')
        window.location.reload(false)
        console.log(response)
      }
      if (response.status == 401) {
        localStorage.removeItem('token')
        window.location.reload(false)
      }
      console.log(response)
      const result = await response.json();
      console.log('updatePerm', result)
      return result;
}

async function updateColoration(token){
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
    ConfigData.SERVER_URL + "/dossiers/coloration",
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

async function updateFeedback(token,type,value){
    const requestOptions = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'x-access-token': token.token,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: type , value:value })
      }
      const response = await fetch(
        ConfigData.SERVER_URL + '/configuration/update',
        requestOptions
      )
      if (!response.ok) {
        localStorage.removeItem('token')
        
      }
      if (response.status == 401) {
        localStorage.removeItem('token')
       
      }
      console.log(response)
      const result = await response.json();
      console.log('updatePerm', result)
      return result;
}

async function updateFeedbackGroupe(token,groupe,type,value){
    const requestOptions = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'x-access-token': token.token,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: type , value:value })
      }
      const response = await fetch(
        ConfigData.SERVER_URL + '/configuration/update/groupe/'+groupe.id,
        requestOptions
      )
      if (!response.ok) {
        localStorage.removeItem('token')
        window.location.reload(false)
       
      }
      if (response.status == 401) {
        localStorage.removeItem('token')
        window.location.reload(false)
      }
       
      const result = await response.json();
       
      return result;
}

async function updatePhaseGroupe(token,groupe,phase,type,value){
    const requestOptions = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'x-access-token': token.token,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: type ,phase:phase, value:value })
      }
      const response = await fetch(
        ConfigData.SERVER_URL + '/configuration/update/groupe/'+groupe.id,
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
       
      const result = await response.json();
       
      return result;
}


export { getDossierByGroup, updateFeedback,getLecteurByGroup,updateFeedbackGroupe,getConfig,updatePhaseGroupe,updateColoration};
