export default function checkDraw(comb: string) {
  const arrComb = comb.split("");

  for (let i = 0; i < arrComb.length; i++) {
    if (arrComb[i] === "-") {
      return false;
    }
  }

  return true;
}
