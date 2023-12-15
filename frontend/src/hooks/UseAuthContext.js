import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext/AuthContext";

export const useAuthContext = () => {
  const authInfo = useContext(AuthContext);

  return authInfo;
};
