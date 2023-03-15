import { createContext, useContext, useReducer, useEffect } from "react";
import reducer from "../reducers/videoReducer";

interface LayoutProps {
  grid_view: boolean,
  updateLayout: (grid_view: boolean) => void
}

const VideoLayoutContext = createContext<LayoutProps | null>(null);

const initialState = {
  grid_view: true,
};

export const LayoutViewContext = ({ children }: any) => {

  const [state, dispatch] = useReducer(reducer, initialState);

  // to set the grid view
  const setGridView = () => {
    return dispatch({ type: "SET_GRID_VIEW" });
  };

  return (
    <VideoLayoutContext.Provider
      value={{ ...state, setGridView }}>
      {children}
    </VideoLayoutContext.Provider>
  );
};

export const useVideoLayoutContext = () => {
  return useContext(VideoLayoutContext);
};
