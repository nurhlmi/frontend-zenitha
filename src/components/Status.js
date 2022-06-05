function Status(param) {
   let output = "";
   if (param !== undefined) {
      if (param === "pending") {
         output = "Menunggu Pembayaran";
      } else if (param === "process") {
         output = "Diproses";
      } else if (param === "paid_off") {
         output = "Menunggu Konfirmasi";
      } else if (param === "sent") {
         output = "Sedang Dikirim";
      } else if (param === "finish") {
         output = "Selesai";
      } else if (param === "canceled") {
         output = "Dibatalkan";
      } else if (param === "expired") {
         output = "Kedaluwarsa";
      }
   }
   return output;
}

export { Status };
