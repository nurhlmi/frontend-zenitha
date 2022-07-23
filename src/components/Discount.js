function Discount(type, price, discount_product, discount_type, discount_group, discount_user) {
   let discount = 0;
   let balance = price;
   let percent = 0;
   if (discount_product !== null) {
      if (discount_type === "rp") {
         discount = discount + discount_product;
         balance = balance - discount_product;
         percent = 100 - Math.round((balance / price) * 100);
      } else {
         let convert_discount = (balance * discount_product) / 100;
         discount = discount + convert_discount;
         balance = balance - convert_discount;
         percent = 100 - Math.round((balance / price) * 100);
      }
   }
   if (discount_group !== null) {
      if (discount_group.discount_type === "rp") {
         discount = discount + discount_group.discount;
         balance = balance - discount_group.discount;
         percent = 100 - Math.round((balance / price) * 100);
      } else {
         let convert_discount = (balance * discount_group.discount) / 100;
         discount = discount + convert_discount;
         balance = balance - convert_discount;
         percent = 100 - Math.round((balance / price) * 100);
      }
      if (discount_user !== null) {
         if (discount_user.discount_type === "rp") {
            discount = discount + discount_user.discount;
            balance = balance - discount_user.discount;
            percent = 100 - Math.round((balance / price) * 100);
         } else {
            let convert_discount = (balance * discount_user.discount) / 100;
            discount = discount + convert_discount;
            balance = balance - convert_discount;
            percent = 100 - Math.round((balance / price) * 100);
         }
      }
   } else {
      if (discount_user !== null) {
         if (discount_user.discount_type === "rp") {
            discount = discount + discount_user.discount;
            balance = balance - discount_user.discount;
            percent = 100 - Math.round((balance / price) * 100);
         } else {
            let convert_discount = (balance * discount_user.discount) / 100;
            discount = discount + convert_discount;
            balance = balance - convert_discount;
            percent = 100 - Math.round((balance / price) * 100);
         }
      }
   }
   return type === "discount" ? discount : type === "balance" ? balance : percent;
}

export { Discount };
