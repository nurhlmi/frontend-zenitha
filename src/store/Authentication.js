import axios from "axios";
import { atom, selector } from "recoil";
import { apiUrl } from "../variable/Url";

const authentication = atom({
   key: "authentication",
   default: selector({
      key: "default-authentication",
      get: async () => {
         let auth = false;
         let user = null;
         try {
            const { data } = await axios.get(`${apiUrl}/auth/user`, {
               headers: {
                  Authorization: "Bearer " + localStorage.getItem("token"),
               },
            });
            auth = data.success === null ? false : true;
            user = data.success;
         } catch {
            auth = false;
            user = null;
         }
         return {
            auth,
            user,
         };
      },
   }),
});

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

export { authentication, carts };
