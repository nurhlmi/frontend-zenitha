import React, { Fragment, useEffect, useState } from "react";
import { Container, Box, Typography, Grid, CircularProgress, Pagination } from "@mui/material";
import { LocalMallOutlined } from "@mui/icons-material";

import axios from "axios";
import { apiUrl, title } from "../variable/Url";
import { ProductCard } from "../components/Card";
import { useRecoilState } from "recoil";
import { search } from "../store/Search";

export default function Search(props) {
   const [searchProduct] = useRecoilState(search);
   const [page, setPage] = useState(1);
   const [data, setData] = useState();
   const getData = async () => {
      await axios
         .get(`${apiUrl}/product/fetch`, {
            params: {
               search: searchProduct,
               page: page,
               limit: 25,
            },
         })
         .then((res) => {
            // console.log(res.data.data);
            setData(res.data.data);
         });
   };

   useEffect(() => {
      window.scrollTo(0, 0);
      document.title = `Cari ${searchProduct}${title}`;
      setData(undefined);
      getData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [page, searchProduct]);

   const handleChangePage = (event, value) => {
      if (value !== page) {
         setData(undefined);
         setPage(value);
      }
   };

   return (
      <Container sx={{ flex: 1 }}>
         {data !== undefined ? (
            data.data.length > 0 ? (
               <Fragment>
                  <Typography variant="body2" color="text.secondary" py={4}>
                     Menampilkan {data.meta.from} - {data.meta.to} produk dari total {data.meta.total} untuk <b>"{searchProduct}"</b>
                  </Typography>
                  <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ mt: 3 }}>
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
                  <Typography mt={1}>
                     Pencarian <b>"{searchProduct}"</b> tidak ditemukan
                  </Typography>
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
