import React, { useState, useEffect, useContext } from "react";
import { auth, db } from "../firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function signup(email, password, firstName) {
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        db.collection("users")
          .doc(result.user.uid)
          .set({ id: result.user.uid, name: firstName, bugCount: 0 });
        return result.user.updateProfile({
          displayName: firstName,
        });
      });
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password);
  }

  function updateFirstName(firstName) {
    db.collection("users").doc(currentUser.uid).update({ name: firstName });
    db.collection("bugs")
      .where("assignedToId", "==", currentUser.uid)
      .get()
      .then((querySnapshots) => {
        if (querySnapshots.size > 0) {
          querySnapshots.forEach((bug) => {
            db.collection("bugs").doc(bug.id).update({ assignedTo: firstName });
          });
        }
      });
    db.collection("bugs")
      .where("createById", "==", currentUser.uid)
      .get()
      .then((querySnapshots) => {
        if (querySnapshots.size > 0) {
          querySnapshots.forEach((bug) => {
            db.collection("bugs").doc(bug.id).update({ createBy: firstName });
          });
        }
      });
    return currentUser.updateProfile({
      displayName: firstName,
    });
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    updateFirstName,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
