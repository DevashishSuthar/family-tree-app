import React from 'react';
import { Toaster } from 'sonner';
import { useThemeStore } from '../store/Store';

export const AppToaster: React.FC = () => {
  const theme = useThemeStore((state) => state.theme);
  return <Toaster position="top-right" theme={theme} richColors />;
};
