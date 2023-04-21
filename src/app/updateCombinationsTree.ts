export default function updateCombinationsTree(root: object) {
  fetch("https://server-for-tic-tac-toe.herokuapp.com/combinations", {
    // fetch("http://localhost:8080/combinations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(root),
  });
}
