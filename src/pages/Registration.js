import React, {useState} from 'react';
import {useEffect} from "react";
import { useFormik } from 'formik';
import { useNavigate  } from "react-router-dom";
import * as Yup from 'yup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import ConfigData from '../utils/configuration.json';
import { Box, Button, Container, Grid, Link, TextField, Typography  } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
 
export default function Registration({setToken}){
    
     

    return(
        <>
         <Typography>Registration</Typography>
    </>
    );
}
 