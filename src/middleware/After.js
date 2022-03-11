import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useRecoilValue } from "recoil";
import { authentication } from "../store/Authentication";

function After(props) {
   const navigate = useNavigate();
   const { auth } = useRecoilValue(authentication);
   useEffect(() => {
      if (!auth) {
         navigate("/login");
      }
   }, [auth, navigate]);

   return props.children;
}

export default After;
