import { createContext, useContext } from 'react';

const PortalContainerContext = createContext<HTMLElement | null>(null);

/**
 * Where menus and pickers portal to. Defaults to <body>; provide an element when a subtree has its
 * own data-theme (popups would otherwise take the page's theme), or inside a dialog or shadow root.
 */
export const PortalContainerProvider = PortalContainerContext.Provider;

export function usePortalContainer() {
  return useContext(PortalContainerContext) ?? undefined;
}
