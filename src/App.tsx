import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppProviders } from "./providers/AppProviders";
import { AppRoutes } from "./routes/AppRoutes";
import { Loader } from "./components/ui/Loader/Loader";
import { AppErrorBoundary } from "./components/feedback/AppErrorBoundary/AppErrorBoundary";

import "./App.css";

const App = () => (
  <BrowserRouter>
    <AppProviders>
      <AppErrorBoundary>
        <Suspense fallback={<Loader variant="page" />}>
          <AppRoutes />
        </Suspense>
      </AppErrorBoundary>
    </AppProviders>
  </BrowserRouter>
);

export default App;
