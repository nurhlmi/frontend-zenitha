import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useRecoilValue } from "recoil";
import { authentication } from "../store/Authentication";

function Before(props) {
   const navigate = useNavigate();
   const { auth } = useRecoilValue(authentication);
   useEffect(() => {
      if (auth) {
         navigate("/dashboard");
      }
   }, [auth, navigate]);

   return props.children;
}

export default Before;
