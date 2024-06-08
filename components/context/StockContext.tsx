import { StockContext } from 'context/StockContext';
import React, { useState } from 'react';
import ChatBar from 'components/ui/ChatBar';
import SectorPerformanceComponent from 'components/stocks/SectorPerformance';

export default function App() {
  const [sectorData, setSectorData] = useState([]);

  return (
    <StockContext.Provider value={{ sectorData, setSectorData }}>
      <ChatBar />
      <SectorPerformanceComponent />
    </StockContext.Provider>
  );
}