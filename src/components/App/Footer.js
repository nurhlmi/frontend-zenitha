import * as React from "react";
import axios from "axios";
import { Container, Box, IconButton, Divider, Grid, Typography, Tooltip, Link } from "@mui/material";
import { FacebookRounded, Instagram, Twitter, YouTube } from "@mui/icons-material";

import { Link as RouterLink } from "react-router-dom";
import { apiUrl } from "../../variable/Url";

export default function Footer(props) {
   const [setting, setSetting] = React.useState();
   const getSetting = async () => {
      await axios
         .get(`${apiUrl}/setting`)
         .then((res) => {
            // console.log(res.data.data);
            setSetting(res.data.data);
         })
         .catch((err) => {
            console.log(err.response);
         });
   };

   const [category, setCategory] = React.useState([]);
   const getCategory = async () => {
      await axios
         .get(`${apiUrl}/category/fetch`, {
            params: {
               with_sub: 1,
            },
         })
         .then((res) => {
            // console.log(res.data.data);
            setCategory(res.data.data);
         })
         .catch((err) => {
            console.log(err.response);
         });
   };

   React.useEffect(() => {
      getSetting();
      getCategory();
   }, []);

   return (
      <React.Fragment>
         <Divider sx={{ mt: 5, mb: 4 }} />
         <Container>
            <Grid container spacing={2} sx={{ mb: 4 }}>
               <Grid item xs={12} sm={6} lg={3} sx={{ mb: 3 }}>
                  <img alt="Logo" src={setting?.logo_url} />
                  <Typography variant="body2" color="text.secondary" mt={1}>
                     +62 {setting?.phone}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                     {setting?.email}
                  </Typography>
                  {setting?.address !== null && (
                     <Typography variant="body2" color="text.secondary" mt={1}>
                        {setting?.address}
                     </Typography>
                  )}
               </Grid>
               <Grid item xs={12} sm={6} lg={3} sx={{ mb: 3 }}>
                  <Typography variant="h6">Media Sosial</Typography>
                  <Box sx={{ display: "flex" }}>
                     {setting?.fb_status !== 0 && (
                        <Tooltip title="Facebook">
                           <IconButton component={Link} href={setting?.fb} target="_blank">
                              <FacebookRounded fontSize="small" />
                           </IconButton>
                        </Tooltip>
                     )}
                     {setting?.ig_status !== 0 && (
                        <Tooltip title="Instagram">
                           <IconButton component={Link} href={setting?.ig} target="_blank">
                              <Instagram fontSize="small" />
                           </IconButton>
                        </Tooltip>
                     )}
                     {setting?.tw_status !== 0 && (
                        <Tooltip title="Twitter">
                           <IconButton component={Link} href={setting?.tw} target="_blank">
                              <Twitter fontSize="small" />
                           </IconButton>
                        </Tooltip>
                     )}
                     {setting?.yt_status !== 0 && (
                        <Tooltip title="YouTube">
                           <IconButton component={Link} href={setting?.yt} target="_blank">
                              <YouTube fontSize="small" />
                           </IconButton>
                        </Tooltip>
                     )}
                  </Box>
               </Grid>
               {category.length > 0 && (
                  <Grid item xs={12} sm={6} lg={3} sx={{ mb: 3 }}>
                     <Typography variant="h6">Kategori</Typography>
                     <Grid container spacing={1} sx={{ mt: 0.5 }}>
                        {category.map((value, index) => (
                           <Grid item xs={12} key={index}>
                              <Typography variant="body2" color="text.secondary">
                                 <Link component={RouterLink} to={`/category/${value.category_slug}`} underline="none" color="inherit">
                                    {value.category_name}
                                 </Link>
                              </Typography>
                           </Grid>
                        ))}
                     </Grid>
                  </Grid>
               )}
               <Grid item xs={12} sm={6} lg={3} sx={{ mb: 3 }}>
                  <Typography variant="h6">Informasi</Typography>
                  <Grid container spacing={1} sx={{ mt: 0.5 }}>
                     <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                           <Link component={RouterLink} to="/article-tutorial" underline="none" color="inherit">
                              Artikel & Tutorial
                           </Link>
                        </Typography>
                     </Grid>
                     <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                           <Link component={RouterLink} to="#" underline="none" color="inherit">
                              Tentang
                           </Link>
                        </Typography>
                     </Grid>
                     <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                           <Link component={RouterLink} to="#" underline="none" color="inherit">
                              Kontak
                           </Link>
                        </Typography>
                     </Grid>
                     <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                           <Link component={RouterLink} to="#" underline="none" color="inherit">
                              FAQ
                           </Link>
                        </Typography>
                     </Grid>
                  </Grid>
               </Grid>
            </Grid>
         </Container>
      </React.Fragment>
   );
}
