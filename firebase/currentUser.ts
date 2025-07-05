// hooks/useCurrentUser.ts
"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

export default function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();           
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        // console.log("📋 Firebase Google user ⇣", {
        //   uid: u.uid,
        //   displayName: u.displayName,
        //   email: u.email,
        //   photoURL: u.photoURL,
        //   phoneNumber: u.phoneNumber,
        //   providerData: u.providerData,
        //   metadata: {
        //     createdAt: u.metadata.creationTime,
        //     lastLoginAt: u.metadata.lastSignInTime,
        //   },
        //   token: (u as any).accessToken,
        // });
        setUser(u);
      } else {
        setUser(null);
      }
    });

    return unsubscribe; // cleanup listener on unmount
  }, []);

  return user;
}
