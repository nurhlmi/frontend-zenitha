import React from "react";
import axios from "axios";
import { Container, Box, Typography, CircularProgress, IconButton, CardContent, Card, Grid, Button, Dialog, DialogContent, Tooltip } from "@mui/material";
import { ArrowBack, CloseRounded, ListAltRounded } from "@mui/icons-material";

import { apiUrl } from "../../variable/Url";
import { DateFormat, NumberFormat, TimeFormat } from "../../components/Format";
import { Link as RouterLink } from "react-router-dom";
import { authentication } from "../../store/Authentication";
import { useRecoilState } from "recoil";

export default function Payment(props) {
   const token = localStorage.getItem("token");
   const [auth] = useRecoilState(authentication);

   const [data, setData] = React.useState();
   const getData = async () => {
      await axios
         .get(`${apiUrl}/transaction/payment`, {
            params: {
               user_id: auth.user.id,
               status: "process",
            },
            headers: {
               Authorization: "Bearer " + token,
            },
         })
         .then((res) => {
            console.log(res.data);
            setData(res.data);
         })
         .catch((xhr) => {
            console.log(xhr.response);
         });
   };

   React.useEffect(() => {
      getData();
      window.scrollTo(0, 0);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const [dialog, setDialog] = React.useState(false);
   const handleDialog = () => {
      setDialog(!dialog);
   };

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
                     Menunggu Pembayaran
                  </Typography>
               </Box>
               {data !== undefined ? (
                  data.data.length > 0 ? (
                     <Box sx={{ mb: 2 }}>
                        {data.data.map((value, index) => (
                           <Card sx={{ mb: 2 }} key={index}>
                              <CardContent key={index}>
                                 <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                    <Typography variant="caption" mr={2}>
                                       {DateFormat(value.created_at)}
                                    </Typography>
                                 </Box>
                                 <Grid container>
                                    <Grid item xs>
                                       <Box sx={{ mr: 2, borderRight: "1px dashed #e0e0e0" }}>
                                          <Typography variant="body2" color="text.secondary">
                                             Bayar Sebelum
                                          </Typography>
                                          <Typography variant="body2" fontWeight="bold" mb={2}>
                                             {DateFormat(value.expired_time)}&nbsp;{TimeFormat(value.expired_time)}
                                          </Typography>
                                       </Box>
                                    </Grid>
                                    <Grid item>
                                       <Box sx={{ textAlign: "right" }}>
                                          <Typography variant="body2" color="text.secondary">
                                             Total Pembayaran
                                          </Typography>
                                          <Typography variant="body2" fontWeight="bold" mb={2}>
                                             {NumberFormat(value.total)}
                                          </Typography>
                                       </Box>
                                    </Grid>
                                 </Grid>
                                 <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                                    <Button variant="outlined" component={RouterLink} to={`/payment/${value.id}`}>
                                       Lihat Detail
                                    </Button>
                                 </Box>
                              </CardContent>
                           </Card>
                        ))}
                     </Box>
                  ) : (
                     <Box
                        sx={{
                           display: "flex",
                           justifyContent: "center",
                           alignItems: "center",
                           flexDirection: "column",
                           height: "60vh",
                           color: "text.secondary",
                        }}
                     >
                        <ListAltRounded fontSize="large" />
                        <Typography mt={1}>Belum ada transaksi</Typography>
                     </Box>
                  )
               ) : (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                     <CircularProgress />
                  </Box>
               )}
            </Grid>
         </Grid>
         <Dialog open={dialog} onClose={handleDialog} maxWidth="xs" fullWidth>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1, pl: 3, pr: 1 }}>
               <Typography variant="subtitle1" fontWeight="bold">
                  Filter
               </Typography>
               <IconButton onClick={handleDialog}>
                  <CloseRounded />
               </IconButton>
            </Box>
            <DialogContent sx={{ minHeight: "65vh" }} dividers></DialogContent>
         </Dialog>
      </Container>
   );
}
