async function* lol() {
  yield 1;
  yield 2;
}

async function main() {
  let v = {};
  for await (const x of lol()) {
    v = { ...v, [x]: 'hai' };
  }
  console.log(v);
}
main();
