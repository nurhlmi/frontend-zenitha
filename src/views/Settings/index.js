import React from "react";
import { Container, Box, Tabs, Tab, Typography, Card, Grid, Avatar, CardContent, Divider } from "@mui/material";

import { useRecoilState } from "recoil";
import { authentication } from "../../store/Authentication";
import { Link as RouterLink } from "react-router-dom";

export default function Settings(props) {
   const [auth] = useRecoilState(authentication);
   return (
      <Container sx={{ flex: 1 }}>
         <Typography variant="h6" fontWeight="bold" py={3}>
            Pengaturan
         </Typography>
         <Grid container spacing={2}>
            <Grid item xs={12} sm={4} lg={3}>
               <Card>
                  <CardContent>
                     <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar sx={{ width: 65, height: 65 }} />
                        <Box sx={{ ml: 2 }}>
                           <Typography noWrap mb={1}>
                              {auth.user.name}
                           </Typography>
                           <Typography variant="caption" component="div" color="text.secondary">
                              +62 {auth.user.phone_number}
                           </Typography>
                           <Typography variant="caption" component="div" color="text.secondary" noWrap>
                              {auth.user.email}
                           </Typography>
                        </Box>
                     </Box>
                  </CardContent>
               </Card>
            </Grid>
            <Grid item xs={12} sm={8} lg={9}>
               <Card>
                  <Tabs value={props.route} aria-label="nav tabs example" indicatorColor="primary">
                     <Tab label="Biodata Diri" value="profile" component={RouterLink} to="/settings" />
                     <Tab label="Daftar Alamat" value="address" component={RouterLink} to="/settings/address" />
                     <Tab label="Ubah Kata Sandi" value="password" component={RouterLink} to="/settings/password" />
                  </Tabs>
                  <Divider />
                  <CardContent sx={{ px: 3 }}>
                     <Box sx={{ minHeight: "300px" }}>{props.render}</Box>
                  </CardContent>
               </Card>
            </Grid>
         </Grid>
      </Container>
   );
}
