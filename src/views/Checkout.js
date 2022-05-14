import React, { Fragment, useEffect, useState } from "react";
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
import { ArrowBackRounded, Check, CheckRounded, ClearRounded, CloseRounded, FileUploadOutlined, GppGoodOutlined, ImageOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authentication } from "../store/Authentication";
import { carts } from "../store/Carts";
import { apiUrl } from "../variable/Url";
import { Discount, NumberFormat } from "../components/Format";

let stagingBox = {
   color: "#000",
   border: "1px solid #e0e0e0",
   display: "inline-block",
   width: "100%",
   cursor: "pointer",
   borderRadius: 1,
   pl: 2,
};

export default function Checkout(props) {
   const navigate = useNavigate();
   const token = localStorage.getItem("token");
   const [auth] = useRecoilState(authentication);
   const [totalCart, setTotalCart] = useRecoilState(carts);

   const [setting, setSetting] = useState();
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

   const [address, setAddress] = useState();
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
               setData({
                  ...data,
                  address: res.data.data[0],
               });
            } else {
               navigate(`/settings/address?redirect=${encodeURIComponent("/checkout")}`);
            }
         });
   };

   const getGroupDiscount = async () => {
      await axios
         .get(`${apiUrl}/discount/fetch`, {
            params: {
               type: "group",
               group_user_id: auth.user.role_id,
            },
            headers: {
               Authorization: "Bearer " + token,
            },
         })
         .then((res) => {
            // console.log(res.data.data);
            getCustomerDiscount(res.data.data);
         });
   };

   const getCustomerDiscount = async (groupDiscount) => {
      await axios
         .get(`${apiUrl}/discount/fetch`, {
            params: {
               type: "user",
               user_id: auth.user.id,
            },
            headers: {
               Authorization: "Bearer " + token,
            },
         })
         .then((res) => {
            // console.log(res.data.data);
            getCart(groupDiscount, res.data.data);
         });
   };

   const [shippingDiscount, setShippingDiscount] = useState(0);
   const [listShippingDiscount, setListShippingDiscount] = useState();
   const getShippingDiscount = async () => {
      await axios
         .get(`${apiUrl}/shipping_discount/show`, {
            headers: {
               Authorization: "Bearer " + token,
            },
         })
         .then((res) => {
            // console.log(res.data.data);
            setListShippingDiscount(res.data.data);
         });
   };

   const [cart, setCart] = useState();
   const [productPrice, setProductPrice] = useState(0);
   const [productDiscount, setProductDiscount] = useState(0);
   const [productQuantity, setProductQuantity] = useState(0);
   const [productWeight, setProductWeight] = useState(0);
   const [totalPrice, setTotalPrice] = useState(0);
   const [totalBill, setTotalBill] = useState(0);
   const getCart = async (groupDiscount, customerDiscount) => {
      await axios
         .get(`${apiUrl}/carts`, {
            headers: {
               Authorization: "Bearer " + token,
            },
         })
         .then((res) => {
            // console.log(res.data.data);
            let data = [];
            if (res.data.data.length > 0) {
               let productprice = 0;
               let productdiscount = 0;
               let productquantity = 0;
               let productweight = 0;
               // eslint-disable-next-line array-callback-return
               res.data.data.map((value, index) => {
                  if (value.product_combination.status === "active") {
                     value.product_combination.discount_product =
                        value.product_combination.price -
                        Discount(value.product_combination.price, value.product_combination.product.discount, value.product_combination.product.discount_type);
                     value.product_combination.discount_product_balance = Discount(
                        value.product_combination.price,
                        value.product_combination.product.discount,
                        value.product_combination.product.discount_type
                     );

                     value.product_combination.discount_group = 0;
                     value.product_combination.discount_customer = 0;

                     // eslint-disable-next-line array-callback-return
                     groupDiscount.map((row) => {
                        if (row.status === "active") {
                           if (row.category.id === value.product_combination.product.category.id) {
                              value.product_combination.discount_group =
                                 value.product_combination.discount_product_balance -
                                 Discount(value.product_combination.discount_product_balance, row.discount, row.discount_type);
                              value.product_combination.discount_group_balance = Discount(
                                 value.product_combination.discount_product_balance,
                                 row.discount,
                                 row.discount_type
                              );

                              // eslint-disable-next-line array-callback-return
                              customerDiscount.map((rows) => {
                                 if (rows.status === "active") {
                                    if (rows.category.id === value.product_combination.product.category.id) {
                                       value.product_combination.discount_customer =
                                          value.product_combination.discount_group_balance -
                                          Discount(value.product_combination.discount_group_balance, row.discount, row.discount_type);
                                       value.product_combination.discount_customer_balance = Discount(
                                          value.product_combination.discount_group_balance,
                                          row.discount,
                                          row.discount_type
                                       );
                                    }
                                 }
                              });
                           }
                        }
                        // console.log(row);
                        // console.log(value);
                     });

                     if (value.product_combination.discount_customer === 0) {
                        // eslint-disable-next-line array-callback-return
                        customerDiscount.map((row) => {
                           if (row.status === "active") {
                              if (row.category.id === value.product_combination.product.category.id) {
                                 value.product_combination.discount_customer =
                                    value.product_combination.discount_product_balance -
                                    Discount(value.product_combination.discount_product_balance, row.discount, row.discount_type);
                                 value.product_combination.discount_customer_balance = Discount(
                                    value.product_combination.discount_product_balance,
                                    row.discount,
                                    row.discount_type
                                 );
                              }
                           }
                        });
                     }
                     value.product_combination.subtotal =
                        Discount(value.product_combination.price, value.product_combination.product.discount, value.product_combination.product.discount_type) -
                        value.product_combination.discount_group -
                        value.product_combination.discount_customer;
                     data.push(value);

                     productprice += value.quantity * value.product_combination.subtotal;
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
               setTotalBill(productprice - productdiscount + shipping.cost - shippingDiscount);
            } else {
               navigate("/cart");
            }
            // console.log(data);
            setCart(data);
         })
         .catch((err) => {
            console.log(err.response);
         });
   };

   const [courier, setCourier] = useState();
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

   const [loading, setLoading] = useState(false);
   const [disabled, setDisabled] = useState(true);
   const [shipping, setShipping] = useState({
      name: null,
      service: null,
      cost: 0,
      etd: null,
      note: null,
      description: null,
   });
   const [listShippingCost, setListShippingCost] = useState();
   const getShippingCost = async (courier) => {
      setDisabled(true);
      setShipping({
         ...shipping,
         name: null,
         cost: 0,
      });
      setShippingDiscount(0);
      setTotalBill(productPrice - productDiscount);
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
               ...shipping,
               name: value.results[0].name,
            });
            handleShipping(value.results[0].costs[0]);
            setDisabled(false);
         })
         .catch((xhr) => {
            console.log(xhr);
            setDisabled(true);
         });
   };

   useEffect(() => {
      window.scrollTo(0, 0);
      let mounted = true;
      if (mounted) {
         getSetting();
         getAddress();
         getCourier();
         getGroupDiscount();
         getShippingDiscount();
      }
      return () => (mounted = false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const [dialogAddress, setDialogAddress] = useState(false);
   const handleDialogAddress = () => {
      setDialogAddress(!dialogAddress);
   };
   const handleAddress = (value) => {
      // console.log(value);
      setDisabled(true);
      setDialogAddress(!dialogAddress);
      setData({
         ...data,
         address: value,
         courier: "none",
      });
      setTotalBill(productPrice - productDiscount);
      setShipping({
         name: null,
         service: null,
         cost: 0,
         etd: null,
         note: null,
         description: null,
      });
   };

   const handleShipping = (value) => {
      // console.log(value);
      setAnchorEl(false);
      setShippingDiscount(0);
      setTotalBill(productPrice - productDiscount);
      setShipping({
         ...shipping,
         service: value.service,
         cost: value.cost[0].value,
         etd: value.cost[0].etd,
         note: value.cost[0].note,
         description: value.description,
      });
      if (totalPrice >= listShippingDiscount.minimum_price && listShippingDiscount.status === "active") {
         if (value.cost[0].value <= listShippingDiscount.max_shipping_discount) {
            setShippingDiscount(value.cost[0].value);
            setTotalBill(productPrice - productDiscount);
         } else {
            setShippingDiscount(listShippingDiscount.max_shipping_discount);
            setTotalBill(productPrice - productDiscount + value.cost[0].value - listShippingDiscount.max_shipping_discount);
         }
      } else {
         setShippingDiscount(0);
         setTotalBill(productPrice - productDiscount + value.cost[0].value);
      }
   };

   const [paymentMethod, setPaymentMethod] = useState([]);
   const handleChange = (e) => {
      e.target.name === "courier" && getShippingCost(e.target.value);
      if (e.target.name === "payment_method") {
         let split = e.target.value.split(";");
         setPaymentMethod(split);
      } else if (e.target.name === "marketplace_resi") {
         if (e.target.files[0] !== undefined) {
            setError({
               ...error,
               [e.target.name]: undefined,
            });
            setData({
               ...data,
               [e.target.name]: e.target.files[0],
            });
         }
         e.target.value = null;
      } else {
         setData({
            ...data,
            [e.target.name]: e.target.value,
         });
      }
   };

   const [anchorEl, setAnchorEl] = useState(null);
   const open = Boolean(anchorEl);
   const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
   };
   const handleClose = () => {
      setAnchorEl(null);
   };

   const [dialog, setDialog] = useState(false);
   const [dialogLoading, setDialogLoading] = useState(false);
   const [bank, setBank] = useState();
   const handleDialog = async () => {
      // eslint-disable-next-line no-mixed-operators
      if (
         auth.user.role === "customer" ||
         (auth.user.role !== "customer" && data.address.type !== "receiver") ||
         (auth.user.role !== "customer" && data.address.type === "receiver" && data.marketplace_resi !== undefined)
      ) {
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
      } else {
         setError({
            marketplace_resi: "Upload nomor resi",
         });
      }
   };

   const [data, setData] = useState({
      courier: "none",
      marketplace_resi: undefined,
   });
   const [error, setError] = useState();
   const handleSubmit = async (e) => {
      e.preventDefault();
      setDialogLoading(true);
      let formData = new FormData();
      formData.append("user_id", auth.user.id);
      formData.append(
         "address",
         `${data.address.address}, ${data.address.district.district}, ${data.address.city.type} ${data.address.city.city}, ${data.address.province.province}, ${data.address.postal_code}`
      );
      formData.append(
         "type",
         auth.user.role !== "customer" && data.address.type === "receiver" && data.marketplace_resi !== undefined ? "marketplace" : "store"
      );
      if (auth.user.role !== "customer" && data.address.type === "receiver" && data.marketplace_resi !== undefined) {
         formData.append("marketplace_resi", data.marketplace_resi);
      }
      formData.append("total_price", totalBill);
      formData.append("shipping_cost", shipping.cost);
      formData.append("shipping_discount", shippingDiscount);
      formData.append("expedition", data.courier);
      formData.append("expedition_service", `${shipping.service} - ${shipping.description}`);
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
            formData.append(`transaction_product[${index}][discount_product]`, value.product_combination.discount_product);
            formData.append(`transaction_product[${index}][discount_group]`, value.product_combination.discount_group);
            formData.append(`transaction_product[${index}][discount_customer]`, value.product_combination.discount_customer);
            formData.append(`transaction_product[${index}][description]`, value.description);
            formData.append(`transaction_product[${index}][notes]`, "notes");
         }
      });
      // console.clear();
      console.log(Object.fromEntries(formData));
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
            if (paymentMethod[0] === "transfer") {
               navigate(`/payment/${res.data.data.payment[0].id}`);
            } else {
               navigate(`/order/${res.data.data.id}`);
            }
         })
         .catch((xhr) => {
            console.log(xhr.response);
            setDialogLoading(false);
         });
   };

   const [dialogPreview, setDialogPreview] = React.useState(false);
   const [preview, setPreview] = React.useState();
   const handlePreview = (e) => {
      let reader = new FileReader();
      reader.readAsDataURL(e);
      reader.onload = function () {
         setDialogPreview(true);
         setPreview(reader.result);
      };
   };

   return (
      <Fragment>
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
            {setting !== undefined && address !== undefined && cart !== undefined && courier !== undefined && listShippingDiscount !== undefined ? (
               <Fragment>
                  {cart.length > 0 ? (
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
                           <Grid container spacing={1} sx={{ py: 1 }}>
                              <Grid item>
                                 <Button variant="outlined" onClick={() => setDialogAddress(true)}>
                                    Pilih Alamat Lain
                                 </Button>
                              </Grid>
                           </Grid>
                           <Box sx={{ borderTop: "4px solid #eee", mt: 1, pt: 2 }}>
                              <Grid container spacing={3}>
                                 <Grid item xs={12} sm={7} md={12} lg={7.5}>
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
                                                         <Typography variant="body2">{value.product_name}</Typography>
                                                         {value.product_combination.combination_string !== null && (
                                                            <Typography variant="caption" mr={1}>
                                                               {value.product_combination.combination_string.replaceAll("-", ", ")}
                                                            </Typography>
                                                         )}
                                                         {value.product_combination.product.preorder === 1 && (
                                                            <Typography variant="caption" color="text.secondary">
                                                               (Pre-Order {value.product_combination.product.duration}&nbsp;
                                                               {value.product_combination.product.duration_unit === "day" ? "Hari" : "Minggu"})
                                                            </Typography>
                                                         )}
                                                         <Typography variant="caption" color="text.secondary" component="div" mt={0.5}>
                                                            {value.quantity} barang ({value.quantity * value.product_combination.product.product_weight}{" "}
                                                            {value.product_combination.product.weight_unit})
                                                         </Typography>
                                                         <Box sx={{ display: "flex", alignItems: "center", mt: 0.5, mb: 1 }}>
                                                            {value.product_combination.product.discount !== null && (
                                                               <Typography variant="caption" color="text.secondary" mr={1}>
                                                                  <del>{NumberFormat(value.product_combination.price)}</del>
                                                               </Typography>
                                                            )}
                                                            <Typography variant="subtitle2" fontWeight="bold">
                                                               {value.product_combination.product.discount !== null
                                                                  ? NumberFormat(
                                                                       Discount(
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
                                                <Box sx={{ mb: 1 }}>
                                                   {value.product_combination.discount_group !== 0 && (
                                                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                                         <Typography variant="body2" color="text.secondary">
                                                            Diskon {auth.user.role}
                                                         </Typography>
                                                         <Typography variant="body2" color="text.secondary">
                                                            -{NumberFormat(value.product_combination.discount_group)}
                                                         </Typography>
                                                      </Box>
                                                   )}
                                                   {value.product_combination.discount_customer !== 0 && (
                                                      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                                                         <Typography variant="body2" color="text.secondary">
                                                            Diskon pelanggan
                                                         </Typography>
                                                         <Typography variant="body2" color="text.secondary">
                                                            -{NumberFormat(value.product_combination.discount_customer)}
                                                         </Typography>
                                                      </Box>
                                                   )}
                                                   {value.product_combination.discount_group > 0 || value.product_combination.discount_customer > 0 ? (
                                                      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5, mb: 2 }}>
                                                         <Typography variant="body2" fontWeight="bold">
                                                            Subtotal
                                                         </Typography>
                                                         <Typography variant="body2" fontWeight="bold">
                                                            {NumberFormat(value.product_combination.subtotal)}
                                                         </Typography>
                                                      </Box>
                                                   ) : null}
                                                </Box>
                                                <Divider />
                                             </Box>
                                          )
                                    )}
                                 </Grid>
                                 <Grid item xs={12} sm={5} md={12} lg={4.5} sx={{ mb: 2 }}>
                                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                                       Kurir Pengiriman
                                    </Typography>
                                    <TextField size="small" name="courier" defaultValue="none" onChange={handleChange} value={data.courier} select fullWidth>
                                       <MenuItem value="none" disabled selected>
                                          Pilih Kurir
                                       </MenuItem>
                                       {courier.map((value, index) => (
                                          <MenuItem value={value.slug} key={index}>
                                             {value.courier}
                                          </MenuItem>
                                       ))}
                                    </TextField>
                                    {shipping.cost > 0 && (
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
                                                      Estimasi tiba {shipping.etd === "0" || shipping.etd === "1-1" ? "1" : shipping.etd} hari
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
                                                         width: "290px",
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
                                    {shipping.cost === 0 && data?.courier !== "none" && (
                                       <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
                                          <CircularProgress size={20} />
                                       </Box>
                                    )}
                                    {data.address.type === "receiver" && auth.user.role !== "customer" && (
                                       <Box sx={{ mt: 2 }}>
                                          <Typography variant="body2" fontWeight="bold" gutterBottom>
                                             Nomor Resi
                                          </Typography>
                                          {data.marketplace_resi !== undefined ? (
                                             <Box sx={stagingBox}>
                                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                                   <ImageOutlined fontSize="small" />
                                                   <Tooltip title={data.marketplace_resi.name} onClick={() => handlePreview(data.marketplace_resi)}>
                                                      <Typography variant="body2" sx={{ flex: 1 }} mx={1} noWrap>
                                                         {data.marketplace_resi.name}
                                                      </Typography>
                                                   </Tooltip>
                                                   <Tooltip title="Hapus" onClick={(e) => setData({ ...data, marketplace_resi: undefined })}>
                                                      <IconButton>
                                                         <ClearRounded fontSize="small" />
                                                      </IconButton>
                                                   </Tooltip>
                                                </Box>
                                             </Box>
                                          ) : (
                                             <Button variant="outlined" startIcon={<FileUploadOutlined />} component="label" fullWidth>
                                                Upload
                                                <input name="marketplace_resi" type="file" accept="image/*, application/pdf" onChange={handleChange} hidden />
                                             </Button>
                                          )}
                                          <Typography component="div" variant="caption" color="error">
                                             {error?.marketplace_resi !== undefined && error.marketplace_resi}
                                          </Typography>
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
                                 {listShippingDiscount.status === "active" && shipping.cost !== 0 && totalPrice >= listShippingDiscount.minimum_price && (
                                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                                       <Typography>Diskon Ongkos Kirim</Typography>
                                       <Typography>-{NumberFormat(shippingDiscount)}</Typography>
                                    </Box>
                                 )}
                                 <Divider sx={{ pt: 2 }} />
                                 <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", my: 2 }}>
                                    <Typography fontWeight="bold">Total Tagihan</Typography>
                                    <Typography variant="h6" fontWeight="bold" color="#fa591d">
                                       {NumberFormat(totalBill)}
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
                  )}
                  <Dialog open={dialogAddress} onClose={handleDialogAddress} maxWidth="xs" fullWidth>
                     <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1, pl: 3, pr: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                           Alamat Pengiriman
                        </Typography>
                        <IconButton onClick={handleDialogAddress}>
                           <CloseRounded />
                        </IconButton>
                     </Box>
                     <DialogContent dividers>
                        <Button variant="outlined" fullWidth component={RouterLink} to={`/settings/address?redirect=${encodeURIComponent("/checkout")}`}>
                           Tambah Alamat
                        </Button>
                     </DialogContent>
                     <DialogContent sx={{ minHeight: "65vh" }}>
                        {address.map((value, index) => (
                           <Card sx={{ mb: 1 }} key={index}>
                              <CardContent>
                                 <Box sx={{ display: "flex" }}>
                                    <Box sx={{ flex: 1 }}>
                                       <Typography variant="body2" gutterBottom>
                                          <b>{value.recipients_name}</b> ({value.label})
                                       </Typography>
                                       <Typography variant="body2" gutterBottom>
                                          +62 {value.phone_number}
                                       </Typography>
                                       <Typography variant="body2" color="text.secondary">
                                          {value.address}, {value.district.district}, {value.city.type} {value.city.city}, {value.province.province},{" "}
                                          {value.postal_code}
                                       </Typography>
                                    </Box>
                                    {data.address.address === value.address && <CheckRounded />}
                                 </Box>
                                 {data.address.address !== value.address && (
                                    <Button variant="contained" sx={{ mt: 2 }} onClick={() => handleAddress(value)} fullWidth>
                                       Pilih Alamat
                                    </Button>
                                 )}
                              </CardContent>
                           </Card>
                        ))}
                     </DialogContent>
                  </Dialog>
               </Fragment>
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
                           <Fragment>
                              <Typography variant="body2" mt={1.5}>
                                 COD (Bayar di Tempat)
                              </Typography>
                              {data?.courier !== "ninja" && (
                                 <Typography variant="caption" component="div" color="rgba(0, 0, 0, 0.38)">
                                    Hanya tersedia melalui kurir NINJA
                                 </Typography>
                              )}
                           </Fragment>
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
                     {NumberFormat(totalBill)}
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
         <Dialog open={dialogPreview} onClose={() => setDialogPreview(false)} scroll="paper">
            <DialogContent>
               <img alt="Preview" src={preview} width="100%" />
            </DialogContent>
            <Divider />
            <DialogActions>
               <Button onClick={() => setDialogPreview(false)}>Tutup</Button>
            </DialogActions>
         </Dialog>
      </Fragment>
   );
}
