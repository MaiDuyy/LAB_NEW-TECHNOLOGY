import fs from "fs";
import _ from "lodash"



// fs.readFile('input.txt', "utf8", (err, data) => {
//   if (err) {
//     console.error("Error reading file:", err);
//     return;
//   }
//   console.log("File content:");
//   console.log(data);
// });


// const content = 'This is new content written by Node.js';

// fs.writeFile('output.txt', content, (err) => {
//     if (err) {
//         console.error(err);
//         return;
//     }
//     console.log('File written successfully!');
// });



const numbers = [1, 2, 3, 4, 5];
const shuffled = _.shuffle(numbers);

console.log('Original:', numbers);
console.log('Shuffled:', shuffled);

