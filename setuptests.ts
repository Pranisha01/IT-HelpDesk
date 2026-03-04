import { TextEncoder, TextDecoder } from "util";
import "@testing-library/jest-dom";
import "whatwg-fetch";

if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder as typeof global.TextEncoder;
}
if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder as typeof global.TextDecoder;
}
