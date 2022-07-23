import React, { Fragment, useEffect, useState } from "react";
import { Container, Box, Typography, Grid, CircularProgress, Pagination } from "@mui/material";
import { LocalMallOutlined } from "@mui/icons-material";

import axios from "axios";
import { apiUrl } from "../../variable/Url";
import { ProductCard } from "../../components/Card";
import { useRecoilState } from "recoil";
import { authentication } from "../../store/Authentication";

export default function Products(props) {
   const [auth] = useRecoilState(authentication);

   const [page, setPage] = useState(1);
   const [data, setData] = useState();
   let params;
   if (auth.auth === true) {
      params = {
         user_id: auth.user.id,
      };
   }
   const getData = async () => {
      await axios
         .get(`${apiUrl}/product/fetch`, {
            params: {
               ...params,
               page: page,
               limit: 10,
            },
         })
         .then((res) => {
            // console.log(res.data.data);
            setData(res.data.data);
         });
   };

   useEffect(() => {
      getData();
      window.scrollTo(0, 0);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [page]);

   const handleChangePage = (event, value) => {
      if (value !== page) {
         setData(undefined);
         setPage(value);
      }
   };

   return (
      <Container sx={{ flex: 1 }}>
         <Typography variant="h6" fontWeight="bold" py={3}>
            Semua Produk
         </Typography>
         {data !== undefined ? (
            data.data.length > 0 ? (
               <Fragment>
                  <Grid container spacing={{ xs: 1, sm: 2 }}>
                     {data.data.map((value, index) => (
                        <Grid item xs={6} sm={4} md={3} lg={2.4} key={index}>
                           <ProductCard
                              key={index}
                              name={value.product_name}
                              slug={value.main_product.product_slug}
                              image={value.image}
                              price={value.price}
                              discount={value.discount}
                              discount_type={value.discount_type}
                              discount_group={value.discount_group}
                              discount_user={value.discount_user}
                           />
                        </Grid>
                     ))}
                  </Grid>
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                     <Pagination
                        component="div"
                        page={page}
                        count={data.meta.last_page}
                        onChange={handleChangePage}
                        siblingCount={0}
                        showFirstButton
                        showLastButton
                     />
                  </Box>
               </Fragment>
            ) : (
               <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", height: "60vh", color: "text.secondary" }}>
                  <LocalMallOutlined fontSize="large" />
                  <Typography mt={1}>Belum ada produk terbaru</Typography>
               </Box>
            )
         ) : (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
               <CircularProgress />
            </Box>
         )}
      </Container>
   );
}
