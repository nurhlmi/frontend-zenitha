import React from "react";
import axios from "axios";
import {
   AppBar,
   Container,
   Box,
   Typography,
   Grid,
   Button,
   Card,
   CardContent,
   IconButton,
   Divider,
   CircularProgress,
   MenuItem,
   Tooltip,
   TextField,
   Menu,
   ListItemText,
   ListItemIcon,
   Dialog,
   DialogContent,
   DialogActions,
   FormControl,
   RadioGroup,
   FormControlLabel,
   Radio,
} from "@mui/material";
import { ArrowBackRounded, Check, CloseRounded, GppGoodOutlined } from "@mui/icons-material";

import { apiUrl } from "../variable/Url";
import { NumberFormat } from "../components/Format";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authentication } from "../store/Authentication";
import { carts } from "../store/Carts";
import { LoadingButton } from "@mui/lab";

export default function Checkout(props) {
   const navigate = useNavigate();
   const token = localStorage.getItem("token");
   const [auth] = useRecoilState(authentication);
   const [totalCart, setTotalCart] = useRecoilState(carts);

   const [setting, setSetting] = React.useState();
   const getSetting = async () => {
      await axios
         .get(`${apiUrl}/setting`, {
            headers: {
               Authorization: "Bearer " + token,
            },
         })
         .then((res) => {
            // console.log(res.data.data);
            setSetting(res.data.data);
         });
   };

   const [address, setAddress] = React.useState();
   const getAddress = async () => {
      await axios
         .get(`${apiUrl}/user/address/fetch`, {
            params: {
               user_id: auth.user.id,
            },
            headers: {
               Authorization: "Bearer " + token,
            },
         })
         .then((res) => {
            // console.log(res.data.data);
            if (res.data.data.length > 0) {
               setAddress(res.data.data);
               // setCurrentAddress(res.data.data[0]);
               setData({
                  ...data,
                  address: res.data.data[0],
               });
            } else {
               navigate(`/settings/address?redirect=${encodeURIComponent("/checkout")}`);
            }
         });
   };

   const [cart, setCart] = React.useState();
   const [productPrice, setProductPrice] = React.useState(0);
   const [productDiscount, setProductDiscount] = React.useState(0);
   const [productQuantity, setProductQuantity] = React.useState(0);
   const [productWeight, setProductWeight] = React.useState(0);
   const [totalPrice, setTotalPrice] = React.useState(0);
   const getCart = async () => {
      await axios
         .get(`${apiUrl}/carts`, {
            headers: {
               Authorization: "Bearer " + token,
            },
         })
         .then((res) => {
            // console.log(res.data.data);
            setCart(res.data.data);
            if (res.data.data.length > 0) {
               let productprice = 0;
               let productdiscount = 0;
               let productquantity = 0;
               let productweight = 0;
               // eslint-disable-next-line array-callback-return
               res.data.data.map((value) => {
                  if (value.product_combination.status === "active") {
                     productprice += value.quantity * value.product_combination.price;
                     if (value.product_combination.product.discount !== null) {
                        if (value.product_combination.product.discount_type === "rp") {
                           productdiscount += value.quantity * value.product_combination.product.discount;
                        } else {
                           productdiscount += value.quantity * (value.product_combination.price * (value.product_combination.product.discount / 100));
                        }
                     }
                     productquantity += value.quantity;
                     if (value.product_combination.product.weight_unit === "kg") {
                        productweight += value.quantity * (value.product_combination.product.product_weight * 1000);
                     } else {
                        productweight += value.quantity * value.product_combination.product.product_weight;
                     }
                  }
               });
               setProductPrice(productprice);
               setProductDiscount(Math.round(productdiscount));
               setProductQuantity(productquantity);
               setProductWeight(productweight);
               setTotalPrice(productprice - productdiscount);
            } else {
               navigate("/cart");
            }
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

   const [courier, setCourier] = React.useState();
   const getCourier = async () => {
      await axios
         .get(`${apiUrl}/courier/fetch`, {
            params: {
               active: "yes",
            },
            headers: {
               Authorization: "Bearer " + token,
            },
         })
         .then((res) => {
            // console.log(res.data.data);
            setCourier(res.data.data);
         });
   };

   const [loading, setLoading] = React.useState(false);
   const [disabled, setDisabled] = React.useState(true);
   const [shipping, setShipping] = React.useState({
      name: null,
      service: null,
      cost: 0,
      etd: null,
      note: null,
      description: null,
   });
   const [listShippingCost, setListShippingCost] = React.useState();
   const getShippingCost = async (courier) => {
      setDisabled(true);
      setShipping({
         ...shipping,
         name: null,
         cost: 0,
      });
      let formData = new FormData();
      formData.append("origin", data.address.district.id);
      formData.append("originType", "subdistrict");
      formData.append("destination", setting.district.id);
      formData.append("destinationType", "subdistrict");
      formData.append("weight", productWeight);
      formData.append("courier", courier);
      await axios
         .post(`${apiUrl}/shipping/cost`, formData, {
            headers: {
               Authorization: "Bearer " + token,
            },
         })
         .then((res) => {
            let value = res.data.rajaongkir;
            // console.log(value);
            setListShippingCost(value.results[0].costs);
            setShipping({
               name: value.results[0].name,
               service: value.results[0].costs[0].service,
               cost: value.results[0].costs[0].cost[0].value,
               etd: value.results[0].costs[0].cost[0].etd,
               note: value.results[0].costs[0].cost[0].note,
               description: value.results[0].costs[0].description,
            });
            setDisabled(false);
         })
         .catch((xhr) => {
            console.log(xhr);
            setDisabled(true);
         });
   };

   const [shippingDiscount, setShippingDiscount] = React.useState();
   const getShippingDiscount = async () => {
      await axios
         .get(`${apiUrl}/shipping_discount/show`, {
            headers: {
               Authorization: "Bearer " + token,
            },
         })
         .then((res) => {
            // console.log(res.data.data);
            setShippingDiscount(res.data.data);
         });
   };

   React.useEffect(() => {
      getSetting();
      getAddress();
      getCart();
      getCourier();
      getShippingDiscount();
      window.scrollTo(0, 0);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const [paymentMethod, setPaymentMethod] = React.useState([]);
   const handleChange = (e) => {
      e.target.name === "courier" && getShippingCost(e.target.value);
      if (e.target.name === "payment_method") {
         let split = e.target.value.split(";");
         setPaymentMethod(split);
      } else {
         setData({
            ...data,
            [e.target.name]: e.target.value,
         });
      }
   };

   const handleShipping = (value) => {
      setAnchorEl(false);
      setShipping({
         ...shipping,
         service: value.service,
         cost: value.cost[0].value,
         etd: value.cost[0].etd,
         note: value.cost[0].note,
         description: value.description,
      });
   };

   const [anchorEl, setAnchorEl] = React.useState(null);
   const open = Boolean(anchorEl);
   const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
   };
   const handleClose = () => {
      setAnchorEl(null);
   };

   const [dialog, setDialog] = React.useState(false);
   const [dialogLoading, setDialogLoading] = React.useState(false);
   const [bank, setBank] = React.useState();
   const handleDialog = async () => {
      setLoading(true);
      setPaymentMethod([]);
      await axios
         .get(`${apiUrl}/moota/bank`, {
            headers: {
               Authorization: "Bearer " + token,
            },
         })
         .then((res) => {
            // console.log(res.data.data);
            setBank(res.data.data);
            setDialog(true);
            setLoading(false);
         });
   };

   const [data, setData] = React.useState();
   const handleSubmit = async (e) => {
      e.preventDefault();
      setDialogLoading(true);
      let formData = new FormData();
      formData.append("user_id", auth.user.id);
      formData.append("address", data.address.address);
      formData.append("type", auth.user.role === "customer" ? "store" : "marketplace");
      auth.user.role !== "customer" && formData.append("marketplace_resi", data.marketplace_resi);
      formData.append("product_price", productPrice);
      formData.append("product_discount", productDiscount);
      formData.append("total_price", productPrice - productDiscount + shipping.cost);
      formData.append("shipping_cost", shipping.cost);
      formData.append("shipping_discount", 0);
      formData.append("expedition", shipping.name);
      formData.append("expedition_service", shipping.service);
      formData.append("payment_method", paymentMethod[0]);
      if (paymentMethod[0] === "transfer") {
         formData.append("bank_name", paymentMethod[1]);
         formData.append("no_rek", paymentMethod[2]);
      }
      // eslint-disable-next-line array-callback-return
      cart.map((value, index) => {
         if (value.product_combination.status === "active") {
            formData.append(
               `transaction_product[${index}][product_name]`,
               `${value.product_name} - ${value.product_combination.combination_string.replaceAll("-", ", ")}`
            );
            formData.append(`transaction_product[${index}][product_slug]`, value.product_combination.product_slug);
            formData.append(`transaction_product[${index}][image]`, value.product_image);
            formData.append(`transaction_product[${index}][price]`, value.product_combination.price);
            formData.append(`transaction_product[${index}][quantity]`, value.quantity);
            let productdiscount = 0;
            if (value.product_combination.product.discount !== null) {
               if (value.product_combination.product.discount_type === "rp") {
                  productdiscount = value.quantity * value.product_combination.product.discount;
               } else {
                  productdiscount = value.quantity * (value.product_combination.price * (value.product_combination.product.discount / 100));
               }
            }
            formData.append(`transaction_product[${index}][discount]`, productdiscount);
            formData.append(`transaction_product[${index}][description]`, value.description);
            formData.append(`transaction_product[${index}][notes]`, "notes");
         }
      });
      // console.clear();
      // console.log(Object.fromEntries(formData));
      await axios
         .post(`${apiUrl}/transaction/checkout`, formData, {
            headers: {
               Authorization: "Bearer " + token,
            },
         })
         .then((res) => {
            // console.log(res.data.data);
            let total = totalCart.total - productQuantity;
            setTotalCart({
               ...cart,
               total: total,
            });
            navigate(`/order/${res.data.data.id}`);
         })
         .catch((xhr) => {
            console.log(xhr.response);
            setDialogLoading(false);
         });
   };

   return (
      <React.Fragment>
         <AppBar color="inherit" position="sticky" elevation={0} sx={{ py: 1, borderBottom: "1px solid #e0e0e0" }}>
            <Container>
               <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Tooltip title="Kembali" component={RouterLink} to="/cart">
                     <IconButton>
                        <ArrowBackRounded />
                     </IconButton>
                  </Tooltip>
                  <Typography variant="h6" ml={1}>
                     Checkout
                  </Typography>
               </Box>
            </Container>
         </AppBar>
         <Container sx={{ flex: 1, my: 3 }}>
            {setting !== undefined && address !== undefined && cart !== undefined && courier !== undefined && shippingDiscount !== undefined ? (
               cart.length > 0 ? (
                  <Grid container spacing={{ xs: 1, sm: 4 }}>
                     <Grid item xs={12} md={7} lg={8}>
                        <Typography variant="body1" fontWeight="bold">
                           Alamat Pengiriman
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2" gutterBottom>
                           <b>{data.address.recipients_name}</b> ({data.address.label})
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                           +62 {data.address.phone_number}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                           {data.address.address}, {data.address.district.district}, {data.address.city.type} {data.address.city.city},{" "}
                           {data.address.province.province}, {data.address.postal_code}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Button variant="outlined" sx={{ my: 1 }}>
                           Pilih Alamat Lain
                        </Button>
                        <Box sx={{ borderTop: "4px solid #eee", mt: 1, pt: 2 }}>
                           <Grid container>
                              <Grid item xs={12} sm={7} md={12} lg={8}>
                                 {cart.map(
                                    (value, index) =>
                                       value.product_combination.status === "active" && (
                                          <Box sx={{ pb: 2 }} key={index}>
                                             <Grid container alignItems="start">
                                                <Grid item>
                                                   <img alt={value.product_name} src={value.product_image} width="80" />
                                                </Grid>
                                                <Grid item xs>
                                                   <Box sx={{ ml: 1.5 }}>
                                                      <Typography mb={0.5}>{value.product_name}</Typography>
                                                      {value.product_combination.combination_string !== null && (
                                                         <Typography component="div" variant="caption" mb={0.5}>
                                                            {value.product_combination.combination_string.replaceAll("-", ", ")}
                                                         </Typography>
                                                      )}
                                                      <Typography component="div" variant="caption" color="text.secondary">
                                                         {value.quantity} barang ({value.quantity * value.product_combination.product.product_weight}{" "}
                                                         {value.product_combination.product.weight_unit})
                                                      </Typography>
                                                      <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                                                         {value.product_combination.product.discount !== null && (
                                                            <Typography variant="caption" color="text.secondary" mr={1}>
                                                               <del>{NumberFormat(value.product_combination.price)}</del>
                                                            </Typography>
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
                                          </Box>
                                       )
                                 )}
                              </Grid>
                              <Grid item xs={12} sm={5} md={12} lg={4} sx={{ mb: 2 }}>
                                 <Typography variant="body2" fontWeight="bold" gutterBottom>
                                    Kurir Pengiriman
                                 </Typography>
                                 <TextField size="small" name="courier" onChange={handleChange} select defaultValue="none" fullWidth>
                                    <MenuItem value="none" disabled selected>
                                       Pilih Kurir
                                    </MenuItem>
                                    {courier.map((value, index) => (
                                       <MenuItem value={value.slug} key={index}>
                                          {value.courier}
                                       </MenuItem>
                                    ))}
                                 </TextField>
                                 {shipping.name !== null && (
                                    <Box sx={{ mt: 2 }}>
                                       <Typography variant="body2" fontWeight="bold" gutterBottom>
                                          Kurir Pilihan
                                       </Typography>
                                       <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                          <Box>
                                             <Typography component="div" variant="caption" color="text.secondary">
                                                {shipping.name}
                                             </Typography>
                                             <Typography component="div" variant="caption" color="text.secondary">
                                                {shipping.service} - {shipping.description} ({NumberFormat(shipping.cost)})
                                             </Typography>
                                             {shipping.etd !== "" && (
                                                <Typography component="div" variant="caption" color="text.secondary">
                                                   Estimasi tiba {shipping.etd} hari
                                                </Typography>
                                             )}
                                          </Box>
                                          <Box>
                                             {listShippingCost?.length > 1 && (
                                                <Typography
                                                   component="div"
                                                   variant="caption"
                                                   fontWeight="bold"
                                                   id="basic-button"
                                                   aria-controls={open ? "basic-menu" : undefined}
                                                   aria-haspopup="true"
                                                   aria-expanded={open ? "true" : undefined}
                                                   onClick={handleClick}
                                                   sx={{ cursor: "pointer" }}
                                                >
                                                   Ubah
                                                </Typography>
                                             )}
                                             <Menu
                                                id="basic-menu"
                                                anchorEl={anchorEl}
                                                open={open}
                                                onClose={handleClose}
                                                MenuListProps={{
                                                   "aria-labelledby": "basic-button",
                                                }}
                                                PaperProps={{
                                                   style: {
                                                      width: "305px",
                                                   },
                                                }}
                                                anchorOrigin={{
                                                   vertical: "bottom",
                                                   horizontal: "right",
                                                }}
                                                transformOrigin={{
                                                   vertical: "top",
                                                   horizontal: "right",
                                                }}
                                             >
                                                {listShippingCost?.map((value, index) => (
                                                   <MenuItem value={value} onClick={() => handleShipping(value)} key={index}>
                                                      {shipping.service === value.service && (
                                                         <ListItemIcon sx={{ mr: 0 }}>
                                                            <Check />
                                                         </ListItemIcon>
                                                      )}
                                                      <ListItemText inset={shipping.service !== value.service}>{value.service}</ListItemText>
                                                      <Typography variant="body2" color="text.secondary" noWrap>
                                                         {NumberFormat(value.cost[0].value)}
                                                      </Typography>
                                                   </MenuItem>
                                                ))}
                                             </Menu>
                                          </Box>
                                       </Box>
                                    </Box>
                                 )}
                                 {disabled === true && shipping.cost === 0 && data?.courier !== undefined && (
                                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
                                       <CircularProgress size={20} />
                                    </Box>
                                 )}
                              </Grid>
                           </Grid>
                        </Box>
                     </Grid>
                     <Grid item xs={12} md={5} lg={4}>
                        <Card>
                           <CardContent>
                              <Typography fontWeight="bold">Ringkasan Belanja</Typography>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                                 <Typography>Total Harga ({productQuantity} Barang)</Typography>
                                 <Typography>{NumberFormat(totalPrice)}</Typography>
                              </Box>
                              {shipping.cost !== 0 && (
                                 <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                                    <Typography>Total Ongkos Kirim</Typography>
                                    <Typography>{NumberFormat(shipping.cost)}</Typography>
                                 </Box>
                              )}
                              {/* {totalPrice >= shippingDiscount.minimum_price && (
                                 <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                                    <Typography>Diskon Ongkos Kirim</Typography>
                                    <Typography>-{NumberFormat(shippingDiscount.max_shipping_discount)}</Typography>
                                 </Box>
                              )} */}
                              <Divider sx={{ pt: 2 }} />
                              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", my: 2 }}>
                                 <Typography fontWeight="bold">Total Tagihan</Typography>
                                 <Typography variant="h6" fontWeight="bold" color="#fa591d">
                                    {NumberFormat(productPrice - productDiscount + shipping.cost)}
                                 </Typography>
                              </Box>
                              <LoadingButton variant="contained" size="large" loading={loading} disabled={disabled} onClick={handleDialog} fullWidth>
                                 Pilih Pembayaran
                              </LoadingButton>
                           </CardContent>
                        </Card>
                     </Grid>
                  </Grid>
               ) : (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>Keranjang Kosong</Box>
               )
            ) : (
               <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                  <CircularProgress />
               </Box>
            )}
         </Container>
         <Dialog open={dialog} maxWidth="xs" fullWidth>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1, pl: 3, pr: 1 }}>
               <Typography variant="subtitle1" fontWeight="bold">
                  Pembayaran
               </Typography>
               <IconButton onClick={() => setDialog(false)}>
                  <CloseRounded />
               </IconButton>
            </Box>
            <DialogContent sx={{ minHeight: "65vh" }} dividers>
               <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                  Pilih Metode Pembayaran
               </Typography>
               <FormControl>
                  <RadioGroup row name="payment_method" onChange={handleChange}>
                     {bank?.map((value, index) => (
                        <FormControlLabel
                           key={index}
                           sx={{ alignItems: "start", py: 0.5 }}
                           value={`transfer;${value.label};${value.account_number}`}
                           control={<Radio />}
                           label={
                              <Typography variant="body2" mt={1.5}>
                                 {value.label} ({value.atas_nama})
                              </Typography>
                           }
                        />
                     ))}
                     <FormControlLabel
                        sx={{ alignItems: "start", py: 0.5 }}
                        value="cod"
                        control={<Radio />}
                        disabled={data?.courier !== "ninja"}
                        label={
                           <React.Fragment>
                              <Typography variant="body2" mt={1.5}>
                                 COD (Bayar di Tempat)
                              </Typography>
                              {data?.courier !== "ninja" && (
                                 <Typography variant="caption" component="div" color="rgba(0, 0, 0, 0.38)">
                                    Hanya tersedia melalui kurir NINJA
                                 </Typography>
                              )}
                           </React.Fragment>
                        }
                     />
                  </RadioGroup>
               </FormControl>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "space-between", alignItems: "end", my: 1, mx: 2 }}>
               <Box>
                  <Typography variant="caption" fontWeight="bold">
                     Total Bayar
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold" color="#fa591d">
                     {NumberFormat(productPrice - productDiscount + shipping.cost)}
                  </Typography>
               </Box>
               {paymentMethod[0] === "transfer" ? (
                  <LoadingButton
                     variant="contained"
                     sx={{ minWidth: { xs: 0, sm: "10rem" }, mb: 0.5 }}
                     startIcon={<GppGoodOutlined />}
                     disabled={paymentMethod.length < 1}
                     loading={dialogLoading}
                     onClick={handleSubmit}
                  >
                     Bayar
                  </LoadingButton>
               ) : (
                  <LoadingButton
                     variant="contained"
                     sx={{ minWidth: { xs: 0, sm: "10rem" }, mb: 0.5 }}
                     disabled={paymentMethod.length < 1}
                     loading={dialogLoading}
                     onClick={handleSubmit}
                  >
                     Bayar di Tempat
                  </LoadingButton>
               )}
            </DialogActions>
         </Dialog>
      </React.Fragment>
   );
}
