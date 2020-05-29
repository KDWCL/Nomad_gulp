import { random } from "./util";
// Uncaught SyntaxError: Cannot use import statement outside a module
// syntaxError가 뜨는 거면 아예 못 알아처먹는다. 결국 문법을 모른다. 즉 babel의 문제다.

const rOne = random(10);
const rTwo = random(20);

console.log(`${rOne} ${rTwo}`);
