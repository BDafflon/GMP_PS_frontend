import ConfigData from './configuration.json';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';





async function getAllGroupe(token){
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
        ConfigData.SERVER_URL + "/groupes",
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

async function addGroupe(token,groupe){
  const requestOptions = {
    method: "POST",
    mode: "cors",
    headers: {
      "x-access-token": token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        name: groupe,
    }),
  };

  const response = await fetch(ConfigData.SERVER_URL + '/groupes/registration', requestOptions);
  if (!response.ok) {
    localStorage.removeItem("token");
    window.location.reload(false);
  }
  if (response.status == 401) {
    localStorage.removeItem("token");
    window.location.reload(false);
  }
  const result = await response.json();
  //console.log(result)
  return result;
}

async function trashGroupe(token,groupe){

  console.log(groupe)
  const requestOptions = {
    method: "POST",
    mode: "cors",
    headers: {
      "x-access-token": token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        id: groupe,
    }),
  };

  const response = await fetch(ConfigData.SERVER_URL + '/groupes/delete', requestOptions);
  if (!response.ok) {
    localStorage.removeItem("token");
    window.location.reload(false);
  }
  if (response.status == 401) {
    localStorage.removeItem("token");
    window.location.reload(false);
  }
  const result = await response.json();
  //console.log(result)
  return result;
}


function GroupePicker({groupes,selectedGroupe,handleGroupeChange,label}){
  return (
  <FormControl >
  <InputLabel  id="demo-simple-select-label">{label}</InputLabel>
<Select
sx={{width: 215}}
  labelId="demo-simple-select-label"
  id="demo-simple-select"
  value={selectedGroupe}
  label="Age"
  
  onChange={handleGroupeChange}
>
  {
    groupes.map((groupe, index) => {
      return (
        <MenuItem value={groupe.id}>{groupe.nom}</MenuItem>
      );
  })

  }
 
</Select>
</FormControl>)

}

function MultipleGroupePicker({groupes,selectedGroupe,handleGroupeChange,label}) {
   console.log(selectedGroupe)
  
   const getName = ()=>{
    let s=""
    groupes.forEach(element => {
      selectedGroupe.forEach(id => {
        if (element.id==id){
          s+=element.nom+","
        }
      });
        
    });

    console.log(s)
    return s
   }

  return (
    <div>
      <FormControl sx={{ m: 1, width: 250 }}>
        <InputLabel id="demo-multiple-checkbox-label">{label}</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={selectedGroupe}
          onChange={handleGroupeChange}
          input={<OutlinedInput label={label} />}
          renderValue={getName}
         
        >
          {groupes.map((g) => (
            <MenuItem key={g.id} value={g.id}>
              <Checkbox checked={selectedGroupe.indexOf(g.id) > -1} />
              <ListItemText primary={g.nom} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
export { getAllGroupe, addGroupe ,trashGroupe , GroupePicker, MultipleGroupePicker};
