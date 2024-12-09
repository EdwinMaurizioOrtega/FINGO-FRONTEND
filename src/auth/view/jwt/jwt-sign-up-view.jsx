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
import { signUp } from '../../context/jwt';
import { useAuthContext } from '../../hooks';
import { FormHead } from '../../components/form-head';
import { SignUpTerms } from '../../components/sign-up-terms';

// ----------------------------------------------------------------------

// Expresión regular corregida para el formato de la cédula ecuatoriana
const cedulaRegex = /\b(0[1-9]|1[0-9]|2[0-4])\d{8}\b/;

export const SignUpSchema = zod.object({
  firstName: zod.string().min(1, { message: '¡Se requieren los nombres!' }),
  lastName: zod.string().min(1, { message: '¡Se requiere los apellidos!' }),
  cedula: zod
    .string()
    .min(10, { message: '¡La cédula debe tener 10 caracteres!' })
    .max(10, { message: '¡La cédula debe tener 10 caracteres!' })
    .regex(cedulaRegex, { message: '¡El formato de la cédula es inválido!' }),
  email: zod
    .string()
    .min(1, { message: '¡Se requiere un correo!' })
    .email({ message: '¡El correo electrónico debe ser una dirección de correo electrónico válida!' }),
  password: zod
    .string()
    .min(1, { message: '¡Se requiere contraseña!' })
    .min(6, { message: '¡La contraseña debe tener al menos 6 caracteres!' }),
});

// ----------------------------------------------------------------------

export function JwtSignUpView() {
  const { checkUserSession } = useAuthContext();

  const router = useRouter();

  const password = useBoolean();

  const [errorMsg, setErrorMsg] = useState('');

  const [termsAccepted, setTermsAccepted] = React.useState(false);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

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
    firstName: '',
    lastName: '',
    cedula: '',
    email: '',
    password: '',
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
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
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
      <Box display="flex" gap={{ xs: 3, sm: 2 }} flexDirection={{ xs: 'column', sm: 'row' }}>
        <Field.Text name="firstName" label="Nombres" InputLabelProps={{ shrink: true }} />
        <Field.Text name="lastName" label="Apellidos" InputLabelProps={{ shrink: true }} />
      </Box>

      <Field.Text
        name="cedula"
        label="Cédula"
        placeholder="10 caracteres"
        InputLabelProps={{ shrink: true }}
        onBlur={(e) => validar(e.target.value)}  // Pasa el valor del campo a la función validar
      />

      <Field.Text name="email" label="Correo electrónico" InputLabelProps={{ shrink: true }}
                  onInput={handleInput} // Usa `onInput` para manejar el evento directamente
      />

      <Field.Text
        name="password"
        label="Contraseña"
        placeholder="6+ caracteres"
        type={password.value ? 'text' : 'password'}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
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

  return (
    <>
      <FormHead
        title="Comience absolutamente gratis"
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
