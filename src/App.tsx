import { useState } from 'react';
import './App.css';
import Tabs from './components/tabs';
import PerformanceObserverEx from './pages/PerformanceObserver/PerformanceObserverEx';
import WebWorker from "./pages/WebWorker/webworker";
import WebAssembly from "./pages/WebAssembly/WebAssembly";

// Example usage
const App = () => {
  const [tabIndex, setTabIndex] = useState(1);

  const tabs = [
    {
      label: "Web Worker",
      content: <WebWorker />
    },
    {
      label: "Performance Observer",
      content: <PerformanceObserverEx />
    },
    {
      label: "WebAssembly",
      content: <WebAssembly />
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