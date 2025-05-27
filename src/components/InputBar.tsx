import React from 'react';
import { TextField, Button, Stack } from '@mui/material';

const InputBar = () => {

    return (
        <form>
            <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                    label="Búsqueda"
                    variant="outlined"
                    fullWidth
                    sx={{ backgroundColor: 'white', borderRadius: 1 }}
                />
                <Button type="submit" variant="contained" color="primary">
                    Enviar
                </Button>
            </Stack>
        </form>
    );
}

export default InputBar;