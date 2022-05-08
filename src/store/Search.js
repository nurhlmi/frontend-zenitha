import { atom } from "recoil";
import { Param } from "../components/Param";

const search = atom({
   key: "search",
   default: Param("q") !== false ? decodeURI(Param("q")) : "",
});

export { search };
