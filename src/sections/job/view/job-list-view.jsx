'use client';

import {DashboardContent} from 'src/layouts/dashboard';
import {
  _jobs,
} from 'src/_mock';
import {JobList} from '../job-list';
import Box from "@mui/material/Box";
import Alert from '@mui/material/Alert';

// ----------------------------------------------------------------------

export function JobListView({ montoTotalSolicitar, numeroDeCuotas }) {
  return (
    <DashboardContent>
      <Box gap={3} display="flex" flexDirection="column">
          <Box gap={3} display="flex" flexDirection="column">
            <Alert key="warning" severity="warning">
              Los resultados estimados por el simulador son de caracter informativo y no constituyen una pre aprobación
              del crédito.
            </Alert>

            <Alert key="error" severity="error">
              La tasa de interés aplicada es de carácter mensual vencido, lo que significa que los intereses se calculan
              al final de cada mes y no de forma anticipada.
            </Alert>
          </Box>
      </Box>

      <Box>
        <JobList jobs={_jobs}
                 montoTotalSolicitar={montoTotalSolicitar}
                 numeroDeCuotas={numeroDeCuotas}

        />
      </Box>

    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
