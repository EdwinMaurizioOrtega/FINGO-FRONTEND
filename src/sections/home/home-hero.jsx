
import { m } from 'framer-motion';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { textGradient } from 'src/theme/styles';
import { Iconify } from 'src/components/iconify';
import { varFade, MotionContainer } from 'src/components/animate';

// ----------------------------------------------------------------------

const smKey = 'sm';
const mdKey = 'md';
const lgKey = 'lg';

export function HomeHero({ sx, ...other }) {
  const theme = useTheme();

  const renderHeading = (
    <AnimatedDiv>
      <Box
        component="h1"
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        sx={{
          ...theme.typography.h2,
          my: 0,
          mx: 'auto',
          // maxWidth: 680,
          fontFamily: theme.typography.fontSecondaryFamily,
          [theme.breakpoints.up(lgKey)]: { fontSize: 72, lineHeight: '90px' },
        }}
      >
        <Box component="span" sx={{ width: 1, opacity: 0.24, fontSize: 35 }}>
          Tu Puente al Mundo de los Productos Financieros
        </Box>
        Bienvenido a
        <Box
          component={m.span}
          animate={{ backgroundPosition: '200% center' }}
          transition={{
            duration: 20,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          sx={{
            ...textGradient(
              `300deg, ${theme.vars.palette.primary.main} 0%, ${theme.vars.palette.warning.main} 25%, ${theme.vars.palette.primary.main} 50%, ${theme.vars.palette.warning.main} 75%, ${theme.vars.palette.primary.main} 100%`
            ),
            backgroundSize: '400%',
            ml: { xs: 0.75, md: 1, xl: 1.5 },
          }}
        >
          FINGO
        </Box>
      </Box>
    </AnimatedDiv>
  );

  const renderText = (
    <AnimatedDiv>
      <Typography
        variant="body2"
        sx={{
          mx: 'auto',
          [theme.breakpoints.up(smKey)]: { whiteSpace: 'pre' },
          [theme.breakpoints.up(lgKey)]: { fontSize: 20, lineHeight: '36px' },
        }}
      >
        {`¿Buscas las mejores opciones para  tu crédito? \nHemos creado un espacio único para conectarte directamente con las mejores instituciones financieras y ayudarte a tomar decisiones informadas, rápidas y seguras.`}
      </Typography>
    </AnimatedDiv>
  );

  const renderButtons = (
    <Box display="flex" flexWrap="wrap" justifyContent="center" gap={{ xs: 1.5, sm: 2 }}>
      <AnimatedDiv>
        <Stack alignItems="center" spacing={2.5}>
          <Button
            component={RouterLink}
            href={paths.auth.jwt.signUp}
            color="inherit"
            size="large"
            variant="contained"
            startIcon={<Iconify width={24} icon="iconoir:flash" />}
          >
            <span>
              Regístrate Ahora
              <Box
                component="small"
                sx={{
                  mt: '-3px',
                  opacity: 0.64,
                  display: 'flex',
                  fontSize: theme.typography.pxToRem(10),
                  fontWeight: theme.typography.fontWeightMedium,
                }}
              >
                {/*v{CONFIG.appVersion}*/}
              </Box>
            </span>
          </Button>

          {/*<Link*/}
          {/*  color="inherit"*/}
          {/*  variant="body2"*/}
          {/*  target="_blank"*/}
          {/*  rel="noopener"*/}
          {/*  href={paths.freeUI}*/}
          {/*  underline="always"*/}
          {/*  sx={{ gap: 0.5, alignItems: 'center', display: 'inline-flex' }}*/}
          {/*>*/}
          {/*  Iniciar Sesión*/}
          {/*  <Iconify width={16} icon="eva:external-link-fill" />*/}
          {/*</Link>*/}
        </Stack>
      </AnimatedDiv>

      <AnimatedDiv>
        <Button
          color="inherit"
          size="large"
          variant="outlined"
          target="_blank"
          rel="noopener"
          href={paths.auth.jwt.signIn}
          startIcon={<Iconify width={24} icon="solar:figma-outline" />}
          sx={{ borderColor: 'text.primary' }}
        >
          Iniciar Sesión
        </Button>
      </AnimatedDiv>
    </Box>
  );

  return (
    <Box
      // ref={scroll.elementRef}
      component="section"
      sx={{
        overflow: 'hidden',
        position: 'relative',
        ...sx,
      }}
      {...other}
    >
      <Box
        // component={m.div}
        // style={{ opacity }}
        sx={{
          width: 1,
          display: 'flex',
          position: 'relative',
          flexDirection: 'column',

        }}
      >
        <Container
          // component={MotionContainer}
          sx={{
            // py: 3,
            // gap: 5,
            // zIndex: 9,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Stack spacing={3} sx={{ textAlign: 'center' }}>
            <m.div >{renderHeading}</m.div>
            <m.div >{renderText}</m.div>
          </Stack>
          <m.div >{renderButtons}</m.div>
        </Container>

      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

function AnimatedDiv({ children, component = m.div }) {
  return (
    <Box component={component} variants={varFade({ distance: 24 }).inUp}>
      {children}
    </Box>
  );
}
