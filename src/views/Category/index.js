import React from "react";
import { Container, Grid, Typography, Link, Divider, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function Category(props) {
   const [category] = React.useState({
      oval: ["Gamis", "Gamis & Jilbab", "Jilbab", "Koko", "Aksesoris"],
      kayana: ["Tunik", "Blouse", "Gamis", "Rok", "Hijab", "Aksesoris", "Masker", "Outer", "Outer & Rok", "Blouse & Rok"],
      zenitha: [
         "Gamis",
         "Blouse",
         "Jilbab",
         "Dewasa",
         "Koko",
         "Aksesoris",
         "Batita",
         "Outer",
         "Baby",
         "Kids",
         "Manset",
         "Mukena",
         "Rok",
         "Gamis & Jilbab",
         "Blouse & Celana",
         "Tunik",
         "Belia",
         "Kemko",
         "Zenitha Kids",
         "Overall",
      ],
      adnin: ["Rompi Sholat", "Kurta", "Gamis"],
      permata: ["Dewasa", "Sekolah", "Baby", "Remaja", "Berri Dewasa", "Remaja/Sekolah", "Gamis", "Jilbab", "Jilbab Sekolah", "Kids", "Berri Kids", "Batita"],
   });
   const CategoryItems = (props) => {
      const brand = props.brand;
      const category = props.category;
      return (
         <Grid item xs={6}>
            <Typography variant="body2">
               <Link component={RouterLink} to={`/category/${brand}/${category.toLowerCase()}`} underline="none" color="inherit">
                  {category}
               </Link>
            </Typography>
         </Grid>
      );
   };

   return (
      <Container>
         <Typography variant="h6" sx={{ fontWeight: "bold" }} py={3}>
            Kategori
         </Typography>
         <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4} lg mb={2}>
               <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={1} alignItems="center" sx={{ pb: 1 }}>
                  <img alt="OVAL" src="assets/images/brands/oval.png" height="30" />
                  <Typography variant="button">OVAL</Typography>
               </Stack>
               <Divider />
               <Grid container spacing={1} pt={1}>
                  {category.oval.map((value, index) => (
                     <CategoryItems brand="oval" category={value} key={index} />
                  ))}
               </Grid>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg mb={2}>
               <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={1} alignItems="center" sx={{ pb: 1 }}>
                  <img alt="KAYANA" src="assets/images/brands/kayana.png" height="30" />
                  <Typography variant="button">KAYANA</Typography>
               </Stack>
               <Divider />
               <Grid container spacing={1} pt={1}>
                  {category.kayana.map((value, index) => (
                     <CategoryItems brand="kayana" category={value} key={index} />
                  ))}
               </Grid>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg mb={2}>
               <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={1} alignItems="center" sx={{ pb: 1 }}>
                  <img alt="Zenitha" src="assets/images/brands/zenitha.png" height="30" />
                  <Typography variant="button">Zenitha</Typography>
               </Stack>
               <Divider />
               <Grid container spacing={1} pt={1}>
                  {category.zenitha.map((value, index) => (
                     <CategoryItems brand="zenitha" category={value} key={index} />
                  ))}
               </Grid>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg mb={2}>
               <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={1} alignItems="center" sx={{ pb: 1 }}>
                  <img alt="ADNIN" src="assets/images/brands/adnin.png" height="30" />
                  <Typography variant="button">ADNIN</Typography>
               </Stack>
               <Divider />
               <Grid container spacing={1} pt={1}>
                  {category.adnin.map((value, index) => (
                     <CategoryItems brand="adnin" category={value} key={index} />
                  ))}
               </Grid>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg mb={2}>
               <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={1} alignItems="center" sx={{ pb: 1 }}>
                  <img alt="PERMATA" src="assets/images/brands/permata.png" height="30" />
                  <Typography variant="button">PERMATA</Typography>
               </Stack>
               <Divider />
               <Grid container spacing={1} pt={1}>
                  {category.permata.map((value, index) => (
                     <CategoryItems brand="permata" category={value} key={index} />
                  ))}
               </Grid>
            </Grid>
         </Grid>
      </Container>
   );
}
