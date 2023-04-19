function GameOverModal({
  humanScore,
  AIScore,
  drawCounter,

  winner,
  isDraw,
  restart,
}: {
  humanScore: number;
  AIScore: number;
  drawCounter: number;

  winner: string | null;
  isDraw: boolean;
  restart: any;
}) {
  if (winner || isDraw)
    return (
      <div className="overlay">
        <div className="GameOverModal">
          <div className="gameOver_status">
            {isDraw ? (
              <h1>It is a draw! You are a worthy opponent.</h1>
            ) : (
              <h1>{winner === "AI" ? "AI won this game." : "You won this game!"}</h1>
            )}
          </div>

          <button
            className="restart_button"
            onClick={restart}
          >
            RESTART
          </button>

          <div className="score">
            <div className="score_item">
              You <span>won {humanScore}</span> times
            </div>
            <div className="score_item">
              You <span>lost {AIScore}</span> times
            </div>
            <div className="score_item">
              You had a <span>draw {drawCounter}</span> times
            </div>
          </div>
        </div>
      </div>
    );
  else return null;
}

export default GameOverModal;
