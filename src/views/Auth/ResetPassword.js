import React, { Fragment, useState } from "react";
import axios from "axios";

import { Box, FormControl, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { Validation } from "../../components/Validation";
import { apiUrl } from "../../variable/Url";
import { MailOutlineRounded } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

export default function ResetPassword(props) {
   const [error, setError] = useState();
   const [success, setSuccess] = useState(false);
   const [data, setData] = useState({
      email: "",
   });
   const [loading, setLoading] = useState(false);
   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(undefined);
      let formData = new FormData();
      formData.append("email", data.email);
      // console.log(Object.fromEntries(formData));
      await axios
         .post(`${apiUrl}/user/reset_password/mail`, formData)
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
   return success === false ? (
      <Fragment>
         <Typography variant="h6" mt={3} mb={2}>
            Atur ulang kata sandi
         </Typography>
         <Typography variant="body2" color="text.secondary" mb={1}>
            Masukkan Email yang terdaftar. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi.
         </Typography>
         <Box component="form" onSubmit={handleSubmit}>
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
                  autoFocus
                  fullWidth
               />
               <Typography variant="caption" color="error">
                  {Validation(error?.email)}
               </Typography>
            </FormControl>
            <FormControl margin="normal" fullWidth sx={{ mt: 3 }}>
               <LoadingButton type="submit" variant="contained" loading={loading}>
                  Kirim
               </LoadingButton>
            </FormControl>
         </Box>
      </Fragment>
   ) : (
      <Box sx={{ textAlign: "center", pt: 8 }}>
         <MailOutlineRounded fontSize="large" />
         <Typography variant="h6" mt={3} mb={2}>
            Harap periksa email Anda
         </Typography>
         <Typography variant="body2" color="text.secondary" mb={1}>
            Kami telah mengirimkan tautan pemulihan kata sandi ke email Anda.
         </Typography>
         <FormControl margin="normal" fullWidth sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" component={RouterLink} to="/login">
               Oke
            </LoadingButton>
         </FormControl>
      </Box>
   );
}
