import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importamos React Router
import { Button, Stack, Typography } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import InputBar from '../components/InputBar'; 


const UserScreens = () => {

    const classe = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
    { id: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com' },
  ];
    return (
        <Stack direction="column" justifyContent="space-between" alignItems="center" sx={{ padding: 2 }}>
            <Typography variant="h4" sx={{ flexGrow: 1 }}>
              Users
            </Typography>
            <InputBar />
            <TableContainer component={Paper} sx={{ marginTop: 2, maxWidth: '80%', marginLeft: 'auto', marginRight: 'auto' }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Email</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {classe.map((clas) => (
                    <TableRow key={clas.id}>
                      <TableCell>{clas.name}</TableCell>
                      <TableCell>{clas.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            </Stack>
    );
};
export default UserScreens;