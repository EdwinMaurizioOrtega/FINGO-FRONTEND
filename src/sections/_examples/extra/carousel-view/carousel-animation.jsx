'use client';

import { m } from 'framer-motion';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { varAlpha, bgGradient } from 'src/theme/styles';
import { varFade, MotionContainer } from 'src/components/animate';
import { Carousel, useCarousel, CarouselArrowNumberButtons } from 'src/components/carousel';
import { IndexLabel } from './elements';
import { DashboardContent } from '../../../../layouts/dashboard';

// ----------------------------------------------------------------------

const data = [
  {
    id: 1,
    title: 'Demo test 1',
    image: 'https://placehold.co/1280x480',
    description: 'Demo test 1',
    link: 'https://www.google.com/',
  },
  {
    id: 2,
    title: 'Demo test 2',
    image: 'https://placehold.co/1280x480',
    description: 'Demo test 2',
    link: 'https://www.google.com/',
  },
];

// ----------------------------------------------------------------------

export function CarouselAnimation() {
  const carousel = useCarousel();

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Box sx={{ position: 'relative' }}>
          <Carousel carousel={carousel} sx={{ borderRadius: 2 }}>
            {data.map((item_d, index) => (
              <CarouselItem
                key={item_d.id}
                index={index}
                itemData={item_d}
                selected={index === carousel.dots.selectedIndex}
              />
            ))}
          </Carousel>

          <CarouselArrowNumberButtons
            {...carousel.arrows}
            options={carousel.options}
            totalSlides={carousel.dots.dotCount}
            selectedIndex={carousel.dots.selectedIndex + 1}
            sx={{ top: 16, right: 16, position: 'absolute' }}
          />
        </Box>
      </Box>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

function CarouselItem({ itemData, index, selected }) {
  return (
    <Box sx={{ position: 'relative' }}>
      <IndexLabel index={index + 1} />

      <Box
        component="img"
        alt={itemData.title}
        src={itemData.image}
        sx={{
          objectFit: 'cover',
          aspectRatio: { xs: '4/3', sm: '16/5' },
        }}
      />

      <Box
        sx={(theme) => ({
          ...bgGradient({
            color: `to top, ${theme.vars.palette.grey[900]}, ${varAlpha(theme.vars.palette.grey['900Channel'], 0)}`,
          }),
          top: 0,
          width: 1,
          height: 1,
          position: 'absolute',
        })}
      />

      <Box
        component={MotionContainer}
        animate={selected}
        action
        sx={{
          p: 3,
          left: 0,
          width: 1,
          bottom: 0,
          position: 'absolute',
          color: 'common.white',
        }}
      >
        <m.div variants={varFade().inRight}>
          <Typography
            noWrap
            sx={{
              mb: 1,
              typography: { xs: 'subtitle1', md: 'h3' },
            }}
          >
            {itemData.title}
          </Typography>
        </m.div>

        <m.div variants={varFade().inRight}>
          <Typography noWrap variant="body2">
            {itemData.description}
          </Typography>
        </m.div>

        <m.div variants={varFade().inRight}>
          <Button
            color="primary"
            variant="contained"
            sx={{ mt: 3, display: { xs: 'none', sm: 'inline-flex' } }}
          >
            Demo Button
          </Button>
        </m.div>
      </Box>
    </Box>
  );
}
