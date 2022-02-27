import * as React from "react";
import { Container, Box, IconButton, Divider, Grid, Typography, Tooltip, Link } from "@mui/material";
import { FacebookRounded, Instagram, Twitter } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

export default function Footer(props) {
   const [category] = React.useState(["Sale", "Oval", "Zenitha", "Permata", "Adnin", "Madu Azura"]);
   return (
      <React.Fragment>
         <Divider sx={{ mt: 5, mb: 4 }} />
         <Container>
            <Grid container spacing={2} sx={{ mb: 5 }}>
               <Grid item xs={12} lg={3}>
                  <img alt="Logo" src="/assets/images/brands/zenitha.png" />
                  <Typography variant="body2">+62 789 7897 7897</Typography>
               </Grid>
               <Grid item xs={12} lg={3}>
                  <Typography variant="h6">Media Sosial</Typography>
                  <Box sx={{ display: "flex" }}>
                     <Tooltip title="Facebook">
                        <IconButton>
                           <FacebookRounded fontSize="small" />
                        </IconButton>
                     </Tooltip>
                     <Tooltip title="Instagram">
                        <IconButton>
                           <Instagram fontSize="small" />
                        </IconButton>
                     </Tooltip>
                     <Tooltip title="Twitter">
                        <IconButton>
                           <Twitter fontSize="small" />
                        </IconButton>
                     </Tooltip>
                  </Box>
               </Grid>
               <Grid item xs={12} lg={3}>
                  <Typography variant="h6">Kategori</Typography>
                  <Grid container spacing={1} sx={{ mt: 0.5 }}>
                     {category.map((value, index) => (
                        <Grid item xs={12} key={index}>
                           <Typography variant="body2" color="text.secondary">
                              <Link component={RouterLink} to={`/category/${value}`} underline="none" color="inherit">
                                 {value}
                              </Link>
                           </Typography>
                        </Grid>
                     ))}
                  </Grid>
               </Grid>
               <Grid item xs={12} lg={3}>
                  <Typography variant="h6">Informasi</Typography>
                  <Grid container spacing={1} sx={{ mt: 0.5 }}>
                     <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                           <Link component={RouterLink} to="/about" underline="none" color="inherit">
                              Tentang
                           </Link>
                        </Typography>
                     </Grid>
                     <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                           <Link component={RouterLink} to="/contact" underline="none" color="inherit">
                              Kontak
                           </Link>
                        </Typography>
                     </Grid>
                     <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                           <Link component={RouterLink} to="/faq" underline="none" color="inherit">
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
