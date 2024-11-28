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

export function HomeMinimalDos({ sx, ...other }) {
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
        caption="Visualizando el éxito"
        title="¿Por Qué Elegirnos?"
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
    title: '•Transparencia Total',
    description: 'Compara las ofertas financieras con información clara y detallada.',
  },
  {
    icon: `${CONFIG.assetsDir}/assets/icons/home/ic-design.svg`,
    title: '•Ahorra Tiempo: ',
    description:
      'Olvídate de visitar múltiples sucursales o sitios web; aquí tienes todo en un solo lugar.',
  },
  {
    icon: `${CONFIG.assetsDir}/assets/icons/home/ic-development.svg`,
    title: '•Conexión Directa:  ',
    description:
      'Nuestro sistema de chat en tiempo real te acerca a los expertos financieros de cada institución.',
  },
  {
    icon: `${CONFIG.assetsDir}/assets/icons/courses/ic-courses-certificates.svg`,
    title: '•Protección de tus Datos: ',
    description:
      'Cumplimos con la Ley Orgánica de Protección de Datos, para que tengas la tranquilidad de que tus datos están protegidos.',
  },
];

