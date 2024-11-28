'use client'; // Agrega esto al principio del archivo

import {useEffect, useState} from 'react';
import { JobItem } from './job-item';
import {CircularProgress} from "@mui/material";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import { RouterLink } from '../../routes/components';
import { paths } from '../../routes/paths';
import { useAuthContext } from '../../auth/hooks';
import { Label } from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

// ----------------------------------------------------------------------

export function JobList({ jobs, montoTotalSolicitar, numeroDeCuotas }) {

  const {user} = useAuthContext();

  const [visibleJobs, setVisibleJobs] = useState(10); // Estado para manejar los trabajos visibles
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar el indicador de carga

  const loadMoreJobs = () => {
    setIsLoading(true); // Mostrar el indicador de carga

    // Simular un retraso de 2 segundos antes de cargar más trabajos
    setTimeout(() => {
      setVisibleJobs((prevVisibleJobs) => prevVisibleJobs + 10); // Cargar los siguientes 10 trabajos
      setIsLoading(false); // Ocultar el indicador de carga
    }, 2000);
  };

  useEffect(() => {
    const handleScroll = () => {
      const hasReachedBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;

      // Verificar si el usuario ha llegado al fondo y si no está cargando ya
      if (hasReachedBottom && !isLoading && visibleJobs < jobs.length) {
        loadMoreJobs(); // Cargar más trabajos cuando el usuario llega al final del scroll
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll); // Limpiar el evento al desmontar
    };
  }, [isLoading, visibleJobs, jobs.length]); // Dependencia de isLoading, visibleJobs y jobs.length

  return (
    <>

      {!user && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center', // Alineación del contenedor
            height: '10vh', // Ajusta si necesitas centrar todo en la pantalla
            paddingBottom: '2rem',
          }}
        >
          <Alert
            key="success"
            severity="success"
            sx={{
              width: '100%', // O ajustar según el diseño deseado
              justifyContent: 'center', // Centra el texto y el icono en el Alert
            }}
          >
            Para visualizar la información debes Registrarte o Iniciar Sesión
          </Alert>
        </Box>
      )}

      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
      >
        {jobs.slice(0, visibleJobs).map((job) => (
          <JobItem
            key={job.razon_social}
            job={job}
            onMontoTotalSolicitar={montoTotalSolicitar}
            onNumeroDeCuotas={numeroDeCuotas}

          />
        ))}
      </Box>


      {/* Indicador de carga cuando se están cargando más trabajos */}
      {isLoading && (
        <Box textAlign="center" marginTop={3}>
          <CircularProgress /> {/* Indicador de carga */}
        </Box>
      )}

      {/* Texto de finalización cuando ya no hay más trabajos por cargar */}
      {!isLoading && visibleJobs >= jobs.length && (
        <Box textAlign="center" marginTop={3}>
          <p>No hay más instituciones financieras por cargar</p>
        </Box>
      )}

    </>
  );
}
