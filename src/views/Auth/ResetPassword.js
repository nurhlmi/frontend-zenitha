import React from "react";
import { Box, FormControl, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";

export default function Category(props) {
   const [data, setData] = React.useState();
   const [loading, setLoading] = React.useState(false);
   const handleSubmit = (e) => {
      e.preventDefault();
      setLoading(true);
   };
   const handleChange = (e) => {
      setData({
         ...data,
         [e.target.name]: e.target.value,
      });
   };
   return (
      <React.Fragment>
         <Typography variant="h6" mt={3} mb={2}>
            Atur ulang kata sandi
         </Typography>
         <Typography variant="body2" color="text.secondary" mb={1}>
            Masukkan nomor HP atau Email yang terdaftar. Kami akan mengirimkan kode verifikasi untuk mengatur ulang kata sandi.
         </Typography>
         <Box component="form" onSubmit={handleSubmit}>
            <FormControl margin="normal" fullWidth>
               <Typography variant="body2" fontWeight="bold" color="text.secondary">
                  Nomor HP atau Email
               </Typography>
               <TextField margin="dense" name="email_phone" size="small" onChange={handleChange} required autoFocus fullWidth />
               <Typography variant="caption" color="text.secondary">
                  Contoh: email@zenitha.com
               </Typography>
            </FormControl>
            <FormControl margin="normal" fullWidth sx={{ mt: 3 }}>
               <LoadingButton type="submit" variant="contained" loading={loading}>
                  Kirim
               </LoadingButton>
            </FormControl>
         </Box>
      </React.Fragment>
   );
}
