'use client';

import {z as zod} from 'zod';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import {paths} from 'src/routes/paths';
import {useRouter} from 'src/routes/hooks';
import {RouterLink} from 'src/routes/components';

import {useBoolean} from 'src/hooks/use-boolean';

import {Iconify} from 'src/components/iconify';
import {Form, Field} from 'src/components/hook-form';

import {useAuthContext} from '../../hooks';
import {FormHead} from '../../components/form-head';
import {googleSuccess, jwtDecode, signInWithPassword} from '../../context/jwt';
import {GoogleLogin, GoogleOAuthProvider} from "@react-oauth/google";

// ----------------------------------------------------------------------

export const SignInSchema = zod.object({
  email: zod
    .string()
    .min(1, {message: '¡Se requiere un correo electrónico!'})
    .email({message: '¡El correo electrónico debe ser una dirección de correo electrónico válida!'}),
  password: zod
    .string()
    .min(1, {message: '¡Se requiere contraseña!'})
    .min(6, {message: '¡La contraseña debe tener al menos 6 caracteres!'}),
});

// ----------------------------------------------------------------------

export function JwtSignInView() {
  const router = useRouter();

  const {checkUserSession} = useAuthContext();

  const [errorMsg, setErrorMsg] = useState('');

  const password = useBoolean();

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: {isSubmitting},
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signInWithPassword({email: data.email, password: data.password});
      await checkUserSession?.();

      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const handleInput = (event) => {
    event.target.value = event.target.value.toLowerCase(); // Convierte directamente a minúsculas
  };

  //Google
  const googleSuccessFront = async (res) => {

    const result = jwtDecode(res.credential);
    console.log("RESULT: " + JSON.stringify(result));

    try {
      await googleSuccess(result);
      await checkUserSession?.();

      router.refresh();

    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  };

  const googleError = () => console.log('El inicio de sesión de Google no tuvo éxito. Vuelva a intentarlo más tarde');


  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Field.Text name="email" label="Correo electrónico" InputLabelProps={{shrink: true}}
                  onInput={handleInput} // Usa `onInput` para manejar el evento directamente

      />

      <Box gap={1.5} display="flex" flexDirection="column">
        <Link
          component={RouterLink}
          href={paths.auth.jwt.resetPassword}
          variant="body2"
          color="inherit"
          sx={{alignSelf: 'flex-end'}}
        >
          ¿Has olvidado tu contraseña?
        </Link>

        <Field.Text
          name="password"
          label="Contraseña"
          placeholder="6+ characters"
          type={password.value ? 'text' : 'password'}
          InputLabelProps={{shrink: true}}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}/>
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Iniciando sesión..."
      >
        Iniciar sesión
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        title="Inicia sesión en tu cuenta"
        description={
          <>
            {`¿No tienes una cuenta? `}
            <Link component={RouterLink} href={paths.auth.jwt.signUp} variant="subtitle2">
              Crear
            </Link>
          </>
        }
        sx={{textAlign: {xs: 'center', md: 'left'}}}
      />

      {/*<Alert severity="info" sx={{ mb: 3 }}>*/}
      {/*  Usar <strong>{defaultValues.email}</strong>*/}
      {/*  {' con la contraseña '}*/}
      {/*  <strong>{defaultValues.password}</strong>*/}
      {/*</Alert>*/}

      {!!errorMsg && (
        <Alert severity="error" sx={{mb: 3}}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>

      <Box mt={3}
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
      </Box>
    </>
  );
}
