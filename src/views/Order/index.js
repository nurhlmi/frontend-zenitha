import React from "react";
import axios from "axios";
import {
   Container,
   Box,
   Typography,
   CircularProgress,
   // Snackbar,
   IconButton,
   CardContent,
   Card,
   TextField,
   InputAdornment,
   Grid,
   Button,
   Dialog,
   DialogContent,
   Link,
   Chip,
} from "@mui/material";
import { CloseRounded, FilterList, ListAltRounded, Search } from "@mui/icons-material";

import { apiUrl } from "../../variable/Url";
import { DateFormat, NumberFormat } from "../../components/Format";
import { Link as RouterLink } from "react-router-dom";
import { Status } from "../../components/Status";
import { authentication } from "../../store/Authentication";
import { useRecoilState } from "recoil";

export default function Order(props) {
   const token = localStorage.getItem("token");
   const [auth] = useRecoilState(authentication);

   const [data, setData] = React.useState();
   const [params, setParams] = React.useState({
      user_id: auth.user.id,
      limit_page: 1,
   });
   const getData = async () => {
      await axios
         .get(`${apiUrl}/transaction/fetch`, {
            params: params,
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
               <Typography variant="h6" fontWeight="bold" py={3}>
                  Daftar Transaksi
               </Typography>
               <Card>
                  <CardContent>
                     <Grid container spacing={2}>
                        <Grid item xs>
                           <TextField
                              name="search"
                              size="small"
                              placeholder="Cari transaksi"
                              autoComplete="off"
                              // onChange={handleSearch}
                              value={params.search}
                              InputProps={{
                                 sx: { fontSize: "default" },
                                 startAdornment: (
                                    <InputAdornment position="start">
                                       <Search />
                                    </InputAdornment>
                                 ),
                                 endAdornment: params.search !== "" && (
                                    <InputAdornment position="end">
                                       <IconButton onClick={() => setParams({ ...params, search: "" })}>
                                          <CloseRounded />
                                       </IconButton>
                                    </InputAdornment>
                                 ),
                              }}
                              fullWidth
                           />
                        </Grid>
                        <Grid item>
                           <Button variant="outlined" startIcon={<FilterList />} sx={{ borderColor: "rgba(0, 0, 0, 0.23)" }}>
                              Filter
                           </Button>
                        </Grid>
                     </Grid>
                     {data !== undefined ? (
                        data.data.length > 0 ? (
                           <Box sx={{ mt: 2 }}>
                              {data.data.map((value, index) => (
                                 <Card sx={{ mb: 2 }} key={index}>
                                    <CardContent key={index}>
                                       <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                          <Typography variant="caption" mr={2}>
                                             {DateFormat(value.created_at)}
                                          </Typography>
                                          <Chip label={Status(value.no_rek === null ? "pending_cod" : value.status)} size="small" variant="outlined" />
                                       </Box>
                                       <Grid container>
                                          <Grid item>
                                             <img alt={value.transaction_product.product_name} src={value.transaction_product.image} width="80" />
                                          </Grid>
                                          <Grid item xs>
                                             <Box sx={{ mx: 2, mb: 1, borderRight: "1px dashed #e0e0e0" }}>
                                                <Link component={RouterLink} to={`/product/${value.transaction_product.product_slug}`} underline="none">
                                                   <Typography noWrap>{value.transaction_product.product_name}</Typography>
                                                </Link>
                                                <Typography variant="caption" color="text.secondary">
                                                   {value.transaction_product.quantity} barang x {NumberFormat(value.transaction_product.price)}
                                                </Typography>
                                                {value.other_product !== 0 && (
                                                   <Typography variant="caption" color="text.secondary" component="div" mt={1}>
                                                      +{value.other_product} barang lainnya
                                                   </Typography>
                                                )}
                                             </Box>
                                          </Grid>
                                          <Grid item>
                                             <Box sx={{ textAlign: "right" }}>
                                                <Typography variant="body2">Total Belanja</Typography>
                                                <Typography variant="body2" fontWeight="bold" mb={2}>
                                                   {NumberFormat(value.transaction_product.price)}
                                                </Typography>
                                             </Box>
                                          </Grid>
                                       </Grid>
                                       <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                                          <Button variant="link" component={RouterLink} to={`/order/${value.id}`} sx={{ mr: 2 }}>
                                             Detail Transaksi
                                          </Button>
                                          <Button
                                             variant="outlined"
                                             sx={{ width: "100px" }}
                                             component={RouterLink}
                                             to={`/product/${value.transaction_product.product_slug}`}
                                          >
                                             Beli Lagi
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
                              <Typography mt={1}>Daftar transaksi kosong</Typography>
                           </Box>
                        )
                     ) : (
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                           <CircularProgress />
                        </Box>
                     )}
                  </CardContent>
               </Card>
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
         {/* <Snackbar
            open={snackbar}
            autoHideDuration={3000}
            onClose={() => setSnackbar(false)}
            message={message}
            action={
               <IconButton size="small" aria-label="close" color="inherit" onClick={() => setSnackbar(false)}>
                  <Close fontSize="small" />
               </IconButton>
            }
         /> */}
      </Container>
   );
}
