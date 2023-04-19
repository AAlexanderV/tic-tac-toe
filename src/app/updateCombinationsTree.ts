export default function updateCombinationsTree(root: object) {
  fetch("http://localhost:8080/combinations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(root),
  });
}
