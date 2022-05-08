function DateFormat(date, day) {
   let hari = new Date(date).getDay();
   let tahun = date.substr(0, 4);
   let bulan = date.substr(5, 2);
   let tanggal = date.substr(8, 2);
   switch (hari) {
      case 0:
         hari = "Minggu";
         break;
      case 1:
         hari = "Senin";
         break;
      case 2:
         hari = "Selasa";
         break;
      case 3:
         hari = "Rabu";
         break;
      case 4:
         hari = "Kamis";
         break;
      case 5:
         hari = "Jumat";
         break;
      case 6:
         hari = "Sabtu";
         break;
      default:
   }
   switch (bulan) {
      case "01":
         // bulan = "Jan";
         bulan = "Januari";
         break;
      case "02":
         // bulan = "Feb";
         bulan = "Februari";
         break;
      case "03":
         // bulan = "Mar";
         bulan = "Maret";
         break;
      case "04":
         // bulan = "Apr";
         bulan = "April";
         break;
      case "05":
         // bulan = "Mei";
         bulan = "Mei";
         break;
      case "06":
         // bulan = "Jun";
         bulan = "Juni";
         break;
      case "07":
         // bulan = "Jul";
         bulan = "Juli";
         break;
      case "08":
         // bulan = "Agu";
         bulan = "Agustus";
         break;
      case "09":
         // bulan = "Sep";
         bulan = "September";
         break;
      case "10":
         // bulan = "Okt";
         bulan = "Oktober";
         break;
      case "11":
         // bulan = "Nov";
         bulan = "November";
         break;
      case "12":
         // bulan = "Des";
         bulan = "Desember";
         break;
      default:
   }
   let tbt = `${tanggal} ${bulan} ${tahun}`;
   let htbt = `${hari}, ${tanggal} ${bulan} ${tahun}`;
   return day !== undefined ? htbt : tbt;
}

function TimeFormat(date) {
   let jam = date.substr(11, 2);
   let menit = date.substr(14, 2);
   let tampilWaktu = `${jam}:${menit} WIB`;
   return tampilWaktu;
}

function Duration(start, end) {
   var seconds = Math.floor((new Date(end) - new Date(start)) / 1000);
   var interval = seconds / 31536000;

   if (interval > 1) {
      return Math.floor(interval) + " Tahun";
   }
   interval = seconds / 2592000;
   if (interval > 1) {
      return Math.floor(interval) + " Bulan";
   }
   interval = seconds / 86400;
   if (interval > 1) {
      return Math.floor(interval) + " Hari";
   }
   interval = seconds / 3600;
   if (interval > 1) {
      return Math.floor(interval) + " Jam";
   }
   interval = seconds / 60;
   if (interval > 1) {
      return Math.floor(interval) + " Menit";
   }
   return Math.floor(seconds) + " Detik";
}

function TimeAgo(date) {
   var seconds = Math.floor((new Date() - new Date(date)) / 1000);
   var interval = seconds / 31536000;

   if (interval > 1) {
      return Math.floor(interval) + " tahun yang lalu";
   }
   interval = seconds / 2592000;
   if (interval > 1) {
      return Math.floor(interval) + " bulan yang lalu";
   }
   interval = seconds / 86400;
   if (interval > 1) {
      return Math.floor(interval) + " hari yang lalu";
   }
   interval = seconds / 3600;
   if (interval > 1) {
      return Math.floor(interval) + " jam yang lalu";
   }
   interval = seconds / 60;
   if (interval > 1) {
      return Math.floor(interval) + " menit yang lalu";
   }
   return "Baru saja";
}

function NumberFormat(e) {
   const string = e.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".");
   const prefix = "Rp";
   return prefix + string;
}

function Discount(price, discount, discount_type) {
   let output = null;
   if (discount_type === "rp") {
      output = price - discount;
   } else {
      output = price - (price * discount) / 100;
   }
   return output;
}

export { DateFormat, TimeFormat, Duration, TimeAgo, NumberFormat, Discount };
