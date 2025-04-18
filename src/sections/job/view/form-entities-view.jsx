'use client';

import { DashboardContent } from 'src/layouts/dashboard';
import Box from '@mui/material/Box';
import { Field, Form } from '../../../components/hook-form';
import LoadingButton from '@mui/lab/LoadingButton';
import { useForm } from 'react-hook-form';
import Grid from '@mui/material/Unstable_Grid2';
import { useEffect, useMemo, useState } from 'react';
import { localStorageAvailable, localStorageGetItem } from '../../../utils/storage-available';
import Button from '@mui/material/Button';
import { Iconify } from '../../../components/iconify';
import { FormControlLabel, Modal, Radio, RadioGroup, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { textGradient } from '../../../theme/styles';
import GlobalStyles from '@mui/material/GlobalStyles';

// ----------------------------------------------------------------------

export function FormEntitiesView({ onSubmit, onClear, ...props }) {
  const [selectedOption, setSelectedOption] = useState('');
  const [hijoUnoOption, setHijoUnoOption] = useState('');
  const theme = useTheme();
  const [storageLoaded, setStorageLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [defaultValues, setDefaultValues] = useState({
    provincia: '',
    tipo_credito: '',
    monto_a_solicitar: '',
    num_cuotas: '',
  });

  // Cargar valores desde localStorage después de que se haya cargado el almacenamiento
  useEffect(() => {
    if (localStorageAvailable()) {
      const storedProvincia = JSON.parse(
        localStorageGetItem('provincia') || '{"value": "AZUAY", "label": "AZUAY"}'
      );
      const storedTipoCredito = JSON.parse(
        localStorageGetItem('tipo_credito') || '{"value": "CONSUMO", "label": "CONSUMO"}'
      );
      const storedMonto = localStorageGetItem('monto_a_solicitar', '');
      const storedCuotas = localStorageGetItem('num_cuotas', '');
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

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
    reset,
  } = methods;

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
  const isFormFilled = Object.values(formValues).some((value) => value !== '');

  useEffect(() => {
    if (storageLoaded && localStorageAvailable()) {
      // Si los valores del formulario cambian, guardarlos en localStorage
      const subscription = watch((values) => {
        localStorage.setItem('provincia', JSON.stringify(values.provincia));
        localStorage.setItem('tipo_credito', JSON.stringify(values.tipo_credito));
        localStorage.setItem('monto_a_solicitar', values.monto_a_solicitar);
        localStorage.setItem('num_cuotas', values.num_cuotas);
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, storageLoaded]);

  const onFormSubmit = handleSubmit(async (data) => {
    console.log('Calculando... ' + JSON.stringify(data));
    console.log('hijoUnoOption... ' + JSON.stringify(hijoUnoOption));

    localStorage.setItem('data_response', JSON.stringify([]));

    const montoTotalSolicitar = parseFloat(data.monto_a_solicitar);
    const numeroDeCuotas = parseInt(data.num_cuotas);
    //const tipo_credito = hijoUnoOption; //Tipo de Crédito
    let tipo_credito =
      hijoUnoOption === 'MAYOR_300000'
        ? 'PRODUCTIVO PYMES'
        : hijoUnoOption === 'MENOR_300000'
          ? 'MICROCREDITO DE ACUMULACION AMPLIADA' //Consultar a Daniel, hay varios tipos de microcréditos
          : hijoUnoOption;

    const provincia = data.provincia.value;

    onSubmit(montoTotalSolicitar, numeroDeCuotas, tipo_credito, provincia);

    console.log('Calculando...');

    handleClose();
  });

  const handleClear = () => {
    // Limpiar los valores del formulario
    methods.reset({
      provincia: JSON.parse('{"value": "AZUAY", "label": "AZUAY"}'),
      tipo_credito: JSON.parse('{"value": "CONSUMO", "label": "CONSUMO"}'),
      monto_a_solicitar: '',
      num_cuotas: '',
    });

    // Borrar los valores en localStorage
    localStorage.setItem('provincia', JSON.stringify({ value: 'AZUAY', label: 'AZUAY' }));
    localStorage.setItem('tipo_credito', JSON.stringify({ value: 'CONSUMO', label: 'CONSUMO' }));
    localStorage.removeItem('monto_a_solicitar');
    localStorage.removeItem('num_cuotas');

    localStorage.setItem('data_response', JSON.stringify([]));

    onClear(true);
  };

  if (!storageLoaded) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          // height: '100vh', // Ocupa toda la altura de la ventana
          // fontSize: '20px', // Tamaño de la fuente
        }}
      >
        Cargando...
      </div>
    );
  }

  // Función para generar signos de dólares con animación de lluvia
  const generateDollarRain = (count) => {
    const dollars = [];
    for (let i = 0; i < count; i++) {
      const size = Math.floor(Math.random() * 30 + 10); // Tamaño entre 10px y 40px
      const left = Math.random() * 100; // Posición horizontal aleatoria
      const delay = Math.random() * 5; // Retardo aleatorio para la animación
      const duration = Math.random() * 5 + 5; // Duración de la animación entre 5s y 10s

      dollars.push(
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255, 255, 255, 0.5)" // Color del SVG (blanco semitransparente)
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            position: 'absolute',
            top: `-${size}px`, // Comienza desde arriba de la pantalla
            left: `${left}%`,
            animation: `fall ${duration}s linear ${delay}s infinite`, // Animación de caída
          }}
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" />
        </svg>
      );
    }
    return dollars;
  };

  return (
    <DashboardContent>

      <Box
        sx={{
          position: 'fixed',
          top: "35px",
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999, // Asegura que esté por encima de todo
          backgroundColor: '#fff', // Fondo para evitar que se mezcle con otros elementos
          padding: '10px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Sombra para mejor visibilidad
          borderRadius: '50px',
          '@media (max-width: 600px)': {
            top: "50px",
          },
        }}
      >

        {/* Definir la animación @keyframes directamente en el componente */}
        <style>
          {`
          @keyframes fall {
            0% {
              transform: translateY(-100px);
            }
            100% {
              transform: translateY(100vh);
            }
          }
        `}
        </style>

        {/* Fondo que atraviesa el botón */}
        {/*<Box*/}
        {/*  sx={{*/}
        {/*    position: 'absolute',*/}
        {/*    top: '-50%', // Ajusta la posición vertical del fondo*/}
        {/*    left: '0',*/}
        {/*    right: '0',*/}
        {/*    height: '50px', // Grosor de la línea*/}
        {/*    backgroundColor: '#8c3535', // Color de la línea*/}
        {/*    zIndex: 1, // Asegura que esté detrás del botón*/}
        {/*    borderRadius: '0px 0px 20px 20px', // Bordes redondeados solo en la parte inferior*/}
        {/*    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Sombra para dar profundidad*/}
        {/*    display: 'flex',*/}
        {/*    alignItems: 'center',*/}
        {/*    justifyContent: 'center',*/}
        {/*    overflow: 'hidden', // Para que el SVG no se desborde*/}
        {/*    opacity: 0.1,*/}
        {/*  }}*/}
        {/*>*/}

        {/*  /!* Generar múltiples signos de dólares *!/*/}
        {/*  {generateDollarRain(30)} /!* Ajusta el número de signos de dólares *!/*/}
        {/*</Box>*/}

        <Button
          onClick={handleOpen}
          variant="outlined"
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#fff',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            borderRadius: '50px',
            padding: '10px 20px',
            minWidth: '300px',
            justifyContent: 'flex-center',
            position: 'relative', // Necesario para posicionar el botón sobre la línea
            zIndex: 2, // Asegura que el botón esté sobre la línea
            ':hover': {
              backgroundColor: '#f5f5f5',
              boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)',
            },
            // Estilos responsivos
            '@media (max-width: 600px)': {
              minWidth: '200px', // Más pequeño en móviles
              padding: '8px 15px',
              fontSize: '12px',
            },
          }}
        >
          {/* SVG personalizado */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            style={{
              width: '20px',
              height: '20px',
              marginRight: '10px',
              color: 'red',
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
          <Typography
            sx={{
              color: '#000',
              fontWeight: '500',
              '@media (max-width: 600px)': {
                fontSize: '12px', // Texto más pequeño en móviles
              },
            }}
          >
            Simula aquí tu crédito.
          </Typography>
        </Button>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
            <Typography
              variant="h6"
              component="h2"
              sx={{ fontWeight: 'bold', marginBottom: '8px' }}
            >
              Cuál es el uso que le vas a dar al crédito?
            </Typography>
          </div>
          <Box
            sx={{
              mb: 5,
              p: 2,
              borderRadius: '16px',
              position: 'relative',
              background: 'linear-gradient(135deg, #ff9999, #ff4d4d)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 'inherit',
                padding: '2px', // Grosor del borde degradado
                background: 'inherit',
                WebkitMask:
                  'linear-gradient(white, white) content-box, linear-gradient(white, white)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              },
            }}
          >
            <Form methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
              <Box gap={3} display="flex" flexDirection="column">
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <RadioGroup
                        name="uso-credito"
                        style={{ width: '100%' }}
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
                      >
                        <Box>
                          <FormControlLabel
                            value="personal"
                            control={<Radio style={{ color: 'white' }} />}
                            label="USO PERSONAL"
                            sx={{
                              '& .MuiFormControlLabel-label': {
                                fontWeight: 'bold', // Negrita
                              },
                            }}
                          />
                          {selectedOption === 'personal' && (
                            <RadioGroup
                              sx={{ ml: 4 }}
                              value={hijoUnoOption}
                              onChange={(e) => setHijoUnoOption(e.target.value)}
                            >
                              <FormControlLabel
                                value="CONSUMO"
                                control={<Radio />}
                                label="Consumo"
                              />

                              {hijoUnoOption === 'CONSUMO' && (
                                <>
                                  <Grid
                                    xs={12}
                                    md={12}
                                    sx={{ display: 'block', alignContent: 'center' }}
                                  >
                                    <Field.Text
                                      name="monto_a_solicitar"
                                      label="MONTO A SOLICITAR *"
                                      onChange={(e) => {
                                        let value = parseFloat(e.target.value);
                                        if (value > 500000) {
                                          value = 500000;
                                        }
                                        setValue('monto_a_solicitar', value);
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
                                  <Grid
                                    xs={12}
                                    md={12}
                                    sx={{ display: 'block', alignContent: 'center' }}
                                  >
                                    <Field.Text
                                      name="num_cuotas"
                                      label="NRO. CUOTAS (Meses)"
                                      onChange={(e) => {
                                        let value = parseFloat(e.target.value);
                                        if (value > 360) {
                                          value = 360;
                                        }
                                        setValue('num_cuotas', value);
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
                                  <Grid
                                    xs={12}
                                    md={12}
                                    sx={{ display: 'block', alignContent: 'center' }}
                                  >
                                    <Field.Autocomplete
                                      name="provincia"
                                      label="Provincia"
                                      options={PROVINCIAS}
                                      getOptionLabel={(option) => option.label}
                                      isOptionEqualToValue={(option, value) =>
                                        option.value === value.value
                                      }
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
                                  <Grid
                                    xs={12}
                                    md={12}
                                    sx={{ display: 'block', alignContent: 'center' }}
                                  >
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
                                    <Grid
                                      xs={12}
                                      md={12}
                                      sx={{ display: 'flex', justifyContent: 'center' }}
                                    >
                                      <Button
                                        onClick={handleClear}
                                        startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                                        sx={{ flexDirection: 'column', alignItems: 'center' }}
                                      >
                                        Limpiar
                                      </Button>
                                    </Grid>
                                  )}
                                </>
                              )}
                              <FormControlLabel
                                value="EDUCATIVO"
                                control={<Radio />}
                                label="Educativo"
                              />
                              {hijoUnoOption === 'EDUCATIVO' && (
                                <>
                                  <Grid
                                    xs={12}
                                    md={12}
                                    sx={{ display: 'block', alignContent: 'center' }}
                                  >
                                    <Field.Text
                                      name="monto_a_solicitar"
                                      label="MONTO A SOLICITAR *"
                                      onChange={(e) => {
                                        let value = parseFloat(e.target.value);
                                        if (value > 500000) {
                                          value = 500000;
                                        }
                                        setValue('monto_a_solicitar', value);
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
                                  <Grid
                                    xs={12}
                                    md={12}
                                    sx={{ display: 'block', alignContent: 'center' }}
                                  >
                                    <Field.Text
                                      name="num_cuotas"
                                      label="NRO. CUOTAS (Meses)"
                                      onChange={(e) => {
                                        let value = parseFloat(e.target.value);
                                        if (value > 360) {
                                          value = 360;
                                        }
                                        setValue('num_cuotas', value);
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
                                  <Grid
                                    xs={12}
                                    md={12}
                                    sx={{ display: 'block', alignContent: 'center' }}
                                  >
                                    <Field.Autocomplete
                                      name="provincia"
                                      label="Provincia"
                                      options={PROVINCIAS}
                                      getOptionLabel={(option) => option.label}
                                      isOptionEqualToValue={(option, value) =>
                                        option.value === value.value
                                      }
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
                                  <Grid
                                    xs={12}
                                    md={12}
                                    sx={{ display: 'block', alignContent: 'center' }}
                                  >
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
                                    <Grid
                                      xs={12}
                                      md={12}
                                      sx={{ display: 'flex', justifyContent: 'center' }}
                                    >
                                      <Button
                                        onClick={handleClear}
                                        startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                                        sx={{ flexDirection: 'column', alignItems: 'center' }}
                                      >
                                        Limpiar
                                      </Button>
                                    </Grid>
                                  )}
                                </>
                              )}
                            </RadioGroup>
                          )}
                        </Box>

                        <Box>
                          <FormControlLabel
                            value="PRODUCTIVO EMPRESARIAL"
                            control={
                              <Radio
                                style={{ color: 'white' }}
                                onChange={(e) => setHijoUnoOption(e.target.value)}
                              />
                            }
                            label="USO PARA MI EMPRESA"
                            sx={{
                              '& .MuiFormControlLabel-label': {
                                fontWeight: 'bold', // Negrita
                              },
                            }}
                          />

                          {selectedOption === 'PRODUCTIVO EMPRESARIAL' && (
                            <RadioGroup
                              sx={{ ml: 4 }}
                              value={hijoUnoOption}
                              onChange={(e) => setHijoUnoOption(e.target.value)}
                            >
                              <FormControlLabel
                                value="MENOR_300000"
                                control={<Radio />}
                                label="Facturacion de ventas menor a 300000"
                              />
                              {hijoUnoOption === 'MENOR_300000' && (
                                <>
                                  <Grid
                                    xs={12}
                                    md={12}
                                    sx={{ display: 'block', alignContent: 'center' }}
                                  >
                                    <Field.Text
                                      name="facturacion_anual"
                                      label="¿CÚANTO FACTURAS AL AÑO? *"
                                      onBlur={(e) => {
                                        let value = parseFloat(e.target.value);
                                        if (value > 300000) {
                                          value = 300000;
                                        }
                                        setValue('facturacion_anual', value);
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
                                        max: 300000,
                                      }} // Asegura que solo se ingresen números
                                      InputProps={{
                                        style: {
                                          backgroundColor: 'white', // Fondo blanco
                                          borderRadius: '9px', // Bordes redondeados
                                        },
                                      }}
                                    />
                                  </Grid>
                                  <Grid
                                    xs={12}
                                    md={12}
                                    sx={{ display: 'block', alignContent: 'center' }}
                                  >
                                    <Field.Text
                                      name="monto_a_solicitar"
                                      label="MONTO A SOLICITAR *"
                                      onChange={(e) => {
                                        let value = parseFloat(e.target.value);
                                        if (value > 500000) {
                                          value = 500000;
                                        }
                                        setValue('monto_a_solicitar', value);
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
                                  <Grid
                                    xs={12}
                                    md={12}
                                    sx={{ display: 'block', alignContent: 'center' }}
                                  >
                                    <Field.Text
                                      name="num_cuotas"
                                      label="NRO. CUOTAS (Meses)"
                                      onChange={(e) => {
                                        let value = parseFloat(e.target.value);
                                        if (value > 360) {
                                          value = 360;
                                        }
                                        setValue('num_cuotas', value);
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
                                  <Grid
                                    xs={12}
                                    md={12}
                                    sx={{ display: 'block', alignContent: 'center' }}
                                  >
                                    <Field.Autocomplete
                                      name="provincia"
                                      label="Provincia"
                                      options={PROVINCIAS}
                                      getOptionLabel={(option) => option.label}
                                      isOptionEqualToValue={(option, value) =>
                                        option.value === value.value
                                      }
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
                                  <Grid
                                    xs={12}
                                    md={12}
                                    sx={{ display: 'block', alignContent: 'center' }}
                                  >
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
                                    <Grid
                                      xs={12}
                                      md={12}
                                      sx={{ display: 'flex', justifyContent: 'center' }}
                                    >
                                      <Button
                                        onClick={handleClear}
                                        startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                                        sx={{ flexDirection: 'column', alignItems: 'center' }}
                                      >
                                        Limpiar
                                      </Button>
                                    </Grid>
                                  )}
                                </>
                              )}
                              <FormControlLabel
                                value="MAYOR_300000"
                                control={<Radio />}
                                label="Facturacion de ventas entre 300000 y 1.5M"
                              />
                              {hijoUnoOption === 'MAYOR_300000' && (
                                <>
                                  <Grid
                                    xs={12}
                                    md={12}
                                    sx={{ display: 'block', alignContent: 'center' }}
                                  >
                                    <Field.Text
                                      name="facturacion_anual"
                                      label="¿CÚANTO FACTURAS AL AÑO? *"
                                      onBlur={(e) => {
                                        let value = parseFloat(e.target.value);
                                        if (value < 300000) {
                                          value = 300000;
                                        }
                                        setValue('facturacion_anual', value);
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
                                        min: 300000,
                                        max: 1500000,
                                      }} // Asegura que solo se ingresen números
                                      InputProps={{
                                        style: {
                                          backgroundColor: 'white', // Fondo blanco
                                          borderRadius: '9px', // Bordes redondeados
                                        },
                                      }}
                                    />
                                  </Grid>
                                  <Grid
                                    xs={12}
                                    md={12}
                                    sx={{ display: 'block', alignContent: 'center' }}
                                  >
                                    <Field.Text
                                      name="monto_a_solicitar"
                                      label="MONTO A SOLICITAR *"
                                      onChange={(e) => {
                                        let value = parseFloat(e.target.value);
                                        if (value > 500000) {
                                          value = 500000;
                                        }
                                        setValue('monto_a_solicitar', value);
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
                                  <Grid
                                    xs={12}
                                    md={12}
                                    sx={{ display: 'block', alignContent: 'center' }}
                                  >
                                    <Field.Text
                                      name="num_cuotas"
                                      label="NRO. CUOTAS (Meses)"
                                      onChange={(e) => {
                                        let value = parseFloat(e.target.value);
                                        if (value > 360) {
                                          value = 360;
                                        }
                                        setValue('num_cuotas', value);
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
                                  <Grid
                                    xs={12}
                                    md={12}
                                    sx={{ display: 'block', alignContent: 'center' }}
                                  >
                                    <Field.Autocomplete
                                      name="provincia"
                                      label="Provincia"
                                      options={PROVINCIAS}
                                      getOptionLabel={(option) => option.label}
                                      isOptionEqualToValue={(option, value) =>
                                        option.value === value.value
                                      }
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
                                  <Grid
                                    xs={12}
                                    md={12}
                                    sx={{ display: 'block', alignContent: 'center' }}
                                  >
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
                                    <Grid
                                      xs={12}
                                      md={12}
                                      sx={{ display: 'flex', justifyContent: 'center' }}
                                    >
                                      <Button
                                        onClick={handleClear}
                                        startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                                        sx={{ flexDirection: 'column', alignItems: 'center' }}
                                      >
                                        Limpiar
                                      </Button>
                                    </Grid>
                                  )}
                                </>
                              )}
                            </RadioGroup>
                          )}
                        </Box>

                        <Box>
                          <FormControlLabel
                            value="inmobiliario"
                            control={<Radio style={{ color: 'white' }} />}
                            label="CRÉDITO INMOBILIARIO"
                            sx={{
                              '& .MuiFormControlLabel-label': {
                                fontWeight: 'bold', // Negrita
                              },
                            }}
                          />
                          {selectedOption === 'inmobiliario' && (
                            <RadioGroup
                              sx={{ ml: 4 }}
                              value={hijoUnoOption}
                              onChange={(e) => setHijoUnoOption(e.target.value)}
                            >
                              <FormControlLabel
                                value="VIVIENDA INTERES SOCIAL"
                                control={<Radio />}
                                label="Social"
                              />
                              {hijoUnoOption === 'VIVIENDA INTERES SOCIAL' && (
                                <>
                                  <Grid
                                    xs={12}
                                    md={12}
                                    sx={{ display: 'block', alignContent: 'center' }}
                                  >
                                    <Field.Text
                                      name="monto_a_solicitar"
                                      label="MONTO A SOLICITAR *"
                                      onChange={(e) => {
                                        let value = parseFloat(e.target.value);
                                        if (value > 500000) {
                                          value = 500000;
                                        }
                                        setValue('monto_a_solicitar', value);
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
                                  <Grid
                                    xs={12}
                                    md={12}
                                    sx={{ display: 'block', alignContent: 'center' }}
                                  >
                                    <Field.Text
                                      name="num_cuotas"
                                      label="NRO. CUOTAS (Meses)"
                                      onChange={(e) => {
                                        let value = parseFloat(e.target.value);
                                        if (value > 360) {
                                          value = 360;
                                        }
                                        setValue('num_cuotas', value);
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
                                  <Grid
                                    xs={12}
                                    md={12}
                                    sx={{ display: 'block', alignContent: 'center' }}
                                  >
                                    <Field.Autocomplete
                                      name="provincia"
                                      label="Provincia"
                                      options={PROVINCIAS}
                                      getOptionLabel={(option) => option.label}
                                      isOptionEqualToValue={(option, value) =>
                                        option.value === value.value
                                      }
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
                                  <Grid
                                    xs={12}
                                    md={12}
                                    sx={{ display: 'block', alignContent: 'center' }}
                                  >
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
                                    <Grid
                                      xs={12}
                                      md={12}
                                      sx={{ display: 'flex', justifyContent: 'center' }}
                                    >
                                      <Button
                                        onClick={handleClear}
                                        startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                                        sx={{ flexDirection: 'column', alignItems: 'center' }}
                                      >
                                        Limpiar
                                      </Button>
                                    </Grid>
                                  )}
                                </>
                              )}
                              <FormControlLabel
                                value="VIVIENDA INTERES PÚBLICO"
                                control={<Radio />}
                                label="Público"
                              />
                              {hijoUnoOption === 'VIVIENDA INTERES PÚBLICO' && (
                                <>
                                  <Grid
                                    xs={12}
                                    md={12}
                                    sx={{ display: 'block', alignContent: 'center' }}
                                  >
                                    <Field.Text
                                      name="monto_a_solicitar"
                                      label="MONTO A SOLICITAR *"
                                      onChange={(e) => {
                                        let value = parseFloat(e.target.value);
                                        if (value > 500000) {
                                          value = 500000;
                                        }
                                        setValue('monto_a_solicitar', value);
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
                                  <Grid
                                    xs={12}
                                    md={12}
                                    sx={{ display: 'block', alignContent: 'center' }}
                                  >
                                    <Field.Text
                                      name="num_cuotas"
                                      label="NRO. CUOTAS (Meses)"
                                      onChange={(e) => {
                                        let value = parseFloat(e.target.value);
                                        if (value > 360) {
                                          value = 360;
                                        }
                                        setValue('num_cuotas', value);
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
                                  <Grid
                                    xs={12}
                                    md={12}
                                    sx={{ display: 'block', alignContent: 'center' }}
                                  >
                                    <Field.Autocomplete
                                      name="provincia"
                                      label="Provincia"
                                      options={PROVINCIAS}
                                      getOptionLabel={(option) => option.label}
                                      isOptionEqualToValue={(option, value) =>
                                        option.value === value.value
                                      }
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
                                  <Grid
                                    xs={12}
                                    md={12}
                                    sx={{ display: 'block', alignContent: 'center' }}
                                  >
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
                                    <Grid
                                      xs={12}
                                      md={12}
                                      sx={{ display: 'flex', justifyContent: 'center' }}
                                    >
                                      <Button
                                        onClick={handleClear}
                                        startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                                        sx={{ flexDirection: 'column', alignItems: 'center' }}
                                      >
                                        Limpiar
                                      </Button>
                                    </Grid>
                                  )}
                                </>
                              )}
                            </RadioGroup>
                          )}
                        </Box>
                      </RadioGroup>
                    </Box>
                  </Grid>

                  {/*tipo_credito*/}
                </Grid>
              </Box>
            </Form>
          </Box>
        </Box>
      </Modal>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

const PROVINCIAS = [
  { value: 'AZUAY', label: 'AZUAY' },
  { value: 'PICHINCHA', label: 'PICHINCHA' },
  { value: 'GUAYAS', label: 'GUAYAS' },
  { value: 'MANABI', label: 'MANABI' },
  { value: 'CARCHI', label: 'CARCHI' },
  { value: 'GALAPAGOS', label: 'GALAPAGOS' },
  { value: 'IMBABURA', label: 'IMBABURA' },
  { value: 'NAPO', label: 'NAPO' },
  { value: 'SUCUMBIOS', label: 'SUCUMBIOS' },
  { value: 'BOLIVAR', label: 'BOLIVAR' },
  { value: 'CHIMBORAZO', label: 'CHIMBORAZO' },
  { value: 'COTOPAXI', label: 'COTOPAXI' },
  { value: 'EL ORO', label: 'EL ORO' },
  { value: 'ESMERALDAS', label: 'ESMERALDAS' },
  { value: 'LOS RIOS', label: 'LOS RIOS' },
  { value: 'MORONA SANTIAGO', label: 'MORONA SANTIAGO' },
  { value: 'ORELLANA', label: 'ORELLANA' },
  { value: 'PASTAZA', label: 'PASTAZA' },
  { value: 'SANTA ELENA', label: 'SANTA ELENA' },
  { value: 'SANTO DOMINGO DE LOS TSACHILAS', label: 'SANTO DOMINGO DE LOS TSACHILAS' },
  { value: 'TUNGURAHUA', label: 'TUNGURAHUA' },
  { value: 'CAÑAR', label: 'CAÑAR' },
  { value: 'ZAMORA CHINCHIPE', label: 'ZAMORA CHINCHIPE' },
];

const TIPO_C = [
  { value: 'CONSUMO', label: 'CONSUMO' },
  { value: 'INMOBILIARIO', label: 'INMOBILIARIO' },
  { value: 'MICROCREDITO MINORISTA', label: 'MICROCREDITO MINORISTA' },
  { value: 'PRODUCTIVO EMPRESARIAL', label: 'PRODUCTIVO EMPRESARIAL' },
  { value: 'PRODUCTIVO PYMES', label: 'PRODUCTIVO PYMES' },
  { value: 'PRODUCTIVO CORPORATIVO', label: 'PRODUCTIVO CORPORATIVO' },
  { value: 'EDUCATIVO', label: 'EDUCATIVO' },
  { value: 'VIVIENDA INTERES SOCIAL', label: 'VIVIENDA INTERES SOCIAL' },
  { value: 'VIVIENDA INTERES PÚBLICO', label: 'VIVIENDA INTERES PÚBLICO' },
  { value: 'MICROCREDITO DE ACUMULACION AMPLIADA', label: 'MICROCREDITO DE ACUMULACION AMPLIADA' },
  { value: 'MICROCREDITO DE ACUMULACION SIMPLE', label: 'MICROCREDITO DE ACUMULACION SIMPLE' },
];
