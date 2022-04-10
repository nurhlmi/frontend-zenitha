import React from "react";
import axios from "axios";
import { Box, FormControl, TextField, Typography, InputAdornment, IconButton, OutlinedInput, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { CheckCircleOutlined, Visibility, VisibilityOff } from "@mui/icons-material";

import { Link as RouterLink } from "react-router-dom";
import { apiUrl } from "../../variable/Url";
import { Validation } from "../../components/Validation";

export default function Register(props) {
   const [loading, setLoading] = React.useState(false);
   const [success, setSuccess] = React.useState(false);
   const [error, setError] = React.useState();
   const [data, setData] = React.useState({
      name: "",
      phone_number: "",
      email: "",
      password: "",
      password_confirmation: "",
   });
   const handleChange = (e) => {
      setData({
         ...data,
         [e.target.name]: e.target.value,
      });
      setError({
         ...error,
         [e.target.name]: undefined,
      });
   };
   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(undefined);
      let formData = new FormData();
      formData.append("name", data.name);
      formData.append("phone_number", parseInt(data.phone_number));
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("password_confirmation", data.password_confirmation);
      formData.append("role", "customer");
      // console.log(Object.fromEntries(formData));
      await axios
         .post(`${apiUrl}/user/create_customer`, formData)
         .then((res) => {
            // console.log(res.data.data);
            setSuccess(true);
            window.scrollTo(0, 0);
         })
         .catch((xhr) => {
            setLoading(false);
            let err = xhr.response.data.errors;
            // console.log(err);
            setError(err);
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

   return (
      <React.Fragment>
         {success === false ? (
            <React.Fragment>
               <Typography variant="h6" mt={3} mb={2}>
                  Daftar
               </Typography>
               <Box component="form" noValidate={true} onSubmit={handleSubmit}>
                  <FormControl margin="normal" fullWidth>
                     <Typography variant="body2" fontWeight="bold" color="text.secondary">
                        Nama Lengkap
                     </Typography>
                     <TextField
                        margin="dense"
                        name="name"
                        size="small"
                        onBlur={handleChange}
                        error={error?.name !== undefined ? true : false}
                        required
                        autoFocus
                        fullWidth
                     />
                     <Typography variant="caption" color="error">
                        {Validation(error?.name)}
                     </Typography>
                     <Typography variant="caption" color="text.secondary">
                        Contoh: John Doe
                     </Typography>
                  </FormControl>
                  <FormControl margin="normal" fullWidth>
                     <Typography variant="body2" fontWeight="bold" color="text.secondary">
                        Nomor HP
                     </Typography>
                     <TextField
                        margin="dense"
                        name="phone_number"
                        type="tel"
                        size="small"
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                        InputProps={{
                           startAdornment: <InputAdornment position="start">+62</InputAdornment>,
                        }}
                        onBlur={handleChange}
                        error={error?.phone_number !== undefined ? true : false}
                        required
                        fullWidth
                     />
                     <Typography variant="caption" color="error">
                        {Validation(error?.phone_number)}
                     </Typography>
                     <Typography variant="caption" color="text.secondary">
                        Contoh: +62 81912345678
                     </Typography>
                  </FormControl>
                  <FormControl margin="normal" fullWidth>
                     <Typography variant="body2" fontWeight="bold" color="text.secondary">
                        Email
                     </Typography>
                     <TextField
                        margin="dense"
                        name="email"
                        type="email"
                        size="small"
                        onBlur={handleChange}
                        error={error?.email !== undefined ? true : false}
                        required
                        fullWidth
                     />
                     <Typography variant="caption" color="error">
                        {Validation(error?.email)}
                     </Typography>
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
                        size="small"
                        inputProps={{ minLength: 8, maxLength: 32 }}
                        type={values.showPassword ? "text" : "password"}
                        onBlur={handleChange}
                        error={error?.password !== undefined ? true : false}
                        endAdornment={
                           <InputAdornment position="end">
                              <IconButton
                                 aria-label="toggle password visibility"
                                 onClick={handleClickShowPassword}
                                 onMouseDown={handleMouseDownPassword}
                                 edge="end"
                              >
                                 {values.showPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                              </IconButton>
                           </InputAdornment>
                        }
                        required
                        fullWidth
                     />
                     <Typography variant="caption" color="error" mt={0.5}>
                        {Validation(error?.password)}
                     </Typography>
                  </FormControl>
                  <FormControl margin="normal" fullWidth>
                     <Typography variant="body2" fontWeight="bold" color="text.secondary" mb={1}>
                        Konfirmasi Kata Sandi
                     </Typography>
                     <OutlinedInput
                        name="password_confirmation"
                        size="small"
                        inputProps={{ minLength: 8, maxLength: 32 }}
                        type={values.showPassword ? "text" : "password"}
                        onBlur={handleChange}
                        error={error?.password_confirmation !== undefined ? true : false}
                        endAdornment={
                           <InputAdornment position="end">
                              <IconButton
                                 aria-label="toggle password visibility"
                                 onClick={handleClickShowPassword}
                                 onMouseDown={handleMouseDownPassword}
                                 edge="end"
                              >
                                 {values.showPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                              </IconButton>
                           </InputAdornment>
                        }
                        required
                        fullWidth
                     />
                     <Typography variant="caption" color="error" mt={0.5}>
                        {Validation(error?.password_confirmation)}
                     </Typography>
                  </FormControl>
                  <FormControl margin="normal" fullWidth sx={{ mt: 3 }}>
                     <LoadingButton type="submit" variant="contained" loading={loading}>
                        Daftar
                     </LoadingButton>
                  </FormControl>
               </Box>
            </React.Fragment>
         ) : (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "70vh", mt: 3 }}>
               <Box sx={{ textAlign: "center", width: "100%" }}>
                  <CheckCircleOutlined sx={{ fontSize: "50px" }} />
                  <Typography variant="h6" mb={3}>
                     Daftar Berhasil
                  </Typography>
                  <Typography color="text.secondary">
                     Nama: <b>{data?.name}</b>
                  </Typography>
                  <Typography color="text.secondary" mb={4}>
                     Email: <b>{data?.email}</b>
                  </Typography>
                  <Button variant="contained" component={RouterLink} to="/login" fullWidth>
                     Masuk
                  </Button>
               </Box>
            </Box>
         )}
      </React.Fragment>
   );
}
