// note: this must be compiled as follows
// GOOS=js GOARCH=wasm go build -o main.wasm main.go
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

func main() {
	c := make(chan struct{}, 0)
	js.Global().Set("multiply", js.FuncOf(multiply))
	<-c
}
