import { useEffect, useState } from "react"

export const WebWorkerDemo = () => {
    const [number, setNumber] = useState(0);
    useEffect(() => {
        // Create a new Worker
        const myWorker = new Worker('src/worker.js');

        // Send a message to the worker
        myWorker.postMessage('Hello from the main script!');

        // Listen for messages from the worker
        myWorker.onmessage = function(event) {
            console.log('Received message from worker: ', event.data);
            setNumber(event.data);
        };
    }, []);

    useEffect(() => {
        // let i=0;
        // for (; i<10000000000; i++) {
    
        // }

        // setNumber(i);
    }, []);

    return <div>Web Worker! 
        Data received: {number}
        <input type="text">
        
        </input></div>
}

export default WebWorkerDemo;
