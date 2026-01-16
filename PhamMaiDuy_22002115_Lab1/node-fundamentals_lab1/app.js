import math from "./mathUtils.js"
// const greeting = "Hello from Node.js environment!";

// console.log(greeting);

// console.log("Current directory:", process.cwd());
// console.log("Node version:", process.version);


console.log("Starting App...");

const sum = math.add(10, 5);
const diff = math.subtract(10, 5);

console.log(`10 + 5 = ${sum}`);
console.log(`10 - 5 = ${diff}`);

console.log("Secret value:", math.secretValue); 