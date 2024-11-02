'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { _pricingPlans } from 'src/_mock';

import { PricingCard } from '../pricing-card';
import Divider from "@mui/material/Divider";
import AccordionDetails from "@mui/material/AccordionDetails";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";


// ----------------------------------------------------------------------

const arrowIcon = (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10.2147 30.6123C6.71243 22.9891 10.1906 14.9695 17.1738 11.0284C24.2834 7.01748 33.9187 7.08209 41.1519 10.6817C42.6578 11.4331 41.4507 13.5427 39.9511 12.945C33.399 10.3368 25.7611 10.0919 19.3278 13.1729C16.5269 14.4946 14.2131 16.6643 12.7143 19.3746C10.7314 22.9202 11.202 26.5193 11.6878 30.3396C11.8055 31.2586 10.5388 31.3074 10.2147 30.6123Z"
      fill="#919EAB"
      fillOpacity="0.24"
    />
    <path
      d="M11.8126 39.0341C9.56032 35.9944 6.83856 32.7706 6.01828 28.9795C5.98242 28.8458 5.99937 28.7036 6.0656 28.5821C6.13183 28.4607 6.24226 28.3694 6.374 28.3271C6.50573 28.2849 6.64867 28.295 6.77316 28.3553C6.89765 28.4157 6.99414 28.5216 7.04263 28.6511C8.43444 31.8092 10.4092 34.463 12.553 37.1099C13.8625 35.3195 14.915 33.2716 16.4773 31.7142C16.6164 31.5741 16.8007 31.4879 16.9974 31.471C17.1941 31.4541 17.3905 31.5075 17.5515 31.6218C17.7125 31.736 17.8277 31.9037 17.8767 32.095C17.9257 32.2863 17.9052 32.4887 17.8189 32.6663C16.5996 35.0298 15.0564 37.2116 13.2339 39.1484C13.1391 39.2464 13.0238 39.3222 12.8963 39.3703C12.7688 39.4185 12.6321 39.4378 12.4963 39.4268C12.3604 39.4159 12.2286 39.375 12.1104 39.3071C11.9922 39.2392 11.8905 39.1459 11.8126 39.0341Z"
      fill="#919EAB"
      fillOpacity="0.24"
    />
  </svg>
);

// ----------------------------------------------------------------------

export function PrivacyPolicyView() {
  return (
    <Container sx={{pt: {xs: 3, md: 5}, pb: 10}}>
      <div >
        <Typography variant="h4" gutterBottom style={{textAlign: 'center'}}>
          Política de Privacidad
        </Typography>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography variant="h6">Introducción</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Este aviso informativo nos permite comunicar la información que recopilamos cuando utiliza nuestro
              servicio. Al recopilar esta información, actuamos como responsables de datos personales y, conforme a la
              LOPDP, estamos obligados a brindarle información sobre nosotros, sobre por qué y cómo usamos sus datos, y
              sobre los derechos que tiene sobre sus datos personales.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography variant="h6">Información que Recopilamos</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Fingo ofrece servicios de búsqueda, consulta y centralización de información relacionada con productos
              financieros a través de nuestra página web y aplicación móvil. La información de los productos financieros
              presentada puede provenir de:
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Fuentes oficiales y públicas: Tasas de interés activas efectivas promedio ponderadas por entidad y tipo."/>
              </ListItem>
              <ListItem>
                <ListItemText primary="Institución Financiera: A través de contrato de prestación de servicios."/>
              </ListItem>
            </List>
            <Typography>
              Fingo, en ningún caso utiliza la información proporcionada por sus titulares para tomar decisiones
              automatizadas que puedan afectarle.
              La exactitud de la información de productos financieros presentada a través de este servicio no es
              responsabilidad de Fingo.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography variant="h6">Información del Responsable</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              El responsable del tratamiento de datos personales es: Avila Ledesma Daniel Eduardo.
              Nos puedes contactar mediante la dirección de correo electrónico: info@fingo.ec.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography variant="h6">Cómo Utilizamos tu Información</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Cuando uses nuestros servicios te pediremos ciertos datos. Normalmente es información básica: tu nombre,
              datos de contacto y tu número de cédula.
              Solicitamos tus datos personales para ayudarte a encontrar el producto financiero ideal basado en tu
              necesidad. Transferimos tus datos a las Instituciones Financieras que son las encargadas de ofrecer
              información sobre el producto financiero de tu interés. Sin esta transferencia, las Instituciones
              Financieras no pueden ejecutar los procesos internos para evaluar y conceder productos financieros.
              Usamos tus datos personales además para contactarte acerca de ofertas y otros productos o servicios que
              creemos que puedan resultarte de interés.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} >
            <Typography variant="h6">Cookies y Seguridad</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>
              También recopilamos datos de tu computadora, teléfono, tablet o de cualquier otro dispositivo en el que
              uses nuestros servicios. Esto puede incluir tu dirección IP, el tipo de navegador que utilizas, la
              configuración de idioma y ubicación.
            </Typography>
            <Typography paragraph>
              Utilizamos una serie de cookies para permitir que el sitio web funcione, recopilar información sobre los
              visitantes y ayudar a mejorar nuestros servicios, mejorando su experiencia de usuario. Algunas de las
              cookies que utilizamos son estrictamente necesarias para que nuestro sitio web funcione, y no solicitamos
              su consentimiento para colocarlas en su computadora. Estas cookies se muestran a continuación.
            </Typography>

            <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Nombre de la Cookie</strong></TableCell>
                    <TableCell><strong>Propósito</strong></TableCell>
                    <TableCell><strong>Información futura</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>session_id</TableCell>
                    <TableCell>Mantiene la sesión del usuario mientras navega por el sitio.</TableCell>
                    <TableCell>Permite a los usuarios permanecer conectados.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>csrf_token</TableCell>
                    <TableCell>Previene ataques CSRF (Cross-Site Request Forgery).</TableCell>
                    <TableCell>Asegura que las solicitudes provengan de usuarios autenticados.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>language_preference</TableCell>
                    <TableCell>Recuerda el idioma preferido del usuario.</TableCell>
                    <TableCell>Mejora la experiencia al personalizar el contenido.</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Typography paragraph>
              Adicionalmente, utilizamos cookies que son útiles pero no estrictamente necesarias. Para el uso de estas
              cookies, siempre le pediremos su consentimiento antes de colocarlas. Estas cookies son:
            </Typography>

            <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Nombre de la Cookie</strong></TableCell>
                    <TableCell><strong>Propósito</strong></TableCell>
                    <TableCell><strong>Información futura</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>analytics_cookie</TableCell>
                    <TableCell>Recopila información sobre cómo los visitantes usan el sitio.</TableCell>
                    <TableCell>Utilizada para analizar el tráfico y optimizar el contenido.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>marketing_cookie</TableCell>
                    <TableCell>Muestra anuncios relevantes y mide la efectividad de la publicidad.</TableCell>
                    <TableCell>Ayuda a personalizar los anuncios.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>preferences_cookie</TableCell>
                    <TableCell>Recuerda las preferencias del usuario.</TableCell>
                    <TableCell>Mejora la personalización de la experiencia del usuario.</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Typography paragraph>
              Para mantener la seguridad de sus datos en Fingo, éstos se almacenarán en una base de datos cifrada y la transmisión
              de información entre su equipo y el servicio ocurrirá usando canales cifrados. Su nombre y dirección de
              correo electrónico se comparten con un sistema de correo de terceros para realizar mailing, y este sistema
              en la nube cumple con los requisitos de protección de datos personales. Conservamos sus datos personales mientras
              nuestro servicio sea de su interés. Si retira su consentimiento o decide darse de baja de nuestro servicio de
              suscripción, marcaremos sus datos para que no se utilicen y los eliminaremos después de dos meses.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography variant="h6">Su Consentimiento es Necesario Para</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Transferir sus datos a las Instituciones Financieras que ofrecen el/los productos de su interés.
              El envío de nuestro boletín informativo, el mismo que utiliza su nombre y dirección de correo electrónico.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography variant="h6">¿Qué Ocurre si se Deshabilitan las Cookies?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Algunas funcionalidades de los Servicios o áreas de este sitio web podrían no funcionar correctamente.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography variant="h6">Actualización de Nuestra Política</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Es posible que actualicemos la política de privacidad, por ello, le recomendamos revisar esta política
              cada que acceda a nuestro sitio web con el objetivo de estar adecuadamente informado sobre cómo y para qué
              usamos las cookies.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography variant="h6">Tus Derechos como Titular</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Conforme lo indicado por la Ley Orgánica de Protección de Datos Personales, como titular tiene derecho a
              consultarnos la información que tenemos sobre usted y puede solicitarnos su actualización si es inexacta.
              Si, para el tratamiento de sus datos personales pedimos su consentimiento, puede retirar ese
              consentimiento en cualquier momento.
              Adicionalmente, si estamos tratando sus datos personales legalmente y hemos solicitado su consentimiento o
              para cumplimiento contractual, puede solicitar una copia de la información en un formato legible para que
              pueda transferirla a otro responsable. Por otro lado, si considera que debemos eliminar sus datos
              personales también tiene derecho a solicitarlo.
              Puede ponerse en contacto con nosotros al correo <strong>derechos@fingo.ec</strong> indicando en el asunto
              el tipo de derecho que desea ejercer.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    </Container>
  );
}
