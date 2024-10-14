'use client';

import { DashboardContent } from 'src/layouts/dashboard';
import { useAuthContext } from '../../../auth/hooks';
import Box from '@mui/material/Box';
import { Field, Form } from '../../../components/hook-form';
import LoadingButton from '@mui/lab/LoadingButton';
import { useForm } from 'react-hook-form';
import Grid from '@mui/material/Unstable_Grid2';

// ----------------------------------------------------------------------

export function FormEntitiesView({ onSubmit }) {

  const { user } = useAuthContext();

  const defaultValues = {
    monto_a_solicitar: '',
    num_cuotas: '',
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onFormSubmit = handleSubmit(async (data) => {
    const montoTotalSolicitar = parseFloat(data.monto_a_solicitar);
    const numeroDeCuotas = parseInt(data.num_cuotas);

    // Llamar al prop onSubmit para pasar los datos al componente padre
    onSubmit(montoTotalSolicitar, numeroDeCuotas);

    console.log(`Calculando...`);
  });

  return (
    <DashboardContent>
      <Box sx={{ mt: 2, mb: 10 }}>
        <Form methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
          <Box gap={3} display="flex" flexDirection="column">
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Field.Text
                  name="monto_a_solicitar"
                  label="MONTO A SOLICITAR *"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Field.Text
                  name="num_cuotas"
                  label="# CUOTAS *"
                  InputLabelProps={{ shrink: true }}
                />
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
          </Box>
        </Form>
      </Box>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
