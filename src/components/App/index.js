import React from "react";
import { Box, CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { title } from "../../variable/Url";
import Header from "./Header";
import Footer from "./Footer";

let theme = createTheme({
   palette: {
      primary: {
         light: "#63ccff",
         main: "#212121", //primary
         // main: "#d084b4", //primary
         // dark: "#000", //hover
      },
   },
   typography: {
      fontFamily: `"OpenSauceOne", sans-serif`,
      h5: {
         fontWeight: 500,
         fontSize: 26,
         letterSpacing: 0.5,
      },
   },
   shape: {
      borderRadius: 8,
   },
   components: {
      MuiTab: {
         defaultProps: {
            disableRipple: true,
         },
      },
   },
   mixins: {
      toolbar: {
         minHeight: 48,
      },
   },
});

theme = {
   ...theme,
   components: {
      MuiDrawer: {
         styleOverrides: {
            paper: {
               backgroundColor: "#081627",
            },
         },
      },
      MuiButton: {
         styleOverrides: {
            root: {
               textTransform: "none",
            },
            contained: {
               boxShadow: "none",
               "&:active": {
                  boxShadow: "none",
               },
            },
         },
      },
      MuiTabs: {
         styleOverrides: {
            root: {
               marginLeft: theme.spacing(1),
            },
            indicator: {
               height: 3,
               borderTopLeftRadius: 3,
               borderTopRightRadius: 3,
            },
         },
      },
      MuiTab: {
         styleOverrides: {
            root: {
               textTransform: "none",
               margin: "0 16px",
               minWidth: 0,
               padding: 0,
               [theme.breakpoints.up("md")]: {
                  padding: 0,
                  minWidth: 0,
               },
            },
         },
      },
      MuiIconButton: {
         styleOverrides: {
            root: {
               padding: theme.spacing(1),
            },
         },
      },
      MuiTooltip: {
         styleOverrides: {
            tooltip: {
               borderRadius: 4,
            },
         },
      },
      MuiDivider: {
         styleOverrides: {
            root: {
               backgroundColor: "rgb(255,255,255,0.15)",
            },
         },
      },
      MuiListItemButton: {
         styleOverrides: {
            root: {
               "&.Mui-selected": {
                  color: "#4fc3f7",
               },
            },
         },
      },
      MuiListItemText: {
         styleOverrides: {
            primary: {
               fontSize: 14,
               fontWeight: theme.typography.fontWeightMedium,
            },
         },
      },
      MuiListItemIcon: {
         styleOverrides: {
            root: {
               color: "inherit",
               minWidth: "auto",
               marginRight: theme.spacing(2),
               "& svg": {
                  fontSize: 20,
               },
            },
         },
      },
      MuiAvatar: {
         styleOverrides: {
            root: {
               width: 32,
               height: 32,
            },
         },
      },
   },
};

function App(props) {
   document.title = `${props.title} ${title}`;

   const bg = {
      backgroundImage: "url(/images/blank.png)",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "bottom",
   };

   return (
      <ThemeProvider theme={theme}>
         <Box sx={{ ...bg, display: "flex", minHeight: "100vh" }}>
            <CssBaseline />
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
               {window.location.pathname !== "/checkout" && <Header />}
               {props.render}
               {window.location.pathname !== "/checkout" && <Footer />}
            </Box>
         </Box>
      </ThemeProvider>
   );
}

export default App;
