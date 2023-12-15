import { useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase/firebase.config";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      console.log("current user is: ", currentUser);
    });

    return () => unsubscribe();
  }, []);

  const createAcc = (email, password) => {
    setLoading(false);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    setLoading(false);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    setLoading(false);
    return signOut(auth);
  };

  const update = (info) => {
    setLoading(false);
    return updateProfile(auth.currentUser, info);
  };

  const loginWithGoogle = () => {
    setLoading(false);
    return signInWithPopup(auth, new GoogleAuthProvider());
  };

  const authInfo = {
    user,
    createAcc,
    login,
    logout,
    update,
    loading,
    loginWithGoogle,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
