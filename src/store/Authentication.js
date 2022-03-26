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
            auth = data.meta.status === "success" ? true : false;
            user = data.data;
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

export { authentication };
