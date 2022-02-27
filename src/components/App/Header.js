import * as React from "react";
import {
   AppBar,
   Avatar,
   Typography,
   Grid,
   IconButton,
   Toolbar,
   Tooltip,
   Menu,
   MenuItem,
   Divider,
   Stack,
   Box,
   Link,
   Button,
   Badge,
   Modal,
   InputBase,
   ListItemIcon,
} from "@mui/material";
// import { Logout, Notifications } from "@mui/icons-material";
import {
   Logout,
   Search,
   FavoriteBorderRounded,
   ShoppingCartOutlined,
   ListAltRounded,
   ArrowDropDownRounded,
   LockOutlined,
   StorefrontOutlined,
   ShoppingBagOutlined,
} from "@mui/icons-material";

// import axios from "axios";
// import { apiUrl } from "../../variable/Url";
import { Link as RouterLink, useNavigate } from "react-router-dom";
// import { useRecoilState } from "recoil";
// import { authentication } from "../../store/Authentication";

export default function Header(props) {
   const navigate = useNavigate();
   const [anchorEl, setAnchorEl] = React.useState(null);
   const open = Boolean(anchorEl);
   const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
   };
   const handleClose = () => {
      setAnchorEl(null);
   };

   // const navigate = useNavigate();
   // eslint-disable-next-line no-unused-vars
   // const [auth, setAuth] = useRecoilState(authentication);
   // const token = localStorage.getItem("token");
   // const name = localStorage.getItem("name");

   const avatar = localStorage.getItem("avatar");
   const [login, setLogin] = React.useState(true);
   const [modal, setModal] = React.useState(false);
   const [cart] = React.useState(1);
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
            <Typography variant="body2" color="text.secondary">
               <Link component={RouterLink} to={`/category/${brand}/${category.toLowerCase()}`} underline="none" color="inherit">
                  {category}
               </Link>
            </Typography>
         </Grid>
      );
   };

   const handleChange = (e) => {
      setSearch(e.target.value);
   };

   const [search, setSearch] = React.useState();
   const handleSearch = (e) => {
      e.preventDefault();
      search !== undefined && search !== "" && navigate(`/search?q=${search}`);
   };

   return (
      <React.Fragment>
         <AppBar color="default" position="sticky" elevation={0} sx={{ boxShadow: 2 }}>
            <Box
               sx={{
                  display: { sm: "flex", xs: "none" },
                  alignItem: "center",
                  justifyContent: "space-between",
                  px: 3,
                  py: 0.5,
                  background: "#f4f4f4",
                  fontSize: 11,
               }}
            >
               <Box sx={{ alignItems: "center" }}>
                  {/* <EmailRounded fontSize="6px" /> */}
                  <Typography variant="caption">cs@zenitha.com</Typography>
               </Box>
               <Link component={RouterLink} to="/article" underline="none" color="inherit">
                  <Typography variant="caption">Artikel & Tutorial</Typography>
               </Link>
            </Box>
            <Toolbar sx={{ py: 1, background: "#fff" }}>
               <Grid container>
                  <Grid item xs>
                     <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                           <Box sx={{ borderRadius: 1 }} component={RouterLink} to="/">
                              <Box sx={{ display: { xs: "none", md: "block" } }}>
                                 <img alt="Logo" src="/assets/images/brands/zenitha.png" />
                              </Box>
                              <Box sx={{ display: { xs: "block", md: "none" }, pt: 1, mr: 1 }}>
                                 <img alt="Logo" src="/favicon.ico" />
                              </Box>
                           </Box>
                           <Button
                              onMouseOver={() => setModal(true)}
                              color="inherit"
                              sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", p: 0.5, mx: 1 }}
                           >
                              <Typography sx={{ ml: 1 }} variant="subtitle2">
                                 Kategori
                              </Typography>
                              <ArrowDropDownRounded />
                           </Button>
                           <Modal open={modal} sx={{ zIndex: 1000 }}>
                              <Box
                                 sx={{ width: "100%", bgcolor: "background.paper", mt: 10, p: 4, maxHeight: "70vh", overflow: "auto" }}
                                 onMouseLeave={() => setModal(false)}
                              >
                                 <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={4} lg mb={2}>
                                       <Stack
                                          direction="row"
                                          divider={<Divider orientation="vertical" flexItem />}
                                          spacing={1}
                                          alignItems="center"
                                          sx={{ pb: 1 }}
                                       >
                                          <img alt="OVAL" src="/assets/images/brands/oval.png" height="30" />
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
                                       <Stack
                                          direction="row"
                                          divider={<Divider orientation="vertical" flexItem />}
                                          spacing={1}
                                          alignItems="center"
                                          sx={{ pb: 1 }}
                                       >
                                          <img alt="KAYANA" src="/assets/images/brands/kayana.png" height="30" />
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
                                       <Stack
                                          direction="row"
                                          divider={<Divider orientation="vertical" flexItem />}
                                          spacing={1}
                                          alignItems="center"
                                          sx={{ pb: 1 }}
                                       >
                                          <img alt="Zenitha" src="/assets/images/brands/zenitha.png" height="30" />
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
                                       <Stack
                                          direction="row"
                                          divider={<Divider orientation="vertical" flexItem />}
                                          spacing={1}
                                          alignItems="center"
                                          sx={{ pb: 1 }}
                                       >
                                          <img alt="ADNIN" src="/assets/images/brands/adnin.png" height="30" />
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
                                       <Stack
                                          direction="row"
                                          divider={<Divider orientation="vertical" flexItem />}
                                          spacing={1}
                                          alignItems="center"
                                          sx={{ pb: 1 }}
                                       >
                                          <img alt="PERMATA" src="/assets/images/brands/permata.png" height="30" />
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
                              </Box>
                           </Modal>
                        </Box>
                        <Box sx={{ flex: 1, mr: { lg: 10, md: 5, sm: 3 } }}>
                           <Box
                              component="form"
                              onSubmit={handleSearch}
                              sx={{ px: "2px", display: "flex", alignItems: "center", border: "1px solid #e0e0e0", borderRadius: 1 }}
                           >
                              <InputBase
                                 sx={{ ml: 1, flex: 1, fontSize: "13px" }}
                                 onChange={handleChange}
                                 placeholder="Cari busana"
                                 inputProps={{ "aria-label": "cari" }}
                                 type="search"
                              />
                              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                              <IconButton type="submit" sx={{ p: "5px" }} aria-label="search">
                                 <Search />
                              </IconButton>
                           </Box>
                        </Box>
                        <Box sx={{ ml: 1 }}>
                           {login ? (
                              <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={1} alignItems="center">
                                 <Box>
                                    <Box sx={{ display: { xs: "none", sm: "inline" } }}>
                                       <Tooltip title="Wishlist">
                                          <IconButton component={RouterLink} to="/wishlist">
                                             <FavoriteBorderRounded fontSize="small" />
                                          </IconButton>
                                       </Tooltip>
                                    </Box>
                                    <Tooltip title="Keranjang">
                                       <IconButton component={RouterLink} to="/cart">
                                          <Badge badgeContent={cart} color="error">
                                             <ShoppingCartOutlined fontSize="small" />
                                          </Badge>
                                       </IconButton>
                                    </Tooltip>
                                    <Box sx={{ display: { xs: "none", sm: "inline" } }}>
                                       <Tooltip title="Pesanan">
                                          <IconButton component={RouterLink} to="/order">
                                             <ListAltRounded fontSize="small" />
                                          </IconButton>
                                       </Tooltip>
                                    </Box>
                                 </Box>
                                 <Box>
                                    <Button onClick={handleClick} color="inherit" sx={{ display: "flex", alignItems: "center", p: 0.5 }}>
                                       <Avatar src={avatar} alt="My Avatar" />
                                       <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
                                          <Typography sx={{ ml: 1 }} variant="subtitle2" noWrap>
                                             Nur Hilmi
                                          </Typography>
                                          <ArrowDropDownRounded />
                                       </Box>
                                    </Button>
                                    <Menu
                                       anchorEl={anchorEl}
                                       open={open}
                                       onClose={handleClose}
                                       onClick={handleClose}
                                       PaperProps={{
                                          elevation: 0,
                                          sx: {
                                             overflow: "visible",
                                             filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                             mt: 1.5,
                                             width: 300,
                                             "& .MuiAvatar-root": {
                                                width: 32,
                                                height: 32,
                                                ml: -0.5,
                                                mr: 1,
                                             },
                                             "&:before": {
                                                content: '""',
                                                display: "block",
                                                position: "absolute",
                                                top: 0,
                                                right: 27,
                                                width: 10,
                                                height: 10,
                                                bgcolor: "background.paper",
                                                transform: "translateY(-50%) rotate(45deg)",
                                                zIndex: 0,
                                             },
                                          },
                                       }}
                                       transformOrigin={{ horizontal: "right", vertical: "top" }}
                                       anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                                    >
                                       <MenuItem component={RouterLink} to="/settings">
                                          <Avatar src={avatar} alt="My Avatar" />
                                          <Box>
                                             <Typography noWrap>Nur Hilmi</Typography>
                                             <Typography variant="caption" noWrap>
                                                nurhilmi.mail@gmail.com
                                             </Typography>
                                          </Box>
                                       </MenuItem>
                                       <Divider />
                                       <Box sx={{ display: { xs: "block", sm: "none" } }}>
                                          <MenuItem component={RouterLink} to="/wishlist">
                                             <ListItemIcon sx={{ mr: 0 }}>
                                                <FavoriteBorderRounded fontSize="small" />
                                             </ListItemIcon>
                                             Wishlist
                                          </MenuItem>
                                          <MenuItem component={RouterLink} to="/order">
                                             <ListItemIcon sx={{ mr: 0 }}>
                                                <ListAltRounded fontSize="small" />
                                             </ListItemIcon>
                                             Pesanan
                                          </MenuItem>
                                          <MenuItem component={RouterLink} to="/category">
                                             <ListItemIcon sx={{ mr: 0 }}>
                                                <ShoppingBagOutlined fontSize="small" />
                                             </ListItemIcon>
                                             Kategori
                                          </MenuItem>
                                       </Box>
                                       <MenuItem component={RouterLink} to="/settings/address">
                                          <ListItemIcon sx={{ mr: 0 }}>
                                             <StorefrontOutlined fontSize="small" />
                                          </ListItemIcon>
                                          Daftar Alamat
                                       </MenuItem>
                                       <MenuItem component={RouterLink} to="/settings/password">
                                          <ListItemIcon sx={{ mr: 0 }}>
                                             <LockOutlined fontSize="small" />
                                          </ListItemIcon>
                                          Ganti Password
                                       </MenuItem>
                                       <Divider />
                                       <MenuItem onClick={() => setLogin(false)}>
                                          <ListItemIcon sx={{ mr: 0 }}>
                                             <Logout fontSize="small" />
                                          </ListItemIcon>
                                          Keluar
                                       </MenuItem>
                                    </Menu>
                                 </Box>
                              </Stack>
                           ) : (
                              <Stack spacing={1} direction="row">
                                 {/* <Button variant="outlined" size="small" onClick={() => setLogin(true)}> */}
                                 <Button variant="outlined" size="small" component={RouterLink} to="/login">
                                    Masuk
                                 </Button>
                                 <Button variant="contained" size="small" component={RouterLink} to="/register">
                                    Daftar
                                 </Button>
                              </Stack>
                           )}
                        </Box>
                     </Box>
                  </Grid>
               </Grid>
            </Toolbar>
         </AppBar>
      </React.Fragment>
   );
}
