// Listen for messages from the main script
self.addEventListener('message', function(event) {
    console.log('Received message in worker: ', event.data);

    let i=0;
    for (; i<10000000000; i++) {

    }
  
    // Send a message back to the main script
    self.postMessage(i);
  });