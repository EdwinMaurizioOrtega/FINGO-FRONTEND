'use client';

import Stack from '@mui/material/Stack';
import { BackToTop } from 'src/components/animate/back-to-top';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';
import { FormEntitiesView, JobListView } from '../../job/view';
import { useEffect, useState } from 'react';
import { CarouselAnimation } from '../../_examples/extra/carousel-view';
import { HomeHero } from '../home-hero';
import {HomeMinimal} from "../home-minimal";
import {localStorageAvailable, localStorageGetItem} from "../../../utils/storage-available";
import {hidden} from "next/dist/lib/picocolors";
import { HomeHugePackElements } from '../home-hugepack-elements';
import { HomeMinimalDos } from '../home-minimal-dos';
import { HomeHugePackElementsDos } from '../home-hugepack-elements-dos';
import Script from 'next/script';
import Cookies from 'js-cookie'; // Asegúrate de instalar esta librería: `npm install js-cookie`


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



    // Verificar si el usuario dio consentimiento para cookies de terceros
    const thirdPartyConsent = Cookies.get('thirdPartyConsent');

    if (thirdPartyConsent === 'accepted') {
      // Almacenar la ubicación en cookies de terceros
      Cookies.set('cooooooo', {
        domain: 'fingo.ec', // Cambia por el dominio que corresponda
        secure: true,
        sameSite: 'None',
        expires: 30, // La cookie expira en 30 días
      });
    }

    //Validamos
    if (localStorageAvailable()) {
      // Verifica si ya existen datos en el localStorage
      const cachedData = localStorage.getItem("data_response");
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);

        // Comprueba que los datos no estén vacíos
        if (parsedData && Object.keys(parsedData).length > 0) {
          console.log("Using cached data");

          const storedProvincia = JSON.parse(localStorageGetItem("provincia") || '{"value": "AZUAY", "label": "AZUAY"}');
          const storedTipoCredito = JSON.parse(localStorageGetItem("tipo_credito") || '{"value": "CONSUMO", "label": "CONSUMO"}');
          const storedMonto = localStorageGetItem("monto_a_solicitar", "");
          const storedCuotas = localStorageGetItem("num_cuotas", "");

          // Solo actualizar el estado si los valores no están vacíos
          if (storedMonto) setMontoTotalSolicitar(storedMonto);
          if (storedCuotas) setNumeroDeCuotas(storedCuotas);
          if (storedTipoCredito) setTipoCredito(storedTipoCredito);
          if (storedProvincia) setProvincia(storedProvincia);

          // Ocultar HomeHero cuando el formulario se envíe
          setShow(false);
        }
      }
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

  const handleFormOnClear = (hidden) => {
    setShow(hidden);
  }

  return (
    <>
      <Script
        type="text/javascript"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=AW-870509432"
      />
      <Script
        id="google-analytics"
        type="text/javascript"
        strategy="afterInteractive"
      >
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-870509432');
          `}
      </Script>

      <ScrollProgress
        variant="linear"
        progress={pageProgress.scrollYProgress}
        sx={{ position: 'fixed' }}
      />

      <BackToTop />
      <FormEntitiesView onSubmit={handleFormSubmit} onClear={handleFormOnClear} />

      {/* Renderizar HomeHero solo si showHomeHero es true */}
      {/*{show && <CarouselAnimation />}*/}
      {show && <HomeHero />}

      <Stack sx={{ position: 'relative', bgcolor: 'background.default' }}>

        {show && <HomeHugePackElements />}

        {show && <HomeMinimal />}

        {show && <HomeMinimalDos />}

        {show && <HomeHugePackElementsDos />}

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
