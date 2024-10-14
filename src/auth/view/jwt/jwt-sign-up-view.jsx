'use client';

import { z as zod } from 'zod';
import React, { useState } from 'react';
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

// Función para calcular el dígito verificador de la cédula ecuatoriana
function validarCedula(cedula) {
  if (cedula.length !== 10) return false;

  const provincia = parseInt(cedula.slice(0, 2), 10);
  if (provincia < 1 || provincia > 24) return false;

  const numeros = cedula.split('').map(Number);

  // Algoritmo para calcular el dígito verificador
  let suma = 0;
  let multip = [2, 1, 2, 1, 2, 1, 2, 1, 2]; // Factor de multiplicación
  for (let i = 0; i < 9; i++) {
    suma += numeros[i] * multip[i];
  }

  const modulo = suma % 10;
  const digitoVerificador = modulo === 0 ? 0 : 10 - modulo;

  return digitoVerificador === numeros[9];
}

export const SignUpSchema = zod.object({
  firstName: zod.string().min(1, { message: '¡Se requieren los nombres!' }),
  lastName: zod.string().min(1, { message: '¡Se requiere los apellidos!' }),
  cedula: zod
    .string()
    .min(10, { message: '¡La cédula debe tener 10 caracteres!' })
    .max(10, { message: '¡La cédula debe tener 10 caracteres!' }),
    // .refine(val => validarCedula(val), {
    //   message: '¡La cédula ingresada no es válida!',
    // }),
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

      });
      await checkUserSession?.();

      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

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
        InputLabelProps={{ shrink: true }} />

      <Field.Text name="email" label="Correo electrónico" InputLabelProps={{ shrink: true }} />

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
