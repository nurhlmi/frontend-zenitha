function PaymentStatus(param) {
   let output = "";
   if (param !== undefined) {
      if (param === "pending") {
         output = "Menunggu Konfirmasi";
      } else if (param === "process") {
         output = "Menunggu Pembayaran";
      } else if (param === "paid_off") {
         output = "Telah Dibayar";
      } else if (param === "expired") {
         output = "Kedaluwarsa";
      } else if (param === "canceled") {
         output = "Dibatalkan";
      }
   }
   return output;
}

export { PaymentStatus };
