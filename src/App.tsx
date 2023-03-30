import { useState } from 'react';
import './App.css';
import Tabs from './components/tabs';
import PerformanceObserverEx from './pages/PerformanceObserver/PerformanceObserveEx';
import WebWorker from "./pages/WebWorker/webworker";

// Example usage
const App = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const tabs = [
    {
      label: "Web Worker",
      content: <WebWorker />
    },
    {
      label: "Performance Observer",
      content: <PerformanceObserverEx />
    }
  ];

  return (
    <div>
      <h1>My Tabs</h1>
      <Tabs tabs={tabs} tabIndex={tabIndex} setTabIndex={setTabIndex} />
    </div>
  );
};

export default App;