const winCombs = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export default function checkVictory(comb: string) {
  const arrComb = comb.split("");

  for (let i = 0; i < winCombs.length; i++) {
    if (
      (arrComb[winCombs[i][0]] === "x" || arrComb[winCombs[i][0]] === "o") &&
      arrComb[winCombs[i][0]] === arrComb[winCombs[i][1]] &&
      arrComb[winCombs[i][1]] === arrComb[winCombs[i][2]]
    ) {
      return arrComb[winCombs[i][0]];
    }
  }

  return false;
}
