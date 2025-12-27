import type { NavigateOptions } from "react-router-dom";
 import { useEffect } from "react";

import { HeroUIProvider } from "@heroui/system";
 import { useTheme } from "@heroui/use-theme";
import { useHref, useNavigate } from "react-router-dom";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

 function ThemeInitializer() {
   const { theme, setTheme } = useTheme();

   useEffect(() => {
     if (!theme) setTheme("light");
   }, [setTheme, theme]);

   return null;
 }

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <ThemeInitializer />
      {children}
    </HeroUIProvider>
  );
}
