import React from "react";
import axios from "axios";
import {
   Container,
   Box,
   Typography,
   Link,
   Grid,
   ButtonGroup,
   Button,
   FormControlLabel,
   Checkbox,
   Card,
   CardContent,
   Tooltip,
   IconButton,
   Divider,
   Snackbar,
   CircularProgress,
} from "@mui/material";
import { Add, Remove, Close, DeleteOutlineRounded } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

import { useRecoilState } from "recoil";
import { carts } from "../store/Authentication";
import { apiUrl } from "../variable/Url";
import { NumberFormat } from "../components/Format";

export default function Category(props) {
   const token = localStorage.getItem("token");
   const [cart, setCart] = useRecoilState(carts);
   const [loading, setLoading] = React.useState(true);
   const [snackbar, setSnackbar] = React.useState(false);
   const [message, setMessage] = React.useState();
   const [data, setData] = React.useState([]);

   const getData = async () => {
      await axios
         .get(`${apiUrl}/carts`, {
            headers: {
               Authorization: "Bearer " + token,
            },
         })
         .then((res) => {
            console.log(res.data.data);
            setData(res.data.data);
            setLoading(false);
         })
         .catch((err) => {
            console.log(err.response);
         });
   };

   React.useEffect(() => {
      getData();
      window.scrollTo(0, 0);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const handleQuantity = async (product_id, quantity, stock, type) => {
      if (quantity >= 1 && quantity <= stock) {
         await axios
            .patch(
               `${apiUrl}/carts/update_quantity/${product_id}`,
               {
                  quantity: quantity,
               },
               {
                  headers: {
                     Authorization: "Bearer " + token,
                  },
               }
            )
            .then((res) => {
               // console.log(res.data.data);
               setData(data.map((el) => (el.id === product_id ? { ...el, quantity } : el)));
               setCart({
                  ...cart,
                  total: type === "decrease" ? cart.total - 1 : cart.total + 1,
               });
            })
            .catch((err) => {
               console.log(err.response);
            });
      }
   };

   const handleDelete = async (product_id, quantity) => {
      await axios
         .delete(`${apiUrl}/carts/delete/${product_id}`, {
            headers: {
               Authorization: "Bearer " + token,
            },
         })
         .then((res) => {
            // console.log(res.data.data);
            setData(data.filter(({ id }) => id !== product_id));
            let total = cart.total - quantity;
            setCart({
               ...cart,
               total: total,
            });
            setSnackbar(true);
            setMessage("1 barang telah dihapus");
         })
         .catch((err) => {
            console.log(err.response);
         });
   };

   const action = (
      <IconButton size="small" aria-label="close" color="inherit" onClick={() => setSnackbar(false)}>
         <Close fontSize="small" />
      </IconButton>
   );

   return (
      <Container sx={{ flex: 1 }}>
         {loading === false ? (
            data.length > 0 ? (
               <>
                  <Typography variant="h6" py={3}>
                     Keranjang
                  </Typography>
                  <Grid container spacing={{ xs: 1, sm: 4 }}>
                     <Grid item xs={12} md={7} sx={{ mb: 4 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                           <FormControlLabel control={<Checkbox size="small" />} label="Pilih Semua" sx={{ ml: 0 }} />
                           <Typography fontWeight="bold" sx={{ cursor: "pointer" }}>
                              Hapus
                           </Typography>
                        </Box>
                        {data.map((value, index) => (
                           <Box key={index}>
                              <Grid container alignItems="center" sx={{ borderTop: "4px solid #eee", mt: 1, pt: 2 }}>
                                 <Grid item>
                                    <Checkbox size="small" />
                                 </Grid>
                                 <Grid item>
                                    <Box component={RouterLink} to={`/product/${value.product_combination.product_slug}`}>
                                       <img alt={value.product_name} src={value.product_image} width="80" />
                                    </Box>
                                 </Grid>
                                 <Grid item xs>
                                    <Box sx={{ ml: 1.5 }}>
                                       <Link component={RouterLink} to={`/product/${value.product_combination.product_slug}`} underline="none">
                                          <Typography noWrap>{value.product_name}</Typography>
                                       </Link>
                                       {value.product_combination.combination_string !== null && (
                                          <Typography variant="caption" color="text.secondary" noWrap>
                                             {value.product_combination.combination_string.replaceAll("-", " ")}
                                          </Typography>
                                       )}
                                       <Typography variant="subtitle2" component="div" fontWeight="bold" mt={1}>
                                          {NumberFormat(value.product_combination.price)}
                                          {/* {value.discount !== null ? `Rp${value.discount_price}` : `Rp${value.price}`} */}
                                       </Typography>
                                       {/* {value.discount !== null && (
                                       <React.Fragment>
                                          <Box sx={{ display: "inline", background: "#ffeaef", borderRadius: 0.5, px: 0.5, pb: 0.4, mr: 1 }}>
                                             <Typography variant="caption" color="#ff5c84" fontWeight="bold">
                                                {value.discount}
                                             </Typography>
                                          </Box>
                                          <Typography variant="caption" color="text.secondary">
                                             <del>Rp{value.price}</del>
                                          </Typography>
                                       </React.Fragment>
                                    )} */}
                                    </Box>
                                 </Grid>
                              </Grid>
                              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", py: 1 }}>
                                 <Tooltip title="Hapus">
                                    <IconButton onClick={() => handleDelete(value.id, value.quantity)}>
                                       <DeleteOutlineRounded />
                                    </IconButton>
                                 </Tooltip>
                                 <ButtonGroup sx={{ ml: 1 }}>
                                    <Button
                                       aria-label="decrease"
                                       onClick={() => handleQuantity(value.id, value.quantity - 1, value.product_combination.stock, "decrease")}
                                       size="small"
                                    >
                                       <Remove fontSize="small" />
                                    </Button>
                                    <Button size="small">{value.quantity}</Button>
                                    <Button
                                       aria-label="increase"
                                       onClick={() => handleQuantity(value.id, value.quantity + 1, value.product_combination.stock, "increase")}
                                       size="small"
                                    >
                                       <Add fontSize="small" />
                                    </Button>
                                 </ButtonGroup>
                              </Box>
                           </Box>
                        ))}
                     </Grid>
                     <Grid item xs={12} md={5} lg={4}>
                        <Card>
                           <CardContent>
                              <Typography fontWeight="bold">Ringkasan Belanja</Typography>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                                 <Typography color="text.secondary">Total Harga (2 Barang)</Typography>
                                 <Typography color="text.secondary">Rp318.000</Typography>
                              </Box>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                 <Typography color="text.secondary">Total Diskon Barang</Typography>
                                 <Typography color="text.secondary">-Rp64.000</Typography>
                              </Box>
                              <Divider />
                              <Box sx={{ display: "flex", justifyContent: "space-between", my: 2 }}>
                                 <Typography fontWeight="bold">Total Harga</Typography>
                                 <Typography fontWeight="bold">Rp254.000</Typography>
                              </Box>
                              <Button variant="contained" size="large" fullWidth>
                                 Beli (2)
                              </Button>
                           </CardContent>
                        </Card>
                     </Grid>
                  </Grid>
               </>
            ) : (
               <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>Keranjang Kosong</Box>
            )
         ) : (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
               <CircularProgress />
            </Box>
         )}
         <Snackbar open={snackbar} autoHideDuration={3000} onClose={() => setSnackbar(false)} message={message} action={action} />
      </Container>
   );
}
