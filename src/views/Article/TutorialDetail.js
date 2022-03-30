import React from "react";
import axios from "axios";
import { Container, Typography, Box, Grid, CircularProgress } from "@mui/material";

import { useParams } from "react-router-dom";
import { apiUrl } from "../../variable/Url";
import { YoutubeParser } from "../../components/YoutubeParser";
import { DateFormat, TimeFormat } from "../../components/Format";

export default function ArticleDetail(props) {
   const { slug } = useParams();
   const [data, setData] = React.useState();
   const getData = async (e) => {
      await axios
         .get(`${apiUrl}/article/show/${slug}`)
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
                           Tutorial
                        </Typography>
                     </Box>
                  </Box>
                  <iframe
                     width="100%"
                     height="450"
                     src={`https://www.youtube.com/embed/${YoutubeParser(data.video_url)}?autoplay=1`}
                     title={data.title}
                     frameBorder="0"
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     allowFullScreen
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
