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
import {HomeHero} from "../../home/home-hero";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Unstable_Grid2";

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

  return (
    <DashboardContent>

      <Box gap={3} display="flex" flexDirection="column" sx={{my: 5}}>
        <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box gap={3} display="flex" flexDirection="column">
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Field.Text name="monto_a_solicitar" label="MONTO A SOLICITAR *" InputLabelProps={{shrink: true}}/>
              </Grid>
              <Grid item xs={12} md={4}>
                <Field.Text name="num_cuotas" label="# CUOTAS *" InputLabelProps={{shrink: true}}/>
              </Grid>
              <Grid item xs={12} md={4}>
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
              </Grid>

            </Grid>
            <Alert key="warning" severity="warning">
              Los resultados estimados por el simulador son de caracter informativo y no constituyen una pre aprobación
              del crédito.
            </Alert>

            <Alert key="error" severity="error">
              La tasa de interés aplicada es de carácter mensual vencido, lo que significa que los intereses se calculan
              al final de cada mes y no de forma anticipada.
            </Alert>

          </Box>
        </Form>
      </Box>

      <Box

      >
        <JobList jobs={_jobs}
                 montoTotalSolicitar={montoTotalSolicitar}
                 numeroDeCuotas={numeroDeCuotas}

        />
      </Box>

    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
