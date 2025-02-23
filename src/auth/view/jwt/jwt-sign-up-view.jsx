'use client';

import { z as zod } from 'zod';
import React, {useEffect, useState} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import { useBoolean } from 'src/hooks/use-boolean';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { googleSuccess, jwtDecode, signUp } from '../../context/jwt';
import { useAuthContext } from '../../hooks';
import { FormHead } from '../../components/form-head';
import { SignUpTerms } from '../../components/sign-up-terms';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import Button from "@mui/material/Button";
import {Modal, TextField} from "@mui/material";

// ----------------------------------------------------------------------

// Expresión regular corregida para el formato de la cédula ecuatoriana
const cedulaRegex = /\b(0[1-9]|1[0-9]|2[0-4])\d{8}\b/;

export const SignUpSchema = zod.object({
  cedula: zod
    .string()
    .min(10, { message: '¡La cédula debe tener 10 caracteres!' })
    .max(10, { message: '¡La cédula debe tener 10 caracteres!' })
    .regex(cedulaRegex, { message: '¡El formato de la cédula es inválido!' }),
  email: zod
    .string()
    .min(1, { message: '¡Se requiere un correo!' })
    .email({ message: '¡El correo electrónico debe ser una dirección de correo electrónico válida!' }),
});

// ----------------------------------------------------------------------

export function JwtSignUpView() {
  const { checkUserSession } = useAuthContext();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const [termsAccepted, setTermsAccepted] = React.useState(false);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);


  const [open, setOpen] = useState(false);
  const [cedulaX, setCedulaX] = useState("");
  const [userData, setUserData] = useState(null);

  // Obtener la ubicación del usuario
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          console.log(`Latitud: ${lat}, Longitud: ${lng}`); // Imprimir coordenadas en consola

          setLatitude(lat);
          setLongitude(lng);
        },
        (error) => {
          console.error("Error obteniendo la ubicación:", error);
          setErrorMsg("No se pudo obtener la ubicación.");
        }
      );
    } else {
      setErrorMsg("Geolocalización no soportada en este navegador.");
    }
  }, []);

  const defaultValues = {
    cedula: '',
    email: '',
  };

  const methods = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signUp({
        email: data.email,
        cedula: data.cedula,
        terms_accepted: termsAccepted,
        lat: latitude, // Incluyendo latitud
        lng: longitude // Incluyendo longitud

      });
      await checkUserSession?.();

      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const validar = (cedula) => {
    let total = 0;
    const longitud = cedula.length;
    const longcheck = longitud - 1;

    // Validación inicial: La cédula no puede estar vacía y debe tener 10 dígitos
    if (cedula !== "" && longitud === 10) {
      for (let i = 0; i < longcheck; i++) {
        if (i % 2 === 0) {
          let aux = cedula.charAt(i) * 2;  // Multiplica el dígito por 2
          if (aux > 9) aux -= 9;  // Si el resultado es mayor que 9, le resta 9
          total += aux;  // Acumula el valor en total
        } else {
          total += parseInt(cedula.charAt(i));  // Si no es un índice par, simplemente suma el valor del dígito
        }
      }

      // Calcula el dígito verificador
      total = total % 10 ? 10 - total % 10 : 0;

      // Verifica si el último dígito (dígito verificador) es correcto
      if (cedula.charAt(longitud - 1) == total) {
        setErrorMsg('Cédula válida');
      } else {
        setErrorMsg('Cédula inválida');
      }
    } else {
      setErrorMsg('¡La cédula debe tener exactamente 10 dígitos!');
    }
  };

  const handleInput = (event) => {
    event.target.value = event.target.value.toLowerCase(); // Convierte directamente a minúsculas
  };

  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Field.Text
        name="cedula"
        label="Cédula"
        placeholder="10 caracteres"
        InputLabelProps={{ shrink: true }}
        onBlur={(e) => validar(e.target.value)}  // Pasa el valor del campo a la función validar
        autoFocus  // Este atributo hará que el campo esté activo al cargar
      />

      <Field.Text name="email" label="Correo electrónico" InputLabelProps={{ shrink: true }}
                  onInput={handleInput} // Usa `onInput` para manejar el evento directamente
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'black',  // Cambia el color del borde al azul (o el que prefieras)
                      },
                      '&:hover fieldset': {
                        borderColor: 'black',  // Asegura que el borde se quede azul incluso al pasar el mouse
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'black',  // Este estilo asegura que el borde estará "activo"
                      }
                    }
                  }}
      />

      <SignUpTerms
        termsAccepted={termsAccepted}
        setTermsAccepted={setTermsAccepted}
      />

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Creando cuenta..."
        disabled={isSubmitting || !termsAccepted} // Deshabilitar si no se aceptan los términos

      >
        Crear cuenta
      </LoadingButton>
    </Box>
  );


  //Google
  const googleSuccessFront = async (res) => {

    const result = jwtDecode(res.credential);
    console.log("RESULT: " + JSON.stringify(result));

    setUserData(result);
    setOpen(true); // Abrir el modal para ingresar la cédula

    // try {
    //   await googleSuccess(result);
    //   await checkUserSession?.();
    //
    //   router.refresh();
    //
    // } catch (error) {
    //   console.error(error);
    //   setErrorMsg(typeof error === 'string' ? error : error.message);
    // }
  };

  const handleSubmitEnviar = async () => {
    if (!cedulaX) {
      console.log("cedulaX: "+ cedulaX);
      setErrorMsg("Por favor, ingrese su cédula.");
      return;
    }

    try {
      console.log("cedulaX: "+ cedulaX);
      await googleSuccess({ ...userData, cedula: cedulaX }); // Enviar datos con la cédula
      await checkUserSession?.();
      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === "string" ? error : error.message);
    } finally {
      setOpen(false);
    }
  };

  const googleError = () => console.log('El inicio de sesión de Google no tuvo éxito. Vuelva a intentarlo más tarde');

  return (
    <>
      <FormHead
        title="Regístrate o inicia sesión para visualizar más instituciones financieras!"
        description={
          <>
            {`¿Ya tienes una cuenta? `}
            <Link component={RouterLink} href={paths.auth.jwt.signIn} variant="subtitle2">
              Iniciar
            </Link>
          </>
        }
        sx={{ textAlign: { xs: 'center', md: 'left' } }}
      />

      <Box py={2}
           display="flex"
           justifyContent="center"
           alignItems="center"
      >
        <GoogleOAuthProvider
          clientId="401996344322-cba70f138bi3nh76am65hinme3r4qsr2.apps.googleusercontent.com">
          <GoogleLogin className="w-full"
                       onSuccess={googleSuccessFront}
                       onError={googleError}
                       shape="pill"
          />
        </GoogleOAuthProvider>

        {/* Modal para ingresar la cédula */}
        <Modal open={open} onClose={() => setOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 300,
              bgcolor: "white",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              label="Número de cédula"
              variant="outlined"
              value={cedulaX}
              onChange={(e) => setCedulaX(e.target.value)}
            />
            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
            <Button variant="contained" onClick={handleSubmitEnviar}>
              Enviar
            </Button>
          </Box>
        </Modal>
      </Box>

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>



    </>
  );
}
