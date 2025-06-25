import { create } from "zustand";
export const useStore = create((set) => ({
  user: null,
  loginUser: (user) =>
    set(() => ({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profile_picture: user.profile_picture,
      },
    })),
  logoutUser: () => set((state) => ({ user: null })),
}));
