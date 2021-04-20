const cTable = require("console.table");

var results = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Mike Chan" },
  { id: 3, name: "Ashley Rodriguez" },
  { id: 7, name: "Sarah Lourd" },
];
console.table(results);

const choiceArray = [];
results.forEach(({ name }) => {
  choiceArray.push({ name });
});
console.log(choiceArray);
console.log("so now");
const x = results.map((row) => row.name);
console.log(x);
//     id  name
// --  ----------------
// 1   John Doe
// 2   Mike Chan
// 3   Ashley Rodriguez
// 7   Sarah Lourd
