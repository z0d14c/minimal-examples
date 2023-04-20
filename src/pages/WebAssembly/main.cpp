// must compile this with emscripten
// e.g. `emcc main.cpp --bind -o main-cpp.js`
#include <cstdint>
#include <emscripten/bind.h>

using namespace emscripten;

// void consoleLog(std::string message) {
//   EM_ASM_({
//     console.log(UTF8ToString($0));
//   }, message.c_str());
// }

double cppMultiply(double a, double b) {
//   consoleLog("Multiply inputs: " + std::to_string(a) + ", " + std::to_string(b));
  return a * b;
}

int cppLoop(double maxNum) {
  double i = 0;
  for (; i < maxNum; i++) {
    // consoleLog("looping");
  }
  return i;
}

EMSCRIPTEN_BINDINGS(my_module) {
  function("cppMultiply", &cppMultiply);
  function("cppLoop", &cppLoop);
}
