import { useState } from 'react';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import StepContent from '@mui/material/StepContent';
import { FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material';

// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

export function VerticalLinearStepper() {
  const [selectedOption, setSelectedOption] = useState('');
  const [personalOption, setPersonalOption] = useState('');
  const [consumoCredito, setConsumoCredito] = useState('');
  const [educativoCredito, setEducativoCredito] = useState('');
  const [empresaFacturacion, setEmpresaFacturacion] = useState('');
  const [inmobiliarioOption, setInmobiliarioOption] = useState('');
  const [socialCredito, setSocialCredito] = useState('');
  const [publicoCredito, setPublicoCredito] = useState('');



  const handleReset = () => {
    setSelectedOption('');
    setPersonalOption('');
    setConsumoCredito('');
    setEducativoCredito('');
    setEmpresaFacturacion('');
    setInmobiliarioOption('');
    setSocialCredito('');
    setPublicoCredito('');
  };


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

    <h3>Cuál es el uso que le vas a dar al crédito?</h3>
      <RadioGroup
        name="uso-credito"
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
      >
        <Box>
          <FormControlLabel value="personal" control={<Radio />} label="Uso personal" />
          {selectedOption === 'personal' && (
            <RadioGroup sx={{ mt: 1, ml: 4 }} value={personalOption} onChange={(e) => setPersonalOption(e.target.value)}>
              <FormControlLabel value="consumo" control={<Radio />} label="Consumo" />
              {personalOption === 'consumo' && (
                <TextField
                  label="MONTO A SOLICITAR"
                  variant="outlined"
                  value={consumoCredito}
                  onChange={(e) => setConsumoCredito(e.target.value)}
                  sx={{ mt: 1, ml: 4, display: 'block' }}
                />
              )}
              <FormControlLabel value="educativo" control={<Radio />} label="Educativo" />
              {personalOption === 'educativo' && (
                <TextField
                  label="MONTO A SOLICITAR"
                  variant="outlined"
                  value={educativoCredito}
                  onChange={(e) => setEducativoCredito(e.target.value)}
                  sx={{ mt: 1, ml: 4, display: 'block' }}
                />
              )}
            </RadioGroup>
          )}
        </Box>

        <Box>
          <FormControlLabel value="empresa" control={<Radio />} label="Uso para mi empresa" />
          {selectedOption === 'empresa' && (
            <TextField
              label="¿Cuánto facturas al año?"
              variant="outlined"
              value={empresaFacturacion}
              onChange={(e) => setEmpresaFacturacion(e.target.value)}
              sx={{ mt: 1, ml: 4, display: 'block' }}
            />
          )}
        </Box>

        <Box>
          <FormControlLabel value="inmobiliario" control={<Radio />} label="Crédito inmobiliario" />
          {selectedOption === 'inmobiliario' && (
            <RadioGroup sx={{ mt: 1, ml: 4 }} value={inmobiliarioOption} onChange={(e) => setInmobiliarioOption(e.target.value)}>
              <FormControlLabel value="social" control={<Radio />} label="Social" />
              {inmobiliarioOption === 'social' && (
                <TextField
                  label="MONTO A SOLICITAR"
                  variant="outlined"
                  value={socialCredito}
                  onChange={(e) => setSocialCredito(e.target.value)}
                  sx={{ mt: 1, ml: 4, display: 'block' }}
                />
              )}
              <FormControlLabel value="publico" control={<Radio />} label="Público" />
              {inmobiliarioOption === 'publico' && (
                <TextField
                  label="MONTO A SOLICITAR"
                  variant="outlined"
                  value={publicoCredito}
                  onChange={(e) => setPublicoCredito(e.target.value)}
                  sx={{ mt: 1, ml: 4, display: 'block' }}
                />
              )}
            </RadioGroup>
          )}
        </Box>
      </RadioGroup>
    </Box>
  );

}
