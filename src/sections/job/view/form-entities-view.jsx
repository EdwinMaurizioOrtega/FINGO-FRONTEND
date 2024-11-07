'use client';

import { DashboardContent } from 'src/layouts/dashboard';
import Box from '@mui/material/Box';
import { Field, Form } from '../../../components/hook-form';
import LoadingButton from '@mui/lab/LoadingButton';
import { useForm } from 'react-hook-form';
import Grid from '@mui/material/Unstable_Grid2';
import Alert from '@mui/material/Alert';
import { Block } from '@mui/icons-material';

// ----------------------------------------------------------------------

const OPTIONS = [
  { value: 'option 1', label: 'Option 1' },
  { value: 'option 2', label: 'Option 2' },
  { value: 'option 3', label: 'Option 3' },
  { value: 'option 4', label: 'Option 4' },
  { value: 'option 5', label: 'Option 5' },
  { value: 'option 6', label: 'Option 6' },
  { value: 'option 7', label: 'Option 7' },
  { value: 'option 8', label: 'Option 8' },
];

export function FormEntitiesView({ onSubmit, ...props }) {

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
      <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
        Elige el crédito que más se ajuste a tus necesidades de entre decenas de opciones en el mercado.
      </div>
      <Box sx={{ mt: 2, mb: 5, bgcolor: '#ff9999', p: 2, borderRadius: '16px'}}>
        <Form methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
          <Box gap={3} display="flex" flexDirection="column">
            <Grid container spacing={2}>
              <Grid xs={12} md={2}>
                  <Field.Autocomplete
                    name="provincia"
                    label="Provincia"
                    options={OPTIONS}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    renderOption={(props, option) => (
                      <li {...props} key={option.value}>
                        {option.label}
                      </li>
                    )}
                  />
              </Grid>
              <Grid xs={12} md={2}>
                <Field.Autocomplete
                  name="tipo_credito"
                  label="Tipo Crédito"
                  options={OPTIONS}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  renderOption={(props, option) => (
                    <li {...props} key={option.value}>
                      {option.label}
                    </li>
                  )}
                />
              </Grid>
              <Grid xs={12} md={3}>
                <Field.Text
                  name="monto_a_solicitar"
                  label="MONTO A SOLICITAR *"
                  InputLabelProps={{ shrink: true,
                    style: { color: 'black',
                      backgroundColor: 'white',
                      borderRadius: '5px',
                      padding: '0 5px',
                    }, // Cambia el color del label a blanco

                  }}
                  inputProps={{ type: 'number', min: 0 }} // Asegura que solo se ingresen números
                  InputProps={{
                    style: {
                      backgroundColor: 'white', // Fondo blanco
                      borderRadius: '9px', // Bordes redondeados
                    },
                  }}
                />
              </Grid>
              <Grid xs={12} md={3}>
                <Field.Text
                  name="num_cuotas"
                  label="NRO. CUOTAS *"
                  InputLabelProps={{ shrink: true,
                    style: { color: 'black',
                      backgroundColor: 'white',
                      borderRadius: '5px',
                      padding: '0 5px',
                    }, // Cambia el color del label a blanco
                }}
                  inputProps={{ type: 'number', min: 0 }} // Asegura que solo se ingresen números
                  InputProps={{
                    style: {
                      backgroundColor: 'white', // Fondo blanco
                      borderRadius: '9px', // Bordes redondeados
                    },
                  }}
                />
              </Grid>
              <Grid xs={12} md={2}>
                <LoadingButton
                  fullWidth
                  color="inherit"
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  loadingIndicator="Generando..."
                >
                  BUSCAR
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
