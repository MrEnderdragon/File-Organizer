const readline = require('readline');
const fs = require('fs');
//const opn = require('opn');
const execa = require('execa');

let folder;
let names;
let what;
let date;
let history = [];
let die = false;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

getCreation = (name) => {
  return fs.statSync(`${folder}/${name}`).birthtime.toString();
}

nextNameNum = (name) => {
  for (x = 0; x <= history.length; x++) {
    if (!history.includes(`${name} ${x}`)) {
      history.push(`${name} ${x}`);
      return `${name} ${x}`
    }
  }
  return "err"
}

whatt = async (num) => {
  // const rl2 = readline.createInterface({
  //   input: process.stdin,
  //   output: process.stdout
  // });

  // opn(`${folder}/${names[num - 1]}`);\
  try {
    await execa("open", [`${folder}/${names[num - 1]}`]);
  }catch (error) {
    console.log(error)
    if (num > 1) {
      whatt(num - 1);
    }
    die = true
  }

  if (die == true) {
    die = false;
    return;
  }

  console.log(`${folder}/${names[num - 1]}`);
  rl.question('What is this? ', (answer) => {
    if (answer != "s" && answer != "skip") {
      what = `${answer}`;
      datee = getCreation(names[num - 1]);
      date = datee.slice(11,15) + " " + datee.slice(4,10);
      nameNum = nextNameNum(what);
      fs.rename(`${folder}/${names[num - 1]}`, `${folder}/${date} ${nameNum}.png`, (err) => {
        if (err) throw err;
      });
    }
    // rl.close();
    if (num > 1) {
      whatt(num - 1);
    }
  });
}

rl.question('Path to folder: ', async  (answer) => {
  folder = `${answer}`
  names = fs.readdirSync(`${answer}`);

  console.log("variables")
  // rl.close();;

  console.log("closed")
  whatt(names.length);
});
