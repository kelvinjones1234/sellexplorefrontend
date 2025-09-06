"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
} from "react";

export interface BookmarkedItem {
  id: string;
  name: string;
  price: number;
  slug: string;
  image?: string;
  vendor: string;
}

interface BookmarkState {
  items: BookmarkedItem[];
  isOpen: boolean;
}

type BookmarkAction =
  | { type: "ADD_ITEM"; payload: BookmarkedItem }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "CLEAR_ALL" }
  | { type: "INIT_FROM_STORAGE"; payload: BookmarkedItem[] }
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "TOGGLE" };

interface BookmarkContextType extends BookmarkState {
  addItem: (item: BookmarkedItem) => void;
  removeItem: (id: string) => void;
  clearAll: () => void;
  openBookmark: () => void;
  closeBookmark: () => void;
  toggleBookmark: () => void;
  totalItems: number;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(
  undefined
);

const reducer = (
  state: BookmarkState,
  action: BookmarkAction
): BookmarkState => {
  switch (action.type) {
    case "ADD_ITEM":
      if (state.items.find((i) => i.id === action.payload.id)) {
        return state; // Already bookmarked
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      };

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload.id),
      };

    case "CLEAR_ALL":
      return { ...state, items: [] };

    case "INIT_FROM_STORAGE":
      return { ...state, items: action.payload };

    case "OPEN":
      return { ...state, isOpen: true };

    case "CLOSE":
      return { ...state, isOpen: false };

    case "TOGGLE":
      return { ...state, isOpen: !state.isOpen };

    default:
      return state;
  }
};

export const BookmarkProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, { items: [], isOpen: false });

  // Initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("bookmarks");
    if (stored) {
      dispatch({
        type: "INIT_FROM_STORAGE",
        payload: JSON.parse(stored),
      });
    }
  }, []);

  // Update localStorage on change
  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (item: BookmarkedItem) =>
    dispatch({ type: "ADD_ITEM", payload: item });

  const removeItem = (id: string) =>
    dispatch({ type: "REMOVE_ITEM", payload: { id } });

  const clearAll = () => dispatch({ type: "CLEAR_ALL" });

  const openBookmark = () => dispatch({ type: "OPEN" });

  const closeBookmark = () => dispatch({ type: "CLOSE" });

  const toggleBookmark = () => dispatch({ type: "TOGGLE" });

  const totalItems = state.items.length;

  return (
    <BookmarkContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        clearAll,
        openBookmark,
        closeBookmark,
        toggleBookmark,
        totalItems,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmark = (): BookmarkContextType => {
  const ctx = useContext(BookmarkContext);
  if (!ctx) throw new Error("useBookmark must be used inside BookmarkProvider");
  return ctx;
};
