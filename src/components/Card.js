import React from "react";
import { Box, Typography, Button, IconButton, Tooltip, Card, CardActionArea, CardContent, CardMedia } from "@mui/material";
import { DeleteOutlineRounded } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { NumberFormat } from "./Format";

function ProductCard(props) {
   return (
      <Card sx={{ height: "100%" }}>
         <CardActionArea component={RouterLink} to={`/product/${props.slug}`} sx={{ height: "100%" }}>
            <CardMedia component="img" height={{ xs: 150, sm: 200 }} image={props.image} alt={props.name} />
            <CardContent>
               <Typography gutterBottom variant="body2" wrap="nowrap">
                  {props.name}
               </Typography>
               <Typography gutterBottom variant="subtitle2" component="div" fontWeight="bold">
                  {props.discount !== null ? NumberFormat(props.discount_price) : NumberFormat(props.price)}
               </Typography>
               {props.discount !== null && (
                  <React.Fragment>
                     <Box sx={{ display: "inline", background: "#ffeaef", borderRadius: 0.5, px: 0.5, pb: 0.4, mr: 1 }}>
                        <Typography variant="caption" color="#ff5c84" fontWeight="bold">
                           {props.discount}
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

function WishlistCard(props) {
   return (
      <Card sx={{ height: "100%" }}>
         <CardActionArea component={RouterLink} to={`/product/${props.slug}`} sx={{ height: "100%" }}>
            <CardMedia component="img" height={{ xs: 150, sm: 200 }} image={`/assets/images/products/${props.image}`} alt={props.name} />
            <CardContent>
               <Box sx={{ diplay: "flex", alignContent: "space-between" }}>
                  <Box>
                     <Typography gutterBottom variant="body2" wrap="nowrap">
                        {props.name}
                     </Typography>
                     <Typography gutterBottom variant="subtitle2" component="div" fontWeight="bold">
                        {props.discount !== null ? `Rp${props.discount_price}` : `Rp${props.price}`}
                     </Typography>
                     {props.discount !== null && (
                        <React.Fragment>
                           <Box sx={{ display: "inline", background: "#ffeaef", borderRadius: 0.5, p: 0.5, mr: 1 }}>
                              <Typography variant="caption" color="#ff5c84" fontWeight="bold">
                                 {props.discount}
                              </Typography>
                           </Box>
                           <Typography variant="caption" color="text.secondary">
                              <del>Rp{props.price}</del>
                           </Typography>
                        </React.Fragment>
                     )}
                  </Box>
               </Box>
               <Box sx={{ display: "flex", alignItems: "flex-end", alignContent: "flex-end", mt: 2 }}>
                  <Tooltip title="Hapus">
                     <IconButton sx={{ mr: 0.5 }} onClick={(e) => e.preventDefault()}>
                        <DeleteOutlineRounded fontSize="small" />
                     </IconButton>
                  </Tooltip>
                  <Button variant="outlined" fullWidth onClick={(e) => e.preventDefault()}>
                     <Typography variant="body2">+ Keranjang</Typography>
                  </Button>
               </Box>
            </CardContent>
         </CardActionArea>
      </Card>
   );
}

export { ProductCard, WishlistCard };
