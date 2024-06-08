import React from 'react';

export const StockContext = React.createContext({
  sectorData: [],
  setSectorData: (data: any) => {},
});