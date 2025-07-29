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
import Cookies from 'js-cookie';
import {VerticalLinearStepper} from "../../_examples/mui/stepper-view/vertical-linear-stepper";
import Fab from "@mui/material/Fab"; // Asegúrate de instalar esta librería: `npm install js-cookie`
import ContactMailIcon from '@mui/icons-material/ContactMail';
import Dialog from "@mui/material/Dialog";
import {DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import axios, {endpoints} from "../../../utils/axios";
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import {ChatView} from "../../chat/view";

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

  //Chat
  const [showChat, setShowChat] = useState(false);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    empresa: '',
    email: '',
    observaciones: '',
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aquí puedes manejar el envío de datos (API, email, etc.)
    console.log(form);
    const params = {
      nombre: form.nombre,
      empresa: form.empresa,
      email: form.email,
      observaciones: form.observaciones,
    };
    const res = await axios.post(endpoints.contact.message, params);
    console.log("data: "+res.data);

    alert('Formulario enviado');
    setOpen(false);
    setForm({nombre: '', empresa: '', email: '', observaciones: ''});
  };


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

      <Script strategy="afterInteractive">
        {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '2561848230670314');
            fbq('track', 'PageView');
          `}
      </Script>
      <noscript>
        <img height="1" width="1" style={{ display: 'none' }} loading="lazy"
             src="https://www.facebook.com/tr?id=2561848230670314&ev=PageView&noscript=1"
        />
      </noscript>

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

      {/* Botón flotante inferior izquierdo */}
      <Fab
        color="primary"
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 16,
          left: 16,
          zIndex: 1000,
        }}
        variant="extended"
      >
        <ContactMailIcon sx={{ mr: 1 }} />
        EMPRESA - CONTACTO
      </Fab>

      {/* Solo mostrar el FAB si el chat está cerrado */}
      {!showChat && (
      <Fab
        onClick={() => setShowChat(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 2000,
          width: 64,
          height: 64,
          minHeight: 'auto',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1e88e5, #42a5f5)',
          color: '#fff',
          boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            background: 'linear-gradient(135deg, #1565c0, #1e88e5)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            transform: 'scale(1.05)',
          },
        }}
      >
        <PsychologyAltIcon fontSize="large" />
      </Fab>
      )}

      {/* Mostrar ChatView cuando se active */}
      {showChat && <ChatView onClose={() => setShowChat(false)} />}

      {/* Modal del formulario */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Formulario de Contacto</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <TextField
              autoFocus
              margin="dense"
              label="Nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="Empresa"
              name="empresa"
              value={form.empresa}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="Observaciones"
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="contained">
              Enviar
            </Button>
          </DialogActions>
        </form>
      </Dialog>

    </>
  );
}
