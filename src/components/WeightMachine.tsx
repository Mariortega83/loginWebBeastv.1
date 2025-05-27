// src/components/WeightMachine.tsx
import React from 'react';
import { Box } from '@mui/material';

interface WeightMachineProps {
  x: number;
  y: number;
  onMove: (x: number, y: number) => void;
}

const WeightMachine: React.FC<WeightMachineProps> = ({ x, y, onMove }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: y,
        left: x,
        width: 100,
        height: 100,
        backgroundColor: '#3f51b5',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '8px',
        cursor: 'move', // Establece el cursor como "move" cuando se pasa sobre el objeto
      }}
      draggable
      onDrag={(e) => {
        // Establece el movimiento cuando se arrastra
        onMove(e.clientX, e.clientY);
      }}
    >
      Máquina de Pesas
    </Box>
  );
};

export default WeightMachine;
