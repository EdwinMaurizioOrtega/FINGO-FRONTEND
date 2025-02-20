'use client';

import { DashboardContent } from 'src/layouts/dashboard';
// import { _jobs } from 'src/_mock';
import { JobList } from '../job-list';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import {CircularProgress, DialogActions, DialogContent, DialogTitle} from '@mui/material';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import axios, { endpoints } from '../../../utils/axios';
import {localStorageAvailable, localStorageGetItem} from '../../../utils/storage-available';
import Loading from "../../../app/loading";
import {LoadingScreen} from "../../../components/loading-screen";

// ----------------------------------------------------------------------

export function JobListView({
                                    montoTotalSolicitar,
                                    numeroDeCuotas,
                                    tipoCredito,
                                    provincia,
}) {

  const [open, setOpen] = useState(true); // Controla el estado del diálogo

  const handleClose = () => {
    setOpen(false); // Cierra el diálogo
  };

  const [banks, setBanks] = useState([]); // Controla el estado del diálogo
  const [loading, setLoading] = useState(false); // Estado para manejar el loading

  useEffect(() => {
    const fetchBanks = async () => {
      setLoading(true); // Empieza la carga
      try {
        const params = {
          tipo_credito: tipoCredito,
          plazo: parseInt(numeroDeCuotas),
          provincia: provincia,
          monto_total_solicitar: montoTotalSolicitar,
        };

        console.log("Request Params:", params); // Imprime los parámetros antes de enviarlos

        if (localStorageAvailable()) {
          // Verifica si ya existen datos en el localStorage
          const cachedData = localStorage.getItem("data_response");
          if (cachedData) {
            const parsedData = JSON.parse(cachedData);

            // Comprueba que los datos no estén vacíos
            if (parsedData && Object.keys(parsedData).length > 0) {
              console.log("Using cached data");
              setBanks(parsedData);
              return;
            }
          }
        }

        const res = await axios.post(endpoints.bank.list, params);
        const { data } = res.data;

        if (localStorageAvailable()) {
          // Guarda los datos en el localStorage
          localStorage.setItem("data_response", JSON.stringify(data));
        }

        // Actualiza el estado
        setBanks(data);
      } catch (err) {
        console.error("Error fetching banks:", err);
      } finally {
        setLoading(false); // Termine la carga
        console.info("Consultado.");
      }
    };

    fetchBanks();
  }, [tipoCredito, numeroDeCuotas, provincia]); // Ejecuta cuando cambian estas dependencias



  return (
    <DashboardContent>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Importante</DialogTitle>
        <DialogContent>
          <Box gap={3} display="flex" flexDirection="column">
            <Box gap={3} display="flex" flexDirection="column">
              <Alert key="warning" severity="warning">
                Los resultados estimados por el simulador son de carácter informativo y no constituyen una pre
                aprobación del crédito. No se incluyen cargos adicionales (por ejemplo seguros, cargos financieros).
              </Alert>

              <Alert key="error" severity="error">
                La tasas de interés aplicadas en la simulación corresponden a la tasas de interés activas efectivas
                promedio ponderadas por entidad y tipo.
              </Alert>
              {/*<Alert key="success" severity="success">*/}
              {/*  En esta versión trabajamos con información de créditos de consumo únicamente. Próximamente iremos*/}
              {/*  agregando más productos!*/}
              {/*</Alert>*/}
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
        {loading ? (
          <LoadingScreen />  // Muestra un spinner de carga
        ) : (
        <JobList
          jobs={banks}
          montoTotalSolicitar={montoTotalSolicitar}
          numeroDeCuotas={numeroDeCuotas}
        />
        )}
      </Box>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
