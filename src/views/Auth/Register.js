import React from "react";
import { Box, FormControl, TextField, Typography, InputAdornment, IconButton, OutlinedInput } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function Category(props) {
   const [data, setData] = React.useState();
   const [loading, setLoading] = React.useState(false);
   const handleChange = (e) => {
      setData({
         ...data,
         [e.target.name]: e.target.value,
      });
   };
   const handleSubmit = (e) => {
      e.preventDefault();
      setLoading(true);
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
         <Typography variant="h6" mt={3} mb={2}>
            Daftar
         </Typography>
         <Box component="form" onSubmit={handleSubmit}>
            <FormControl margin="normal" fullWidth>
               <Typography variant="body2" fontWeight="bold" color="text.secondary">
                  Email
               </Typography>
               <TextField margin="dense" name="email" type="email" size="small" onBlur={handleChange} required autoFocus fullWidth />
               <Typography variant="caption" color="text.secondary">
                  Contoh: email@zenitha.com
               </Typography>
            </FormControl>
            <FormControl margin="normal" fullWidth>
               <Typography variant="body2" fontWeight="bold" color="text.secondary">
                  Nomor HP
               </Typography>
               <TextField
                  margin="dense"
                  name="phone"
                  type="tel"
                  size="small"
                  onBlur={handleChange}
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  required
                  fullWidth
               />
               <Typography variant="caption" color="text.secondary">
                  Contoh: 081912345678
               </Typography>
            </FormControl>
            <FormControl margin="normal" fullWidth>
               <Typography variant="body2" fontWeight="bold" color="text.secondary">
                  Nama Lengkap
               </Typography>
               <TextField margin="dense" name="name" size="small" onBlur={handleChange} required fullWidth />
               <Typography variant="caption" color="text.secondary">
                  Contoh: John Doe
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
               <Typography variant="caption" color="text.secondary">
                  Minimal 8 karakter
               </Typography>
            </FormControl>
            <FormControl margin="normal" fullWidth sx={{ mt: 3 }}>
               <LoadingButton type="submit" variant="contained" loading={loading}>
                  Daftar
               </LoadingButton>
            </FormControl>
         </Box>
      </React.Fragment>
   );
}
