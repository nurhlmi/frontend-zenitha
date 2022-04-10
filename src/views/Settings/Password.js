import React, { useRef } from "react";
import axios from "axios";
import { Box, FormControl, Grid, IconButton, InputAdornment, Snackbar, TextField, Typography } from "@mui/material";

import { apiUrl } from "../../variable/Url";
import { Validation } from "../../components/Validation";
import { Close, Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

export default function Password(props) {
   const token = localStorage.getItem("token");

   const [data, setData] = React.useState({
      old_password: "",
      password: "",
      password_confirmation: "",
   });
   const old_password = useRef(null);
   const password = useRef(null);
   const password_confirmation = useRef(null);
   const [error, setError] = React.useState();
   const [loading, setLoading] = React.useState(false);
   const [snackbar, setSnackbar] = React.useState(false);
   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(undefined);
      let formData = new FormData();
      formData.append("old_password", data.old_password);
      formData.append("password", data.password);
      formData.append("password_confirmation", data.password_confirmation);
      // console.log(data);
      // console.log(Object.fromEntries(formData));
      await axios
         .post(`${apiUrl}/user/reset_password/with_old_password`, formData, {
            headers: {
               Authorization: "Bearer " + token,
            },
         })
         .then((res) => {
            // console.log(res.data.data);
            setSnackbar(true);
            setLoading(false);
            old_password.current.value = "";
            password.current.value = "";
            password_confirmation.current.value = "";
         })
         .catch((err) => {
            // console.log(err.response);
            if (err.response) {
               if (err.response.data.data) {
                  setError({
                     ...error,
                     old_password: [err.response.data.data.message],
                  });
               } else {
                  setError(err.response.data.errors);
               }
            }
            setLoading(false);
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

   const [showPassword, setShowPassword] = React.useState(false);
   const handleClickShowPassword = () => {
      setShowPassword(!showPassword);
   };
   const handleMouseDownPassword = (event) => {
      event.preventDefault();
   };

   return (
      <Grid container>
         <Grid item xs={12} md={10} lg={8}>
            <Box component="form" noValidate={true} onSubmit={handleSubmit}>
               <FormControl margin="normal" fullWidth>
                  <TextField
                     id="old_password"
                     name="old_password"
                     label="Kata sandi saat ini"
                     variant="standard"
                     inputRef={old_password}
                     type={showPassword ? "text" : "password"}
                     onBlur={handleChange}
                     error={error?.old_password !== undefined ? true : false}
                     inputProps={{ minLength: 8 }}
                     InputProps={{
                        endAdornment: (
                           <InputAdornment position="end">
                              <IconButton
                                 aria-label="toggle password visibility"
                                 onClick={handleClickShowPassword}
                                 onMouseDown={handleMouseDownPassword}
                                 edge="end"
                              >
                                 {showPassword ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                           </InputAdornment>
                        ),
                     }}
                  />
                  <Typography variant="caption" color="error" mt={0.5}>
                     {error?.old_password !== undefined && Validation(error.old_password)}
                  </Typography>
               </FormControl>
               <FormControl margin="normal" fullWidth>
                  <TextField
                     id="password"
                     name="password"
                     label="Kata sandi baru"
                     variant="standard"
                     type={showPassword ? "text" : "password"}
                     inputRef={password}
                     onBlur={handleChange}
                     error={error?.password !== undefined ? true : false}
                     inputProps={{ minLength: 8 }}
                     InputProps={{
                        endAdornment: (
                           <InputAdornment position="end">
                              <IconButton
                                 aria-label="toggle password visibility"
                                 onClick={handleClickShowPassword}
                                 onMouseDown={handleMouseDownPassword}
                                 edge="end"
                              >
                                 {showPassword ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                           </InputAdornment>
                        ),
                     }}
                  />
                  <Typography variant="caption" color="error" mt={0.5}>
                     {error?.password !== undefined && Validation(error.password)}
                  </Typography>
               </FormControl>
               <FormControl margin="normal" fullWidth>
                  <TextField
                     id="password_confirmation"
                     name="password_confirmation"
                     label="Konfirmasi kata sandi"
                     variant="standard"
                     type={showPassword ? "text" : "password"}
                     inputRef={password_confirmation}
                     onBlur={handleChange}
                     error={error?.password_confirmation !== undefined ? true : false}
                     inputProps={{ minLength: 8 }}
                     InputProps={{
                        endAdornment: (
                           <InputAdornment position="end">
                              <IconButton
                                 aria-label="toggle password visibility"
                                 onClick={handleClickShowPassword}
                                 onMouseDown={handleMouseDownPassword}
                                 edge="end"
                              >
                                 {showPassword ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                           </InputAdornment>
                        ),
                     }}
                  />
                  <Typography variant="caption" color="error" mt={0.5}>
                     {error?.password_confirmation !== undefined && Validation(error.password_confirmation)}
                  </Typography>
               </FormControl>
               <FormControl margin="normal">
                  <LoadingButton variant="contained" loading={loading} type="submit">
                     Ubah Kata Sandi
                  </LoadingButton>
               </FormControl>
            </Box>
            <Snackbar
               open={snackbar}
               autoHideDuration={3000}
               onClose={() => setSnackbar(false)}
               message="Kata sandi berhasil diubah"
               action={
                  <IconButton size="small" aria-label="close" color="inherit" onClick={() => setSnackbar(false)}>
                     <Close fontSize="small" />
                  </IconButton>
               }
            />
         </Grid>
      </Grid>
   );
}
