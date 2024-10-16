'use client';

import Stack from '@mui/material/Stack';
import { BackToTop } from 'src/components/animate/back-to-top';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';
import { HomeHero } from '../home-hero';
import { HomeMinimal } from '../home-minimal';
import { FormEntitiesView, JobListView } from '../../job/view';
import { useEffect, useState } from 'react';
import { Box, CardHeader } from '@mui/material';
import { CarouselAnimation } from '../../_examples/extra/carousel-view/carousel-animation';
import { DashboardContent } from '../../../layouts/dashboard';

// ----------------------------------------------------------------------

export function HomeView() {
  const pageProgress = useScrollProgress();

  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  // Estado para manejar los datos de FormEntitiesView
  const [montoTotalSolicitar, setMontoTotalSolicitar] = useState(0);
  const [numeroDeCuotas, setNumeroDeCuotas] = useState(0);

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
  const handleFormSubmit = (monto, cuotas) => {
    setMontoTotalSolicitar(monto);
    setNumeroDeCuotas(cuotas);
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
      {/*{show && <HomeHero />}*/}
      <DashboardContent>
        <Box>
          <CardHeader title="Distribuidor Autorizado" subheader="Samsung, Infinix, Xiaomi y BLU" />
        </Box>
      </DashboardContent>

      <CarouselAnimation data={_carouselSsectionOne} />

      <Stack sx={{ position: 'relative', bgcolor: 'background.default' }}>
        {/*{show && <HomeMinimal />}*/}

        <JobListView montoTotalSolicitar={montoTotalSolicitar} numeroDeCuotas={numeroDeCuotas} />
      </Stack>
    </>
  );
}

const _carouselSsectionOne = [
  {
    id: 1,
    title: 'SAMSUNG',
    image: '/assets/images/home/section-one/dit-aut-samsung.jpg',
    description: 'Distribuidor autorizado',
    link: 'https://mecompras.ec/16-samsung',
  },
  {
    id: 2,
    title: 'INFINIX',
    image: '/assets/images/home/section-one/dit-aut-infinix.jpg',
    description: 'Distribuidor autorizado',
    link: 'https://mecompras.ec/17-infinix',
  },
  {
    id: 3,
    title: 'XIAOMI',
    image: '/assets/images/home/section-one/dit-aut-xiaomi.jpg',
    description: 'Distribuidor autorizado',
    link: 'https://mecompras.ec/',
  },
  {
    id: 4,
    title: 'BLU',
    image: '/assets/images/home/section-one/banner-blu-aut.jpg',
    description: 'Distribuidor autorizado',
    link: 'https://mecompras.ec/',
  },
  {
    id: 5,
    title: 'GARANTIA',
    image: '/assets/images/home/section-one/banner-garantia.jpg',
    description: '1 año de garantia en todos nuestros productos.',
    link: 'https://mecompras.ec/',
  },
];
