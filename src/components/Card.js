import React from "react";
import { Box, Typography, Card, CardActionArea, CardContent, CardMedia } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { NumberFormat } from "./Format";

function ProductCard(props) {
   let discount = null;
   let percent = null;
   if (props.discount !== null) {
      if (props.discount_type === "rp") {
         discount = props.price - props.discount;
         percent = Math.floor((props.discount / props.price) * 100);
      } else {
         discount = props.price - (props.price * props.discount) / 100;
         percent = props.discount;
      }
   }
   return (
      <Card sx={{ height: "100%" }}>
         <CardActionArea component={RouterLink} to={`/product/${props.slug}`} sx={{ height: "100%" }}>
            <CardMedia component="img" height={{ xs: 150, sm: 200 }} image={props.image} alt={props.name} />
            <CardContent>
               <Typography gutterBottom variant="body2" wrap="nowrap">
                  {props.name}
               </Typography>
               <Typography gutterBottom variant="subtitle2" component="div" fontWeight="bold">
                  {props.discount !== null ? NumberFormat(discount) : NumberFormat(props.price)}
               </Typography>
               {props.discount !== null && (
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
