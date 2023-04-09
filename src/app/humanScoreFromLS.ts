function humanScoreFromLS() {
  return parseInt(JSON.parse(localStorage.getItem("humanScore") || "0"), 10);
}

export default humanScoreFromLS();
