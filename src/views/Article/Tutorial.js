import React from "react";
import axios from "axios";
import { Container, Typography, Box, Link, Grid, Card, CardActionArea, CardMedia, CardContent, Pagination, CircularProgress } from "@mui/material";
import { YouTube } from "@mui/icons-material";

import { Link as RouterLink } from "react-router-dom";
import { apiUrl } from "../../variable/Url";
import { YoutubeParser } from "../../components/YoutubeParser";
import { TimeAgo } from "../../components/Format";

export default function Article(props) {
   const [tutorial, setTutorial] = React.useState();
   const [page, setPage] = React.useState(1);
   const getTutorial = async (e) => {
      await axios
         .get(`${apiUrl}/article/fetch`, {
            params: {
               type: "video",
               page: page,
               limit: 12,
            },
         })
         .then((res) => {
            // console.log(res.data.data);
            setTutorial(res.data.data);
         })
         .catch((xhr) => {
            console.log(xhr.response);
         });
   };
   React.useEffect(() => {
      getTutorial();
      window.scrollTo(0, 0);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [page]);

   const handleChangePage = (event, value) => {
      if (value !== page) {
         setTutorial(undefined);
         setPage(value);
      }
   };

   return (
      <Container sx={{ flex: 1 }}>
         {tutorial !== undefined ? (
            <React.Fragment>
               <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 3, mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">
                     Semua Tutorial
                  </Typography>
                  {tutorial.meta.total > 4 && (
                     <Link underline="none" color="text.secondary" component={RouterLink} to="/tutorial">
                        Lihat Semua
                     </Link>
                  )}
               </Box>
               {tutorial.data.length > 0 ? (
                  <React.Fragment>
                     <Grid container spacing={{ xs: 1, sm: 2 }}>
                        {tutorial.data.map((value, index) => (
                           <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                              <Card sx={{ height: "100%" }}>
                                 <CardActionArea component={RouterLink} to={`/tutorial/${value.slug}`} sx={{ height: "100%" }}>
                                    <CardMedia
                                       component="img"
                                       height={{ xs: 150, sm: 200 }}
                                       image={`https://img.youtube.com/vi/${YoutubeParser(value.video_url)}/0.jpg`}
                                       alt={value.title}
                                    />
                                    <CardContent sx={{ pb: 5 }}>
                                       <Typography variant="subtitle2" fontWeight="bold" wrap="nowrap">
                                          {value.title}
                                       </Typography>
                                       <Typography variant="caption" wrap="nowrap" color="text.secondary" mb={1} sx={{ position: "absolute", bottom: "5px" }}>
                                          {TimeAgo("2022-03-26 15:00:00", "day")}
                                       </Typography>
                                    </CardContent>
                                 </CardActionArea>
                              </Card>
                           </Grid>
                        ))}
                     </Grid>
                     <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                        <Pagination
                           component="div"
                           page={page}
                           count={tutorial.meta.last_page}
                           onChange={handleChangePage}
                           siblingCount={0}
                           showFirstButton
                           showLastButton
                        />
                     </Box>
                  </React.Fragment>
               ) : (
                  <Box
                     sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", height: "60vh", color: "text.secondary" }}
                  >
                     <YouTube fontSize="large" />
                     <Typography mt={1}>Belum ada tutorial</Typography>
                  </Box>
               )}
            </React.Fragment>
         ) : (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
               <CircularProgress />
            </Box>
         )}
      </Container>
   );
}
