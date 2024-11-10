'use client';

import {DashboardContent} from 'src/layouts/dashboard';
import Box from '@mui/material/Box';
import {Field, Form} from '../../../components/hook-form';
import LoadingButton from '@mui/lab/LoadingButton';
import {useForm} from 'react-hook-form';
import Grid from '@mui/material/Unstable_Grid2';
import {useEffect, useMemo, useState} from "react";
import {localStorageAvailable, localStorageGetItem} from '../../../utils/storage-available';
import Button from "@mui/material/Button";
import {Iconify} from "../../../components/iconify";

// ----------------------------------------------------------------------

const OPTIONS = [
  {value: 'option 1', label: 'Option 1'},
  {value: 'option 2', label: 'Option 2'},
];

export function FormEntitiesView({onSubmit, ...props}) {

  const [localStorageData, setLocalStorageData] = useState({
    monto_a_solicitar: '',
    num_cuotas: ''
  });

  const methods = useForm({
    defaultValues: localStorageData,
  });

  const {handleSubmit, watch, reset, formState: {isSubmitting}} = methods;

  // Load values from localStorage if available
  useEffect(() => {
    if (localStorageAvailable()) {
      setLocalStorageData({
        monto_a_solicitar: localStorageGetItem('monto_a_solicitar', ''),
        num_cuotas: localStorageGetItem('num_cuotas', '')
      });
    }
  }, []);

  useEffect(() => {
    if (localStorageAvailable()) {
      const subscription = watch((values) => {
        localStorage.setItem('monto_a_solicitar', values.monto_a_solicitar);
        localStorage.setItem('num_cuotas', values.num_cuotas);
      });
      return () => subscription.unsubscribe();
    }
  }, [watch]);

  const onFormSubmit = handleSubmit(async (data) => {
    const montoTotalSolicitar = parseFloat(data.monto_a_solicitar);
    const numeroDeCuotas = parseInt(data.num_cuotas);

    // Llamar al prop onSubmit para pasar los datos al componente padre
    onSubmit(montoTotalSolicitar, numeroDeCuotas);

    console.log(`Calculando...`);
  });

  const handleClear = () => {
    reset(localStorageData);
  };

  const formValues = watch();
  const isFormFilled = Object.values(formValues).some((value) => value !== '');

  return (
    <DashboardContent>
      <div style={{display: 'flex', justifyContent: 'center', textAlign: 'center'}}>
        Elige el crédito que más se ajuste a tus necesidades de entre decenas de opciones en el mercado.
      </div>
      <Box sx={{mt: 2, mb: 5, bgcolor: '#ff9999', p: 2, borderRadius: '16px'}}>
        <Form methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
          <Box gap={3} display="flex" flexDirection="column">
            <Grid container spacing={2}>
              {/*<Grid xs={12} md={2}>*/}
              {/*    <Field.Autocomplete*/}
              {/*      name="provincia"*/}
              {/*      label="Provincia"*/}
              {/*      options={OPTIONS}*/}
              {/*      getOptionLabel={(option) => option.label}*/}
              {/*      isOptionEqualToValue={(option, value) => option.value === value.value}*/}
              {/*      renderOption={(props, option) => (*/}
              {/*        <li {...props} key={option.value}>*/}
              {/*          {option.label}*/}
              {/*        </li>*/}
              {/*      )}*/}
              {/*    />*/}
              {/*</Grid>*/}
              {/*<Grid xs={12} md={2}>*/}
              {/*  <Field.Autocomplete*/}
              {/*    name="tipo_credito"*/}
              {/*    label="Tipo Crédito"*/}
              {/*    options={OPTIONS}*/}
              {/*    getOptionLabel={(option) => option.label}*/}
              {/*    isOptionEqualToValue={(option, value) => option.value === value.value}*/}
              {/*    renderOption={(props, option) => (*/}
              {/*      <li {...props} key={option.value}>*/}
              {/*        {option.label}*/}
              {/*      </li>*/}
              {/*    )}*/}
              {/*  />*/}
              {/*</Grid>*/}
              <Grid xs={12} md={4}>
                <Field.Text
                  name="monto_a_solicitar"
                  label="MONTO A SOLICITAR *"
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      color: 'black',
                      backgroundColor: 'white',
                      borderRadius: '5px',
                      padding: '0 5px',
                    }, // Cambia el color del label a blanco

                  }}
                  inputProps={{type: 'number', min: 0}} // Asegura que solo se ingresen números
                  InputProps={{
                    style: {
                      backgroundColor: 'white', // Fondo blanco
                      borderRadius: '9px', // Bordes redondeados
                    },
                  }}
                />
              </Grid>
              <Grid xs={12} md={4}>
                <Field.Text
                  name="num_cuotas"
                  label="NRO. CUOTAS *"
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      color: 'black',
                      backgroundColor: 'white',
                      borderRadius: '5px',
                      padding: '0 5px',
                    }, // Cambia el color del label a blanco
                  }}
                  inputProps={{type: 'number', min: 0}} // Asegura que solo se ingresen números
                  InputProps={{
                    style: {
                      backgroundColor: 'white', // Fondo blanco
                      borderRadius: '9px', // Bordes redondeados
                    },
                  }}
                />
              </Grid>
              <Grid xs={12} md={3}>
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
              {/* Mostrar el botón de "Limpiar" solo si algún campo tiene datos */}
              {isFormFilled && (
                <Grid xs={12} md={1} sx={{display: 'flex', justifyContent: 'center'}}>
                  <Button
                    onClick={handleClear}
                    startIcon={<Iconify icon="solar:trash-bin-trash-bold"/>}
                    sx={{flexDirection: 'column', alignItems: 'center'}}
                  >
                    Limpiar
                  </Button>
                </Grid>
              )}
            </Grid>
          </Box>
        </Form>
      </Box>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
