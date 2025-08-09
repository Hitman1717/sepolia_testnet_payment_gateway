import React from 'react';
import TracePanel from '../components/TracePanel.jsx';
import TraceViewer from '../components/TraceViewer.jsx';

export default function Trace() {
  return (
    <div style={{ padding: 24 }}>
      <TracePanel />
      <TraceViewer />
    </div>
  );
}


