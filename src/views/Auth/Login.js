import React from "react";
import axios from "axios";
import { Box, FormControl, TextField, Typography, Link, InputAdornment, IconButton, OutlinedInput, Collapse, Alert } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { useRecoilState } from "recoil";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { authentication } from "../../store/Authentication";
import { carts } from "../../store/Carts";
import { Param } from "../../components/Param";
import { apiUrl } from "../../variable/Url";

export default function Category(props) {
   const redirect = Param("redirect");
   const navigate = useNavigate("redirect");
   // eslint-disable-next-line no-unused-vars
   const [auth, setAuth] = useRecoilState(authentication);
   const [cart, setCart] = useRecoilState(carts);
   const [data, setData] = React.useState();
   const [alert, setAlert] = React.useState(false);
   const [error, setError] = React.useState(false);
   const [loading, setLoading] = React.useState(false);
   const handleChange = (e) => {
      setData({
         ...data,
         [e.target.name]: e.target.value,
      });
   };
   const handleSubmit = async (e) => {
      e.preventDefault();
      setAlert(false);
      setLoading(true);
      let formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("type", "customer");
      await axios
         .post(`${apiUrl}/auth/login`, formData)
         .then((res) => {
            // console.log(res.data.data);
            let data = res.data.data;
            localStorage.setItem("token", data.access_token);
            axios
               .get(`${apiUrl}/carts`, {
                  headers: {
                     Authorization: "Bearer " + data.access_token,
                  },
               })
               .then((row) => {
                  setAuth({
                     auth: true,
                     user: data.user,
                  });
                  let total = 0;
                  row.data.data.map((value, index) => (total = total + value.quantity));
                  setCart({
                     ...cart,
                     total: total,
                  });
                  redirect !== false ? navigate(decodeURIComponent(redirect)) : navigate("/");
               });
         })
         .catch((err) => {
            // console.log(err.response);
            let responseError = err.response.data.data;
            if (responseError.message === "unauthorization") {
               setAlert(true);
               setLoading(false);
               setError("Email atau kata sandi salah");
            }
         });
   };

   const [values, setValues] = React.useState({
      showPassword: false,
   });
   const handleClickShowPassword = () => {
      setValues({
         ...values,
         showPassword: !values.showPassword,
      });
   };
   const handleMouseDownPassword = (event) => {
      event.preventDefault();
   };

   React.useEffect(() => {
      window.scrollTo(0, 0);
   }, [redirect]);

   return (
      <React.Fragment>
         <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="h6">Masuk</Typography>
            {redirect !== false && (
               <Typography variant="body2" color="text.secondary" mt={0.5}>
                  Anda akan diarahkan ke halaman produk
               </Typography>
            )}
         </Box>
         <Box component="form" onSubmit={handleSubmit}>
            <Collapse in={alert} sx={{ mt: 1 }}>
               <Alert severity="error">{error}</Alert>
            </Collapse>
            <FormControl margin="normal" fullWidth>
               <Typography variant="body2" fontWeight="bold" color="text.secondary">
                  Email
               </Typography>
               <TextField margin="dense" name="email" size="small" onChange={handleChange} required autoFocus fullWidth />
               <Typography variant="caption" color="text.secondary">
                  Contoh: email@zenitha.com
               </Typography>
            </FormControl>
            <FormControl margin="normal" fullWidth>
               <Typography variant="body2" fontWeight="bold" color="text.secondary" mb={1}>
                  Kata Sandi
               </Typography>
               <OutlinedInput
                  name="password"
                  type={values.showPassword ? "text" : "password"}
                  size="small"
                  inputProps={{ minLength: 8, maxLength: 32 }}
                  onChange={handleChange}
                  endAdornment={
                     <InputAdornment position="end">
                        <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                           {values.showPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                        </IconButton>
                     </InputAdornment>
                  }
                  required
                  fullWidth
               />
               <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                  <Link component={RouterLink} to="/reset-password" sx={{ textDecoration: "none" }}>
                     <Typography variant="body2">Lupa kata sandi?</Typography>
                  </Link>
               </Box>
            </FormControl>
            <FormControl margin="normal" fullWidth sx={{ mt: 3 }}>
               <LoadingButton type="submit" variant="contained" loading={loading}>
                  Masuk
               </LoadingButton>
            </FormControl>
         </Box>
      </React.Fragment>
   );
}
