function Calculate(type, price, discount_product, discount_type, discount_group, discount_user) {
   let discount = 0;
   let discount_balance = price;
   let percent = 0;

   if (discount_product !== null) {
      if (discount_type === "rp") {
         discount = discount + discount_product;
         discount_balance = discount_balance - discount_product;
         percent = Math.round((discount / price) * 100);
      } else {
         let convert_discount = (price * discount_product) / 100;
         discount = discount + convert_discount;
         discount_balance = discount_balance - convert_discount;
         percent = percent + discount_product;
      }
   }

   if (discount_group !== null) {
      if (discount_group.discount_type === "rp") {
         discount = discount + discount_group.discount;
         discount_balance = discount_balance - discount_group.discount;
         percent = Math.round((discount / price) * 100);
      } else {
         let convert_discount = (price * discount_group.discount) / 100;
         discount = discount + convert_discount;
         discount_balance = discount_balance - convert_discount;
         percent = percent + discount_group.discount;
      }

      if (discount_user !== null) {
         if (discount_user.discount_type === "rp") {
            discount = discount + discount_user.discount;
            discount_balance = discount_balance - discount_user.discount;
            percent = Math.round((discount / price) * 100);
         } else {
            let convert_discount = (price * discount_user.discount) / 100;
            discount = discount + convert_discount;
            discount_balance = discount_balance - convert_discount;
            percent = percent + discount_user.discount;
         }
      }
   }

   return type === "discount" ? discount : type === "discount_balance" ? discount_balance : percent;
}

export { Calculate };
