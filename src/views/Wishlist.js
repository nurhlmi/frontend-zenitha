import React from "react";
import { Container, Typography, Grid } from "@mui/material";
// import { Link as RouterLink } from "react-router-dom";

import { ProductCard } from "../components/Card";

export default function Wishlist(props) {
   const [products] = React.useState([
      {
         name: "Ummi 11",
         slug: "ummi-11",
         image: window.location.origin + "/assets/images/products/image 8.png",
         price: 350000,
         discount: 10,
         discount_type: "percent",
      },
      {
         name: "Long Blouse Adella 04",
         slug: "long-blouse-adella-04",
         image: window.location.origin + "/assets/images/products/image 12.png",
         price: 159000,
         discount: 10,
         discount_type: "percent",
      },
      {
         name: "Blouse Lavina 08",
         slug: "blouse-lavina-08",
         image: window.location.origin + "/assets/images/products/image 13.png",
         price: 149000,
         discount: 10,
         discount_type: "percent",
      },
      {
         name: "Gamis Kids Anissa 11",
         slug: "gamis-kids-anissa-11",
         image: window.location.origin + "/assets/images/products/image 10.png",
         price: 269000,
         discount: 10,
         discount_type: "percent",
      },
      {
         name: "Znk 245",
         slug: "znk-245",
         image: window.location.origin + "/assets/images/products/image 14.png",
         price: 117000,
         discount: 10,
         discount_type: "percent",
      },
   ]);
   React.useEffect(() => {
      window.scrollTo(0, 0);
   }, []);
   return (
      <Container sx={{ flex: 1 }}>
         <Typography variant="h6" py={3}>
            Wishlist
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
                     discount_type={value.discount_type}
                  />
               </Grid>
            ))}
         </Grid>
      </Container>
   );
}
