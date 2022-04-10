function Validation(error) {
   let output = "";
   if (error !== undefined) {
      if (error[0] === "The name field is required.") {
         output = "Masukkan nama lengkap.";
      } else if (error[0] === "The email field is required.") {
         output = "Masukkan email.";
      } else if (error[0] === "The email has already been taken.") {
         output = "Email telah digunakan.";
      } else if (error[0] === "The phone number field is required.") {
         output = "Masukkan nomor telepon.";
      } else if (error[0] === "The phone number must be an integer.") {
         output = "Masukkan nomor telepon.";
      } else if (error[0] === "The old password field is required.") {
         output = "Masukkan kata sandi saat ini.";
      } else if (error[0] === "old password is invalid") {
         output = "Kata sandi lama salah.";
      } else if (error[0] === "The password field is required.") {
         output = "Masukkan kata sandi.";
      } else if (error[0] === "The password must be at least 8 characters.") {
         output = "Masukkan kata sandi minimal 8 karakter.";
      } else if (error[0] === "The password confirmation field is required.") {
         output = "Masukkan konfirmasi kata sandi.";
      } else if (error[0] === "The password confirmation does not match.") {
         output = "Konfirmasi kata sandi dengan benar.";
      } else if (error[0] === "The password confirmation must be at least 8 characters.") {
         output = "Masukkan kata sandi minimal 8 karakter.";
      }
   }
   return output;
}

export { Validation };
