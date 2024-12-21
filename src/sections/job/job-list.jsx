'use client'; // Agrega esto al principio del archivo

import {useEffect, useState} from 'react';
import {JobItem} from './job-item';
import {CircularProgress, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import Box from "@mui/material/Box";
import {useAuthContext} from '../../auth/hooks';
import Alert from '@mui/material/Alert';
import Link from "@mui/material/Link";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {JwtSignInView, JwtSignUpView} from "../../auth/view/jwt";

// ----------------------------------------------------------------------

export function JobList({jobs, montoTotalSolicitar, numeroDeCuotas}) {

  const {user} = useAuthContext();

  const [visibleJobs, setVisibleJobs] = useState(10); // Estado para manejar los trabajos visibles
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar el indicador de carga

  const [openRegisterModal, setOpenRegisterModal] = useState(false); // Estado para controlar el modal de registro
  const [openLoginModal, setOpenLoginModal] = useState(false); // Estado para controlar el modal de inicio de sesión


  const loadMoreJobs = () => {
    setIsLoading(true); // Mostrar el indicador de carga

    // Simular un retraso de 1 segundo antes de cargar más trabajos
    setTimeout(() => {
      setVisibleJobs((prevVisibleJobs) => prevVisibleJobs + 10); // Cargar los siguientes 10 trabajos
      setIsLoading(false); // Ocultar el indicador de carga
    }, 1000);
  };

  useEffect(() => {
    if (!user) return; // No se carga más si el usuario no está autenticado

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

  // Handlers para abrir y cerrar el modal de registro
  const handleOpenRegisterModal = () => setOpenRegisterModal(true);
  const handleCloseRegisterModal = () => setOpenRegisterModal(false);

  // Handlers para abrir y cerrar el modal de inicio de sesión
  const handleOpenLoginModal = () => setOpenLoginModal(true);
  const handleCloseLoginModal = () => setOpenLoginModal(false);

  return (
    <>

      {/*{!user && (*/}
      {/*  <Box*/}
      {/*    sx={{*/}
      {/*      display: 'flex',*/}
      {/*      justifyContent: 'center',*/}
      {/*      alignItems: 'center',*/}
      {/*      textAlign: 'center', // Alineación del contenedor*/}
      {/*      height: '10vh', // Ajusta si necesitas centrar todo en la pantalla*/}
      {/*      paddingBottom: '2rem',*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <Alert*/}
      {/*      key="success"*/}
      {/*      severity="success"*/}
      {/*      sx={{*/}
      {/*        width: '100%', // O ajustar según el diseño deseado*/}
      {/*        justifyContent: 'center', // Centra el texto y el icono en el Alert*/}
      {/*        fontSize: '20px'*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      Para visualizar la información debes{' '}*/}
      {/*      <Link href="/auth/jwt/sign-up/" sx={{ fontWeight: 'bold' }}>*/}
      {/*        Registrarte*/}
      {/*      </Link>{' '}*/}
      {/*      o{' '}*/}
      {/*      <Link href="/auth/jwt/sign-in/" sx={{ fontWeight: 'bold' }}>*/}
      {/*        Iniciar Sesión*/}
      {/*      </Link>.*/}
      {/*    </Alert>*/}
      {/*  </Box>*/}
      {/*)}*/}

      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)'}}
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

      {!user && (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center', // Alineación del contenedor
              height: '10vh', // Ajusta si necesitas centrar todo en la pantalla
              paddingBottom: '2rem',
              marginTop: '2rem',
            }}
          >
            <Alert
              key="success"
              severity="success"
              sx={{
                width: '100%', // O ajustar según el diseño deseado
                justifyContent: 'center', // Centra el texto y el icono en el Alert
                fontSize: '20px'
              }}
            >
              Para acceder y visualizar las demás entidades financieras, es necesario:{' '}
              <Link
                component="button"
                onClick={handleOpenRegisterModal}
                sx={{fontWeight: 'bold'}}>
                Registrarse
              </Link>{' '}
              o{' '}
              <Link
                component="button"
                     onClick={handleOpenLoginModal}
                    sx={{fontWeight: 'bold'}}>
                Iniciar Sesión
              </Link>.
            </Alert>
          </Box>

          {/* Modal de Registro */}
          <Dialog open={openRegisterModal} onClose={handleCloseRegisterModal} fullWidth maxWidth="sm">
            <DialogTitle>Registrarse</DialogTitle>
            <DialogContent>
              <JwtSignUpView/>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseRegisterModal}>Cerrar</Button>
            </DialogActions>
          </Dialog>

          {/* Modal de Iniciar Sesión */}
          <Dialog open={openLoginModal} onClose={handleCloseLoginModal} fullWidth maxWidth="sm">
            <DialogTitle>Iniciar Sesión</DialogTitle>
            <DialogContent>
              <JwtSignInView/>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseLoginModal}>Cerrar</Button>
            </DialogActions>
          </Dialog>
        </>
      )}


      {/* Indicador de carga cuando se están cargando más trabajos */}
      {isLoading && (
        <Box textAlign="center" marginTop={3}>
          <CircularProgress/> {/* Indicador de carga */}
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
