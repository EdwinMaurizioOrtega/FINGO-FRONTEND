import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import {useAuthContext} from "../../auth/hooks";
import Button from "@mui/material/Button";

// ----------------------------------------------------------------------

export function JobItem({ job, onView, onEdit, onDelete, onMontoTotalSolicitar, onNumeroDeCuotas }) {

  const {user} = useAuthContext();

  const popover = usePopover();

  const montoTotalSolicitar = onMontoTotalSolicitar || 0;
  const numeroDeCuotas = onNumeroDeCuotas || 0;
  const tasaNominal = job.tasa / 100 || 0; // Tasa nominal

  // Cálculo de la tasa de interés mensual
  const tasaMensual = tasaNominal / 12 || 0;

  // Cálculo de la cuota mensual usando la fórmula de amortización
  const cuotaMensual = (montoTotalSolicitar * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -numeroDeCuotas))  || 0;

  // Cálculo del total a pagar (cuota mensual * número de cuotas)
  const totalAPagar = cuotaMensual * numeroDeCuotas || 0;

  console.log(`La cuota mensual será aproximadamente $${cuotaMensual.toFixed(2)}.`);

  return (
    <>
      <Card>
        <IconButton onClick={popover.onOpen} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>

        <Stack sx={{ p: 3, pb: 2 }}>
          <Avatar
            alt={job.name}
            src={job.logo}
            variant="rounded"
            sx={{ width: 'auto', height: 100, mb: 2 }}
          />

          <ListItemText
            sx={{ mb: 1 }}
            primary={
              <Link
                component={RouterLink}
                href="#"
                color="inherit"
              >
                {job.name}
              </Link>
            }
            // secondary={`Posted date: ${fDate(job.createdAt)}`}
            primaryTypographyProps={{ typography: 'subtitle1' }}
            secondaryTypographyProps={{
              mt: 1,
              component: 'span',
              typography: 'caption',
              color: 'text.disabled',
            }}
          />

          <Stack
            spacing={0.5}
            direction="row"
            alignItems="center"
            sx={{
              pointerEvents: user ? 'auto' : 'none',  // Deshabilita clics si el usuario no está
              filter: user ? 'none' : 'blur(4px)',    // Aplica efecto difuso si el usuario no está
              opacity: user ? 1 : 0.5,                // Baja la opacidad si el usuario no está
              transition: 'filter 0.3s, opacity 0.3s', // Suaviza la transición
              color: 'primary.main',
              typography: 'caption'
          }}
          >
            <Iconify width={16} icon="solar:users-group-rounded-bold" />
            {job.tasa}% Tasa Nominal
          </Stack>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box
          sx={{
            pointerEvents: user ? 'auto' : 'none',  // Deshabilita clics si el usuario no está
            filter: user ? 'none' : 'blur(4px)',    // Aplica efecto difuso si el usuario no está
            opacity: user ? 1 : 0.5,                // Baja la opacidad si el usuario no está
            transition: 'filter 0.3s, opacity 0.3s', // Suaviza la transición
            p: 3
          }}
          rowGap={1.5} display="grid" gridTemplateColumns="repeat(2, 1fr)" >
          {[
            {
              label: fCurrency(montoTotalSolicitar) + ' Monto A Solicitar',
              icon: <Iconify width={16} icon="solar:wad-of-money-bold" sx={{ flexShrink: 0 }} />,
            },
            {
              label: numeroDeCuotas + ' # Cuotas',
              icon: <Iconify width={16}  icon="solar:clock-circle-bold"  sx={{ flexShrink: 0 }} />,
            },
            {
              label: fCurrency(totalAPagar) + ' Total A Pagar',
              icon: <Iconify width={16} icon="solar:user-rounded-bold" sx={{ flexShrink: 0 }} />,
            },
            {
              label: fCurrency(cuotaMensual) + ' Cuota Mensual',
              icon: <Iconify width={16} icon="carbon:skill-level-basic" sx={{ flexShrink: 0 }} />,
            }
          ].map((item, index) => (
            <Stack
              key={index}
              spacing={0.5}
              flexShrink={0}
              direction="row"
              alignItems="center"
              sx={{ color: 'text.disabled', minWidth: 0 }}
            >
              {item.icon}
              <Typography variant="caption" noWrap>
                {item.label}
              </Typography>
            </Stack>
          ))}
        </Box>

        {!user && (
          <Button
            component={RouterLink}
            href={paths.auth.jwt.signIn}
            color="inherit"
            type="submit"
            variant="contained"
            fullWidth // Esta es la propiedad que hace que el botón sea de ancho completo
          >
            VER TODOS LOS DATOS
          </Button>

        )}

      </Card>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
              onView();
            }}
          >
            <Iconify icon="solar:eye-bold" />
            Info
          </MenuItem>

          {/*<MenuItem*/}
          {/*  onClick={() => {*/}
          {/*    popover.onClose();*/}
          {/*    onEdit();*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <Iconify icon="solar:pen-bold" />*/}
          {/*  Edit*/}
          {/*</MenuItem>*/}

          {/*<MenuItem*/}
          {/*  onClick={() => {*/}
          {/*    popover.onClose();*/}
          {/*    onDelete();*/}
          {/*  }}*/}
          {/*  sx={{ color: 'error.main' }}*/}
          {/*>*/}
          {/*  <Iconify icon="solar:trash-bin-trash-bold" />*/}
          {/*  Delete*/}
          {/*</MenuItem>*/}
        </MenuList>
      </CustomPopover>
    </>
  );
}
