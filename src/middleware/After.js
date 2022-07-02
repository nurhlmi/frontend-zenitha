import { Navigate } from "react-router";
import { useRecoilValue } from "recoil";
import { authentication } from "../store/Authentication";

function After(props) {
   const { auth } = useRecoilValue(authentication);
   if (!auth) {
      return <Navigate to="/" />;
   }

   return props.children;
}

export default After;
