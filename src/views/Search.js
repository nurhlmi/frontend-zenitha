import React from "react";
import { Container, Typography, Grid } from "@mui/material";
// import { Link as RouterLink } from "react-router-dom";

import { Param } from "../components/Param";
import { ProductCard } from "../components/Card";

export default function CategoryDetail(props) {
   const [products] = React.useState([
      {
         name: "Ummi 11",
         slug: "ummi-11",
         image: "image 8.png",
         price: "350.000",
         discount: "30%",
         discount_price: "219.000",
      },
      {
         name: "Long Blouse Adella 04",
         slug: "long-blouse-adella-04",
         image: "image 12.png",
         price: "159.000",
         discount: "20%",
         discount_price: "127.000",
      },
      {
         name: "Blouse Lavina 08",
         slug: "blouse-lavina-08",
         image: "image 13.png",
         price: "149.000",
         discount: "20%",
         discount_price: "119.000",
      },
      {
         name: "Gamis Kids Anissa 11",
         slug: "gamis-kids-anissa-11",
         image: "image 10.png",
         price: "269.000",
         discount: null,
         discount_price: null,
      },
      {
         name: "Znk 245",
         slug: "znk-245",
         image: "image 14.png",
         price: "117.000",
         discount: "20%",
         discount_price: "82.000",
      },
   ]);
   React.useEffect(() => {
      window.scrollTo(0, 0);
      console.log(Param("q"));
   }, []);
   return (
      <Container sx={{ flex: 1 }}>
         <Typography color="text.secondary" py={3}>
            Menampilkan 5 produk untuk <b>"Busana"</b> (<b>1 - 5</b> of <b>5</b>)
         </Typography>
         <Grid container spacing={{ xs: 1, sm: 2 }}>
            {products.map((value, index) => (
               <Grid item xs={6} sm={4} md={3} lg={2.4} key={index}>
                  <ProductCard
                     key={index}
                     name={value.name}
                     slug={value.slug}
                     image={value.image}
                     price={value.price}
                     discount={value.discount}
                     discount_price={value.discount_price}
                  />
               </Grid>
            ))}
         </Grid>
      </Container>
   );
}
