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

const PROVINCIAS = [
  {value: 'AZUAY', label: 'AZUAY'},
];

const TIPO_C = [
  {value: 'CONSUMO', label: 'CONSUMO'},
];

export function FormEntitiesView({onSubmit, ...props}) {

  const [storageLoaded, setStorageLoaded] = useState(false);
  const [defaultValues, setDefaultValues] = useState({
    monto_a_solicitar: '',
    num_cuotas: ''
  });

  // Cargar valores desde localStorage después de que se haya cargado el almacenamiento
  useEffect(() => {
    if (localStorageAvailable()) {
      const storedMonto = localStorageGetItem("monto_a_solicitar", "");
      const storedCuotas = localStorageGetItem("num_cuotas", "");
      setDefaultValues({
        monto_a_solicitar: storedMonto,
        num_cuotas: storedCuotas,
      });
    }
    setStorageLoaded(true);
  }, []);

  // Inicializa el formulario con react-hook-form
  const methods = useForm({
    defaultValues,
  });

  const { handleSubmit, watch, formState: { isSubmitting }, reset } = methods;

  useEffect(() => {
    if (storageLoaded) {
      // Resetear el formulario con los valores del localStorage una vez que esté cargado
      reset(defaultValues);
    }
  }, [storageLoaded, defaultValues, reset]);

  const formValues = watch();
  const isFormFilled = Object.values(formValues).some((value) => value !== "");

  useEffect(() => {
    if (storageLoaded && localStorageAvailable()) {
      // Si los valores del formulario cambian, guardarlos en localStorage
      const subscription = watch((values) => {
        localStorage.setItem("monto_a_solicitar", values.monto_a_solicitar);
        localStorage.setItem("num_cuotas", values.num_cuotas);
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, storageLoaded]);

  const onFormSubmit = handleSubmit(async (data) => {
    const montoTotalSolicitar = parseFloat(data.monto_a_solicitar);
    const numeroDeCuotas = parseInt(data.num_cuotas);
    const tipo_credito = data.tipo_credito;
    const provincia = data.provincia;

    onSubmit(montoTotalSolicitar, numeroDeCuotas, tipo_credito, provincia);

    console.log("Calculando...");
  });

  const handleClear = () => {
    // Limpiar los valores del formulario
    methods.reset({
      monto_a_solicitar: '',
      num_cuotas: ''
    });

    // Borrar los valores en localStorage
    localStorage.removeItem('monto_a_solicitar');
    localStorage.removeItem('num_cuotas');
  };

  if (!storageLoaded) {
    return <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      // height: '100vh', // Ocupa toda la altura de la ventana
      // fontSize: '20px', // Tamaño de la fuente
    }}>
      Cargando...
    </div>
  }

  return (
    <DashboardContent>
      <div style={{display: 'flex', justifyContent: 'center', textAlign: 'center'}}>
        Elige el crédito que más se ajuste a tus necesidades de entre decenas de opciones en el mercado.
      </div>
      <Box sx={{mt: 2, mb: 5, bgcolor: '#ff9999', p: 2, borderRadius: '16px'}}>
        <Form methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
          <Box gap={3} display="flex" flexDirection="column">
            <Grid container spacing={2}>
              <Grid xs={12} md={2}>
                  <Field.Autocomplete
                    name="provincia"
                    label="Provincia"
                    options={PROVINCIAS}
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
                  options={TIPO_C}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  renderOption={(props, option) => (
                    <li {...props} key={option.value}>
                      {option.label}
                    </li>
                  )}
                />
              </Grid>
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
                <Grid xs={12} md={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    onClick={handleClear}
                    startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                    sx={{ flexDirection: 'column', alignItems: 'center' }}
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
