import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

// ----------------------------------------------------------------------

export function SignUpTerms({ sx, ...other }) {
  return (
    <Box
      component="span"
      sx={{
        mt: 3,
        display: 'block',
        textAlign: 'center',
        typography: 'caption',
        color: 'text.secondary',
        ...sx,
      }}
      {...other}
    >
      {'Al registrarme, acepto los '}
      <Link underline="always" color="text.primary">
        Términos de servicio
      </Link>
      {' y la '}
      <Link underline="always" color="text.primary">
        Política de privacidad
      </Link>
      .
    </Box>
  );
}
