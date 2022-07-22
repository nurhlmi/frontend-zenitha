import React from "react";
import { Box, Typography, Card, CardActionArea, CardContent, CardMedia } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { NumberFormat } from "./Format";

function ProductCard(props) {
   let discount = 0;
   let discount_balance = props.price;
   let percent = 0;
   if (props.discount !== null) {
      if (props.discount_type === "rp") {
         discount = discount + props.discount;
         discount_balance = discount_balance - props.discount;
         percent = Math.round((discount / props.price) * 100);
      } else {
         let convert_discount = (props.price * props.discount) / 100;
         discount = discount + convert_discount;
         discount_balance = discount_balance - convert_discount;
         percent = percent + props.discount;
      }
   }
   if (props.discount_group !== null) {
      if (props.discount_group.discount_type === "rp") {
         discount = discount + props.discount_group.discount;
         discount_balance = discount_balance - props.discount_group.discount;
         percent = Math.round((discount / props.price) * 100);
      } else {
         let convert_discount = (props.price * props.discount_group.discount) / 100;
         discount = discount + convert_discount;
         discount_balance = discount_balance - convert_discount;
         percent = percent + props.discount_group.discount;
      }
      if (props.discount_user !== null) {
         if (props.discount_user.discount_type === "rp") {
            discount = discount + props.discount_user.discount;
            discount_balance = discount_balance - props.discount_user.discount;
            percent = Math.round((discount / props.price) * 100);
         } else {
            let convert_discount = (props.price * props.discount_user.discount) / 100;
            discount = discount + convert_discount;
            discount_balance = discount_balance - convert_discount;
            percent = percent + props.discount_user.discount;
         }
      }
   } else {
      if (props.discount_user !== null) {
         if (props.discount_user.discount_type === "rp") {
            discount = discount + props.discount_user.discount;
            discount_balance = discount_balance - props.discount_user.discount;
            percent = Math.round((discount / props.price) * 100);
         } else {
            let convert_discount = (props.price * props.discount_user.discount) / 100;
            discount = discount + convert_discount;
            discount_balance = discount_balance - convert_discount;
            percent = percent + props.discount_user.discount;
         }
      }
   }

   return (
      <Card sx={{ height: "100%" }}>
         <CardActionArea component={RouterLink} to={`/product/${props.slug}`} sx={{ height: "100%" }}>
            <CardMedia component="img" height={{ xs: 150, sm: 200 }} image={props.image} alt={props.name} />
            <Box sx={{ position: "absolute", top: 5, right: 5 }}>{props.wishlist}</Box>
            <CardContent>
               <Typography gutterBottom variant="body2" wrap="nowrap">
                  {props.name}
               </Typography>
               <Typography gutterBottom variant="subtitle2" component="div" fontWeight="bold">
                  {percent !== 0 ? NumberFormat(discount_balance) : NumberFormat(props.price)}
               </Typography>
               {percent !== 0 && (
                  <React.Fragment>
                     <Box sx={{ display: "inline", background: "#ffeaef", borderRadius: 0.5, px: 0.5, pb: 0.4, mr: 1 }}>
                        <Typography variant="caption" color="#ff5c84" fontWeight="bold">
                           {percent}%
                        </Typography>
                     </Box>
                     <Typography variant="caption" color="text.secondary">
                        <del>{NumberFormat(props.price)}</del>
                     </Typography>
                  </React.Fragment>
               )}
            </CardContent>
         </CardActionArea>
      </Card>
   );
}

export { ProductCard };
