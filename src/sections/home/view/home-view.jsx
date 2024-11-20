'use client';

import Stack from '@mui/material/Stack';
import { BackToTop } from 'src/components/animate/back-to-top';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';
import { FormEntitiesView, JobListView } from '../../job/view';
import { useEffect, useState } from 'react';
import { CarouselAnimation } from '../../_examples/extra/carousel-view';
import { HomeHero } from '../home-hero';
import {HomeMinimal} from "../home-minimal";

// ----------------------------------------------------------------------

export function HomeView() {
  const pageProgress = useScrollProgress();

  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  // Estado para manejar los datos de FormEntitiesView
  const [montoTotalSolicitar, setMontoTotalSolicitar] = useState(0);
  const [numeroDeCuotas, setNumeroDeCuotas] = useState(0);
  const [tipoCredito, setTipoCredito] = useState('');
  const [provincia, setProvincia] = useState('');

  // Estado para controlar la visibilidad de HomeHero
  const [show, setShow] = useState(true);

  // Solicitar permisos de ubicación al montar el componente
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError('Este navegador no admite la geolocalización.');
    }
  }, []);

  // Función que actualizará el estado con los datos desde FormEntitiesView
  const handleFormSubmit = (monto, cuotas, tipo, provincia) => {
    setMontoTotalSolicitar(monto);
    setNumeroDeCuotas(cuotas);
    setTipoCredito(tipo)
    setProvincia(provincia)
    // Ocultar HomeHero cuando el formulario se envíe
    setShow(false);
  };

  return (
    <>
      <ScrollProgress
        variant="linear"
        progress={pageProgress.scrollYProgress}
        sx={{ position: 'fixed' }}
      />

      <BackToTop />
      <FormEntitiesView onSubmit={handleFormSubmit} />

      {/* Renderizar HomeHero solo si showHomeHero es true */}
      {show && <CarouselAnimation />}
      {show && <HomeHero />}

      <Stack sx={{ position: 'relative', bgcolor: 'background.default' }}>
        {show && <HomeMinimal />}

        {!show &&  <JobListView
          montoTotalSolicitar={montoTotalSolicitar}
          numeroDeCuotas={numeroDeCuotas}
          tipoCredito={tipoCredito}
          provincia={provincia}
        />}
      </Stack>
    </>
  );
}
