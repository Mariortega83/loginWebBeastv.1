import React from "react";

import { Button, Stack, Typography, IconButton } from "@mui/material";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const UserProfile = () => {
    return (
        <Stack
            direction={"row"}
            justifyContent="space-between"
            gap={2}
            alignItems="center"
            width={"auto"}
            overflow={'hidden'}
        >
            <img
                srcSet={``}
                src={`../../public/vite.svg`}
                alt={`Lol`}
                loading="lazy"
            />
            <Stack 
            direction={"column"} 
            justifyContent={"center"} 
            alignItems={"left"}>
                <Typography variant="h6">
                    User Name
                </Typography>
                <Typography variant="subtitle2" color="">
                   mariortegaperez83@gmail.com
                </Typography>
            </Stack>

            <IconButton sx={{padding: 0}}>
                <AccountCircleIcon fontSize="medium" sx={{color:"white"}}  />
            </IconButton>



        </Stack>
    );
};

export default UserProfile;