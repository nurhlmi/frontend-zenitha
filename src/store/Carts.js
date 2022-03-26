import axios from "axios";
import { atom, selector } from "recoil";
import { apiUrl } from "../variable/Url";

const carts = atom({
   key: "carts",
   default: selector({
      key: "default-carts",
      get: async () => {
         let total = 0;
         try {
            const { data } = await axios.get(`${apiUrl}/carts`, {
               headers: {
                  Authorization: "Bearer " + localStorage.getItem("token"),
               },
            });
            data.data.map((value, index) => (total = total + value.quantity));
         } catch {
            total = 0;
         }
         return {
            total,
         };
      },
   }),
});

export { carts };
