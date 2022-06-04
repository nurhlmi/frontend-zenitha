import React, { useEffect, useState } from "react";
import axios from "axios";
import {
   Container,
   Box,
   Typography,
   CircularProgress,
   CardContent,
   Card,
   Grid,
   Button,
   Tooltip,
   IconButton,
   Dialog,
   DialogContent,
   DialogActions,
   Stepper,
   Step,
   StepLabel,
   StepContent,
} from "@mui/material";
import { ArrowBack, Circle, CloseRounded } from "@mui/icons-material";

import { apiUrl } from "../../variable/Url";
import { DateFormat, TimeFormat, NumberFormat } from "../../components/Format";
import { Link as RouterLink, useParams } from "react-router-dom";
import { Status } from "../../components/Status";
import { authentication } from "../../store/Authentication";
import { useRecoilState } from "recoil";

export default function OrderDetail(props) {
   const { id } = useParams();
   const token = localStorage.getItem("token");
   const [auth] = useRecoilState(authentication);

   const [data, setData] = useState();
   const [totalQuantity, setTotalQuantity] = useState(0);
   const [totalPrice, setTotalPrice] = useState(0);
   const getData = async () => {
      await axios
         .get(`${apiUrl}/transaction/show/${id}`, {
            headers: {
               Authorization: "Bearer " + token,
            },
         })
         .then((res) => {
            // console.log(res.data.data);
            setData(res.data.data);
            let quantity = 0;
            let price = 0;
            // eslint-disable-next-line array-callback-return
            res.data.data.transaction_product.map((value) => {
               quantity = quantity + value.quantity;
               price = price + (value.price - value.discount_product - value.discount_group - value.discount_customer);
            });
            setTotalQuantity(quantity);
            setTotalPrice(price);
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

   const [tracking, setTracking] = useState();
   const [trackingDialog, setTrackingDialog] = useState(false);
   const handleTrackingDialog = async () => {
      setTracking(undefined);
      setTrackingDialog(!trackingDialog);
      if (trackingDialog === false) {
         let formData = new FormData();
         formData.append("courier", data?.expedition);
         formData.append("waybill", data?.number_resi);
         // console.log(Object.fromEntries(formData));
         await axios
            .post(`${apiUrl}/shipping/waybill`, formData, {
               headers: {
                  Authorization: "Bearer " + token,
               },
            })
            .then((res) => {
               // console.log(res);
               setTracking(res.data.rajaongkir.result.manifest);
            })
            .catch((xhr) => {
               console.log(xhr.response);
            });
      }
   };

   const CustomStepIcon = (index) => {
      return (
         <Typography color={index + 1 !== tracking.length ? "text.secondary" : "#fa591d"}>
            <Circle />
         </Typography>
      );
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
                     Detail Transaksi
                  </Typography>
               </Box>
               {data !== undefined ? (
                  <Card>
                     <CardContent>
                        <Box sx={{ borderBottom: "5px solid #e0e0e0", pb: 2, mb: 3 }}>
                           <Box sx={{ borderBottom: "1px dashed #e0e0e0", pb: 2, mb: 2 }}>
                              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                 <Typography variant="body2" fontWeight="bold" gutterBottom>
                                    {Status(data.payment_method === "cod" ? "pending_cod" : data.status)}
                                 </Typography>
                                 {data.number_resi !== null && (
                                    <Typography variant="body2" fontWeight="bold" onClick={handleTrackingDialog}>
                                       Lacak
                                    </Typography>
                                 )}
                              </Box>
                              {data.status === "pending" &&
                                 data.payment_method !== "cod" &&
                                 data.payment.map((value, index) => (
                                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }} key={index}>
                                       <Typography variant="body2" color="text.secondary">
                                          Pembayaran
                                       </Typography>
                                       <Typography variant="body2" color="text.secondary" component={RouterLink} to={`/payment/${value.id}`}>
                                          Cek Status Pembayaran
                                       </Typography>
                                    </Box>
                                 ))}
                           </Box>
                           <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                 No. Invoice
                              </Typography>
                              <Typography variant="body2">INV/{data.invoice_number}</Typography>
                           </Box>
                           <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                 Tanggal Pembelian
                              </Typography>
                              <Typography variant="body2">
                                 {DateFormat(data.created_at)}, {TimeFormat(data.created_at)}
                              </Typography>
                           </Box>
                        </Box>
                        <Box sx={{ borderBottom: "5px solid #e0e0e0", pb: 2, mb: 3 }}>
                           <Typography variant="body2" fontWeight="bold" mt={1} mb={2}>
                              Detail Produk
                           </Typography>
                           {data.transaction_product.map((value, index) => (
                              <Card sx={{ mb: 2 }} key={index}>
                                 <CardContent>
                                    <Grid container>
                                       <Grid item>
                                          <img alt={value.product_name} src={value.image} width="50" />
                                       </Grid>
                                       <Grid item xs>
                                          <Box sx={{ px: 2 }}>
                                             <Typography variant="body2">{value.product_name}</Typography>
                                             <Typography variant="caption" color="text.secondary">
                                                {/* {value.quantity} x {NumberFormat(value.price - value.discount)} */}
                                                {value.quantity} x {NumberFormat(value.price - value.discount_product)}
                                             </Typography>
                                             <Box sx={{ my: 1 }}>
                                                {value.discount_group !== 0 && (
                                                   <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                                      <Typography variant="caption" color="text.secondary">
                                                         Diskon {auth.user.role}
                                                      </Typography>
                                                      <Typography variant="caption" color="text.secondary">
                                                         -{NumberFormat(value.discount_group)}
                                                      </Typography>
                                                   </Box>
                                                )}
                                                {value.discount_customer !== 0 && (
                                                   <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                                                      <Typography variant="caption" color="text.secondary">
                                                         Diskon pelanggan
                                                      </Typography>
                                                      <Typography variant="caption" color="text.secondary">
                                                         -{NumberFormat(value.discount_customer)}
                                                      </Typography>
                                                   </Box>
                                                )}
                                             </Box>
                                          </Box>
                                       </Grid>
                                       <Grid item>
                                          <Box sx={{ pl: 3, borderLeft: "1px dashed #e0e0e0", textAlign: "right" }}>
                                             <Typography variant="body2">Total Harga</Typography>
                                             <Typography variant="body2" fontWeight="bold" mb={2}>
                                                {NumberFormat(
                                                   (value.price - value.discount_product - value.discount_group - value.discount_customer) * value.quantity
                                                )}
                                             </Typography>
                                             <Button variant="outlined" sx={{ width: "100px" }} component={RouterLink} to={`/product/${value.product_slug}`}>
                                                Beli Lagi
                                             </Button>
                                          </Box>
                                       </Grid>
                                    </Grid>
                                 </CardContent>
                              </Card>
                           ))}
                        </Box>
                        <Box sx={{ borderBottom: "5px solid #e0e0e0", pb: 3, mb: 3 }}>
                           <Typography variant="body2" fontWeight="bold" mt={1} mb={2}>
                              Info Pengiriman
                           </Typography>
                           <table>
                              <tbody>
                                 <tr>
                                    <td>
                                       <Typography variant="body2" color="text.secondary">
                                          Kurir
                                       </Typography>
                                    </td>
                                    <td>:</td>
                                    <td>
                                       <Typography variant="body2">{data.expedition_service}</Typography>
                                    </td>
                                 </tr>
                                 <tr>
                                    <td>
                                       <Typography variant="body2" color="text.secondary">
                                          No. Resi
                                       </Typography>
                                    </td>
                                    <td>:</td>
                                    <td>
                                       <Typography variant="body2">{data.number_resi !== null ? data.number_resi : "-"}</Typography>
                                    </td>
                                 </tr>
                                 <tr>
                                    <td>
                                       <Typography variant="body2" color="text.secondary">
                                          Alamat
                                       </Typography>
                                    </td>
                                    <td>:</td>
                                    <td>
                                       <Typography variant="body2">{data.address}</Typography>
                                    </td>
                                 </tr>
                              </tbody>
                           </table>
                        </Box>
                        <Box>
                           <Typography variant="body2" fontWeight="bold" mb={2}>
                              Rincian Pembayaran
                           </Typography>
                           <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed #e0e0e0", pb: 2, mb: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                 Metode Pembayaran
                              </Typography>
                              <Typography variant="body2">
                                 {data.payment_method === "cod" ? "COD (Bayar di Tempat)" : `Transfer Bank ${data.bank_name}`}
                              </Typography>
                           </Box>
                           <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                 Total Harga ({totalQuantity} Barang)
                              </Typography>
                              <Typography variant="body2">{NumberFormat(totalPrice)}</Typography>
                           </Box>
                           <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                 Total Ongkos Kirim
                              </Typography>
                              <Typography variant="body2">{NumberFormat(data.shipping_cost)}</Typography>
                           </Box>
                           {data.shipping_discount > 0 && (
                              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                 <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Diskon Ongkos Kirim
                                 </Typography>
                                 <Typography variant="body2">-{NumberFormat(data.shipping_discount)}</Typography>
                              </Box>
                           )}
                           <Box sx={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed #e0e0e0", pt: 2, mt: 2 }}>
                              <Typography variant="body2" fontWeight="bold">
                                 Total Belanja
                              </Typography>
                              <Typography variant="body1" fontWeight="bold">
                                 {NumberFormat(totalPrice + data.shipping_cost - data.shipping_discount)}
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
         <Dialog open={trackingDialog} maxWidth="xs" fullWidth>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 2, pl: 3, pr: 1 }}>
               <Typography variant="subtitle1" fontWeight="bold">
                  Lacak
               </Typography>
               <IconButton onClick={handleTrackingDialog}>
                  <CloseRounded />
               </IconButton>
            </Box>
            <DialogContent sx={{ minHeight: "65vh" }} dividers>
               {tracking !== undefined ? (
                  <Stepper orientation="vertical" activeStep={tracking.length - 1}>
                     {tracking.map((value, index) => (
                        <Step active={true} key={index}>
                           <StepLabel StepIconComponent={() => CustomStepIcon(index)}>
                              <Typography variant="caption" color={index + 1 !== tracking.length && "text.secondary"}>
                                 {DateFormat(value.manifest_date)}, {value.manifest_time} WIB
                              </Typography>
                           </StepLabel>
                           <StepContent>
                              <Typography variant="caption" color={index + 1 !== tracking.length && "text.secondary"}>
                                 {value.manifest_description}
                              </Typography>
                           </StepContent>
                        </Step>
                     ))}
                  </Stepper>
               ) : (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                     <CircularProgress />
                  </Box>
               )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: "space-between", alignItems: "end", my: 1, mx: 2 }}>
               <Box></Box>
               <Button variant="contained" sx={{ minWidth: { xs: 0, sm: "10rem" }, mb: 0.5 }} onClick={handleTrackingDialog}>
                  Tutup
               </Button>
            </DialogActions>
         </Dialog>
      </Container>
   );
}
