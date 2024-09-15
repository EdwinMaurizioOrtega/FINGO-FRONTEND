'use client';

import {useState, useCallback} from 'react';
import {DashboardContent} from 'src/layouts/dashboard';
import {
  _jobs,
} from 'src/_mock';

import {JobList} from '../job-list';
import {useAuthContext} from "../../../auth/hooks";
import Box from "@mui/material/Box";
import {Field, Form} from "../../../components/hook-form";
import LoadingButton from "@mui/lab/LoadingButton";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {SignInSchema} from "../../../auth/view/jwt";

// ----------------------------------------------------------------------

export function JobListView() {

  const {user} = useAuthContext();

  const [errorMsg, setErrorMsg] = useState('');

  const defaultValues = {
    monto_a_solicitar: '',
    num_cuotas: '',
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

    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });


  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Field.Text name="monto_a_solicitar" label="MONTO A SOLICITAR *" InputLabelProps={{shrink: true}}/>

      <Field.Text name="num_cuotas" label="# CUOTAS *" InputLabelProps={{shrink: true}}/>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Sign in..."
      >
        Generar
      </LoadingButton>
    </Box>
  );

  return (
    <DashboardContent>
      <Box gap={3} display="flex" flexDirection="column" sx={{my: 5}}>
        <Form methods={methods} onSubmit={onSubmit}>
          {renderForm}
        </Form>
      </Box>
      <Box
        sx={{
          pointerEvents: user ? 'auto' : 'none',  // Deshabilita clics si el usuario no está
          filter: user ? 'none' : 'blur(4px)',    // Aplica efecto difuso si el usuario no está
          opacity: user ? 1 : 0.5,                // Baja la opacidad si el usuario no está
          transition: 'filter 0.3s, opacity 0.3s' // Suaviza la transición
        }}
      >
        <JobList jobs={_jobs}/>
      </Box>
    </DashboardContent>
  );
}
