function drawsFromLS() {
  return parseInt(JSON.parse(localStorage.getItem("draws") || "0"), 10);
}

export default drawsFromLS();
