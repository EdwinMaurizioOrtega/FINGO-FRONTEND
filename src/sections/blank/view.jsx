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
import IconButton from '@mui/material/IconButton';
import axios, { endpoints } from '../../utils/axios';

// ----------------------------------------------------------------------

export function BlankView({ title = 'Blank' }) {

  const [businessPartners, setBusinessPartners] = useState([]);

  useEffect(() => {

    const BuscarPorRango = async () => {

      try {

        const response = await axios.get(endpoints.bank.registered_users);

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
    },
    {
      field: 'cedula_ruc',
      headerName: 'CÉDULA',
      flex: 1,
      minWidth: 160,
    },
    {
      field: 'created_at',
      headerName: 'CREADO',
      flex: 1,
      minWidth: 160,
    },
    {
      field: 'display_name',
      headerName: 'NOMBRE',
      flex: 1,
      minWidth: 250,
    },
    {
      field: 'email',
      headerName: 'EMAIL',
      flex: 1,
      minWidth: 300,
    },
    {
      field: 'terms_accepted',
      headerName: 'TÉRMINOS',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => {
        const value = params.value;
        return value ? 'Aceptado' : 'No aceptado';
      },
    },
    // {
    //   field: 'latitude',
    //   headerName: 'latitude',
    //   flex: 1,
    //   minWidth: 260,
    // },
    // {
    //   field: 'longitude',
    //   headerName: 'longitude',
    //   flex: 1,
    //   minWidth: 160,
    // },

    {
      field: 'location',
      headerName: 'UBICACIÓN',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        const latitude = params.row.latitude;
        const longitude = params.row.longitude;

        if (!latitude || !longitude) {
          return null; // No renderizar si falta algún valor
        }

        const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

        return (
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'blue', textDecoration: 'underline' }}
            title="Ver ubicación en Google Maps"
          >
            Ver en Google Maps
          </a>
        );
      },
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
