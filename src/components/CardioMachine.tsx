// src/components/CardioMachine.tsx
import React from 'react';
import { Box } from '@mui/material';

interface CardioMachineProps {
  x: number;
  y: number;
  onMove: (x: number, y: number) => void;
}

const CardioMachine: React.FC<CardioMachineProps> = ({ x, y, onMove }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: y,
        left: x,
        width: 100,
        height: 100,
        backgroundColor: '#ff5722',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '8px',
        cursor: 'move', // Cambia el cursor a "move" para arrastrar
      }}
      draggable
      onDrag={(e) => {
        // Mueve la máquina en el plano al arrastrarla
        onMove(e.clientX, e.clientY);
      }}
    >
      Máquina Cardio
    </Box>
  );
};

export default CardioMachine;
