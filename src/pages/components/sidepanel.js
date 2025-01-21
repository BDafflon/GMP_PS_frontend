import React from 'react'
import Drawer from '@mui/material/Drawer'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import SettingsIcon from '@mui/icons-material/Settings'
import SpeedIcon from '@mui/icons-material/Speed'
import ListItemButton from '@mui/material/ListItemButton'
import LogoutIcon from '@mui/icons-material/Logout';
import MapIcon from '@mui/icons-material/Map';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WidgetsIcon from '@mui/icons-material/Widgets';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import BadgeIcon from '@mui/icons-material/Badge';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';

const drawerWidth = 240
 

function GetAdminPanel({token,selectedIndex,handleListItemClick}){
  if (token.rank==0){
    return <>
    <List component="nav" aria-label="main mailbox folders">
        <ListItemButton
          selected={selectedIndex === 2}
          onClick={(event) => handleListItemClick(event, 2)}
        >
          <ListItemIcon>
            <DriveFolderUploadIcon />
          </ListItemIcon>
          <ListItemText primary="Gestion des dossiers" />
        </ListItemButton>
        <ListItemButton
          selected={selectedIndex === 3}
          onClick={(event) => handleListItemClick(event, 3)}
        >
          <ListItemIcon>
            <BadgeIcon />
          </ListItemIcon>
          <ListItemText primary="Gestion des lecteurs" />
        </ListItemButton>
        <ListItemButton
          selected={selectedIndex === 4}
          onClick={(event) => handleListItemClick(event, 4)}
        >
          <ListItemIcon>
            <MiscellaneousServicesIcon />
          </ListItemIcon>
          <ListItemText primary="Gestion d'une sessions parcoursup" />
        </ListItemButton>
         
      </List>
      <Divider />
      </>
  }
  return <></>
}
 
export default function SidePanel ({token,handleComponent}) {
    const [selectedIndex, setSelectedIndex] = React.useState(1);

    const handleListItemClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number,
      ) => {
        setSelectedIndex(index);
        handleComponent(index)
      };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box'
        }
      }}
      variant='permanent'
      anchor='left'
    >
      <Toolbar />
      <Divider />
      <List component="nav" aria-label="main mailbox folders">
        <ListItemButton
          selected={selectedIndex === 0}
          onClick={(event) => handleListItemClick(event, 0)}
        >
          <ListItemIcon>
            <SpeedIcon />
          </ListItemIcon>
          <ListItemText primary="Dashbord" />
        </ListItemButton>
        
      </List>
      <Divider />
      <GetAdminPanel token={token} selectedIndex={selectedIndex} handleListItemClick={handleListItemClick}/>
      <List component="nav" aria-label="main mailbox folders">
        <ListItemButton
          selected={selectedIndex === 5}
          onClick={(event) => handleListItemClick(event, 5)}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Deconnexion" />
        </ListItemButton>
         
      </List>

 
    </Drawer>
  )
}
