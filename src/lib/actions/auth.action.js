/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useCurrentUser } from "@/lib/store";
import { apiLogin, apiRegister, apiLogout } from "@/lib/helpers";
import { useNotification } from "@/hooks";

export const useAuthState = () => {
  const {
    getCurrentUser,
    userProfile: profile,
    getUserProfile,
  } = useCurrentUser();

  useEffect(() => {
    // Check if user is logged in from localStorage/session
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        getCurrentUser({
          userId: user?.id,
          user: {
            ...profile,
            ...user,
          },
          isLoading: false,
          isLoaded: true,
        });
      } catch (error) {
        getCurrentUser({ isLoaded: true, isLoading: false });
        getUserProfile(null);
      }
    } else {
      getCurrentUser({ isLoaded: true, isLoading: false });
      getUserProfile(null);
    }
  }, [getCurrentUser, profile]);
};

export const useLogin = () => {
  const [notify] = useNotification();
  const { getCurrentUser } = useCurrentUser();

  const {
    mutate: login,
    isPending: isSubmitting,
    isSuccess: isSubmitted,
  } = useMutation({
    mutationFn: async (values) => {
      try {
        const response = await apiLogin({
          email: values?.email,
          password: values?.password,
        });

        // Store user data and token
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("token", response.token);

        // Update current user state
        getCurrentUser({
          userId: response.user?.id,
          user: response.user,
          isLoading: false,
          isLoaded: true,
        });

        notify({
          title: "Success",
          variant: "success",
          description: "Logged in successfully",
        });
      } catch (err) {
        console.error("error", err);
        notify({
          title: "Error",
          variant: "error",
          description: err?.response?.data?.message || err?.message || "Login failed",
        });
      }
    },
  });

  return { isSubmitting, isSubmitted, login };
};

export const useRegister = () => {
  const [notify] = useNotification();
  const { getCurrentUser } = useCurrentUser();

  const {
    mutate: register,
    isPending: isSubmitting,
    isSuccess: isSubmitted,
  } = useMutation({
    mutationFn: async (values) => {
      try {
        const response = await apiRegister({
          email: values.email,
          password: values.password,
          username: values.username,
          role: values.role,
        });

        // Store user data and token
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("token", response.token);

        // Update current user state
        getCurrentUser({
          userId: response.user?.id,
          user: response.user,
          isLoading: false,
          isLoaded: true,
        });

        notify({
          title: "Success",
          variant: "success",
          description: "Account created successfully",
        });
      } catch (err) {
        console.error("error", err);

        notify({
          title: "Error",
          variant: "error",
          description: err?.response?.data?.message || err?.message || "Registration failed",
        });
      }
    },
  });

  return { isSubmitting, isSubmitted, register };
};

export const useSocialAuthSignUp = () => {
  const [notify] = useNotification();

  const {
    mutate: socialAuthSignUp,
    isPending: isSubmitting,
    isSuccess: isSubmitted,
  } = useMutation({
    mutationFn: async (strategy) => {
      try {
        // TODO: Implement OAuth endpoints when available in backend
        // For now, redirect to your backend OAuth endpoints
        if (strategy === "oauth_google") {
          window.location.href = "https://localhost:7227/api/auth/google";
        }
        if (strategy === "oauth_github") {
          window.location.href = "https://localhost:7227/api/auth/github";
        }
      } catch (err) {
        console.error("error", err);
        notify({
          title: "Error",
          variant: "error",
          description: err?.message || "Social login failed",
        });
      }
    },
  });

  return { isSubmitting, isSubmitted, socialAuthSignUp };
};

export const useSocialAuthSignUpRedirect = () => {
  const { getCurrentUser } = useCurrentUser();
  const [notify] = useNotification();

  const {
    mutate: socialAuthSignUpRedirect,
    isPending: isSubmitting,
    isSuccess: isSubmitted,
  } = useMutation({
    mutationFn: async () => {
      try {
        // TODO: Handle OAuth redirect response from backend
        // Check localStorage or sessionStorage for OAuth user data
        const oauthUser = localStorage.getItem("oauth_user");
        if (oauthUser) {
          const user = JSON.parse(oauthUser);
          localStorage.setItem("user", JSON.stringify(user));
          getCurrentUser({
            userId: user?.id,
            user,
            isLoading: false,
            isLoaded: true,
          });
          localStorage.removeItem("oauth_user");
        }
      } catch (err) {
        console.error("error", err);
        notify({
          title: "Error",
          variant: "error",
          description: "OAuth redirect failed",
        });
      }
    },
  });

  return { isSubmitting, isSubmitted, socialAuthSignUpRedirect };
};

export const useLogout = () => {
  const { getCurrentUser } = useCurrentUser();
  const [notify] = useNotification();

  const {
    mutate: logout,
    isPending: isSubmitting,
    isSuccess: isSubmitted,
  } = useMutation({
    mutationFn: async () => {
      try {
        await apiLogout();
        
        // Clear stored user data and token
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        getCurrentUser({
          isLoaded: true,
          isLoading: false,
        });

        notify({
          title: "Success",
          variant: "success",
          description: "Logged out successfully",
        });
      } catch (err) {
        console.error("Logout error:", err);
        notify({
          title: "Error",
          variant: "error",
          description: "Logout failed",
        });
      }
    },
  });

  return { isSubmitting, isSubmitted, logout };
};

export const useForgetPassCreate = () => {
  const [notify] = useNotification();

  const {
    mutate: forgetPassCreate,
    isPending: isSubmitting,
    isSuccess: isSubmitted,
  } = useMutation({
    mutationFn: async (values) => {
      try {
        const actionCodeSettings = {
          url: import.meta.env.VITE_PUBLIC_AUTH_RESET_PASS_ACTION_URL,
          handleCodeInApp: false,
        };

        await sendPasswordResetEmail(auth, values?.email, actionCodeSettings);

        notify({
          title: "Success",
          variant: "success",
          description: "Password reset email sent",
        });

        return null;
      } catch (error) {
        // console.log(error, "ERROR");
        const message =
          error.code === "auth/user-not-found"
            ? "Email address not found. Check your email address and try again."
            : "An error occured. Try again later.";
        notify({
          title: "Error",
          variant: "error",
          description: message,
        });
      }
    },
  });

  return {
    forgetPassCreate,
    isSubmitting,
    isSubmitted,
  };
};

export const useVerifyResetPassword = (actionCode) => {
  const { isPending, isSuccess, isError, isFetching, error, data } = useQuery({
    queryKey: ["resetPassword", { actionCode }],
    queryFn: async () => {
      if (actionCode) {
        try {
          return await verifyPasswordResetCode(auth, actionCode);
        } catch (error) {
          // console.log(error.code);
        }
      }
    },
  });

  return { isPending, isSuccess, isError, isFetching, error, data };
};

export const useForgetPassReset = () => {
  const [notify] = useNotification();

  const navigate = useNavigate();

  const {
    mutate: forgetPassReset,
    isPending: isSubmitting,
    isSuccess: isSubmitted,
  } = useMutation({
    mutationFn: async (values) => {
      try {
        await confirmPasswordReset(auth, values?.actionCode, values?.password);

        notify({
          title: "Success",
          variant: "success",
          description: "Password reset successful",
        });
      } catch (error) {
        let message;
        if (error?.code) {
          switch (error?.code) {
            case "auth/invalid-action-code":
              message = "Reset Code has Expired";
              break;

            default:
              message = "An error occured. Try again later.";
              break;
          }
        } else {
          message = "An error occured. Try again later.";
        }

        notify({
          title: "Error",
          variant: "error",
          description: message,
        });
      }
    },
    onSuccess: () => {
      navigate("/login");
    },
  });

  return {
    forgetPassReset,
    isSubmitting,
    isSubmitted,
  };
};
