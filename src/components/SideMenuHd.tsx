import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import axios from "axios";
import { API_URL, useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  gymId?: string
}

const SideMenuHd = () => {
  const { authState } = useAuth();
  interface Gym {
    name?: string;
    address?: string

    // add other properties if needed
  }
  const [gym, setGym] = useState<Gym>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGym = async () => {
      try {
        setLoading(true);

        const token = authState?.token;
        let gymId = "";
        if (token) {
          const payload = jwtDecode<JwtPayload>(token);
          gymId = payload.gymId || "";
        }

        const response = await axios.get(`${API_URL}/api/gyms/${gymId}`);
        setGym(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching classes:', error);
        setError('Error al cargar las clases');
      } finally {
        setLoading(false);
      }
    };

    fetchGym();
  }, [authState]);
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
      <Toolbar sx={{ display: "flex", flexFlow: "column", justifyContent: "space-evenly", padding: "0 3rem" }}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "0.5rem" }} />
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
          {loading ? "Cargando..." : gym?.name || "Nose"}
          <Typography variant="subtitle1" sx={{ color: "white",  textAlign: "center", maxWidth: "300px", fontSize: '.6rem' }}>
          {loading ? "Cargando..." : gym?.address || "Nose"}
        </Typography>

        </Typography>
        

      </Toolbar>
    </AppBar>
  );
};

export default SideMenuHd;
