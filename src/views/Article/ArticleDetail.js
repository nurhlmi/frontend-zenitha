import React from "react";
import axios from "axios";
import { Container, Typography, Box, Grid, CircularProgress } from "@mui/material";

import { useParams } from "react-router-dom";
import { apiUrl, token } from "../../variable/Url";
import { DateFormat, TimeFormat } from "../../components/DateFormat";

export default function ArticleDetail(props) {
   const { slug } = useParams();
   const [data, setData] = React.useState();
   const getData = async (e) => {
      await axios
         .get(`${apiUrl}/article/show/${slug}`, {
            headers: {
               Authorization: "Bearer " + token,
            },
         })
         .then((res) => {
            // console.log(res.data.data);
            setData(res.data.data);
         })
         .catch((xhr) => {
            console.log(xhr.response);
         });
   };
   React.useEffect(() => {
      getData();
      window.scrollTo(0, 0);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);
   return (
      <Container sx={{ flex: 1 }}>
         {data !== undefined ? (
            <Grid container>
               <Grid item sm={1} md={2} />
               <Grid item sm={10} md={8}>
                  <Box sx={{ mt: 3, mb: 2 }}>
                     <Typography variant="h5" fontWeight="bold" mb={1}>
                        {data.title}
                     </Typography>
                     <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography variant="body2" color="text.secondary">
                           {DateFormat(data.created_at, "day")} | {TimeFormat(data.created_at)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                           Artikel
                        </Typography>
                     </Box>
                  </Box>
                  <img alt={data.title} src={data.image_url} width="100%" />
                  <Typography
                     variant="body1"
                     dangerouslySetInnerHTML={{
                        __html: data.content,
                     }}
                  />
               </Grid>
            </Grid>
         ) : (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
               <CircularProgress />
            </Box>
         )}
      </Container>
   );
}
