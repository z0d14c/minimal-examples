import { useEffect, useState } from "react"

export const WebWorkerDemo = () => {
    const [number, setNumber] = useState(0);
    const runWorker = () => {
        console.log("before worker")
        // Create a new Worker
        const myWorker = new Worker('src/worker.js');

        // Send a message to the worker
        myWorker.postMessage('Hello from the main script!');

        // Listen for messages from the worker
        myWorker.onmessage = function (event) {
            console.log('Received message from worker: ', event.data);
            setNumber(event.data);
            myWorker.terminate();
        };
    }

    const runMainThread = () => {
        console.log("before main thread")
        const perfA = performance.now();
        let i = 0;
        for (; i < 10000000000; i++) {

        }

        console.log("perfomance: ", performance.now() - perfA);
    }

    return <div>Web Worker!
        Data received: {number}
        <input type="text">

        </input>
        <div>
            <button onClick={runWorker}>Run Worker</button></div>
            <div>
                <button onClick={runMainThread}>Run main thread</button>
                </div></div>
}

export default WebWorkerDemo;
