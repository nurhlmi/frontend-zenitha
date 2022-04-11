function Status(param) {
   let output = "";
   if (param !== undefined) {
      if (param === "pending") {
         output = "Menunggu Pembayaran";
      } else if (param === "paid_off") {
         output = "Diproses";
      } else if (param === "sent") {
         output = "Dikirim";
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
