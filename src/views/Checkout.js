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
   Checkbox,
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
   cursor: "pointer",
   borderRadius: 1,
   pl: 2,
};

export default function Checkout(props) {
   const navigate = useNavigate();
   const token = localStorage.getItem("token");
   const [auth] = useRecoilState(authentication);
   const [totalCart, setTotalCart] = useRecoilState(carts);

   const [error, setError] = useState();
   const [transaction, setTransaction] = useState({
      type: "store",
      marketplace_resi: undefined,
   });

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
            let value = res.data.data;
            if (value.length > 0) {
               setAddress(value);
               setTransaction({
                  ...transaction,
                  address: value[0],
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
   const [totalPrice, setTotalPrice] = useState(0);
   const [totalBill, setTotalBill] = useState(0);
   const [preOrder, setPreOrder] = useState(0);
   const [cod, setCod] = useState(false);
   const getCart = async (groupDiscount, customerDiscount) => {
      await axios
         .get(`${apiUrl}/carts`, {
            headers: {
               Authorization: "Bearer " + token,
            },
         })
         .then((res) => {
            // console.log(res.data.data);
            let newdata = [];
            let filter = res.data.data.filter(function (e) {
               return e.product_combination.product.preorder === 0;
            });
            if (filter.length > 0) {
               newdata = [
                  {
                     data: [],
                     subtotal: 0,
                     preorder: false,
                     courier: "none",
                     shipping: {
                        name: null,
                        service: null,
                        cost: 0,
                        etd: null,
                        note: null,
                        description: null,
                     },
                     payment_method: "none",
                  },
               ];
            }

            if (res.data.data.length > 0) {
               let productprice = 0;
               let productdiscount = 0;
               let productquantity = 0;
               let productweight = 0;
               let productsubtotal = 0;

               // eslint-disable-next-line array-callback-return
               res.data.data.map((value, index) => {
                  if (value.product_combination.product.preorder === 0) {
                     newdata[0].data.push(value);
                  }
               });
               // eslint-disable-next-line array-callback-return
               res.data.data.map((value, index) => {
                  if (value.product_combination.product.preorder === 1) {
                     // colors.splice(index, 0, "white");
                     newdata.push({
                        data: [value],
                        subtotal: 0,
                        preorder: true,
                        courier: "none",
                        shipping: {
                           name: null,
                           service: null,
                           cost: 0,
                           etd: null,
                           note: null,
                           description: null,
                        },
                        payment_method: "po",
                     });
                  }
               });
               const preorder = newdata.filter((row) => row.preorder === true);
               setPreOrder(preorder.length);

               // eslint-disable-next-line array-callback-return
               newdata.map((value) => {
                  productweight = 0;
                  productsubtotal = 0;
                  // eslint-disable-next-line array-callback-return
                  value.data.map((value) => {
                     if (value.product_combination.status === "active") {
                        value.product_combination.discount_product =
                           value.product_combination.price -
                           Discount(
                              value.product_combination.price,
                              value.product_combination.product.discount,
                              value.product_combination.product.discount_type
                           );
                        value.product_combination.discount_product_balance =
                           value.quantity *
                           Discount(
                              value.product_combination.price,
                              value.product_combination.product.discount,
                              value.product_combination.product.discount_type
                           );

                        value.product_combination.discount_group = 0;
                        value.product_combination.discount_customer = 0;
                        value.product_combination.discount_po = 0;

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
                           value.product_combination.discount_product_balance -
                           value.product_combination.discount_group -
                           value.product_combination.discount_customer;
                        if (value.product_combination.product.preorder === 1) {
                           value.product_combination.discount_po = Discount(value.product_combination.subtotal, 10, "percent");
                           value.product_combination.discount_po_balance = value.product_combination.subtotal - value.product_combination.discount_po;
                           value.product_combination.subtotal = value.product_combination.discount_po_balance;
                        }
                        productsubtotal = productsubtotal + value.product_combination.subtotal;

                        // productprice += value.quantity * value.product_combination.subtotal;
                        productprice += value.product_combination.subtotal;
                        productquantity += value.quantity;
                        if (value.product_combination.product.weight_unit === "kg") {
                           productweight += value.quantity * (value.product_combination.product.product_weight * 1000);
                        } else {
                           productweight += value.quantity * value.product_combination.product.product_weight;
                        }
                     }
                  });
                  value.weight = productweight;
                  value.subtotal = productsubtotal;
               });
               setProductPrice(productprice);
               setProductDiscount(Math.round(productdiscount));
               setProductQuantity(productquantity);
               setTotalPrice(productprice - productdiscount);
               setTotalBill(productprice - productdiscount + shipping - shippingDiscount);
            } else {
               navigate("/cart");
            }
            // console.log(newdata);
            setCart(newdata);
         })
         .catch((err) => {
            // console.log(err);
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

   const [loading, setLoading] = useState(false);
   const [disabled, setDisabled] = useState(false);
   const [shipping, setShipping] = useState(0);
   const [disabledService, setDisabledService] = useState(false);
   const handleCourier = async (e, weight, before_cost, key) => {
      setDisabledService(true);
      const newState = cart.map((obj, index) =>
         index === key
            ? {
                 ...obj,
                 courier: e.target.value,
                 list_shipping: [],
                 shipping: {
                    name: null,
                    service: null,
                    cost: 0,
                    etd: null,
                    note: null,
                    description: null,
                 },
              }
            : obj
      );
      setCart(newState);
      const cod = newState.filter((row) => row.courier === "ninja");
      setCod(newState.length === cod.length ? true : false);

      setShippingDiscount(0);
      setTotalBill(productPrice - productDiscount);
      let formData = new FormData();
      formData.append("origin", transaction.address.district.id);
      formData.append("originType", "subdistrict");
      formData.append("destination", setting.district.id);
      formData.append("destinationType", "subdistrict");
      formData.append("weight", weight);
      formData.append("courier", e.target.value);
      await axios
         .post(`${apiUrl}/shipping/cost`, formData, {
            headers: {
               Authorization: "Bearer " + token,
            },
         })
         .then((res) => {
            let value = res.data.rajaongkir;
            // console.log(value);
            const newStatee = newState.map((obj, index) =>
               index === key
                  ? {
                       ...obj,
                       list_shipping: value.results[0].costs,
                       shipping: {
                          ...obj.shipping,
                          name: value.results[0].name,
                       },
                    }
                  : obj
            );
            setCart(newStatee);
            handleService(key, value.results[0].costs[0], before_cost, newStatee);
         })
         .catch((xhr) => {
            console.log(xhr);
            setDisabled(true);
         });
   };

   const handleService = (key, value, before_cost, newstate) => {
      setAnchorEl(false);
      let newshipping = shipping - before_cost + value.cost[0].value;
      setShipping(newshipping);
      const newState = newstate.map((obj, index) =>
         index === key
            ? {
                 ...obj,
                 shipping: {
                    ...obj.shipping,
                    service: value.service,
                    cost: value.cost[0].value,
                    etd: value.cost[0].etd,
                    note: value.cost[0].note,
                    description: value.description,
                 },
              }
            : obj
      );
      setCart(newState);
      setDisabledService(false);

      if (totalPrice >= listShippingDiscount.minimum_price && listShippingDiscount.status === "active") {
         if (newshipping <= listShippingDiscount.max_shipping_discount) {
            setShippingDiscount(value.cost[0].value);
            setTotalBill(productPrice - productDiscount);
         } else {
            setShippingDiscount(listShippingDiscount.max_shipping_discount);
            setTotalBill(productPrice - productDiscount + newshipping - listShippingDiscount.max_shipping_discount);
         }
      } else {
         setShippingDiscount(0);
         setTotalBill(productPrice - productDiscount + newshipping);
      }
   };

   const handleMarketplace = (e) => {
      setTransaction({
         ...transaction,
         type: transaction.type === "store" ? "marketplace" : "store",
         marketplace_resi: undefined,
      });
   };

   const [dialogAddress, setDialogAddress] = useState(false);
   const handleDialogAddress = () => {
      setDialogAddress(!dialogAddress);
   };
   const handleAddress = (value) => {
      setDialogAddress(!dialogAddress);
      setTransaction({
         address: value,
         type: "store",
         marketplace_resi: undefined,
      });
      setTotalBill(productPrice - productDiscount);
   };

   const [paymentMethod, setPaymentMethod] = useState([]);
   const handleChange = (e) => {
      if (e.target.name === "payment_method") {
         let split = e.target.value.split(";");
         setPaymentMethod(split);
      } else if (e.target.name === "marketplace_resi") {
         if (e.target.files[0] !== undefined) {
            setError({
               ...error,
               [e.target.name]: undefined,
            });
            setTransaction({
               ...transaction,
               [e.target.name]: e.target.files[0],
            });
         }
         e.target.value = null;
      } else {
         setTransaction({
            ...transaction,
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
         (auth.user.role !== "customer" && transaction.address.type !== "receiver") ||
         (auth.user.role !== "customer" && transaction.address.type === "receiver" && transaction.type === "store") ||
         (auth.user.role !== "customer" &&
            transaction.address.type === "receiver" &&
            transaction.type === "marketplace" &&
            transaction.marketplace_resi !== undefined)
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

   const handleSubmit = async (e) => {
      e.preventDefault();
      setDialogLoading(true);
      let formData = new FormData();
      formData.append("user_id", auth.user.id);
      formData.append(
         "address",
         `${transaction.address.address}, ${transaction.address.district.district}, ${transaction.address.city.type} ${transaction.address.city.city}, ${transaction.address.province.province}, ${transaction.address.postal_code}`
      );
      formData.append("type", transaction.type);
      if (transaction.type === "marketplace") {
         formData.append("marketplace_resi", transaction.marketplace_resi);
      }
      formData.append("total_price", totalBill);
      formData.append("shipping_discount", shippingDiscount);
      let subtotal_preorder = 0;
      // eslint-disable-next-line array-callback-return
      cart.map((obj, key) => {
         // eslint-disable-next-line array-callback-return
         obj.data.map((value, index) => {
            if (value.product_combination.combination_string !== null) {
               formData.append(
                  `transaction[${key}][transaction_product][${index}][product_name]`,
                  `${value.product_name} - ${value.product_combination.combination_string.replaceAll("-", ", ")}`
               );
            } else {
               formData.append(`transaction[${key}][transaction_product][${index}][product_name]`, value.product_name);
            }
            formData.append(`transaction[${key}][transaction_product][${index}][product_slug]`, value.product_combination.product_slug);
            formData.append(`transaction[${key}][transaction_product][${index}][image]`, value.product_image);
            formData.append(`transaction[${key}][transaction_product][${index}][price]`, value.product_combination.price);
            formData.append(`transaction[${key}][transaction_product][${index}][quantity]`, value.quantity);
            let productdiscount = 0;
            if (value.product_combination.product.discount !== null) {
               if (value.product_combination.product.discount_type === "rp") {
                  productdiscount = value.quantity * value.product_combination.product.discount;
               } else {
                  productdiscount = value.quantity * (value.product_combination.price * (value.product_combination.product.discount / 100));
               }
            }
            formData.append(`transaction[${key}][transaction_product][${index}][discount]`, productdiscount);
            formData.append(`transaction[${key}][transaction_product][${index}][discount_product]`, value.product_combination.discount_product);
            formData.append(`transaction[${key}][transaction_product][${index}][discount_group]`, value.product_combination.discount_group);
            formData.append(`transaction[${key}][transaction_product][${index}][discount_customer]`, value.product_combination.discount_customer);
            formData.append(`transaction[${key}][transaction_product][${index}][description]`, value.description);
            formData.append(`transaction[${key}][transaction_product][${index}][notes]`, "");
            subtotal_preorder =
               value.product_combination.discount_product_balance - value.product_combination.discount_group - value.product_combination.discount_customer;
         });
         formData.append(`transaction[${key}][sub_total]`, obj.preorder === true ? subtotal_preorder : obj.subtotal);
         formData.append(`transaction[${key}][expedition]`, obj.courier);
         formData.append(`transaction[${key}][expedition_service]`, `${obj.shipping.name} - ${obj.shipping.service}`);
         formData.append(`transaction[${key}][shipping_cost]`, obj.shipping.cost);
         formData.append(`transaction[${key}][payment_method]`, obj.payment_method === "none" ? paymentMethod[0] : obj.payment_method);
         if (paymentMethod[0] === "transfer") {
            formData.append("bank_name", paymentMethod[1]);
            formData.append("no_rek", paymentMethod[2]);
         }
      });
      // console.clear();
      // console.log(cart);
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
            if (paymentMethod[0] === "transfer") {
               navigate(`/payment/${res.data.data.id}`);
            } else {
               navigate(`/order`);
            }
         })
         .catch((xhr) => {
            console.log(xhr);
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

   // const handleConsole = (e) => {
   //    console.clear();
   //    console.log(transaction);
   //    console.log(cart);
   //    handleSubmit(e);
   // };

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
                              <b>{transaction.address.recipients_name}</b> ({transaction.address.label})
                           </Typography>
                           <Typography variant="body2" gutterBottom>
                              +62 {transaction.address.phone_number}
                           </Typography>
                           <Typography variant="body2" color="text.secondary">
                              {transaction.address.address}, {transaction.address.district.district}, {transaction.address.city.type}{" "}
                              {transaction.address.city.city}, {transaction.address.province.province}, {transaction.address.postal_code}
                           </Typography>
                           <Divider sx={{ my: 1 }} />
                           <Grid container spacing={1} sx={{ py: 1 }}>
                              <Grid item>
                                 <Button variant="outlined" onClick={() => setDialogAddress(true)}>
                                    Pilih Alamat Lain
                                 </Button>
                                 {/* <Button variant="outlined" onClick={handleConsole}>
                                    console.log
                                 </Button> */}
                              </Grid>
                           </Grid>
                           <Box sx={{ mt: 1 }}>
                              {transaction.address.type === "receiver" && auth.user.role !== "customer" && (
                                 <Box sx={{ borderTop: "4px solid #eee", py: 1 }}>
                                    {/* <FormControlLabel control={<Checkbox />} label="Upload Resi" /> */}
                                    <Box>
                                       <FormControlLabel
                                          control={<Checkbox required={true} />}
                                          label={<Typography variant="body2">Nomor Resi</Typography>}
                                          onChange={handleMarketplace}
                                       />
                                    </Box>
                                    {transaction.type === "marketplace" && (
                                       <Box sx={{ mb: 1 }}>
                                          {transaction.marketplace_resi !== undefined ? (
                                             <Box sx={stagingBox}>
                                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                                   <ImageOutlined fontSize="small" />
                                                   <Tooltip
                                                      title={transaction.marketplace_resi.name}
                                                      onClick={() => handlePreview(transaction.marketplace_resi)}
                                                   >
                                                      <Typography variant="body2" sx={{ flex: 1 }} mx={1} noWrap>
                                                         {transaction.marketplace_resi.name}
                                                      </Typography>
                                                   </Tooltip>
                                                   <Tooltip title="Hapus" onClick={(e) => setTransaction({ ...transaction, marketplace_resi: undefined })}>
                                                      <IconButton>
                                                         <ClearRounded fontSize="small" />
                                                      </IconButton>
                                                   </Tooltip>
                                                </Box>
                                             </Box>
                                          ) : (
                                             <Button variant="outlined" startIcon={<FileUploadOutlined />} component="label">
                                                Pilih File
                                                <input name="marketplace_resi" type="file" accept="image/*, application/pdf" onChange={handleChange} hidden />
                                             </Button>
                                          )}
                                          <Typography component="div" variant="caption" color="error" mt={1}>
                                             {error?.marketplace_resi !== undefined && error.marketplace_resi}
                                          </Typography>
                                       </Box>
                                    )}
                                 </Box>
                              )}
                              {cart.map((val, key) => (
                                 <Box sx={{ borderTop: "4px solid #eee" }} key={key}>
                                    {cart.length > 1 && (
                                       <Typography variant="body2" fontWeight="bold" mt={2}>
                                          Pesanan {key + 1}
                                       </Typography>
                                    )}
                                    <Grid container spacing={{ xs: 0, sm: 3 }}>
                                       <Grid item xs={12} sm={7} md={12} lg={7.5}>
                                          {val.data.map((value, index) => (
                                             <Box sx={{ pt: 2 }} key={index}>
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
                                                   {value.product_combination.discount_po !== 0 && (
                                                      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                                                         <Typography variant="body2" color="text.secondary">
                                                            Pembayaran Pre-Order (10%)
                                                         </Typography>
                                                         <Typography variant="body2" color="text.secondary">
                                                            -{NumberFormat(value.product_combination.discount_po)}
                                                         </Typography>
                                                      </Box>
                                                   )}
                                                   <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5, mb: 2 }}>
                                                      <Typography variant="body2" fontWeight="bold">
                                                         Subtotal
                                                      </Typography>
                                                      <Typography variant="body2" fontWeight="bold">
                                                         {NumberFormat(value.product_combination.subtotal)}
                                                      </Typography>
                                                   </Box>
                                                </Box>
                                                {val.data.length !== index + 1 && <Divider />}
                                             </Box>
                                          ))}
                                          <Divider />
                                          <Box sx={{ display: "flex", justifyContent: "space-between", my: 2 }}>
                                             <Typography variant="body2" fontWeight="bold">
                                                Subtotal Pesanan
                                             </Typography>
                                             <Typography variant="body2" fontWeight="bold">
                                                {NumberFormat(val.subtotal)}
                                             </Typography>
                                          </Box>
                                       </Grid>
                                       <Grid item xs={12} sm={5} md={12} lg={4.5} sx={{ mb: 3, mt: { xs: 1, sm: 2, md: 0, lg: 2 } }}>
                                          <Typography variant="body2" fontWeight="bold" gutterBottom>
                                             Kurir Pengiriman
                                          </Typography>
                                          <TextField
                                             size="small"
                                             name="courier"
                                             defaultValue="none"
                                             onChange={(e) => handleCourier(e, val.weight, val.shipping.cost, key)}
                                             value={val.courier}
                                             disabled={disabledService}
                                             select
                                             fullWidth
                                          >
                                             <MenuItem value="none" disabled selected>
                                                Pilih Kurir
                                             </MenuItem>
                                             {courier.map((value, index) => (
                                                <MenuItem value={value.slug} key={index}>
                                                   {value.courier}
                                                </MenuItem>
                                             ))}
                                          </TextField>
                                          {val.shipping.cost > 0 && (
                                             <Box sx={{ mt: 2 }}>
                                                <Typography variant="body2" fontWeight="bold" gutterBottom>
                                                   Kurir Pilihan
                                                </Typography>
                                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                                   <Box>
                                                      <Typography component="div" variant="caption" color="text.secondary">
                                                         {val.shipping.name}
                                                      </Typography>
                                                      <Typography component="div" variant="caption" color="text.secondary">
                                                         {val.shipping.service} - {val.shipping.description} ({NumberFormat(val.shipping.cost)})
                                                      </Typography>
                                                      {val.shipping.etd !== "" && (
                                                         <Typography component="div" variant="caption" color="text.secondary">
                                                            Estimasi tiba {val.shipping.etd === "0" || val.shipping.etd === "1-1" ? "1" : val.shipping.etd} hari
                                                         </Typography>
                                                      )}
                                                   </Box>
                                                   <Box>
                                                      {val.list_shipping?.length > 1 && (
                                                         <Typography
                                                            component="div"
                                                            variant="caption"
                                                            fontWeight="bold"
                                                            aria-controls={open ? "basic-menu" : undefined}
                                                            aria-haspopup="true"
                                                            aria-expanded={open ? "true" : undefined}
                                                            onClick={handleClick}
                                                            sx={{ cursor: "pointer" }}
                                                            disabled={disabledService}
                                                         >
                                                            Ubah
                                                         </Typography>
                                                      )}
                                                      <Menu
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
                                                         {val.list_shipping?.map((value, index) => (
                                                            <MenuItem
                                                               key={index}
                                                               value={value}
                                                               onClick={() => handleService(key, value, val.shipping.cost, cart)}
                                                            >
                                                               {val.shipping.service === value.service && (
                                                                  <ListItemIcon sx={{ mr: 0 }}>
                                                                     <Check />
                                                                  </ListItemIcon>
                                                               )}
                                                               <ListItemText inset={val.shipping.service !== value.service}>{value.service}</ListItemText>
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
                                          {val.shipping.cost === 0 && val.courier !== "none" && (
                                             <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
                                                <CircularProgress size={20} />
                                             </Box>
                                          )}
                                       </Grid>
                                    </Grid>
                                 </Box>
                              ))}
                           </Box>
                        </Grid>
                        <Grid item xs={12} md={5} lg={4}>
                           <Card sx={{ position: { xs: "relative", md: "fixed" }, width: { xs: "100%", md: "330px", lg: "350px" } }}>
                              <CardContent>
                                 <Typography fontWeight="bold">Ringkasan Belanja</Typography>
                                 <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                                    <Typography>Total Harga ({productQuantity} Barang)</Typography>
                                    <Typography>{NumberFormat(totalPrice)}</Typography>
                                 </Box>
                                 {shipping !== 0 && (
                                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                                       <Typography>Total Ongkos Kirim</Typography>
                                       <Typography>{NumberFormat(shipping)}</Typography>
                                    </Box>
                                 )}
                                 {listShippingDiscount.status === "active" && shippingDiscount !== 0 && totalPrice >= listShippingDiscount.minimum_price && (
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
                                    {transaction.address.address === value.address && <CheckRounded />}
                                 </Box>
                                 {transaction.address.address !== value.address && (
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
                  <RadioGroup name="payment_method" onChange={handleChange}>
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
                        disabled={preOrder > 0 || cod === false}
                        label={
                           <Fragment>
                              <Typography variant="body2" mt={1.5}>
                                 COD (Bayar di Tempat)
                              </Typography>
                              {preOrder < 1 && cod === false && (
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
               <LoadingButton
                  variant="contained"
                  sx={{ minWidth: { xs: 0, sm: "10rem" }, mb: 0.5 }}
                  startIcon={paymentMethod[0] === "transfer" && <GppGoodOutlined />}
                  disabled={paymentMethod.length < 1}
                  loading={dialogLoading}
                  onClick={handleSubmit}
               >
                  {paymentMethod[0] === "transfer" ? "Bayar" : "Bayar di Tempat"}
               </LoadingButton>
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
