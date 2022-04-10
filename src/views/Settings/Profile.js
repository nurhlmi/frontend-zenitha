import React from "react";
import axios from "axios";
import { Box, FormControl, Grid, IconButton, InputAdornment, Snackbar, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Close } from "@mui/icons-material";

import { apiUrl } from "../../variable/Url";
import { Validation } from "../../components/Validation";
import { authentication } from "../../store/Authentication";
import { useRecoilState } from "recoil";

export default function Profile(props) {
   const token = localStorage.getItem("token");
   const [auth, setAuth] = useRecoilState(authentication);

   const [error, setError] = React.useState();
   const [loading, setLoading] = React.useState(false);
   const [snackbar, setSnackbar] = React.useState(false);
   const [data, setData] = React.useState({
      name: auth.user.name,
      phone_number: auth.user.phone_number,
   });
   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(undefined);
      await axios
         .put(
            `${apiUrl}/user/update/${auth.user.id}`,
            {
               name: data.name,
               phone_number: parseInt(data.phone_number),
               role: auth.user.role,
               status: auth.user.status,
            },
            {
               headers: {
                  Authorization: "Bearer " + token,
               },
            }
         )
         .then((res) => {
            // console.log(res.data.data);
            setLoading(false);
            setSnackbar(true);
            setAuth({
               auth: true,
               user: res.data.data,
            });
         })
         .catch((xhr) => {
            // console.log(xhr.response);
            setError(xhr.response.data.errors);
            setLoading(false);
         });
   };

   const handleChange = (e) => {
      setData({
         ...data,
         [e.target.name]: e.target.value,
      });
   };

   return (
      <Grid container>
         <Grid item xs={12} md={10} lg={8}>
            <Box component="form" noValidate={true} onSubmit={handleSubmit}>
               <FormControl margin="normal" fullWidth>
                  <TextField name="name" variant="standard" label="Nama Lengkap" value={data.name} onChange={handleChange} />
                  <Typography variant="caption" color="error" mt={0.5}>
                     {error?.name !== undefined && Validation(error.name)}
                  </Typography>
               </FormControl>
               <FormControl margin="normal" fullWidth>
                  <TextField
                     name="phone_number"
                     variant="standard"
                     label="Nomor HP"
                     value={data.phone_number}
                     onChange={handleChange}
                     inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                     InputProps={{
                        startAdornment: <InputAdornment position="start">+62</InputAdornment>,
                     }}
                  />
                  <Typography variant="caption" color="error" mt={0.5}>
                     {error?.phone_number !== undefined && Validation(error.phone_number)}
                  </Typography>
               </FormControl>
               <FormControl margin="normal" fullWidth sx={{ mb: 1.5 }}>
                  <TextField name="email" variant="standard" label="Email" value={auth.user.email} disabled />
               </FormControl>
               <FormControl margin="normal">
                  <LoadingButton type="submit" variant="contained" loading={loading}>
                     Simpan
                  </LoadingButton>
               </FormControl>
            </Box>
            <Snackbar
               open={snackbar}
               autoHideDuration={3000}
               onClose={() => setSnackbar(false)}
               message="Biodata diri berhasil disimpan"
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
