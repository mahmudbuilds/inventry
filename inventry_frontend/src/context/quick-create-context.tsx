"use client";

import * as React from "react";

export type QuickCreateType =
  | "product"
  | "movement"
  | "supplier"
  | "category"
  | null;

interface QuickCreateContextType {
  activeType: QuickCreateType;
  open: (type: NonNullable<QuickCreateType>) => void;
  close: () => void;
  isOpen: boolean;
}

const QuickCreateContext = React.createContext<
  QuickCreateContextType | undefined
>(undefined);

export function QuickCreateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeType, setActiveType] = React.useState<QuickCreateType>(null);

  const open = React.useCallback((type: NonNullable<QuickCreateType>) => {
    setActiveType(type);
  }, []);

  const close = React.useCallback(() => {
    setActiveType(null);
  }, []);

  return (
    <QuickCreateContext.Provider
      value={{
        activeType,
        open,
        close,
        isOpen: activeType !== null,
      }}
    >
      {children}
    </QuickCreateContext.Provider>
  );
}

export function useQuickCreate() {
  const context = React.useContext(QuickCreateContext);
  if (!context) {
    throw new Error("useQuickCreate must be used within a QuickCreateProvider");
  }
  return context;
}
