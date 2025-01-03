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
import Tooltip from "@mui/material/Tooltip";

// ----------------------------------------------------------------------

export function FormEntitiesView({onSubmit, onClear, ...props}) {

  const [storageLoaded, setStorageLoaded] = useState(false);
  const [defaultValues, setDefaultValues] = useState({
    provincia: '',
    tipo_credito: '',
    monto_a_solicitar: '',
    num_cuotas: ''
  });

  // Cargar valores desde localStorage después de que se haya cargado el almacenamiento
  useEffect(() => {
    if (localStorageAvailable()) {

      const storedProvincia = JSON.parse(localStorageGetItem("provincia") || '{"value": "AZUAY", "label": "AZUAY"}');
      const storedTipoCredito = JSON.parse(localStorageGetItem("tipo_credito") || '{"value": "CONSUMO", "label": "CONSUMO"}');
      const storedMonto = localStorageGetItem("monto_a_solicitar", "");
      const storedCuotas = localStorageGetItem("num_cuotas", "");
      setDefaultValues({
        provincia: storedProvincia,
        tipo_credito: storedTipoCredito,
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

  const { handleSubmit, watch, setValue, formState: { isSubmitting }, reset } = methods;

  const [errors, setErrors] = useState({
    monto_a_solicitar: '',
    num_cuotas: '',
  });

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
        localStorage.setItem("provincia", JSON.stringify(values.provincia));
        localStorage.setItem("tipo_credito", JSON.stringify(values.tipo_credito));
        localStorage.setItem("monto_a_solicitar", values.monto_a_solicitar);
        localStorage.setItem("num_cuotas", values.num_cuotas);
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, storageLoaded]);

  const onFormSubmit = handleSubmit(async (data) => {

    localStorage.setItem("data_response", JSON.stringify([]));

    const montoTotalSolicitar = parseFloat(data.monto_a_solicitar);
    const numeroDeCuotas = parseInt(data.num_cuotas);
    const tipo_credito = data.tipo_credito.value;
    const provincia = data.provincia.value;

    onSubmit(montoTotalSolicitar, numeroDeCuotas, tipo_credito, provincia);

    console.log("Calculando...");
  });

  const handleClear = () => {
    // Limpiar los valores del formulario
    methods.reset({
      provincia: JSON.parse('{"value": "AZUAY", "label": "AZUAY"}'),
      tipo_credito: JSON.parse('{"value": "CONSUMO", "label": "CONSUMO"}'),
      monto_a_solicitar: '',
      num_cuotas: ''
    });

    // Borrar los valores en localStorage
    localStorage.setItem('provincia', JSON.stringify({value: "AZUAY", label: "AZUAY"}));
    localStorage.setItem('tipo_credito', JSON.stringify({value: "CONSUMO", label: "CONSUMO"}));
    localStorage.removeItem('monto_a_solicitar');
    localStorage.removeItem('num_cuotas');

    localStorage.setItem("data_response", JSON.stringify([]));

    onClear(true);

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

  const handleChange = (fieldName, value, max) => {
    if (value > max) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: `El valor máximo permitido es ${max}.`,
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: '',
      }));
    }

    setValue(fieldName, value);
  };

  return (
    <DashboardContent>
      <div style={{display: 'flex', justifyContent: 'center', textAlign: 'center'}}>
        Elige el crédito que más se ajuste a tus necesidades de entre decenas de opciones en el mercado.
      </div>
      <Box sx={{mt: 2, mb: 5, bgcolor: '#ff9999', p: 2, borderRadius: '16px'}}>
        <Form methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
          <Box gap={3} display="flex" flexDirection="column">
            <Grid container spacing={2}>
              {/*<Tooltip title="test">*/}
              <Grid xs={12} md={3}>
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
                  disableClearable // Desactiva la opción de limpiar el campo
                  freeSolo={false} // Impide que el usuario ingrese texto no definido en las opciones
                  clearOnBlur // Borra el valor cuando el campo pierde el enfoque
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: 1, // Bordes redondeados
                    '& .MuiInputLabel-root': {
                      backgroundColor: 'white', // Fondo blanco para el label
                      padding: '0 4px', // Asegura que el fondo no tape el borde
                      borderRadius: 1, // Bordes redondeados
                      color: 'red',
                    },
                  }}
                />
              </Grid>
              {/*</Tooltip>*/}
              <Grid xs={12} md={2}>
                <Field.Text
                  name="monto_a_solicitar"
                  label="MONTO A SOLICITAR *"
                  onChange={(e) => {
                    let value = parseFloat(e.target.value);
                    if (value > 500000) {
                    value = 500000;
                  }
                    setValue("monto_a_solicitar", value);
                  }}
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      color: 'black',
                      backgroundColor: 'white',
                      borderRadius: '5px',
                      padding: '0 5px',
                    }, // Cambia el color del label a blanco

                  }}
                  inputProps={{
                    type: 'number',
                    min: 0,
                    max: 500000,
                }} // Asegura que solo se ingresen números
                  InputProps={{
                    style: {
                      backgroundColor: 'white', // Fondo blanco
                      borderRadius: '9px', // Bordes redondeados
                    },
                  }}
                />
              </Grid>
              <Grid xs={12} md={2}>
                <Field.Text
                  name="num_cuotas"
                  label="NRO. CUOTAS (Meses)"
                  onChange={(e) => {
                    let value = parseFloat(e.target.value);
                    if (value > 360) {
                      value = 360;
                    }
                    setValue("num_cuotas", value);
                  }}
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      color: 'black',
                      backgroundColor: 'white',
                      borderRadius: '5px',
                      padding: '0 5px',
                    }, // Cambia el color del label a blanco
                  }}
                  inputProps={{
                    type: 'number',
                    min: 0,
                    max: 360,
                }} // Asegura que solo se ingresen números
                  InputProps={{
                    style: {
                      backgroundColor: 'white', // Fondo blanco
                      borderRadius: '9px', // Bordes redondeados
                    },
                  }}
                />
              </Grid>
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
                  disableClearable // Desactiva la opción de limpiar el campo
                  freeSolo={false} // Impide que el usuario ingrese texto no definido en las opciones
                  clearOnBlur // Borra el valor cuando el campo pierde el enfoque
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: 1, // Bordes redondeados
                    '& .MuiInputLabel-root': {
                      backgroundColor: 'white', // Fondo blanco para el label
                      padding: '0 4px', // Asegura que el fondo no tape el borde
                      borderRadius: 1, // Bordes redondeados
                      color: 'red',
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


const PROVINCIAS = [
  {value: 'AZUAY', label: 'AZUAY'},
  {value: 'PICHINCHA', label: 'PICHINCHA'},
  {value: 'GUAYAS', label: 'GUAYAS'},
  {value: 'MANABI', label: 'MANABI'},
  {value: 'CARCHI', label: 'CARCHI'},
  {value: 'GALAPAGOS', label: 'GALAPAGOS'},
  {value: 'IMBABURA', label: 'IMBABURA'},
  {value: 'NAPO', label: 'NAPO'},
  {value: 'SUCUMBIOS', label: 'SUCUMBIOS'},
  {value: 'BOLIVAR', label: 'BOLIVAR'},
  {value: 'CHIMBORAZO', label: 'CHIMBORAZO'},
  {value: 'COTOPAXI', label: 'COTOPAXI'},
  {value: 'EL ORO', label: 'EL ORO'},
  {value: 'ESMERALDAS', label: 'ESMERALDAS'},
  {value: 'LOS RIOS', label: 'LOS RIOS'},
  {value: 'MORONA SANTIAGO', label: 'MORONA SANTIAGO'},
  {value: 'ORELLANA', label: 'ORELLANA'},
  {value: 'PASTAZA', label: 'PASTAZA'},
  {value: 'SANTA ELENA', label: 'SANTA ELENA'},
  {value: 'SANTO DOMINGO DE LOS TSACHILAS', label: 'SANTO DOMINGO DE LOS TSACHILAS'},
  {value: 'TUNGURAHUA', label: 'TUNGURAHUA'},
  {value: 'CAÑAR', label: 'CAÑAR'},
  {value: 'ZAMORA CHINCHIPE', label: 'ZAMORA CHINCHIPE'},
];

const TIPO_C = [
  {value: 'CONSUMO', label: 'CONSUMO'},
  {value: 'INMOBILIARIO', label: 'INMOBILIARIO'},
  {value: 'MICROCREDITO MINORISTA', label: 'MICROCREDITO MINORISTA'},
  {value: 'PRODUCTIVO EMPRESARIAL', label: 'PRODUCTIVO EMPRESARIAL'},
  {value: 'PRODUCTIVO PYMES', label: 'PRODUCTIVO PYMES'},
  {value: 'EDUCATIVO', label: 'EDUCATIVO'},
  {value: 'PRODUCTIVO CORPORATIVO', label: 'PRODUCTIVO CORPORATIVO'},
  {value: 'VIVIENDA INTERES SOCIAL', label: 'VIVIENDA INTERES SOCIAL'},
  {value: 'VIVIENDA INTERES PÚBLICO', label: 'VIVIENDA INTERES PÚBLICO'},
  {value: 'MICROCREDITO DE ACUMULACION AMPLIADA', label: 'MICROCREDITO DE ACUMULACION AMPLIADA'},
  {value: 'MICROCREDITO DE ACUMULACION SIMPLE', label: 'MICROCREDITO DE ACUMULACION SIMPLE'},
];
