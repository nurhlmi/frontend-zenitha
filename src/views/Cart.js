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
import { Add, Remove, Close, DeleteOutlineRounded, ShoppingCartOutlined } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

import { useRecoilState } from "recoil";
import { carts } from "../store/Carts";
import { apiUrl } from "../variable/Url";
import { NumberFormat } from "../components/Format";

export default function Cart(props) {
   const token = localStorage.getItem("token");
   const [cart, setCart] = useRecoilState(carts);
   const [snackbar, setSnackbar] = React.useState(false);
   const [message, setMessage] = React.useState();
   const [data, setData] = React.useState();
   const [subTotal, setSubTotal] = React.useState(0);
   const [totalDiscount, setTotalDiscount] = React.useState(0);
   const [totalQuantity, setTotalQuantity] = React.useState(0);
   const [total, setTotal] = React.useState(0);

   const getData = async () => {
      await axios
         .get(`${apiUrl}/carts`, {
            headers: {
               Authorization: "Bearer " + token,
            },
         })
         .then((res) => {
            // console.log(res.data.data);
            setData(res.data.data);
            let subtotal = 0;
            let totaldiscount = 0;
            let totalquantity = 0;
            // eslint-disable-next-line array-callback-return
            res.data.data.map((value) => {
               subtotal += value.quantity * value.product_combination.price;
               if (value.product_combination.product.discount !== null) {
                  if (value.product_combination.product.discount_type === "rp") {
                     totaldiscount += value.quantity * value.product_combination.product.discount;
                  } else {
                     totaldiscount += value.quantity * (value.product_combination.price * (value.product_combination.product.discount / 100));
                  }
               }
               totalquantity += value.quantity;
            });
            setSubTotal(subtotal);
            setTotalDiscount(Math.round(totaldiscount));
            setTotalQuantity(totalquantity);
            setTotal(subtotal - totaldiscount);
         })
         .catch((err) => {
            console.log(err.response);
         });
   };

   const getDiscount = (price, discount, discount_type) => {
      let output = null;
      if (discount_type === "rp") {
         output = price - discount;
      } else {
         output = price - (price * discount) / 100;
      }
      return output;
   };
   const getPercent = (price, discount, discount_type) => {
      let output = null;
      if (discount_type === "rp") {
         output = Math.floor((discount / price) * 100);
      } else {
         output = discount;
      }
      return output;
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
               // setData(data.map((el) => (el.id === product_id ? { ...el, quantity } : el)));
               getData();
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
            // setData(data.filter(({ id }) => id !== product_id));
            getData();
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
         {data !== undefined ? (
            data.length > 0 ? (
               <React.Fragment>
                  <Typography variant="h6" py={3}>
                     Keranjang
                  </Typography>
                  <Grid container spacing={{ xs: 1, sm: 4 }}>
                     <Grid item xs={12} md={7} lg={8} sx={{ mb: 4 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                           <FormControlLabel control={<Checkbox size="small" disabled />} label="Pilih Semua" sx={{ ml: 0 }} />
                           {/* <Typography fontWeight="bold" sx={{ cursor: "pointer" }}>
                              Hapus
                           </Typography> */}
                        </Box>
                        {data.map((value, index) => (
                           <Box key={index}>
                              <Grid container alignItems="center" sx={{ borderTop: "4px solid #eee", mt: 1, pt: 2 }}>
                                 <Grid item>
                                    <Checkbox size="small" disabled />
                                 </Grid>
                                 <Grid item>
                                    <Box component={RouterLink} to={`/product/${value.product_combination.product_slug}`}>
                                       <img alt={value.product_name} src={value.product_image} width="80" />
                                    </Box>
                                 </Grid>
                                 <Grid item xs>
                                    <Box sx={{ ml: 1.5, mb: 1 }}>
                                       <Link component={RouterLink} to={`/product/${value.product_combination.product_slug}`} underline="none">
                                          <Typography noWrap>{value.product_name}</Typography>
                                       </Link>
                                       {value.product_combination.combination_string !== null && (
                                          <Typography variant="caption" color="text.secondary" noWrap>
                                             {value.product_combination.combination_string.replaceAll("-", ", ")}
                                          </Typography>
                                       )}
                                       <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                                          {value.product_combination.product.discount !== null && (
                                             <React.Fragment>
                                                <Box sx={{ display: "inline", background: "#ffeaef", borderRadius: 0.5, px: 0.5, pb: 0.4, mr: 1 }}>
                                                   <Typography variant="caption" color="#ff5c84" fontWeight="bold">
                                                      {getPercent(
                                                         value.product_combination.price,
                                                         value.product_combination.product.discount,
                                                         value.product_combination.product.discount_type
                                                      )}
                                                      %
                                                   </Typography>
                                                </Box>
                                                <Typography variant="caption" color="text.secondary" mr={1}>
                                                   <del>{NumberFormat(value.product_combination.price)}</del>
                                                </Typography>
                                             </React.Fragment>
                                          )}
                                          <Typography variant="subtitle2" component="div" fontWeight="bold">
                                             {value.product_combination.product.discount !== null
                                                ? NumberFormat(
                                                     getDiscount(
                                                        value.product_combination.price,
                                                        value.product_combination.product.discount,
                                                        value.product_combination.product.discount_type
                                                     )
                                                  )
                                                : NumberFormat(value.product_combination.price)}
                                          </Typography>
                                       </Box>
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
                                 <Typography color="text.secondary">Total Harga ({totalQuantity} Barang)</Typography>
                                 <Typography color="text.secondary">{NumberFormat(subTotal)}</Typography>
                              </Box>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                 <Typography color="text.secondary">Total Diskon Barang</Typography>
                                 <Typography color="text.secondary">-{NumberFormat(totalDiscount)}</Typography>
                              </Box>
                              <Divider />
                              <Box sx={{ display: "flex", justifyContent: "space-between", my: 2 }}>
                                 <Typography fontWeight="bold">Total Harga</Typography>
                                 <Typography fontWeight="bold">{NumberFormat(total)}</Typography>
                              </Box>
                              <Button variant="contained" size="large" component={RouterLink} to="/checkout" fullWidth>
                                 Beli ({totalQuantity})
                              </Button>
                           </CardContent>
                        </Card>
                     </Grid>
                  </Grid>
               </React.Fragment>
            ) : (
               <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", height: "60vh", color: "text.secondary" }}>
                  <ShoppingCartOutlined fontSize="large" />
                  <Typography mt={1}>Keranjang kosong</Typography>
               </Box>
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
