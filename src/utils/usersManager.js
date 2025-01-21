import ConfigData from './configuration.json';

async function getAllUser(token){
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
    ConfigData.SERVER_URL + "/users",
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
  console.log('getUser', result)
  return result;

}


async function getUser(token){
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
    ConfigData.SERVER_URL + "/user/"+token.id,
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
  console.log('getUser', result)
  return result;

}

async function addUsers(token,users,permission){
  let data=[]
  users.forEach(async(element) =>  {
    console.log("del ",element)
    let c = await addUser(token,element)
    data.push(c)
    permission.forEach(async(e) => {
      let p = await addPermission(token,c,e)
      data.push(p)
      
    });
  });
  return data
}

async function addUser(token,user){

const requestOptions = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'x-access-token': token.token,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ user: user})
  }
  const response = await fetch(
    ConfigData.SERVER_URL + '/user/registration',
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


async function addPermission(token,user,groupe){
  const requestOptions = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'x-access-token': token.token,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ user: user,groupe:groupe})
  }
  const response = await fetch(
    ConfigData.SERVER_URL + '/permission/registration',
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
}


async function delUsers(token, users){
  let data=[]
  users.forEach(async(element) =>  {
    console.log("del ",element)
    let c = await delUser(token,element.id)
    data.push(c)
  });
  return data
}

async function delUser(token, id){
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
    ConfigData.SERVER_URL + "/user/trash/"+id,
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

async function getLectureByLecteur(token,user){

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
    ConfigData.SERVER_URL + "/users/relectures/"+user.id,
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
  console.log('getNbLectureByLecteur', result)
  return result;

}

async function exportUsers(token,users){

  const downloadTxtFile = (data) => {
    console.log("txt",data)
    const element = document.createElement("a");
    const file = new Blob([data], {type: 'text/csv'});
    element.href = URL.createObjectURL(file);
    element.download = "exportLecteurs.csv";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  let dataCSV="id;nom;prenom;mail;nombre de lecture;\n"
  console.log(users)

  users.forEach( (element) => {
    
    dataCSV+=element.id+";"+element.lastname+";"+element.firstname+";"+element.mail+";"+element.relecture.length+":\n"
     
  });
  console.log(dataCSV)
  downloadTxtFile(dataCSV)

}

async function removePermissions(token,users){
  users.forEach( (element) => {
    updatePermission(token,element.id,[])
  });
}

async function updatePermissions(token,users,permissions){
  users.forEach( (element) => {
    updatePermission(token,element.id,permissions)
  });
}



async function updatePermission(token,id,permission){

  const requestOptions = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'x-access-token': token.token,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ user: id , permission:permission })
  }
  const response = await fetch(
    ConfigData.SERVER_URL + '/permission/update',
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
  console.log(response)
  const result = await response.json();
  console.log('updatePerm', result)
  return result;

}





async function updateUser(token,user,type,value){

  const requestOptions = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'x-access-token': token.token,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: user.id , type:type, value:value })
  }
  const response = await fetch(
    ConfigData.SERVER_URL + '/user/update',
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
  console.log(response)
  const result = await response.json();
  console.log('updatePerm', result)
  return result;

}





async function updatePref(token,user,pref,value){

  const requestOptions = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'x-access-token': token.token,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: user.id , pref:pref.id, lecture:value })
  }

  const response = await fetch(
    ConfigData.SERVER_URL + '/preference/update',
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
  console.log(response)
  const result = await response.json();
  console.log('updatePerm', result)
  return result;

}



export { addUsers,addUser,getAllUser,delUser,delUsers,exportUsers,removePermissions,updateUser,updatePermissions,getUser,updatePref};
