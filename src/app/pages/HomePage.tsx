import React from 'react';
import { HomeDashboard } from '../../blocks/templates/HomeDashboard/HomeDashboard';

export const HomePage: React.FC = () => {
  return (
    <HomeDashboard>
      <div style={{ padding: '20px' }}>
        <h1>Welcome to CYBO AI Video Editor</h1>
        <p>Your launchpad for AI creativity.</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => window.location.href = '/editor'}>Go to Editor</button>
          <button onClick={() => window.location.href = '/builder'}>Go to Puck Builder</button>
        </div>
      </div>
    </HomeDashboard>
  );
};
