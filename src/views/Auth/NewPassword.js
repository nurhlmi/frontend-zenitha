import React, { Fragment, useState } from "react";
import axios from "axios";

import { Box, FormControl, IconButton, InputAdornment, OutlinedInput, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { Validation } from "../../components/Validation";
import { apiUrl } from "../../variable/Url";
import { CheckCircleOutlineRounded, Visibility, VisibilityOff } from "@mui/icons-material";
import { Link as RouterLink, useParams } from "react-router-dom";

export default function NewPassword(props) {
   const { token } = useParams();
   const [error, setError] = useState();
   const [success, setSuccess] = useState(false);
   const [data, setData] = useState({
      password: "",
      password_confirmation: "",
   });
   const [loading, setLoading] = useState(false);
   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(undefined);
      let formData = new FormData();
      formData.append("token", token);
      formData.append("password", data.password);
      formData.append("password_confirmation", data.password_confirmation);
      // console.log(Object.fromEntries(formData));
      await axios
         .post(`${apiUrl}/user/reset_password/token`, formData)
         .then((res) => {
            // console.log(res.data.data);
            setSuccess(true);
         })
         .catch((xhr) => {
            setLoading(false);
            let err = xhr.response.data.errors;
            // console.log(err);
            setError(err);
         });
   };
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

   return success === false ? (
      <Fragment>
         <Typography variant="h6" mt={3} mb={2}>
            Atur ulang kata sandi
         </Typography>
         <Typography variant="body2" color="text.secondary" mb={1}>
            Harap bedakan kata sandi baru Anda dengan kata sandi yang digunakan sebelumnya.
         </Typography>
         <Box component="form" onSubmit={handleSubmit}>
            <FormControl margin="normal" fullWidth>
               <Typography variant="body2" fontWeight="bold" color="text.secondary" mb={1}>
                  Kata Sandi Baru
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
                        <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                           {values.showPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                        </IconButton>
                     </InputAdornment>
                  }
                  autoFocus
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
                        <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                           {values.showPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                        </IconButton>
                     </InputAdornment>
                  }
                  fullWidth
               />
               <Typography variant="caption" color="error" mt={0.5}>
                  {Validation(error?.password_confirmation)}
               </Typography>
            </FormControl>
            <FormControl margin="normal" fullWidth sx={{ mt: 3 }}>
               <LoadingButton type="submit" variant="contained" loading={loading}>
                  Atur Ulang Kata Sandi
               </LoadingButton>
            </FormControl>
         </Box>
      </Fragment>
   ) : (
      <Box sx={{ textAlign: "center", pt: 8 }}>
         <CheckCircleOutlineRounded fontSize="large" />
         <Typography variant="h6" mt={3} mb={2}>
            Kata sandi berhasil diubah
         </Typography>
         <Typography variant="body2" color="text.secondary" mb={1}>
            Jaga selalu keamanan akun Anda dan ubah kata sandi secara berkala.
         </Typography>
         <FormControl margin="normal" fullWidth sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" component={RouterLink} to="/login">
               Masuk
            </LoadingButton>
         </FormControl>
      </Box>
   );
}
