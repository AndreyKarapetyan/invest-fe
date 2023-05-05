import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { StyledEngineProvider } from '@mui/material/styles';

import App from './app/app';
import { ErrorBoundary } from './app/components/ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <ErrorBoundary>
    <StyledEngineProvider injectFirst>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StyledEngineProvider>
  </ErrorBoundary>,
);
