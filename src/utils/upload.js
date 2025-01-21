import ConfigData from "../utils/configuration.json"

async function upload(file,selectedGroupe,token) {
    const formData = new FormData()
    
    formData.append('file', file)
    formData.append('groupe',selectedGroupe)
  
    const requestOptions = {
      method: 'POST',
      mode: 'cors',
      headers: {
        'x-access-token': token,
        
      },
      body:formData
    }
  
    const response = await fetch(ConfigData.SERVER_URL + '/uploader', requestOptions);
  
    if (!response.ok) {
      localStorage.removeItem('token')
      window.location.reload(false);
    }
    if(response.status==401){
      localStorage.removeItem('token')
      window.location.reload(false);
    }
    const result = await response.json()
    if(result.type.includes("image")){
      return "![img]("+ConfigData.SERVER_URL+result.path+")";
    }
    return "[Document]("+ConfigData.SERVER_URL+result.path+")";
  }

  export { upload };
