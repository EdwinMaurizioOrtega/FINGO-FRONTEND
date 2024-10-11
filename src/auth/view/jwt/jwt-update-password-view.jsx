'use client';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { SentIcon } from 'src/assets/icons';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { FormHead } from '../../components/form-head';
import { FormReturnLink } from '../../components/form-return-link';
import { updatePassword } from '../../context/jwt';

// ----------------------------------------------------------------------

export const UpdatePasswordSchema = zod
  .object({
    email: zod
      .string()
      .min(1, { message: '¡Se requiere correo electrónico!' })
      .email({ message: '¡El correo electrónico debe ser una dirección de correo electrónico válida!' }),
    password: zod
      .string()
      .min(1, { message: '¡Se requiere contraseña!' })
      .min(6, { message: '¡La contraseña debe tener al menos 6 caracteres!' }),
    confirmPassword: zod.string().min(1, { message: '¡Se requiere confirmar la contraseña!' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '¡Las contraseñas no coinciden!',
    path: ['confirmPassword'],
  });

// ----------------------------------------------------------------------

export function JwtUpdatePasswordView() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const email = searchParams.get('email');

  const password = useBoolean();

  const defaultValues = {
    code: '',
    email: email || '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await updatePassword({
        username: data.email,
        new_password: data.password,
      });

      router.push(paths.auth.jwt.signIn);
    } catch (error) {
      console.error(error);
    }
  });

  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Field.Text
        name="email"
        label="Correo electrónico"
        placeholder="example@gmail.com"
        InputLabelProps={{ shrink: true }}
        disabled
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

      <Field.Text
        name="confirmPassword"
        label="Confirmar nueva contraseña"
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

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Actualizando contraseña..."
      >
        Actualizar contraseña
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        icon={<SentIcon />}
        title="¡Solicitud de actualización de contraseña!"
        // description={`We've sent a 6-digit confirmation email to your email. \nPlease enter the code in below box to verify your email.`}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>

      <FormReturnLink href={paths.auth.jwt.signIn} />
    </>
  );
}
