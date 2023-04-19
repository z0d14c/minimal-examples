import { useEffect, useState } from 'react';

function WebAssembly() {
  const [wasmReady, setWasmReady] = useState(false);
  const [number1, setNumber1] = useState(0);
  const [number2, setNumber2] = useState(0);
  const [result, setResult] = useState(null);

  useEffect(() => {
    async function initWasm() {
      const go = new (window as any).Go();
      const result = await window.WebAssembly.instantiateStreaming(
        fetch('src/pages/WebAssembly/main.wasm'),
        go.importObject
      );
      go.run(result.instance);
      setWasmReady(true);
    }
    initWasm();
  }, []);

  const multiply = () => {
    if (wasmReady) {
      const product = (window as any).multiply(number1, number2);
      setResult(product);
    }
  };

  return (
    <div className="App">
      <h1>Multiply Two Numbers with Go WebAssembly</h1>
      <input
        type="number"
        value={number1}
        onChange={(e) => setNumber1(parseInt(e.target.value))}
        placeholder="Enter the first number"
      />
      <input
        type="number"
        value={number2}
        onChange={(e) => setNumber2(parseInt(e.target.value))}
        placeholder="Enter the second number"
      />
      <button onClick={multiply}>Multiply</button>
      {result !== null && (
        <p>
          The product of {number1} and {number2} is {result}.
        </p>
      )}
    </div>
  );
}

export default WebAssembly;
