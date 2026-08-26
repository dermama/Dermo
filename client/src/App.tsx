import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import AdminPage from "./pages/AdminPage";
import ConversationPage from "./pages/ConversationPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/yonetim" component={AdminPage} />
      <Route path="/gorusme/:token" component={ConversationPage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router />
    </ErrorBoundary>
  );
}

export default App;
