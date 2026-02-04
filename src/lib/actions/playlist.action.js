/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useCurrentUser } from "@/lib/store";
import { elementInArray } from "@/lib/utils";
import {
  apiSaveRecentPlayed,
  apiFetchRecentPlayed,
  apiCreatePlaylist,
  apiGetPlaylist,
  apiUpdatePlaylist,
  apiDeletePlaylist,
  apiAddTrackToPlaylist,
  apiRemoveTrackFromPlaylist,
  apiFavoritePlaylists,
  apiAddFavoritePlaylist,
  apiRemoveFavoritePlaylist,
  apiFetchMyPlaylists,
  uploadImage,
} from "@/lib/helpers";

import { useNotification } from "@/hooks";

// recent played
export const useSaveRecentPlayed = () => {
  const queryClient = useQueryClient();

  const { mutate: saveRecentPlayed } = useMutation({
    mutationFn: async (playlistId) => {
      try {
        await apiSaveRecentPlayed(playlistId);
      } catch (error) {
        console.error("Error saving recent played:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recentPlayed"] });
    },
  });

  return {
    saveRecentPlayed,
  };
};

export const useFetchRecentPlayed = () => {
  const { currentUser } = useCurrentUser();
  const { userId } = currentUser || {};

  const { isPending, isSuccess, isError, isFetching, error, data } = useQuery({
    queryKey: ["recentPlayed", { userId }],
    queryFn: async () => {
      if (userId) {
        try {
          const response = await apiFetchRecentPlayed();
          return response.data || [];
        } catch (error) {
          console.error("Error fetching recent played:", error);
          return [];
        }
      } else {
        return null;
      }
    },
  });

  return { isPending, isSuccess, isError, isFetching, error, data };
};

// fetch playlists

export const useFetchMyPlaylists = () => {
  const { currentUser } = useCurrentUser();
  const { userId } = currentUser || {};

  const navigate = useNavigate();

  const { isPending, isSuccess, isError, isFetching, error, data } = useQuery({
    queryKey: ["myPlaylists", { userId }],
    queryFn: async () => {
      if (userId) {
        try {
          const response = await apiFetchMyPlaylists();
          return response.data || [];
        } catch (error) {
          console.error("Error fetching playlists:", error);
         // navigate("/");
          return [];
        }
      } else {
        return null;
      }
    },
  });

  return { isPending, isSuccess, isError, isFetching, error, data };
};

// playlist CRUD

export const useCreateMyPlaylist = () => {
  const { currentUser } = useCurrentUser();
  const { userId } = currentUser || {};

  const navigate = useNavigate();
  const [notify] = useNotification();

  const queryClient = useQueryClient();

  const { mutate: createMyPlaylist, isPending: isCreating } = useMutation({
    mutationFn: async () => {
      if (userId) {
        try {
          const response = await apiCreatePlaylist({
            name: `My Playlist #${Date.now()}`,
            description: "Here is an optional description",
            imageUrl: null,
          });

          navigate(`/my-playlists/${response.data.id}`);
        } catch (error) {
          notify({
            title: "Error",
            variant: "error",
            description: error?.response?.data?.message || "Failed to create playlist",
          });
        }
      } else {
        throw new Error("Invalid params");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myPlaylists"] });
    },
  });

  return {
    createMyPlaylist,
    isCreating,
  };
};

export const useFetchMyPlaylist = (id) => {
  const { currentUser } = useCurrentUser();
  const { userId } = currentUser || {};

  const [notify] = useNotification();
  const navigate = useNavigate();

  const { isPending, isSuccess, isError, isFetching, error, data } = useQuery({
    queryKey: [`singleMyPlaylist_${id}`, { userId, id }],
    queryFn: async () => {
      if (userId) {
        try {
          const response = await apiGetPlaylist(id);
          return response.data;
        } catch (error) {
          notify({
            title: "Error",
            variant: "error",
            description: "Request failed",
          });
          navigate("/");
        }
      } else {
        throw new Error("Invalid params");
      }
    },
  });

  return { isPending, isSuccess, isError, isFetching, error, data };
};

export const useEditMyPlaylist = () => {
  const { currentUser } = useCurrentUser();
  const { userId } = currentUser || {};

  const [notify] = useNotification();
  const queryClient = useQueryClient();

  const {
    mutate: editMyPlaylist,
    isPending: isEditing,
    isSuccess: isEdited,
  } = useMutation({
    mutationFn: async (values) => {
      const { id, title, desc, files, imagePath } = values;

      if (userId) {
        try {
          let imageUrl = null;

          if (files) {
            imageUrl = await uploadImage({
              imageFile: files[0],
              storagePath: `myPlaylists/${imagePath || uuidv4()}`,
              fileName: "image.jpg",
            });
          }

          await apiUpdatePlaylist(id, {
            name: title,
            description: desc,
            imageUrl: imageUrl,
          });

          notify({
            title: "Success",
            variant: "success",
            description: "Details successfully edited",
          });
        } catch (error) {
          notify({
            title: "Error",
            variant: "error",
            description: "Request failed",
          });
        }
      } else {
        throw new Error("invalid params");
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [`singleMyPlaylist_${variables?.id}`],
      });
    },
  });

  return {
    editMyPlaylist,
    isEditing,
    isEdited,
  };
};

export const useRemoveMyPlaylist = () => {
  const { currentUser } = useCurrentUser();
  const { userId } = currentUser || {};

  const navigate = useNavigate();
  const [notify] = useNotification();

  const queryClient = useQueryClient();

  const { mutate: deleteMyPlaylist, isPending: isRemoving } = useMutation({
    mutationFn: async (id) => {
      if (userId) {
        try {
          await apiDeletePlaylist(id);

          navigate("/my-playlists");

          notify({
            title: "Success",
            variant: "success",
            description: "Playlist deleted",
          });
          return null;
        } catch (error) {
          notify({
            title: "Error",
            variant: "error",
            description: "An error occurred while deleting",
          });
        }
      } else {
        throw new Error("invalid error");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`myPlaylists`] });
    },
  });

  return {
    deleteMyPlaylist,
    isRemoving,
  };
};

// add/remove tracks to/from a playlist

export const useAddTrackToMyPlaylist = () => {
  const { currentUser } = useCurrentUser();
  const { userId } = currentUser || {};

  const [notify] = useNotification();

  const queryClient = useQueryClient();

  const { mutate: createMyPlaylist, isPending: isCreating } = useMutation({
    mutationFn: async ({ trackD, id, imageUrl }) => {
      if (userId) {
        try {
          await apiAddTrackToPlaylist(id, trackD);

          notify({
            title: "Success",
            variant: "success",
            description: "Added to playlist",
          });
        } catch (error) {
          notify({
            title: "Error",
            variant: "error",
            description: "An error occurred while adding",
          });
        }
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [`singleMyPlaylist_${variables.id}`],
      });
    },
  });

  return {
    createMyPlaylist,
    isCreating,
  };
};

export const useRemoveTrackFromMyPlaylist = () => {
  const { currentUser } = useCurrentUser();
  const { userId } = currentUser || {};

  const [notify] = useNotification();

  const queryClient = useQueryClient();

  const { mutate: deleteTrackFromMyPlaylist, isPending: isRemoving } =
    useMutation({
      mutationFn: async ({ trackD, id }) => {
        if (userId) {
          try {
            await apiRemoveTrackFromPlaylist(id, trackD);

            notify({
              title: "Success",
              variant: "success",
              description: "Deleted from playlist",
            });
            return null;
          } catch (error) {
            notify({
              title: "Error",
              variant: "error",
              description: "An error occurred while deleting",
            });
          }
        } else {
          throw new Error("Invalid params");
        }
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: [`singleMyPlaylist_${variables.id}`],
        });
      },
    });

  return {
    deleteTrackFromMyPlaylist,
    isRemoving,
  };
};

// favourites playlists CRUD

export const useSaveFavouritePlaylist = () => {
  const { currentUser } = useCurrentUser();
  const { userId } = currentUser || {};

  const queryClient = useQueryClient();

  const [notify] = useNotification();

  const { mutate: saveFavouritePlaylist } = useMutation({
    mutationFn: async (playlistId) => {
      if (userId) {
        try {
          await apiAddFavoritePlaylist(playlistId);

          notify({
            title: "Success",
            variant: "success",
            description: "Favourite product added",
          });
        } catch (error) {
          console.error("Error adding favorite:", error);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["listFavouritePlaylists"],
      });
      queryClient.invalidateQueries({
        queryKey: ["favouritePlaylists"],
      });
    },
  });

  return {
    saveFavouritePlaylist,
  };
};

export const useFetchFavouritePlaylist = () => {
  const { currentUser } = useCurrentUser();
  const { userId } = currentUser || {};

  const { isPending, isSuccess, isError, isFetching, error, data } = useQuery({
    queryKey: ["favouritePlaylists", { userId }],
    queryFn: async () => {
      if (userId) {
        try {
          const response = await apiFavoritePlaylists();
          return response.data || [];
        } catch (error) {
          console.error("Error fetching favorites:", error);
          return [];
        }
      } else {
        throw new Error("Invalid userId");
      }
    },
  });

  return { isPending, isSuccess, isError, isFetching, error, data };
};

export const useListFavouritePlaylist = () => {
  const { currentUser } = useCurrentUser();
  const { userId } = currentUser || {};

  const { isPending, isSuccess, isError, isFetching, error, data } = useQuery({
    queryKey: ["listFavouritePlaylists", { userId }],
    queryFn: async () => {
      if (userId) {
        try {
          const response = await apiFavoritePlaylists();
          const playlistIds = response.data?.map((p) => p.id) || [];
          return { favouriteplaylistList: playlistIds };
        } catch (error) {
          console.error("Error fetching favorite list:", error);
          return { favouriteplaylistList: [] };
        }
      } else {
        throw new Error("Invalid userId");
      }
    },
  });

  return { isPending, isSuccess, isError, isFetching, error, data };
};

export const useRemoveFavouritePlaylist = () => {
  const { currentUser } = useCurrentUser();
  const { userId } = currentUser || {};

  const [notify] = useNotification();

  const queryClient = useQueryClient();

  const { mutate: removeFavouritePlaylist } = useMutation({
    mutationFn: async (playlistId) => {
      if (userId) {
        try {
          await apiRemoveFavoritePlaylist(playlistId);

          notify({
            title: "Success",
            variant: "success",
            description: "Favourite playlist removed",
          });
        } catch (error) {
          notify({
            title: "Error",
            variant: "error",
            description: "An error occurred while deleting",
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["listFavouritePlaylists"],
      });
      queryClient.invalidateQueries({
        queryKey: ["favouritePlaylists"],
      });
    },
  });

  return { removeFavouritePlaylist };
};
