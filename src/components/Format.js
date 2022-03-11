function NumberFormat(e) {
   const string = e.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".");
   const prefix = "Rp";
   return prefix + string;
}

export { NumberFormat };
