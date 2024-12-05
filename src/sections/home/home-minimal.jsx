import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/config-global';
import { varAlpha, stylesMode } from 'src/theme/styles';

import { SvgColor } from 'src/components/svg-color';
import { varFade, MotionViewport } from 'src/components/animate';

import { SectionTitle } from './components/section-title';
import { CircleSvg, FloatLine, FloatPlusIcon } from './components/svg-elements';
import Button from '@mui/material/Button';
import { paths } from '../../routes/paths';
import { Iconify } from '../../components/iconify';

// ----------------------------------------------------------------------

export function HomeMinimal({ sx, ...other }) {
  const renderLines = (
    <>
      <FloatPlusIcon sx={{ top: 72, left: 72 }} />
      <FloatPlusIcon sx={{ bottom: 72, left: 72 }} />
      <FloatLine sx={{ top: 80, left: 0 }} />
      <FloatLine sx={{ bottom: 80, left: 0 }} />
      <FloatLine vertical sx={{ top: 0, left: 80 }} />
    </>
  );

  const renderDescription = (
    <>
      <SectionTitle
        // caption="Visualizando el éxito"
        title="¿Cómo Funciona?"
        // txtGradient="FinGo"
        sx={{ mb: { xs: 5, md: 8 }, textAlign: { xs: 'center', md: 'left' } }}
      />

      <Stack spacing={6}>
        {ITEMS.map((item) => (
          <Box
            component={m.div}
            key={item.title}
            variants={varFade({ distance: 24 }).inUp}
            gap={3}
            display="flex"
          >
            <SvgColor src={item.icon} sx={{ width: 40, height: 40 }} />
            <Stack spacing={1}>
              <Typography variant="h5" component="h6">
                {item.title}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>{item.description}</Typography>
            </Stack>
          </Box>
        ))}
      </Stack>
    </>
  );

  return (
    <Box
      component="section"
      sx={{
        overflow: 'hidden',
        position: 'relative',
        py: { xs: 10, md: 20 },
        ...sx,
      }}
      {...other}
    >
      <MotionViewport>
        {renderLines}

        <Container sx={{ position: 'relative' }}>
          <Grid container columnSpacing={{ xs: 0, md: 8 }} sx={{ position: 'relative', zIndex: 9 }}>
            <Grid xs={12} md={12} lg={12}>
              {renderDescription}
            </Grid>
          </Grid>

          <m.div variants={varFade({ distance: 24 }).inUp}>
            <Button
              size="large"
              color="inherit"
              variant="outlined"
              target="_blank"
              rel="noopener"
              href={paths.auth.jwt.signUp}
              endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
              sx={{ mt: 5, mx: 'auto' }}
            >
              Regístrate Ahora
            </Button>
          </m.div>

          <CircleSvg variants={varFade().in} sx={{ display: { xs: 'none', md: 'block' } }} />
        </Container>
      </MotionViewport>
    </Box>
  );
}

// ----------------------------------------------------------------------

const ITEMS = [
  {
    icon: `${CONFIG.assetsDir}/assets/icons/home/ic-make-brand.svg`,
    title: '1. Regístrate Gratis:',
    description:
      'Crea tu cuenta y accede a una experiencia personalizada para encontrar los productos que mejor se adapten a ti.',
  },
  {
    icon: `${CONFIG.assetsDir}/assets/icons/home/ic-design.svg`,
    title: '2. Explora y Compara:',
    description:
      'Utiliza nuestro buscador para explorar las opciones disponibles. Puedes comparar tasas, plazos y beneficios de cada producto en un solo lugar.',
  },
  {
    icon: `${CONFIG.assetsDir}/assets/icons/home/ic-development.svg`,
    title: '3. Conéctate en Tiempo Real: ',
    description:
      '¿Tienes dudas? Usa nuestro sistema de chat en vivo para comunicarte directamente con las instituciones financieras y obtener respuestas rápidas y precisas.',
  },
  {
    icon: `${CONFIG.assetsDir}/assets/icons/courses/ic-courses-certificates.svg`,
    title: '4. Toma Decisiones Informadas:',
    description:
      'Una vez que encuentres el producto ideal, completa el proceso con el respaldo de nuestra plataforma y las instituciones financieras.',
  },
];

