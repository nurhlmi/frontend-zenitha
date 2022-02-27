import React from "react";
import { Container, Typography } from "@mui/material";
// import { Link as RouterLink } from "react-router-dom";

export default function Category(props) {
   return (
      <Container sx={{ flex: 1 }}>
         <Typography variant="h6" py={3}>
            Keranjang
         </Typography>
      </Container>
   );
}
