/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface WhiteLabelConfig {
  id?: string;
  name?: string;
  domain?: string;
  accent?: string;
  bg?: string;
  heroCopy?: string;
  btnPrimary?: string;
  sliderCount?: number;
  customSections?: string;
  heroImage?: string;
  logoImage?: string;
  owner_id?: string;
}

interface WhiteLabelContextProps {
  wlConfig: WhiteLabelConfig | null;
  setWlConfig: (config: WhiteLabelConfig | null) => void;
}

export const WhiteLabelContext = createContext<WhiteLabelContextProps>({
  wlConfig: null,
  setWlConfig: () => {}
});

export const useWhiteLabel = () => useContext(WhiteLabelContext);

export const WhiteLabelProvider = ({ children, initialConfig }: { children: ReactNode, initialConfig?: any }) => {
  const [wlConfig, setWlConfig] = useState<WhiteLabelConfig | null>(initialConfig || null);

  useEffect(() => {
    if (initialConfig !== undefined) {
      setWlConfig(initialConfig);
    }
  }, [initialConfig]);

  return (
    <WhiteLabelContext.Provider value={{ wlConfig, setWlConfig }}>
      {children}
    </WhiteLabelContext.Provider>
  );
};
