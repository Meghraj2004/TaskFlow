
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { updateProfile, updateEmail, updatePassword, User } from "firebase/auth";

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  phoneNumber?: string | null;
  address?: string;
  bio?: string;
  createdAt?: Date;
  lastLoginAt?: Date;
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      return { ...(docSnap.data() as UserProfile), uid: userId };
    } else {
      // Create a basic profile if it doesn't exist
      const user = auth.currentUser;
      if (user) {
        const newProfile: UserProfile = {
          uid: userId,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date(),
        };
        
        await setDoc(userRef, newProfile);
        return newProfile;
      }
      return null;
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (
  userId: string, 
  profileData: Partial<UserProfile>
): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { ...profileData });
    
    // Update auth profile if available
    const user = auth.currentUser;
    if (user) {
      if (profileData.displayName) {
        await updateProfile(user, { displayName: profileData.displayName });
      }
      if (profileData.photoURL) {
        await updateProfile(user, { photoURL: profileData.photoURL });
      }
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const updateUserEmail = async (newEmail: string): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (user) {
      await updateEmail(user, newEmail);
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { email: newEmail });
    }
  } catch (error) {
    console.error("Error updating user email:", error);
    throw error;
  }
};

export const updateUserPassword = async (newPassword: string): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (user) {
      await updatePassword(user, newPassword);
    }
  } catch (error) {
    console.error("Error updating user password:", error);
    throw error;
  }
};
