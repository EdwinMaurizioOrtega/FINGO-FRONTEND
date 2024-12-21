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
import {paths} from 'src/routes/paths';
import {RouterLink} from 'src/routes/components';
import {fCurrency} from 'src/utils/format-number';
import {Iconify} from 'src/components/iconify';
import {usePopover, CustomPopover} from 'src/components/custom-popover';
import {useAuthContext} from "../../auth/hooks";
import Button from "@mui/material/Button";
import html2canvas from "html2canvas";

// ----------------------------------------------------------------------

export function JobItem({job, onView, onEdit, onDelete, onMontoTotalSolicitar, onNumeroDeCuotas}) {

  const {user} = useAuthContext();

  const popover = usePopover();

  const montoTotalSolicitar = onMontoTotalSolicitar || 0;
  const numeroDeCuotas = onNumeroDeCuotas || 0;
  const tasaNominal = job.tasa_interes_promedio_ponderada / 100 || 0; // Tasa nominal

  // Cálculo de la tasa de interés mensual
  const tasaMensual = tasaNominal / 12 || 0;

  // Cálculo de la cuota mensual usando la fórmula de amortización
  const cuotaMensual = (montoTotalSolicitar * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -numeroDeCuotas)) || 0;

  // Cálculo del total a pagar (cuota mensual * número de cuotas)
  const totalAPagar = cuotaMensual * numeroDeCuotas || 0;

  console.log(`La cuota mensual será aproximadamente $${cuotaMensual.toFixed(2)}.`);

  // Supongamos que tu imagen está en la carpeta 'public' y se llama 'watermark.png'
  const watermarkImageUrl = '/logo/logo-fingo-full.png';

  const handleDownloadImage = () => {
    const captureElement = document.getElementById('imprimir'); // Asegúrate de tener un elemento con este ID

    html2canvas(captureElement).then((canvas) => {
      // Obtener el contexto del canvas
      const context = canvas.getContext('2d');

      // Obtener el alto original
      const originalHeight = canvas.height;
      const originalWidth = canvas.width;

      // Calcular la nueva altura manteniendo la relación de aspecto
      const newWidth = 400;
      const aspectRatio = originalHeight / originalWidth;
      const newHeight = newWidth * aspectRatio;

      // Crear un nuevo canvas con el tamaño deseado
      const resizedCanvas = document.createElement('canvas');
      resizedCanvas.width = newWidth;
      resizedCanvas.height = newHeight;

      // Dibujar la imagen redimensionada en el nuevo canvas
      const resizedContext = resizedCanvas.getContext('2d');
      resizedContext.drawImage(canvas, 0, 0, newWidth, newHeight);

      // Cargar la imagen de la marca de agua
      const watermarkImg = new Image();
      watermarkImg.src = watermarkImageUrl;

      watermarkImg.onload = () => {
        // Calcular el tamaño y posición de la marca de agua
        const watermarkWidth = 350; // Ajusta el tamaño de la marca de agua según desees
        const watermarkHeight = watermarkWidth * (watermarkImg.height / watermarkImg.width);
        const x = (newWidth - watermarkWidth) / 2;
        const y = (newHeight - watermarkHeight) / 2;

        // Dibujar la marca de agua
        resizedContext.globalAlpha = 0.2; // Ajustar opacidad si es necesario
        resizedContext.drawImage(watermarkImg, x, y, watermarkWidth, watermarkHeight);

        // Descargar la imagen
        const link = document.createElement('a');
        link.download = 'fingo.png';
        link.href = resizedCanvas.toDataURL();
        link.click();
      };
    });
  };

  return (
    <>
      <Card id="imprimir">
        {/*<IconButton onClick={popover.onOpen} sx={{position: 'absolute', top: 8, right: 8}}>*/}
        {/*  <Iconify icon="eva:more-vertical-fill"/>*/}
        {/*</IconButton>*/}

        <Stack sx={{p: 3, pb: 2}}>
          <Box
            component="img"
            alt={job.razon_social}
            src={job.logo}
            sx={{
              height: 50,
              width: 'auto', // El ancho se ajustará automáticamente según el tamaño original de la imagen
              mb: 2,
              backgroundColor: job.background_color,
              objectFit: 'contain' // Evita la distorsión de la imagen
            }}
          />

          <ListItemText
            sx={{mb: 1}}
            primary={
              <Link
                component={RouterLink}
                href="#"
                color="inherit"
              >
                {job.razon_social}
              </Link>
            }
            // secondary={`Posted date: ${fDate(job.createdAt)}`}
            primaryTypographyProps={{typography: 'subtitle1'}}
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
              // pointerEvents: user ? 'auto' : 'none',  // Deshabilita clics si el usuario no está
              // filter: user ? 'none' : 'blur(4px)',    // Aplica efecto difuso si el usuario no está
              // opacity: user ? 1 : 0.5,                // Baja la opacidad si el usuario no está
              pointerEvents: 'auto',  // Deshabilita clics si el usuario no está
              filter: 'none',    // Aplica efecto difuso si el usuario no está
              opacity: 1,                // Baja la opacidad si el usuario no está
              transition: 'filter 0.3s, opacity 0.3s', // Suaviza la transición
              color: 'primary.main',
              typography: 'caption'
            }}
          >
            <Iconify width={16} icon="solar:users-group-rounded-bold"/>
            {
              job.tasa_interes_promedio_ponderada !== '1' ? job.tasa_interes_promedio_ponderada + '% Tasa Nominal' : 'Sin % Tasa Nominal'
            }
          </Stack>
        </Stack>

        <Divider sx={{borderStyle: 'dashed'}}/>

        <Box
          sx={{
            // pointerEvents: user ? 'auto' : 'none',  // Deshabilita clics si el usuario no está
            // filter: user ? 'none' : 'blur(4px)',    // Aplica efecto difuso si el usuario no está
            // opacity: user ? 1 : 0.5,                // Baja la opacidad si el usuario no está
            pointerEvents: 'auto',  // Deshabilita clics si el usuario no está
            filter: 'none',    // Aplica efecto difuso si el usuario no está
            opacity: 1,                // Baja la opacidad si el usuario no está
            transition: 'filter 0.3s, opacity 0.3s', // Suaviza la transición
            p: 3
          }}
          rowGap={1.5} display="grid" gridTemplateColumns="repeat(1, 1fr)">
          {[
            {
              label: fCurrency(montoTotalSolicitar) + ' Monto A Solicitar',
              icon: <Iconify width={16} icon="solar:wad-of-money-bold" sx={{flexShrink: 0}}/>,
            },
            {
              label: numeroDeCuotas + ' # Cuotas',
              icon: <Iconify width={16} icon="solar:clock-circle-bold" sx={{flexShrink: 0}}/>,
            },
            {
              label: fCurrency(totalAPagar) + ' Total A Pagar',
              icon: <Iconify width={16} icon="solar:user-rounded-bold" sx={{flexShrink: 0}}/>,
            },
            {
              label: fCurrency(cuotaMensual) + ' Cuota Mensual',
              icon: <Iconify width={16} icon="carbon:skill-level-basic" sx={{flexShrink: 0}}/>,
            }
          ].map((item, index) => (
            <Stack
              key={index}
              spacing={0.5}
              flexShrink={0}
              direction="row"
              alignItems="center"
              sx={{color: 'text.disabled', minWidth: 0}}
            >
              {item.icon}
              <Typography variant="caption" noWrap sx={{fontSize: '0.9rem'}}>
                {item.label}
              </Typography>
            </Stack>
          ))}

        </Box>

        <Box
          sx={{
            // pointerEvents: user ? 'auto' : 'none',  // Deshabilita clics si el usuario no está
            // filter: user ? 'none' : 'blur(4px)',    // Aplica efecto difuso si el usuario no está
            // opacity: user ? 1 : 0.5,                // Baja la opacidad si el usuario no está
            pointerEvents: 'auto',  // Deshabilita clics si el usuario no está
            filter: 'none',    // Aplica efecto difuso si el usuario no está
            opacity: 1,                // Baja la opacidad si el usuario no está
            transition: 'filter 0.3s, opacity 0.3s', // Suaviza la transición
            p: 3
          }}
          >
        <Stack
          spacing={0.5}
          flexShrink={0}
          direction="row"
          alignItems="center"
          sx={{
            color: 'text.disabled',
            minWidth: 0,
            width: '100%',
            justifyContent: 'space-between'
          }} // Alinea los botones a los extremos
        >
          <Button
            fullWidth // Esta es la propiedad que hace que el botón sea de ancho completo
            color="inherit"
            type="submit"
            variant="contained"
            onClick={handleDownloadImage}
          >
            Descargar
          </Button>

          <Button
            color="inherit"
            type="submit"
            variant="contained"
            sx={{
              position: 'relative',
              cursor: 'not-allowed', // Asegura que el cursor refleje que está deshabilitado
              '&:hover::after': {
                content: '"Próximamente"',
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                color: '#fff',
                padding: '4px 8px',
                borderRadius: '4px',
                whiteSpace: 'nowrap',
                fontSize: '12px',
                zIndex: 1,
              },
            }}
          >
            Chat
          </Button>
        </Stack>
        </Box>
        {/*{!user && (*/}
        {/*  <Button*/}
        {/*    component={RouterLink}*/}
        {/*    href={paths.auth.jwt.signIn}*/}
        {/*    color="inherit"*/}
        {/*    type="submit"*/}
        {/*    variant="contained"*/}
        {/*    fullWidth // Esta es la propiedad que hace que el botón sea de ancho completo*/}
        {/*  >*/}
        {/*    VER TODOS LOS DATOS*/}
        {/*  </Button>*/}

        {/*)}*/}

      </Card>

      {/*<CustomPopover*/}
      {/*  open={popover.open}*/}
      {/*  anchorEl={popover.anchorEl}*/}
      {/*  onClose={popover.onClose}*/}
      {/*  slotProps={{arrow: {placement: 'right-top'}}}*/}
      {/*>*/}
      {/*  <MenuList>*/}
          {/*<MenuItem*/}
          {/*  onClick={() => {*/}
          {/*    popover.onClose();*/}
          {/*    onView();*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <Iconify icon="solar:eye-bold"/>*/}
          {/*  Info*/}
          {/*</MenuItem>*/}

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
      {/*  </MenuList>*/}
      {/*</CustomPopover>*/}
    </>
  );
}
