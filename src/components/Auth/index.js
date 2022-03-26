import React from "react";
import { Container, Box } from "@mui/material";

export default function Category(props) {
   return (
      <Box sx={{ display: "flex" }}>
         <Box sx={{ maxWidth: "400px", minWidth: { xs: "100%", sm: "400px" } }}>
            <Container>{props.render}</Container>
         </Box>
         <Box
            sx={{
               width: "100%",
               height: "90vh",
               backgroundSize: "cover",
               backgroundRepeat: "no-repeat",
               backgroundPosition: "right top",
               backgroundImage: "url('/assets/images/background.png')",
            }}
         />
      </Box>
   );
}
