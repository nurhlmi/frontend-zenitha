import React from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../style/Slider.css";

import {
   Container,
   Grid,
   Typography,
   Box,
   Tooltip,
   IconButton,
   TextField,
   MenuItem,
   Button,
   ButtonGroup,
   Snackbar,
   CircularProgress,
   Link,
} from "@mui/material";
import { FavoriteRounded, FavoriteBorderRounded, Add, Remove, Close } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

import { Link as RouterLink } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authentication } from "../../store/Authentication";
import { carts } from "../../store/Carts";
import { apiUrl } from "../../variable/Url";
import { NumberFormat } from "../../components/Format";

export default function ProductDetail(props) {
   const { slug } = useParams();
   const navigate = useNavigate();
   const token = localStorage.getItem("token");
   const [auth] = useRecoilState(authentication);
   const [cart, setCart] = useRecoilState(carts);

   const [data, setData] = React.useState();
   const [product, setProduct] = React.useState();
   const [quantity, setQuantity] = React.useState(0);
   const [snackbar, setSnackbar] = React.useState(false);
   const [disabled, setDisabled] = React.useState(false);
   const [error, setError] = React.useState(false);
   const [message, setMessage] = React.useState();

   const getProductCombinationSlug = async () => {
      await axios
         .get(`${apiUrl}/product/product_combination_by_slug/${slug}`)
         .then((res) => {
            // console.log(res.data.data);
            let value = res.data.data;
            setData(value);
            setProduct(value.product);
            setQuantity(value.product.minimum_order);
            getWishlist(auth.user.id, value.product.id);
         })
         .catch((xhr) => {
            console.log(xhr.response);
         });
   };

   const getProductCombination = async (combination_string) => {
      setDisabled(true);
      await axios
         .get(`${apiUrl}/product/product_combination`, {
            params: {
               product_id: product?.id,
               combination_string: combination_string,
            },
         })
         .then((res) => {
            // console.log(res.data.data);
            let value = res.data.data;
            setData(value);
            setQuantity(1);
            if (value.stock > 0) {
               setDisabled(false);
            } else {
               setError("Stok barang telah habis");
            }
            // setQuantity(value.product.minimum_order);
         })
         .catch((xhr) => {
            // console.log(xhr.response);
            setData({
               ...data,
               stock: 0,
            });
            setQuantity(1);
            setError("Barang belum tersedia");
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
         output = Math.round((discount / price) * 100);
      } else {
         output = discount;
      }
      return output;
   };

   const [wishlist, setWishlist] = React.useState();
   const getWishlist = async (user_id, product_id) => {
      await axios
         .get(`${apiUrl}/user_wishlist/show`, {
            params: {
               user_id: user_id,
               product_id: product_id,
            },
            headers: {
               Authorization: "Bearer " + token,
            },
         })
         .then((res) => {
            // console.log(res.data.data);
            res.data.data !== null ? setWishlist(true) : setWishlist(false);
         })
         .catch((xhr) => {
            console.log(xhr.response);
         });
   };
   const handleWishlist = async (product_id) => {
      let formData = new FormData();
      formData.append("product_id", product_id);
      await axios
         .post(`${apiUrl}/user_wishlist/wishlist`, formData, {
            headers: {
               Authorization: "Bearer " + token,
            },
         })
         .then((res) => {
            // console.log(res.data.data);
            if (res.data.data !== null) {
               setWishlist(true);
               setSnackbar(true);
               setMessage(`Barang berhasil disimpan di Wishlist`);
            } else {
               setWishlist(false);
               setSnackbar(true);
               setMessage(`Barang telah dihapus dari Wishlist`);
            }
         })
         .catch((xhr) => {
            console.log(xhr.response);
         });
   };

   const [variant, setVariant] = React.useState();
   const handleChange = (e) => {
      setVariant({
         ...variant,
         [e.target.name]: e.target.value,
      });
   };

   const handleSubmit = (preorder) => {
      setDisabled(true);
      let formData = new FormData();
      formData.append("product_slug", data.product_slug);
      formData.append("quantity", quantity);
      axios
         .post(`${apiUrl}/carts/create`, formData, {
            headers: {
               Authorization: "Bearer " + token,
            },
         })
         .then((res) => {
            // console.log(res.data.data);
            let total = cart.total + quantity;
            setCart({
               ...cart,
               total: total,
            });
            if (preorder === true) {
               navigate("/cart");
            } else {
               setDisabled(false);
               setSnackbar(true);
               setMessage(`${quantity} barang berhasil ditambahkan`);
            }
         })
         .catch((xhr) => {
            setDisabled(false);
            // console.log(xhr.response);
            if (xhr.response) {
               let err = xhr.response.data.data;
               if (err.message === "cannot add this product") {
                  setSnackbar(true);
                  setMessage(`Stok barang ini tersisa ${err.stock}, dan kamu sudah punya ${err.quantity} di keranjangmu`);
               }
            }
         });
   };

   const handleCart = (preorder) => {
      if (auth.auth === true) {
         let length = Object.keys(product?.product_variant_option).length;
         if (length === 0) {
            handleSubmit(preorder);
         } else {
            if (variant !== undefined) {
               if (length === 1) {
                  variant.variant1 !== undefined ? handleSubmit(preorder) : setError("Pilih varian terlebih dahulu");
               } else if (length === 2) {
                  variant.variant1 !== undefined && variant.variant2 !== undefined ? handleSubmit(preorder) : setError("Pilih varian terlebih dahulu");
               } else {
                  setError("Pilih varian terlebih dahulu");
               }
            } else {
               setError("Pilih varian terlebih dahulu");
            }
         }
      } else {
         navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      }
   };

   React.useEffect(() => {
      if (quantity < 1) {
         window.scrollTo(0, 0);
         getProductCombinationSlug();
      }
      if (variant !== undefined) {
         let length = Object.keys(product?.product_variant_option).length;
         if (length === 1 && variant.variant1 !== undefined) {
            getProductCombination(variant.variant1);
            setError("");
         } else if (length === 2 && variant.variant1 !== undefined && variant.variant2 !== undefined) {
            getProductCombination(`${variant.variant1}-${variant.variant2}`);
            setError("");
         }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [slug, variant]);

   const settings = {
      customPaging: function (i) {
         return (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a>
               <img alt="Slider" src={product.product_image[i].product_image_url} />
            </a>
         );
      },
      dots: true,
      infinite: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      dotsClass: "slick-dots slick-thumb",
      responsive: [
         {
            breakpoint: 600,
            settings: {
               dots: false,
            },
         },
      ],
   };

   const action = (
      <IconButton size="small" aria-label="close" color="inherit" onClick={() => setSnackbar(false)}>
         <Close fontSize="small" />
      </IconButton>
   );

   return (
      <Container sx={{ flex: 1, mt: { xs: 1, sm: 0, lg: 4 } }}>
         {data !== undefined && product !== undefined && wishlist !== undefined ? (
            <Grid container spacing={{ xs: 1, sm: 4 }}>
               <Grid item xs={12} lg={1} />
               <Grid item xs={12} sm={6} lg={5}>
                  <Box sx={{ mb: { xs: -1.5, sm: 2 } }}>
                     <Slider {...settings}>
                        {product.product_image.map((value, index) => (
                           <div key={index}>
                              <img alt="Slide" src={value.product_image_url} />
                           </div>
                        ))}
                     </Slider>
                  </Box>
               </Grid>
               <Grid item xs={12} sm={6} lg={5}>
                  <Box>
                     <Typography variant="h6" fontWeight="bold" mb={2} sx={{ display: { xs: "none", sm: "block" } }}>
                        {product.product_name}
                     </Typography>
                     <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography variant="h5" component="div" fontWeight="bold">
                           {product.discount !== null
                              ? NumberFormat(getDiscount(data.price, product.discount, product.discount_type))
                              : NumberFormat(data.price)}
                        </Typography>
                        <Tooltip title={wishlist === true ? "Hapus dari Wishlist" : "Tambah ke Wishlist"}>
                           <IconButton onClick={() => handleWishlist(data.product.id)} color={wishlist === true ? "error" : "inherit"}>
                              {wishlist === true ? <FavoriteRounded /> : <FavoriteBorderRounded />}
                           </IconButton>
                        </Tooltip>
                     </Box>
                     {product.discount !== null && (
                        <React.Fragment>
                           <Box sx={{ display: "inline", background: "#ffeaef", borderRadius: 0.5, px: 0.5, pb: 0.4, mr: 1 }}>
                              <Typography variant="caption" color="#ff5c84" fontWeight="bold">
                                 {getPercent(data.price, product.discount, product.discount_type)}%
                              </Typography>
                           </Box>
                           <Typography variant="caption" color="text.secondary">
                              <del>{NumberFormat(data.price)}</del>
                           </Typography>
                        </React.Fragment>
                     )}
                     <Typography variant="subtitle1" sx={{ display: { xs: "block", sm: "none" } }} mt={1}>
                        {product.product_name}
                     </Typography>
                  </Box>
                  {Object.keys(product?.product_variant_option).length > 0 && (
                     <Box sx={{ borderTop: "1px solid #e0e0e0", pt: 2, pb: 1, mt: 2 }}>
                        <Typography fontWeight="bold" mb={1}>
                           Pilih Varian
                        </Typography>
                        <Grid container spacing={1}>
                           {product.product_variant_option.map((value, index) => (
                              <Grid item xs={12} md={6} key={index}>
                                 <Box sx={{ display: "flex" }}>
                                    {value.variant_name}:&nbsp;
                                    <Typography color="text.secondary">{value.product_variant_option_value.length} varian</Typography>
                                 </Box>
                                 <TextField name={`variant${index + 1}`} size="small" defaultValue="none" onChange={handleChange} select fullWidth>
                                    <MenuItem value="none" disabled selected>
                                       Pilih {value.variant_name}
                                    </MenuItem>
                                    {value.product_variant_option_value.map((row, index) => (
                                       <MenuItem value={row.variant_option_name} key={index} selected={index === 0 ? true : false}>
                                          {row.variant_option_name}
                                       </MenuItem>
                                    ))}
                                 </TextField>
                              </Grid>
                           ))}
                        </Grid>
                        <Typography variant="caption" color="error">
                           {error}
                        </Typography>
                     </Box>
                  )}
                  <Box sx={{ borderTop: "1px solid #e0e0e0", pt: 2, mt: 2 }}>
                     <Typography fontWeight="bold" mb={1}>
                        Atur Jumlah
                     </Typography>
                     <Box sx={{ display: "flex", alignItems: "center" }}>
                        <ButtonGroup>
                           <Button
                              aria-label="reduce"
                              onClick={() => {
                                 setQuantity(Math.max(quantity - 1, 1));
                              }}
                           >
                              <Remove fontSize="small" />
                           </Button>
                           <Button>{quantity}</Button>
                           <Button
                              aria-label="increase"
                              onClick={() => {
                                 quantity < data.stock && setQuantity(quantity + 1);
                              }}
                           >
                              <Add fontSize="small" />
                           </Button>
                        </ButtonGroup>
                        <Box sx={{ display: "flex" }}>
                           <Typography color="text.secondary" ml={2}>
                              Stok
                           </Typography>
                           &nbsp;
                           <Typography fontWeight="bold">{data.stock}</Typography>
                           &nbsp;
                           <Typography color="text.secondary">Pcs</Typography>
                        </Box>
                     </Box>
                     <Typography variant="caption" color="text.secondary" component="div" mt={0.5} mb={2}>
                        Minimal pembelian {product.minimum_order} pcs
                     </Typography>
                     <Grid container spacing={1}>
                        {product.preorder !== 0 && (
                           <Grid item xs={6}>
                              <LoadingButton variant="outlined" onClick={() => handleCart(true)} disabled={disabled} fullWidth>
                                 Pre Order
                              </LoadingButton>
                           </Grid>
                        )}
                        <Grid item xs={product.preorder !== 0 ? 6 : 12}>
                           <LoadingButton variant="contained" onClick={() => handleCart(false)} disabled={disabled} fullWidth>
                              Tambahkan ke Keranjang
                           </LoadingButton>
                        </Grid>
                     </Grid>
                  </Box>
                  <Snackbar open={snackbar} autoHideDuration={3000} onClose={() => setSnackbar(false)} message={message} action={action} />
               </Grid>
               <Grid item xs={12} lg={1} />
               <Grid item xs={12} lg={1} />
               <Grid item xs={12} lg={10}>
                  <Box sx={{ borderTop: "1px solid #e0e0e0", pt: 2 }}>
                     <Typography fontWeight="bold" mb={1}>
                        Detail Produk
                     </Typography>
                     <table>
                        <tbody>
                           <tr>
                              <td>
                                 <Typography color="text.secondary">Kondisi</Typography>
                              </td>
                              <td>Baru</td>
                           </tr>
                           <tr>
                              <td>
                                 <Typography color="text.secondary">Berat</Typography>
                              </td>
                              <td>
                                 {product.product_weight} {product.weight_unit}
                              </td>
                           </tr>
                           <tr>
                              <td>
                                 <Typography color="text.secondary">Panjang</Typography>
                              </td>
                              <td>
                                 {product?.["length"]} {product.size_unit}
                              </td>
                           </tr>
                           <tr>
                              <td>
                                 <Typography color="text.secondary">Tinggi</Typography>
                              </td>
                              <td>
                                 {product.height} {product.size_unit}
                              </td>
                           </tr>
                           {product.preorder !== 0 && (
                              <tr>
                                 <td>
                                    <Typography color="text.secondary">Waktu Preorder</Typography>
                                 </td>
                                 <td>
                                    {product.duration} {product.duration_unit === "day" && "Hari"}
                                    {product.duration_unit === "week" && "Minggu"}
                                    {product.duration_unit === "month" && "Bulan"}
                                 </td>
                              </tr>
                           )}
                           <tr>
                              <td>
                                 <Typography color="text.secondary">Kategori</Typography>
                              </td>
                              <td>
                                 <Link
                                    component={RouterLink}
                                    to={`/category/${product.category.category_slug}/${product.sub_category.sub_category_slug}`}
                                    underline="none"
                                 >
                                    <Typography fontWeight="bold">{product.sub_category.sub_category_name}</Typography>
                                 </Link>
                              </td>
                           </tr>
                        </tbody>
                     </table>
                     <Typography
                        variant="body1"
                        dangerouslySetInnerHTML={{
                           __html: product.description,
                        }}
                     />
                  </Box>
               </Grid>
            </Grid>
         ) : (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70vh" }}>
               <CircularProgress />
            </Box>
         )}
      </Container>
   );
}
