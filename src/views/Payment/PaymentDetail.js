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
   Tooltip,
   IconButton,
   Divider,
   Snackbar,
   Button,
   FormControl,
   Dialog,
   DialogContent,
   DialogActions,
} from "@mui/material";
import { ArrowBack, ContentCopy, ImageOutlined } from "@mui/icons-material";

import { apiUrl } from "../../variable/Url";
import { DateFormat, TimeFormat, NumberFormat } from "../../components/Format";
import { PaymentStatus } from "../../components/PaymentStatus";
import { Link as RouterLink, useParams } from "react-router-dom";
import Countdown from "react-countdown";

let stagingBox = {
   color: "#000",
   border: "1px solid #eee",
   display: "inline-block",
   maxWidth: "100%",
   cursor: "pointer",
   borderRadius: 1,
   p: 1,
};

export default function PaymentDetail(props) {
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
            // console.log(xhr.response);
         });
   };

   useEffect(() => {
      getData();
      window.scrollTo(0, 0);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const [message, setMessage] = useState();
   const [snackbar, setSnackbar] = useState(false);
   const handleSnackbar = () => {
      setSnackbar(!snackbar);
   };

   const handleEvidence = async (e) => {
      if (e.target.files[0] !== undefined) {
         let formData = new FormData();
         formData.append("evidence", e.target.files[0]);
         await axios
            .post(`${apiUrl}/transaction/payment/upload_evidence/${id}`, formData, {
               headers: {
                  Authorization: "Bearer " + token,
               },
            })
            .then((res) => {
               // console.log(res.data.data);
               setData({
                  ...data,
                  evidence: res.data.data.evidence,
               });
               setMessage("Bukti pembayaran telah dikirim");
               handleSnackbar();
            })
            .catch((xhr) => {
               // console.log(xhr.response);
            });
      }
   };

   const [preview, setPreview] = useState();
   const handlePreview = (e) => {
      setPreview(e);
      handleDialog();
   };

   const [dialog, setDialog] = useState(false);
   const handleDialog = () => {
      setDialog(!dialog);
   };

   const handleCopy = (value, type) => {
      // window.clipboardData.setData("Text", value);
      navigator.clipboard.writeText(value);
      if (type === "no_rek") {
         setMessage("Nomor rekening telah disalin");
      } else if (type === "total") {
         setMessage("Total pembayaran telah disalin");
      }
      handleSnackbar();
   };

   return (
      <Container sx={{ flex: 1 }}>
         <Grid container>
            <Grid item xs={12} md={1} />
            <Grid item xs={12} md={10}>
               <Box sx={{ display: "flex", alignItems: "center", py: 3 }}>
                  <Tooltip title="Kembali">
                     <IconButton component={RouterLink} to="/payment">
                        <ArrowBack />
                     </IconButton>
                  </Tooltip>
                  <Typography variant="h6" fontWeight="bold" ml={1}>
                     Status Pembayaran
                  </Typography>
               </Box>
               {data !== undefined ? (
                  <Grid container justifyContent="center" spacing={2}>
                     <Grid item xs={12} md={8} lg={7}>
                        <Card sx={{ mb: 2 }}>
                           <CardContent>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                 Status
                              </Typography>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                 <Typography variant="body2">{PaymentStatus(data.status)}</Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                 Bayar Sebelum
                              </Typography>
                              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                 <Typography variant="body2">
                                    {DateFormat(data.expired_time)}&nbsp;{TimeFormat(data.expired_time)}
                                 </Typography>
                                 <Typography variant="body2" fontWeight="bold" color="#fa591d">
                                    <Countdown date={new Date(data.expired_time).getTime() - 86400000 + 86400000} daysInHours={true} />
                                 </Typography>
                              </Box>
                           </CardContent>
                        </Card>
                        <Card>
                           <CardContent>
                              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                 <Typography variant="body1">Transfer Bank {data.bank_name}</Typography>
                                 <img alt="Logo Bank" src={`/assets/images/logos/${data.bank_name.toLowerCase()}.png`} height="20px" />
                              </Box>
                              <Divider sx={{ my: 2 }} />
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                 Nomor Rekening
                              </Typography>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                 <Typography variant="body2">{data.no_rek}</Typography>
                                 <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => handleCopy(data.no_rek, "no_rek")}>
                                    <Typography variant="caption" fontWeight="bold" pr={1}>
                                       Salin
                                    </Typography>
                                    <ContentCopy fontSize="small" />
                                 </Box>
                              </Box>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                 Total Belanja
                              </Typography>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                 <Typography variant="body2">{NumberFormat(data.total - data.unique_code)}</Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                 Kode Unik
                              </Typography>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                 <Typography variant="body2">{data.unique_code}</Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                 Total Pembayaran
                              </Typography>
                              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                 <Typography variant="body1" fontWeight="bold" color="#fa591d">
                                    {NumberFormat(data.total)}
                                 </Typography>
                                 <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => handleCopy(data.total, "total")}>
                                    <Typography variant="caption" fontWeight="bold" pr={1}>
                                       Salin
                                    </Typography>
                                    <ContentCopy fontSize="small" />
                                 </Box>
                              </Box>
                              {data.evidence === null ? (
                                 <FormControl margin="normal" fullWidth>
                                    <Button variant="outlined" size="large" component="label">
                                       Kirim Bukti Pembayaran
                                       <input name="evidence" type="file" accept="image/*" hidden onChange={handleEvidence} />
                                    </Button>
                                 </FormControl>
                              ) : (
                                 <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                       Bukti Pembayaran
                                    </Typography>
                                    <Box sx={stagingBox}>
                                       <Box sx={{ display: "flex", alignItems: "center" }}>
                                          <ImageOutlined fontSize="small" />
                                          <Tooltip
                                             title={data.evidence.evidence_url.substring(data.evidence.evidence_url.lastIndexOf("/") + 1)}
                                             onClick={() => handlePreview(data.evidence.evidence_url)}
                                          >
                                             <Typography variant="body2" sx={{ flex: 1 }} mx={1} noWrap>
                                                {data.evidence.evidence_url.substring(data.evidence.evidence_url.lastIndexOf("/") + 1)}
                                             </Typography>
                                          </Tooltip>
                                       </Box>
                                    </Box>
                                 </Box>
                              )}
                           </CardContent>
                        </Card>
                     </Grid>
                  </Grid>
               ) : (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                     <CircularProgress />
                  </Box>
               )}
            </Grid>
         </Grid>
         <Dialog open={dialog} onClose={handleDialog} scroll="paper">
            <DialogContent>
               <img alt="Preview" src={preview} width="100%" />
            </DialogContent>
            <Divider />
            <DialogActions>
               <Button onClick={handleDialog}>Tutup</Button>
            </DialogActions>
         </Dialog>
         <Snackbar open={snackbar} autoHideDuration={3000} onClose={handleSnackbar} message={message} />
      </Container>
   );
}
