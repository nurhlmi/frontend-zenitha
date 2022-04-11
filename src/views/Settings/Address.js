import React from "react";
import axios from "axios";
import {
   Box,
   Button,
   Card,
   CardContent,
   CircularProgress,
   Dialog,
   DialogContent,
   FormControl,
   Grid,
   IconButton,
   InputAdornment,
   MenuItem,
   Snackbar,
   TextField,
   Tooltip,
   Typography,
} from "@mui/material";
import { Close, CloseRounded, DeleteOutline, EditOutlined, ErrorOutlineRounded, StorefrontOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

import { apiUrl } from "../../variable/Url";
import { Param } from "../../components/Param";
import { Validation } from "../../components/Validation";
import { authentication } from "../../store/Authentication";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

export default function Address(props) {
   const token = localStorage.getItem("token");
   const [auth] = useRecoilState(authentication);
   const redirect = Param("redirect");
   const navigate = useNavigate("redirect");

   const [address, setAddress] = React.useState();
   const getAddress = async () => {
      await axios
         .get(`${apiUrl}/user/address/fetch`, {
            params: {
               user_id: auth.user.id,
            },
            headers: {
               Authorization: "Bearer " + token,
            },
         })
         .then((res) => {
            // console.log(res.data.data);
            setAddress(res.data.data);
         })
         .catch((xhr) => {
            console.log(xhr.response);
         });
   };

   const [province, setProvince] = React.useState([]);
   const getProvince = async () => {
      await axios
         .get(`${apiUrl}/region/province`, {
            headers: {
               Authorization: "Bearer " + token,
            },
         })
         .then((res) => {
            // console.log(res.data.data);
            setProvince(res.data.data);
         })
         .catch((xhr) => {
            console.log(xhr.response);
         });
   };

   const [city, setCity] = React.useState([]);
   const getCity = async (province_id) => {
      await axios
         .get(`${apiUrl}/region/city`, {
            params: {
               province_id: province_id,
            },
            headers: {
               Authorization: "Bearer " + token,
            },
         })
         .then((res) => {
            // console.log(res.data.data);
            setCity(res.data.data);
         })
         .catch((xhr) => {
            console.log(xhr.response);
         });
   };

   const [district, setDistrict] = React.useState([]);
   const getDistrict = async (city_id) => {
      await axios
         .get(`${apiUrl}/region/district`, {
            params: {
               city_id: city_id,
            },
            headers: {
               Authorization: "Bearer " + token,
            },
         })
         .then((res) => {
            // console.log(res.data.data);
            setDistrict(res.data.data);
         })
         .catch((xhr) => {
            console.log(xhr.response);
         });
   };

   React.useEffect(() => {
      getAddress();
      getProvince();
      window.scrollTo(0, 0);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const handleChange = (e) => {
      if (e.target.name === "province_id") {
         data.city_id = "none";
         data.district_id = "none";
         setCity([]);
         setDistrict([]);
         getCity(e.target.value);
      } else if (e.target.name === "city_id") {
         data.district_id = "none";
         setDistrict([]);
         getDistrict(e.target.value);
      }
      setData({
         ...data,
         [e.target.name]: e.target.value,
      });
      setError({
         ...error,
         [e.target.name]: undefined,
      });
   };

   const [data, setData] = React.useState({
      type: "create",
      id: "",
      label: "",
      recipients_name: "",
      phone_number: "",
      province_id: "none",
      city_id: "none",
      district_id: "none",
      address: "",
      postal_code: "",
   });
   const [error, setError] = React.useState();
   const [loading, setLoading] = React.useState(false);
   const [snackbar, setSnackbar] = React.useState(false);
   const [message, setMessage] = React.useState();
   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(undefined);
      if (data.type === "create") {
         let formData = new FormData();
         formData.append("user_id", auth.user.id);
         formData.append("label", data.label);
         formData.append("recipients_name", data.recipients_name);
         formData.append("phone_number", parseInt(data.phone_number));
         formData.append("province_id", data.province_id);
         formData.append("city_id", data.city_id);
         formData.append("district_id", data.district_id);
         formData.append("address", data.address);
         formData.append("postal_code", data.postal_code);
         await axios
            .post(`${apiUrl}/user/address/create`, formData, {
               headers: {
                  Authorization: "Bearer " + token,
               },
            })
            .then((res) => {
               // console.log(res.data.data);
               getAddress();
               setDialog(false);
               setSnackbar(true);
               redirect !== false ? navigate(decodeURIComponent(redirect)) : setMessage("Alamat baru berhasil ditambah");
            })
            .catch((xhr) => {
               // console.log(xhr.response);
               setError(xhr.response.data.errors);
            })
            .finally((e) => {
               setLoading(false);
            });
      } else if (data.type === "edit") {
         await axios
            .put(
               `${apiUrl}/user/address/update/${data.id}`,
               {
                  label: data.label,
                  recipients_name: data.recipients_name,
                  phone_number: parseInt(data.phone_number),
                  province_id: data.province_id,
                  city_id: data.city_id,
                  district_id: data.district_id,
                  address: data.address,
                  postal_code: data.postal_code,
               },
               {
                  headers: {
                     Authorization: "Bearer " + token,
                  },
               }
            )
            .then((res) => {
               // console.log(res.data.data);
               getAddress();
               setDialog(false);
               setSnackbar(true);
               setMessage("Alamat berhasil diubah");
            })
            .catch((xhr) => {
               // console.log(xhr.response);
               setError(xhr.response.data.errors);
            })
            .finally((e) => {
               setLoading(false);
            });
      } else {
         await axios
            .delete(`${apiUrl}/user/address/delete/${data.id}`, {
               headers: {
                  Authorization: "Bearer " + token,
               },
            })
            .then((res) => {
               // console.log(res.data.data);
               getAddress();
               setDialog(false);
               setSnackbar(true);
               setMessage("Alamat berhasil dihapus");
            })
            .catch((xhr) => {
               // console.log(xhr.response);
               setError(xhr.response.data.errors);
            })
            .finally((e) => {
               setLoading(false);
            });
      }
   };

   const handleCreate = () => {
      setDialog(true);
      setCity([]);
      setDistrict([]);
      setData({
         type: "create",
         id: "",
         label: "",
         recipients_name: "",
         phone_number: "",
         province_id: "none",
         city_id: "none",
         district_id: "none",
         address: "",
         postal_code: "",
      });
   };

   const handleEdit = (value) => {
      setDialog(true);
      getCity(value.province.id, value.city.id);
      getDistrict(value.city.id, value.district.id);
      setData({
         type: "edit",
         id: value.id,
         label: value.label,
         recipients_name: value.recipients_name,
         phone_number: value.phone_number,
         province_id: value.province.id,
         city_id: value.city.id,
         district_id: value.district.id,
         address: value.address,
         postal_code: value.postal_code,
      });
   };

   const handleDelete = (value) => {
      setDialog(true);
      setData({
         ...data,
         type: "delete",
         id: value.id,
         label: value.label,
      });
   };

   const [dialog, setDialog] = React.useState(false);
   const handleDialog = () => {
      setDialog(!dialog);
   };

   const [dialogNotice, setDialogNotice] = React.useState(redirect !== false);
   const handleDialogNotice = () => {
      setDialog(!dialog);
      setDialogNotice(!dialogNotice);
   };

   return (
      <React.Fragment>
         {address !== undefined && province.length > 0 ? (
            address.length > 0 ? (
               <React.Fragment>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                     <Button variant="contained" onClick={handleCreate} sx={{ mb: 2 }}>
                        Tambah Alamat
                     </Button>
                  </Box>
                  {address.map((value, index) => (
                     <Card sx={{ mb: 2 }} key={index}>
                        <CardContent>
                           <Box sx={{ display: "flex" }}>
                              <Box sx={{ flex: 1 }}>
                                 <Typography variant="body2" gutterBottom>
                                    <b>{value.recipients_name}</b> ({value.label})
                                 </Typography>
                                 <Typography variant="body2" gutterBottom>
                                    +62 {value.phone_number}
                                 </Typography>
                                 <Typography variant="body2" color="text.secondary">
                                    {value.address}, {value.district.district}, {value.city.type} {value.city.city}, {value.province.province},{" "}
                                    {value.postal_code}
                                 </Typography>
                              </Box>
                              <Box>
                                 <Tooltip title="Ubah Alamat">
                                    <IconButton onClick={() => handleEdit(value)}>
                                       <EditOutlined />
                                    </IconButton>
                                 </Tooltip>
                                 {address.length > 1 && (
                                    <Tooltip title="Hapus Alamat">
                                       <IconButton onClick={() => handleDelete(value)}>
                                          <DeleteOutline />
                                       </IconButton>
                                    </Tooltip>
                                 )}
                              </Box>
                           </Box>
                        </CardContent>
                     </Card>
                  ))}
               </React.Fragment>
            ) : (
               <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", height: "40vh", color: "text.secondary" }}>
                  <StorefrontOutlined fontSize="large" />
                  <Typography mt={1} mb={2}>
                     Belum ada daftar alamat
                  </Typography>
                  <Button variant="contained" onClick={handleCreate} sx={{ mb: 2 }}>
                     Tambah Alamat
                  </Button>
               </Box>
            )
         ) : (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "30vh" }}>
               <CircularProgress />
            </Box>
         )}
         <Dialog open={dialogNotice} onClose={handleDialogNotice} maxWidth="xs" fullWidth>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1, pl: 3, pr: 1 }}>
               <Typography variant="subtitle1" fontWeight="bold">
                  Pengumuman
               </Typography>
               <IconButton onClick={handleDialogNotice}>
                  <CloseRounded />
               </IconButton>
            </Box>
            <DialogContent dividers>
               <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", mt: 3, mb: 6 }}>
                  <ErrorOutlineRounded sx={{ fontSize: "50px" }} />
                  <Typography mt={1}>Tambah alamat terlebih dahulu</Typography>
               </Box>
               <LoadingButton variant="contained" onClick={handleDialogNotice} fullWidth>
                  Tambah Alamat
               </LoadingButton>
            </DialogContent>
         </Dialog>
         <Dialog open={dialog} onClose={handleDialog} maxWidth="xs" fullWidth>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1, pl: 3, pr: 1 }}>
               <Typography variant="subtitle1" fontWeight="bold">
                  {data.type === "create" ? "Tambah" : data.type === "edit" ? "Ubah" : "Hapus"} Alamat
               </Typography>
               <IconButton onClick={handleDialog}>
                  <CloseRounded />
               </IconButton>
            </Box>
            <DialogContent dividers>
               <Box component="form" noValidate={true} onSubmit={handleSubmit}>
                  {data.type !== "delete" ? (
                     <React.Fragment>
                        <FormControl margin="dense" fullWidth>
                           <Typography variant="body2" fontWeight="bold" color="text.secondary">
                              Label Alamat
                           </Typography>
                           <TextField
                              margin="dense"
                              size="small"
                              name="label"
                              value={data.label}
                              onChange={handleChange}
                              error={error?.label !== undefined ? true : false}
                              helperText={Validation(error?.label)}
                              autoFocus={data.type === "create"}
                           />
                        </FormControl>
                        <FormControl margin="dense" fullWidth>
                           <Typography variant="body2" fontWeight="bold" color="text.secondary">
                              Nama Penerima
                           </Typography>
                           <TextField
                              margin="dense"
                              size="small"
                              name="recipients_name"
                              value={data.recipients_name}
                              onChange={handleChange}
                              error={error?.recipients_name !== undefined ? true : false}
                              helperText={Validation(error?.recipients_name)}
                           />
                        </FormControl>
                        <FormControl margin="dense" fullWidth>
                           <Typography variant="body2" fontWeight="bold" color="text.secondary">
                              Nomor HP
                           </Typography>
                           <TextField
                              margin="dense"
                              size="small"
                              name="phone_number"
                              value={data.phone_number}
                              onChange={handleChange}
                              error={error?.phone_number !== undefined ? true : false}
                              helperText={Validation(error?.phone_number)}
                              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                              InputProps={{
                                 startAdornment: <InputAdornment position="start">+62</InputAdornment>,
                              }}
                           />
                        </FormControl>
                        <FormControl margin="dense" fullWidth>
                           <Typography variant="body2" fontWeight="bold" color="text.secondary">
                              Provinsi
                           </Typography>
                           <TextField
                              margin="dense"
                              size="small"
                              name="province_id"
                              value={data.province_id}
                              onChange={handleChange}
                              error={error?.province_id !== undefined ? true : false}
                              helperText={Validation(error?.province_id)}
                              select
                              defaultValue="none"
                           >
                              <MenuItem value="none" disabled selected>
                                 Pilih Provinsi
                              </MenuItem>
                              {province.map((value, index) => (
                                 <MenuItem value={value.id} key={index}>
                                    {value.province}
                                 </MenuItem>
                              ))}
                           </TextField>
                        </FormControl>
                        <FormControl margin="dense" fullWidth>
                           <Typography variant="body2" fontWeight="bold" color="text.secondary">
                              Kabupaten/Kota
                           </Typography>
                           <TextField
                              margin="dense"
                              size="small"
                              name="city_id"
                              value={data.city_id}
                              onChange={handleChange}
                              error={error?.city_id !== undefined ? true : false}
                              helperText={Validation(error?.city_id)}
                              select
                              defaultValue="none"
                           >
                              <MenuItem value="none" disabled selected>
                                 Pilih Kabupaten/Kota
                              </MenuItem>
                              {city.map((value, index) => (
                                 <MenuItem value={value.id} key={index}>
                                    {value.type} {value.city}
                                 </MenuItem>
                              ))}
                           </TextField>
                        </FormControl>
                        <FormControl margin="dense" fullWidth>
                           <Typography variant="body2" fontWeight="bold" color="text.secondary">
                              Kecamatan
                           </Typography>
                           <TextField
                              margin="dense"
                              size="small"
                              name="district_id"
                              value={data.district_id}
                              onChange={handleChange}
                              error={error?.district_id !== undefined ? true : false}
                              helperText={Validation(error?.district_id)}
                              select
                              defaultValue="none"
                           >
                              <MenuItem value="none" disabled selected>
                                 Pilih Kecamatan
                              </MenuItem>
                              {district.map((value, index) => (
                                 <MenuItem value={value.id} key={index}>
                                    {value.district}
                                 </MenuItem>
                              ))}
                           </TextField>
                        </FormControl>
                        <FormControl margin="dense" fullWidth>
                           <Typography variant="body2" fontWeight="bold" color="text.secondary">
                              Kode Pos
                           </Typography>
                           <TextField
                              margin="dense"
                              size="small"
                              name="postal_code"
                              value={data.postal_code}
                              onChange={handleChange}
                              error={error?.postal_code !== undefined ? true : false}
                              helperText={Validation(error?.postal_code)}
                              inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 5, minLength: 5 }}
                           />
                        </FormControl>
                        <FormControl margin="dense" fullWidth>
                           <Typography variant="body2" fontWeight="bold" color="text.secondary">
                              Alamat
                           </Typography>
                           <TextField
                              margin="dense"
                              size="small"
                              name="address"
                              value={data.address}
                              onChange={handleChange}
                              error={error?.address !== undefined ? true : false}
                              helperText={Validation(error?.address)}
                              multiline
                              rows={4}
                           />
                        </FormControl>
                     </React.Fragment>
                  ) : (
                     <Box sx={{ my: 2 }}>
                        Anda yakin ingin menghapus alamat <b>{data.label}</b>?
                     </Box>
                  )}
                  <FormControl margin="normal" fullWidth>
                     <Grid container spacing={1}>
                        {data.type === "delete" && (
                           <Grid item xs>
                              <LoadingButton variant="outlined" onClick={handleDialog} fullWidth>
                                 Batal
                              </LoadingButton>
                           </Grid>
                        )}
                        <Grid item xs>
                           <LoadingButton type="submit" variant="contained" loading={loading} fullWidth>
                              {data.type === "delete" ? "Hapus" : "Simpan"}
                           </LoadingButton>
                        </Grid>
                     </Grid>
                  </FormControl>
               </Box>
            </DialogContent>
         </Dialog>
         <Snackbar
            open={snackbar}
            autoHideDuration={3000}
            onClose={() => setSnackbar(false)}
            message={message}
            action={
               <IconButton size="small" aria-label="close" color="inherit" onClick={() => setSnackbar(false)}>
                  <Close fontSize="small" />
               </IconButton>
            }
         />
      </React.Fragment>
   );
}
