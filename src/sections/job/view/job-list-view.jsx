'use client';

import { DashboardContent } from 'src/layouts/dashboard';
import { _jobs } from 'src/_mock';
import { JobList } from '../job-list';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useState } from 'react';
import Button from '@mui/material/Button';

// ----------------------------------------------------------------------

export function JobListView({ montoTotalSolicitar, numeroDeCuotas }) {

  const [open, setOpen] = useState(true); // Controla el estado del diálogo

  const handleClose = () => {
    setOpen(false); // Cierra el diálogo
  };
  return (
    <DashboardContent>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Importante</DialogTitle>
        <DialogContent>
          <Box gap={3} display="flex" flexDirection="column">
            <Box gap={3} display="flex" flexDirection="column">
              <Alert key="warning" severity="warning">
                Los resultados estimados por el simulador son de carácter informativo y no constituyen una pre aprobación del crédito. No se incluyen cargos adicionales (por ejemplo seguros, cargos financieros).
              </Alert>

              <Alert key="error" severity="error">
                La tasas de interés aplicadas en la simulación corresponden a la tasas de interés activas efectivas promedio ponderadas por entidad y tipo a mes vencido.
              </Alert>
              <Alert key="success" severity="success">
                En esta versión trabajamos con información de créditos de consumo únicamente. Próximamente iremos agregando más productos!
              </Alert>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

      <Box>
        <JobList
          jobs={_jobs}
          montoTotalSolicitar={montoTotalSolicitar}
          numeroDeCuotas={numeroDeCuotas}
        />
      </Box>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
