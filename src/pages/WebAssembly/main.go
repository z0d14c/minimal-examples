// note: this must be compiled as follows
// GOOS=js GOARCH=wasm go build -o main.wasm main.go
// ultimately the WebAssembly/ folder should have `main.go` and `wasm_exec.js`
// `wasm_exec.js` comes from the Go installation, and was located at
// /usr/local/go/misc/wasm/wasm_exec.js
package main

import (
	"syscall/js"
)

func consoleLog(args ...interface{}) {
	console := js.Global().Get("console")
	log := console.Get("log")
	log.Invoke(args...)
}

func multiply(this js.Value, inputs []js.Value) interface{} {
	consoleLog("Multiply inputs", inputs[0], inputs[1])
	// the below code didn't work for me, but leaving for reference
	// I suspect it is because the inputs are already numbers when they're passed in
	// a, errA := strconv.Atoi(inputs[0].String())
	// if errA != nil {
	// 	consoleLog("Error converting first input to integer:")
	// }

	// b, errB := strconv.Atoi(inputs[1].String())
	// if errB != nil {
	// 	consoleLog("Error converting second input to integer:")
	// }

	return inputs[0].Float() * inputs[1].Float()
}

func golangLoop(this js.Value, inputs []js.Value) interface{} {
	i := 0
	maxNum := inputs[0].Int()

	for ; i < maxNum; i++ {
		// consoleLog("looping")
	}

	return i
}

func main() {
	c := make(chan struct{}, 0)
	js.Global().Set("multiply", js.FuncOf(multiply))
	js.Global().Set("golangLoop", js.FuncOf(golangLoop))
	<-c
}
