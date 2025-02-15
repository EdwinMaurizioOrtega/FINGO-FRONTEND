'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import { EmptyContent } from '../../components/empty-content';
import { useEffect, useState } from 'react';
import axios, { endpoints } from '../../utils/axios';

// ----------------------------------------------------------------------

export function LogsView({ title = 'Logs' }) {

  const [businessPartners, setBusinessPartners] = useState([]);

  useEffect(() => {

    const BuscarPorRango = async () => {

      try {

        const response = await axios.get(endpoints.bank.registered_logs_bank_query_records);

        if (response.status === 200) {
          console.log(response);
          const businessPartnersWithId = response.data.data.map((partner, index) => ({
            ...partner,
            id: index + 1, // Puedes ajustar la lógica según tus necesidades
          }));

          setBusinessPartners(businessPartnersWithId);
          console.log("response.data.data: " + JSON.stringify(response.data.data));
          console.log("businessPartnersWithId: " + JSON.stringify(businessPartnersWithId));

        } else {
          // La solicitud POST no se realizó correctamente
          console.error('Error en la solicitud POST:', response.status);
        }


      } catch (error) {
        console.error('Error fetching data:', error);
      }

    };

    BuscarPorRango()

  }, []);


  const baseColumns = [

    {
      field: 'id',
      hide: true,
      flex: 1,
      minWidth: 15,
    },
    {
      field: 'tipo_credito',
      headerName: 'tipo_credito',
      flex: 1,
      minWidth: 160,
    },
    {
      field: 'created_at',
      headerName: 'CREADO',
      flex: 1,
      minWidth: 250,
      renderCell: (params) => {
        const createdAt = new Date(params.value); // Convertir el valor a una fecha
        if (isNaN(createdAt)) return 'Fecha inválida'; // Manejo de error si la fecha no es válida

        // Obtener fecha en el formato deseado
        const formattedDate = createdAt.toLocaleDateString('es-EC', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });

        // Obtener hora en el formato deseado
        const formattedTime = createdAt.toLocaleTimeString('es-EC', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });

        return `${formattedDate} ${formattedTime}`;
      },
    },
    {
      field: 'plazo',
      headerName: 'plazo',
      flex: 1,
      minWidth: 50,
    },
    {
      field: 'provincia',
      headerName: 'provincia',
      flex: 1,
      minWidth: 80,
    },
    {
      field: 'monto_total_solicitar',
      headerName: 'monto_total_solicitar',
      flex: 1,
      minWidth: 80,
    },

  ]



  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4"> {title} </Typography>

      {/*<Box*/}
      {/*  sx={{*/}
      {/*    mt: 5,*/}
      {/*    width: 1,*/}
      {/*    height: 320,*/}
      {/*    borderRadius: 2,*/}
      {/*    bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.04),*/}
      {/*    border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,*/}
      {/*  }}*/}
      {/*/>*/}

      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{p: 3}}>
            <Stack spacing={3}>
              <DataGrid
                rows={businessPartners}
                columns={baseColumns}
                pagination
                slots={{
                  toolbar: CustomToolbar,
                  noRowsOverlay: () => <EmptyContent title="No Data"/>,
                  noResultsOverlay: () => <EmptyContent title="No results found"/>,
                }}
              />
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarQuickFilter/>
      <Box sx={{flexGrow: 1}}/>
      <GridToolbarColumnsButton/>
      <GridToolbarFilterButton/>
      <GridToolbarDensitySelector/>
      <GridToolbarExport/>
    </GridToolbarContainer>
  );
}
