import React from "react";
import axios from "axios";
import { Container, Grid, Typography, Link, Divider, Stack } from "@mui/material";

import { apiUrl } from "../../variable/Url";
import { Link as RouterLink } from "react-router-dom";

export default function Category(props) {
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
            // console.log(err.response);
         });
   };

   React.useEffect(() => {
      getCategory();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return (
      <Container>
         <Typography variant="h6" fontWeight="bold" py={3}>
            Kategori
         </Typography>
         {category.length > 0 ? (
            <Grid container spacing={2}>
               {category.map((value, index) => (
                  <Grid item xs={12} sm={6} md={4} lg mb={2} key={index}>
                     <Stack
                        component={RouterLink}
                        to={`/category/${value.id}`}
                        spacing={1}
                        direction="row"
                        alignItems="center"
                        divider={<Divider orientation="vertical" flexItem />}
                        sx={{ pb: 1, textDecoration: "none", color: "black" }}
                     >
                        <img alt={value.category_name} src={value.image_url} height="30" />
                        <Typography variant="button">{value.category_name}</Typography>
                     </Stack>
                     <Divider />
                     <Grid container spacing={1} pt={1}>
                        {value.sub_category.map((row, index) => (
                           <Grid item xs={6} key={index}>
                              <Typography variant="body2" color="text.secondary">
                                 <Link component={RouterLink} to={`/category/${value.id}/${row.id}`} underline="none" color="inherit">
                                    {row.sub_category_name}
                                 </Link>
                              </Typography>
                           </Grid>
                        ))}
                     </Grid>
                  </Grid>
               ))}
            </Grid>
         ) : (
            <Typography textAlign="center" mt={2}>
               Belum ada kategori
            </Typography>
         )}
      </Container>
   );
}
