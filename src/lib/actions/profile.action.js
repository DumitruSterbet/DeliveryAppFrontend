/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import useLocalStorage from "use-local-storage";

import { useCurrentUser } from "@/lib/store";
import { apiUpdateProfile, uploadImage, apiChangePassword } from "@/lib/helpers";
import { useNotification } from "@/hooks";

export const useGetProfile = () => {
  const [, setThemeLS] = useLocalStorage("groove-theme-config");
  const [, setPlayerLS] = useLocalStorage("groove-player");

  const { currentUser, getUserProfile } = useCurrentUser();
  const { user } = currentUser || {};

  const [prof, setProf] = useState(null);
  
  useEffect(() => {
    // Get profile from localStorage user data
    if (user) {
      setProf(user);
      if (user?.prefs) setThemeLS(user.prefs);
      if (user?.player) setPlayerLS(user.player);
      getUserProfile(user);
    }
  }, [user]);

  return prof;
};

export const useUpdateProfile = () => {
  const { currentUser } = useCurrentUser();
  const { userId } = currentUser || {};

  const [notify] = useNotification();

  const {
    mutate: updateUserProfile,
    isPending: isSubmitting,
    isSuccess: isSubmitted,
  } = useMutation({
    mutationFn: async (values) => {
      if (userId) {
        try {
          let profileImage = null;
          if (values?.files) {
            profileImage = await uploadImage({
              imageFile: values?.files[0],
              storagePath: `users/${userId}`,
              fileName: "avatar.jpg",
            });
          }

          await apiUpdateProfile({
            username: values?.username,
            imageUrl: profileImage,
          });

          // Update localStorage user data
          const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
          const updatedUser = {
            ...storedUser,
            username: values?.username,
            imageUrl: profileImage,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));

          notify({
            title: "Success",
            variant: "success",
            description: "Profile updated successfully",
          });
        } catch (err) {
          console.error("error", err);
          notify({
            title: "Error",
            variant: "error",
            description: "An error occured!",
          });
        }
      }
    },
  });

  return { updateUserProfile, isSubmitting, isSubmitted };
};

export const useUpdateAccountTheme = () => {
  const [, setThemeLS] = useLocalStorage("groove-theme-config");

  const { currentUser } = useCurrentUser();
  const { userId } = currentUser || {};

  const {
    mutate: updateTheme,
    isPending: isSubmitting,
    isSuccess: isSubmitted,
  } = useMutation({
    mutationFn: async (prefs) => {
      if (userId) {
        try {
          await apiUpdateProfile({ prefs });
          
          // Update localStorage
          const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
          storedUser.prefs = prefs;
          localStorage.setItem("user", JSON.stringify(storedUser));
        } catch (err) {
          console.error("error", err);
        }
      } else {
        setThemeLS(prefs);
      }
    },
  });

  return { updateTheme, isSubmitting, isSubmitted };
};

export const useUpdateAccountPlayer = () => {
  const [, setPlayerLS] = useLocalStorage("groove-player");

  const { currentUser } = useCurrentUser();
  const { userId } = currentUser || {};

  const {
    mutate: updatePlayer,
    isPending: isSubmitting,
    isSuccess: isSubmitted,
  } = useMutation({
    mutationFn: async (player) => {
      if (userId) {
        try {
          await apiUpdateProfile({ player });
          
          // Update localStorage
          const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
          storedUser.player = player;
          localStorage.setItem("user", JSON.stringify(storedUser));
        } catch (err) {
          console.error("error", err);
        }
      } else {
        setPlayerLS(player);
      }
    },
  });

  return { updatePlayer, isSubmitting, isSubmitted };
};

export const useUpdatePassword = () => {
  const { currentUser } = useCurrentUser();
  const { userId } = currentUser || {};

  const [notify] = useNotification();

  const {
    mutate: updatePass,
    isPending: isSubmitting,
    isSuccess: isSubmitted,
  } = useMutation({
    mutationFn: async (values) => {
      if (userId) {
        try {
          await apiChangePassword({
            currentPassword: values?.currentPassword,
            newPassword: values?.newPassword,
          });

          notify({
            title: "Success",
            variant: "success",
            description: "Password updated successfully",
          });
        } catch (err) {
          console.error("error", err);
          notify({
            title: "Error",
            variant: "error",
            description: err?.response?.data?.message || "An error occured!",
          });
        }
      }
    },
  });

  return { updatePass, isSubmitting, isSubmitted };
};
