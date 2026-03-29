import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router';
import '../tokens/tokens.css';
import '../tokens/dark.css';

function App() {
  // Use data-theme="dark" for dark mode by default
  React.useEffect(() => {
    document.body.setAttribute('data-theme', 'dark');
  }, []);

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
