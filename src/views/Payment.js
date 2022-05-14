import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Box, Typography, CircularProgress, CardContent, Card, Grid, Tooltip, IconButton, Divider } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

import { apiUrl } from "../variable/Url";
import { DateFormat, TimeFormat, NumberFormat } from "../components/Format";
import { Link as RouterLink, useParams } from "react-router-dom";
import { Status } from "../components/Status";
import Countdown from "react-countdown";

export default function Payment(props) {
   const { id } = useParams();
   const token = localStorage.getItem("token");

   const [data, setData] = useState();
   const getData = async () => {
      await axios
         .get(`${apiUrl}/transaction/payment/show/${id}`, {
            headers: {
               Authorization: "Bearer " + token,
            },
         })
         .then((res) => {
            // console.log(res.data.data);
            setData(res.data.data);
         })
         .catch((xhr) => {
            console.log(xhr.response);
         });
   };

   useEffect(() => {
      getData();
      window.scrollTo(0, 0);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return (
      <Container sx={{ flex: 1 }}>
         <Grid container>
            <Grid item xs={12} md={1} />
            <Grid item xs={12} md={10}>
               <Box sx={{ display: "flex", alignItems: "center", py: 3 }}>
                  <Tooltip title="Kembali">
                     <IconButton component={RouterLink} to="/order">
                        <ArrowBack />
                     </IconButton>
                  </Tooltip>
                  <Typography variant="h6" fontWeight="bold" ml={1}>
                     Status Pembayaran
                  </Typography>
               </Box>
               {data !== undefined ? (
                  <Card>
                     <CardContent>
                        <Box sx={{ borderBottom: "5px solid #e0e0e0", pb: 2, mb: 3 }}>
                           <Typography variant="body2" color="text.secondary" gutterBottom>
                              Status
                           </Typography>
                           <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                              <Typography variant="body2" fontWeight="bold">
                                 {Status(data.status)}
                              </Typography>
                           </Box>
                           <Typography variant="body2" color="text.secondary" gutterBottom>
                              Batas Akhir Pembayaran
                           </Typography>
                           <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="body2" fontWeight="bold">
                                 {DateFormat(data.expired_time)}&nbsp;{TimeFormat(data.expired_time)}
                              </Typography>
                              <Typography variant="body2" fontWeight="bold" color="#fa591d">
                                 <Countdown date={new Date(data.expired_time).getTime() - 86400000 + 86400000} daysInHours={true} />
                              </Typography>
                           </Box>
                        </Box>
                        <Box>
                           <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <Typography variant="body1" fontWeight="bold">
                                 Transfer Bank BCA
                              </Typography>
                              <img alt="Logo Bank BCA" src="/assets/images/logos/bca.png" height="20px" />
                           </Box>
                           <Divider sx={{ my: 2 }} />
                           <Typography variant="body2" color="text.secondary" gutterBottom>
                              Total Belanja
                           </Typography>
                           <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                              <Typography variant="body2" fontWeight="bold">
                                 {NumberFormat(data.total - data.unique_code)}
                              </Typography>
                           </Box>
                           <Typography variant="body2" color="text.secondary" gutterBottom>
                              Kode Unik
                           </Typography>
                           <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                              <Typography variant="body2" fontWeight="bold">
                                 {data.unique_code}
                              </Typography>
                           </Box>
                           <Typography variant="body2" color="text.secondary" gutterBottom>
                              Total Pembayaran
                           </Typography>
                           <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="body1" fontWeight="bold" color="#fa591d">
                                 {NumberFormat(data.total)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" component={RouterLink} to="#">
                                 Lihat Detail
                              </Typography>
                           </Box>
                        </Box>
                     </CardContent>
                  </Card>
               ) : (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                     <CircularProgress />
                  </Box>
               )}
            </Grid>
         </Grid>
      </Container>
   );
}
