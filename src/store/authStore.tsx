import { User } from "@/types/user";
import { deleteItemAsync, getItem, setItem } from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


// interface LoginData {
//   currentUser: { userId: string; username: string,avatar : string } | null;
//   accessToken: string | null;
//   refreshToken: string | null;
// }

interface AuthState {
  isAuthenticated: boolean;
  isGuest: boolean;
  userBookmarks: Array<string>;
  isOnboardingCompleted?: boolean;
  currentUser: { userId: string; username: string, avatar: string  } | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (user: User) => void;
  logout: () => void;
  loginAsGuest: () => void;
  addToBookmark: (slug: string) => void;
  removeFromBookmark: (slug: string) => void;
  onboardingCompleted: (status: boolean) => void;
  updateUserInfo: (user: Pick<User,"currentUser">) => void;
}


const useAuthStore = create(
  
  persist<AuthState>(
    (set) => ({
      isAuthenticated: false,
      isGuest: false,
      userBookmarks: [],
      currentUser: null,
      accessToken: null,
      refreshToken: null,
      isOnboardingCompleted: false,

      login: (payload: User) =>
        set({
          currentUser: payload.currentUser,
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
          isAuthenticated: true,
          isGuest: false,
        }),
      logout: () =>
        set({
          currentUser: null,
          isGuest: false,
          accessToken: null,
          refreshToken: null,
          userBookmarks: [],
          isAuthenticated: false,
        }),
      loginAsGuest: () =>
        set({
          isAuthenticated: true,
          currentUser: null,
          isGuest: true,
          userBookmarks: [],
          accessToken: null,
          refreshToken: null,
        }),
        onboardingCompleted: (status: boolean) =>
        set({
          isOnboardingCompleted: status,
        }),
      addToBookmark: (slug) =>
        set((state) => ({
          userBookmarks: [...state.userBookmarks, slug],
        })),
      removeFromBookmark: (slug) =>
        set((state) => ({
          userBookmarks: state.userBookmarks.filter(
            (bookmark) => bookmark !== slug
          ),
        })),
      updateUserInfo : (user: Pick<User,"currentUser">) => set((state) => ({
        currentUser : {
          userId : user.currentUser?.userId || state.currentUser?.userId || "",
          avatar : user.currentUser?.avatar || state.currentUser?.avatar || "",
          username : user.currentUser?.username || state.currentUser?.username || ""
        }
        })),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => ({
        getItem,
        setItem,
        removeItem: deleteItemAsync,
      })),
    }
  )
);

export const getAccessToken = () => {
  const accessToken = useAuthStore.getState().accessToken;
  return accessToken;
};

export const getRefreshToken = () => {
  const refreshToken = useAuthStore.getState().refreshToken;
  return refreshToken;
};

export const setAccessTokenInStore = (accessToken: string) => {
  useAuthStore.setState({ accessToken });
};

export default useAuthStore;
