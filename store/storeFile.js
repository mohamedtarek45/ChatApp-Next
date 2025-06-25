import { create } from "zustand";
export const useFileStore = create((set, get) => ({
  file: null,

  loading: false,
  setLoading: (loading) => set(() => ({ loading })),
  addImageOrVideo: (type, url) =>
    set(() => ({
      file: {
        type: type,
        src: url,
      },
    })),
  deleteImageOrVideo: () => {
    set(() => ({ file: null }));
  },
}));
