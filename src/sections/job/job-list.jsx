'use client'; // Agrega esto al principio del archivo

import {useEffect, useState} from 'react';
import { JobItem } from './job-item';
import {CircularProgress} from "@mui/material";
import Box from "@mui/material/Box";

// ----------------------------------------------------------------------

export function JobList({ jobs, montoTotalSolicitar, numeroDeCuotas }) {

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
