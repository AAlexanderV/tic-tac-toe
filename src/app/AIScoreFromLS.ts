function AIScoreFromLS() {
  return parseInt(JSON.parse(localStorage.getItem("AIScore") || "0"), 10);
}

export default AIScoreFromLS();
