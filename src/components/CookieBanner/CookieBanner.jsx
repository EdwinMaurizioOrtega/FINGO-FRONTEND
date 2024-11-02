"use client";

import { useEffect, useState } from "react";
import { getCookie, setCookie } from "cookies-next";
import { Snackbar, Button, Typography, Box } from "@mui/material";
import Link from "@mui/material/Link";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const acceptedCookies = getCookie('acceptedCookies');
    if (!acceptedCookies) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    setCookie('acceptedCookies', 'true', { maxAge: 30 * 24 * 60 * 60 }); // 30 días
    setIsVisible(false);
  };

  return (
    <Snackbar
      open={isVisible}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{ width: '100%', backgroundColor: '#333' }}
      message={
        <Box display="flex" alignItems="center">
          <Typography variant="body2" sx={{ color: 'white' }}>
            Usamos cookies para mejorar tu experiencia. Al continuar, aceptas nuestra {' '}
            <Link href="/privacy-policy" underline="always" color="text.secondary" >
               Política de privacidad
            </Link>
            .
          </Typography>
          <Button
            onClick={handleAccept}
            variant="contained"
            color="success"
            sx={{ marginLeft: 2 }}
          >
            Aceptar
          </Button>
        </Box>
      }
      // action={
      //   <Button
      //     color="inherit"
      //     onClick={() => setIsVisible(false)}
      //   >
      //     Cerrar
      //   </Button>
      // }
    />
  );
}
