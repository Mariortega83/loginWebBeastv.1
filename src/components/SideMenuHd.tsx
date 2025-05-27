import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";


const SideMenuHd = () => {

  return (
    <AppBar 
    position="sticky" 
    color="primary"
    sx={{
      width: "100%",
      height: "150px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "transparent",
      boxShadow: "none",
    }
    }
    >
      <Toolbar sx={{ display: "flex", flexFlow:"column", justifyContent: "space-evenly", padding: "0 3rem" }}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "0.5rem" }}/>
          <img
            srcSet={``}
            src={`../../public/logowb.png`}
            alt={`Logo`}
            loading="lazy"
            style={{ width: "75px", height: "75px" }}
          />
        <Typography variant="h3" >
          BeastMode
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "white", fontWeight: "bold", borderBottom: "2px solid white", paddingBottom: "0.5rem", textAlign: "center", maxWidth: "300px" }}>
          Calle Me lo invento 167 3b
        </Typography>
        
      </Toolbar>
    </AppBar>
  );
};

export default SideMenuHd;
