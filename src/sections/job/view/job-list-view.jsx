'use client';

import {useState, useCallback} from 'react';
import {DashboardContent} from 'src/layouts/dashboard';
import {
  _jobs,
} from 'src/_mock';

import {JobList} from '../job-list';
import {useAuthContext} from "../../../auth/hooks";
import Box from "@mui/material/Box";
import {Field, Form} from "../../../components/hook-form";
import LoadingButton from "@mui/lab/LoadingButton";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {SignInSchema} from "../../../auth/view/jwt";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {Iconify} from "../../../components/iconify";
import {varFade} from "../../../components/animate";
import {varAlpha} from "../../../theme/styles";
import {m} from 'framer-motion';
import {SectionTitle} from "../../home/components/section-title";
import {SvgColor} from "../../../components/svg-color";
import {CONFIG} from "../../../config-global";
import * as zod from "zod";
import {RouterLink} from "../../../routes/components";
import {paths} from "../../../routes/paths";

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function JobListView() {

  const {user} = useAuthContext();

  const defaultValues = {
    monto_a_solicitar: '',
    num_cuotas: '',
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: {isSubmitting},
  } = methods;

  const [montoTotalSolicitar, setMontoTotalSolicitar] = useState(0);
  const [numeroDeCuotas, setNumeroDeCuotas] = useState(0);

  const onSubmit = handleSubmit(async (data) => {

    const montoTotalSolicitar = parseFloat(data.monto_a_solicitar);
    setMontoTotalSolicitar(montoTotalSolicitar);
    const numeroDeCuotas = parseInt(data.num_cuotas);
    setNumeroDeCuotas(numeroDeCuotas);

    console.log(`Calculando...`);

  });

  const renderDescription = (
    <>
      <SectionTitle
        caption="Visualizando el éxito"
        title="FinGo"
        txtGradient="Características principales:"
        sx={{mb: {xs: 5, md: 8}, textAlign: {xs: 'center', md: 'left'}}}
      />

      <Stack
        spacing={6}
        sx={{
          maxWidth: {sm: 560, md: 400},
          mx: {xs: 'auto', md: 'unset'},
        }}
      >
        {ITEMS.map((item) => (
          <Box
            component={m.div}
            key={item.title}
            variants={varFade({distance: 24}).inUp}
            gap={3}
            display="flex"
          >
            <SvgColor src={item.icon} sx={{width: 40, height: 40}}/>
            <Stack spacing={1}>
              <Typography variant="h5" component="h6">
                {item.title}
              </Typography>
              <Typography sx={{color: 'text.secondary'}}>{item.description}</Typography>
            </Stack>
          </Box>
        ))}
      </Stack>
    </>
  );

  return (
    <DashboardContent>
      <Box gap={3} display="flex" flexDirection="column" sx={{my: 5}}>
        <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box gap={3} display="flex" flexDirection="column">

            <Field.Text name="monto_a_solicitar" label="MONTO A SOLICITAR *" InputLabelProps={{shrink: true}}/>

            <Field.Text name="num_cuotas" label="# CUOTAS *" InputLabelProps={{shrink: true}}/>


            {user ? (
              <LoadingButton
                fullWidth
                color="inherit"
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
                loadingIndicator="Generando..."
              >
                Generar
              </LoadingButton>
            ) : (
              <Button
                component={RouterLink}
                href={paths.auth.jwt.signIn}
                color="inherit"
                type="submit"
                variant="contained"
              >
                INICIAR SESIÓN
              </Button>
            )


            }


          </Box>
        </Form>
      </Box>

      {user && (

        <Box
          sx={{
            pointerEvents: user ? 'auto' : 'none',  // Deshabilita clics si el usuario no está
            filter: user ? 'none' : 'blur(4px)',    // Aplica efecto difuso si el usuario no está
            opacity: user ? 1 : 0.5,                // Baja la opacidad si el usuario no está
            transition: 'filter 0.3s, opacity 0.3s' // Suaviza la transición
          }}
        >
          <JobList jobs={_jobs}
                   montoTotalSolicitar={montoTotalSolicitar}
                   numeroDeCuotas={numeroDeCuotas}

          />
        </Box>

      )}

      {renderContact}

      {renderDescription}

      {renderContactDos}

    </DashboardContent>
  );
}

const renderContact = (
  <Stack
    alignItems="center"
    sx={{
      px: 3,
      py: 8,
      textAlign: 'center',
      background: (theme) =>
        `linear-gradient(270deg, ${varAlpha(
          theme.vars.palette.grey['500Channel'],
          0.08
        )}, ${varAlpha(theme.vars.palette.grey['500Channel'], 0)})`,
    }}
  >
    <m.div variants={varFade().in}>
      <Typography variant="h4">¿Qué es?</Typography>
    </m.div>

    <m.div variants={varFade().in}>
      <Typography sx={{mt: 2, mb: 3, color: 'text.secondary'}}>
        FINGO centraliza información de productos financieros, obtenida exclusivamente de fuentes oficiales y públicas,
        en un solo lugar. Ofrecemos datos actualizados a mes vencido sobre una amplia gama de productos financieros,
        incluyendo productos de crédito e inversiones*.
      </Typography>
    </m.div>

  </Stack>
);

const renderContactDos = (
  <Stack
    alignItems="center"
    sx={{
      px: 3,
      py: 8,
      textAlign: 'center',
      background: (theme) =>
        `linear-gradient(270deg, ${varAlpha(
          theme.vars.palette.grey['500Channel'],
          0.08
        )}, ${varAlpha(theme.vars.palette.grey['500Channel'], 0)})`,
    }}
  >

    <m.div variants={varFade().in}>
      <Typography sx={{mt: 2, mb: 3, color: 'text.secondary'}}>
        En esta versión trabajamos con información de créditos de consumo únicamente. Próximamente iremos agregando más
        productos! </Typography>
    </m.div>

  </Stack>
);


// ----------------------------------------------------------------------

const ITEMS = [
  {
    icon: `${CONFIG.assetsDir}/assets/icons/home/ic-make-brand.svg`,
    title: 'Fuentes Confiables:',
    description: 'Toda la información proviene de entidades oficiales y públicas, garantizando su veracidad y actualidad.',
  },
  {
    icon: `${CONFIG.assetsDir}/assets/icons/home/ic-design.svg`,
    title: 'Acceso Centralizado: ',
    description: 'Toda la información está disponible en un solo sitio, facilitando la toma de decisiones informadas.',
  },
  {
    icon: `${CONFIG.assetsDir}/assets/icons/home/ic-development.svg`,
    title: 'Actualizaciones Constantes:',
    description: 'Mantenemos la información actualizada para reflejar los cambios en el mercado.',
  },
];
