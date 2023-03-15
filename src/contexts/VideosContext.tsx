import { createContext, useState } from "react";

const initialState = {
  gridView: 'grid',
  updateLayout: () => {}
}

interface LayoutProps {
  gridView: string,
  updateLayout?: (gridView: string) => void
}

const VideoLayoutContext = createContext<LayoutProps | null>(initialState);

export const VideoLayoutProvider = ({ children }: any) => {
  const [currentLayout, setCurrentLayout] = useState('')

  const updateLayout = (layout: string) => {
    setCurrentLayout(layout)
  }

  return (
    <VideoLayoutContext.Provider
      value={{gridView: currentLayout, updateLayout}}>
      {children}
    </VideoLayoutContext.Provider>
  );
};

export default VideoLayoutContext

