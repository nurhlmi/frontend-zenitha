import React from "react";
import { Box, Typography, Card, CardActionArea, CardContent, CardMedia } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { NumberFormat } from "./Format";
import { Discount } from "./Discount";

function ProductCard(props) {
   let name = props.name;
   let slug = props.slug;
   let image = props.image;
   let price = props.price;
   let discount = props.discount;
   let discount_type = props.discount_type;
   let discount_group = props.discount_group;
   let discount_user = props.discount_user;
   let wishlist = props.wishlist;

   let balance = Discount("balance", price, discount, discount_type, discount_group, discount_user);
   let percent = Discount("percent", price, discount, discount_type, discount_group, discount_user);

   return (
      <Card sx={{ height: "100%" }}>
         <CardActionArea component={RouterLink} to={`/product/${slug}`} sx={{ height: "100%" }}>
            <CardMedia component="img" height={{ xs: 150, sm: 200 }} image={image} alt={name} />
            <Box sx={{ position: "absolute", top: 5, right: 5 }}>{wishlist}</Box>
            <CardContent>
               <Typography gutterBottom variant="body2" wrap="nowrap">
                  {name}
               </Typography>
               <Typography gutterBottom variant="subtitle2" component="div" fontWeight="bold">
                  {price !== balance ? NumberFormat(balance) : NumberFormat(price)}
               </Typography>
               {price !== balance && (
                  <React.Fragment>
                     <Box sx={{ display: "inline", background: "#ffeaef", borderRadius: 0.5, px: 0.5, pb: 0.4, mr: 1 }}>
                        <Typography variant="caption" color="#ff5c84" fontWeight="bold">
                           {percent}%
                        </Typography>
                     </Box>
                     <Typography variant="caption" color="text.secondary">
                        <del>{NumberFormat(price)}</del>
                     </Typography>
                  </React.Fragment>
               )}
            </CardContent>
         </CardActionArea>
      </Card>
   );
}

export { ProductCard };
