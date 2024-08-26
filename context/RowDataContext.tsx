'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RowDataContextType {
  rowData: any;
  setRowData: (data: any) => void;
}

const RowDataContext = createContext<RowDataContextType | undefined>(undefined);

export function RowDataProvider({ children }: { children: ReactNode }) {
  const [rowData, setRowData] = useState<any>(null);

  return (
    <RowDataContext.Provider value={{ rowData, setRowData }}>
      {children}
    </RowDataContext.Provider>
  );
}

export function useRowData() {
  const context = useContext(RowDataContext);
  if (context === undefined) {
    throw new Error('useRowData must be used within a RowDataProvider');
  }
  return context;
}