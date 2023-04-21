import { useState, useEffect } from "react";
import FieldElement from "./FieldElement";
import WaitModal from "../modalWindows/WaitModal";
import GameOverModal from "../modalWindows/GameOverModal";

import updateCombinationsTree from "../../app/updateCombinationsTree";

import humanScoreFromLS from "../../app/humanScoreFromLS";
import AIScoreFromLS from "../../app/AIScoreFromLS";
import drawsFromLS from "../../app/drawsFromLS";

import childExists from "../../app/childExists";
import checkVictory from "../../app/checkVictory";
import checkDraw from "../../app/checkDraw";

import NodeElement from "../../app/NodeElement";

function GameField() {
  // load combinationsTree from server
  useEffect(() => {
    fetch("https://server-for-tic-tac-toe.herokuapp.com/combinations")
      // fetch("http://localhost:8080/")
      .then((response) => response.json())
      .then(
        (data) => {
          setRootIsLoaded(true);
          setError(false);

          setRoot(data);
          setCurrentTreeElement(data);
          setCurrentCombination(data.combination);
        },
        (err) => {
          console.log("response/request ERROR", err);
          setRootIsLoaded(true);
          setError(err);
        }
      );
  }, []);

  const [rootIsLoaded, setRootIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  const [root, setRoot] = useState(null);
  const [currentTreeElement, setCurrentTreeElement] = useState<any>(null);
  const [currentCombination, setCurrentCombination] = useState<string | null>(null);

  const [humanCanMove, setHumanCanMove] = useState(true);
  // const [humanMovesFirst, setHumanMovesFirst] = useState(true);
  const humanMovesFirst = true;

  const [winner, setWinner] = useState<string | null>(null);
  const [isDraw, setDraw] = useState<boolean>(false);

  const [humanScore, setHumanScore] = useState(humanScoreFromLS);
  const [AIScore, setAIScore] = useState(AIScoreFromLS);
  const [drawCounter, setDrawCounter] = useState(drawsFromLS);

  useEffect(() => {
    if (rootIsLoaded && !error && !winner && root) {
      const AIWon = checkVictory(currentTreeElement.combination); // => x || o || false

      if (AIWon) {
        setWinner("AI");
        setHumanCanMove(true);
        currentTreeElement.status = "win";
        updateCombinationsTree(root);

        setAIScore(AIScore + 1);
        localStorage.setItem("AIScore", JSON.stringify(AIScore + 1));
      }
    }
  }, [currentTreeElement, currentCombination, AIScore, winner, error, rootIsLoaded, root]);

  //
  // HUMAN made a move:
  function humanMove(cellIndex: number) {
    if (!humanCanMove || winner || isDraw || !currentCombination || !root) return;

    setHumanCanMove(false);
    const combinationArray = currentCombination.split("");
    combinationArray[cellIndex] = humanMovesFirst ? "x" : "o";
    const newCurrentCombination = combinationArray.join("");

    //reflect changes on the screen
    setCurrentCombination(newCurrentCombination);

    const humanWon = checkVictory(newCurrentCombination); // => x || o || false

    if (humanWon) {
      currentTreeElement.status = "red";
      updateCombinationsTree(root);

      setWinner("human");
      setHumanCanMove(true);

      setHumanScore(humanScore + 1);
      localStorage.setItem("humanScore", JSON.stringify(humanScore + 1));

      return;
    } else if (checkDraw(newCurrentCombination)) {
      currentTreeElement.status = "yellow";
      updateCombinationsTree(root);
      setHumanCanMove(true);
      setDraw(true);
      setDrawCounter(drawCounter + 1);
      localStorage.setItem("draws", JSON.stringify(drawCounter + 1));

      return;
    }

    // check if element has child with the same combination
    const childIndex = childExists(currentTreeElement.children, newCurrentCombination); // Number || false

    if (childIndex !== false) {
      setCurrentTreeElement(currentTreeElement.children[childIndex]);

      console.log("currentTreeElement: ", currentTreeElement.children[childIndex]);

      setTimeout(() => {
        AIMove(newCurrentCombination, currentTreeElement.children[childIndex]);
      }, 400);
    } else {
      const child = new NodeElement(newCurrentCombination);
      currentTreeElement.children.push(child);
      setCurrentTreeElement(child);
      updateCombinationsTree(root);

      console.log("currentTreeElement: ", child);
      // AIMove(newCurrentCombination, child);
      setTimeout(() => {
        AIMove(newCurrentCombination, child);
      }, 400);
    }
  }

  //
  // AIMove
  //
  function AIMove(newCurrentCombination: string, treeElement: any) {
    if (!root) return;

    setHumanCanMove(true);
    // проверим, есть ли win "children"
    for (let i = 0; i < treeElement.children.length; i++) {
      if (treeElement.children[i].status === "win") {
        console.log("followed WIN status");

        treeElement.status = "preWin";
        updateCombinationsTree(root);

        setCurrentTreeElement(treeElement.children[i]);
        setCurrentCombination(treeElement.children[i].combination);

        return;
      }
    }

    // проверим, есть ли preWin "children"
    for (let i = 0; i < treeElement.children.length; i++) {
      if (treeElement.children[i].status === "preWin") {
        console.log("followed preWIN status");

        setCurrentTreeElement(treeElement.children[i]);
        setCurrentCombination(treeElement.children[i].combination);

        return;
      }
    }

    // check if any green "children"
    const greenChildren = treeElement.children.filter(
      (value: NodeElement): boolean => value.status === "green"
    );

    if (greenChildren.length > 0) {
      const randomIndex = Math.floor(Math.random() * greenChildren.length);
      setCurrentTreeElement(greenChildren[randomIndex]);

      setCurrentCombination(greenChildren[randomIndex].combination);

      return;
    }

    const arrCombination = newCurrentCombination.split("");
    const possibleMoves: number = arrCombination.filter((value) => value === "-").length;

    // try to create a new "child"
    // for (let j = 0; j < 9; j++) {
    //   if (arrCombination[j] === "-") {
    //     arrCombination[j] = humanMovesFirst ? "o" : "x";

    //     if (childExists(treeElement.children, arrCombination.join("")) !== false) {
    //       arrCombination[j] = "-";
    //     } else {
    //       const newChild = new NodeElement(arrCombination.join(""));
    //       treeElement.children.push(newChild);
    //       setCurrentTreeElement(newChild);
    //       updateCombinationsTree(root);

    //       setCurrentCombination(newChild.combination);

    //       return;
    //     }
    //   }
    // }

    // try to create a new "child"
    if (treeElement.children.length < possibleMoves) {
      for (let j = 0; j < 9; j++) {
        if (arrCombination[j] === "-") {
          arrCombination[j] = humanMovesFirst ? "o" : "x";

          if (childExists(treeElement.children, arrCombination.join("")) !== false) {
            arrCombination[j] = "-";
          } else {
            const newChild = new NodeElement(arrCombination.join(""));
            treeElement.children.push(newChild);

            arrCombination[j] = "-";
          }
        }
      }
      updateCombinationsTree(root);

      const greenChildren = treeElement.children.filter(
        (value: NodeElement): boolean => value.status === "green"
      );

      if (greenChildren.length > 0) {
        const randomIndex = Math.floor(Math.random() * greenChildren.length);
        setCurrentTreeElement(greenChildren[randomIndex]);

        setCurrentCombination(greenChildren[randomIndex].combination);
        return;
      }
    }

    //if all routes exist, find "yellow"
    for (let i = 0; i < treeElement.children.length; i++) {
      if (treeElement.children[i].status === "yellow") {
        // if we enter here & found yellow, then parent el should be yellow as well
        treeElement.status = "yellow";
        updateCombinationsTree(root);

        setCurrentTreeElement(treeElement.children[i]);
        setCurrentCombination(treeElement.children[i].combination);

        console.log("followed yellow status");

        return;
      }
    }

    // no green, no free space, no yellow => it's red
    currentTreeElement.status = "red";
    updateCombinationsTree(root);

    // propose draw
    const drawAccepted = window.confirm("Maybe you want a draw? =)");

    //make some random move
    if (drawAccepted) {
      setDraw(drawAccepted);
      setHumanCanMove(true);

      setDrawCounter(drawCounter + 1);
      localStorage.setItem("draws", JSON.stringify(drawCounter + 1));

      setHumanCanMove(false);
    } else {
      const randomIndex = Math.floor(Math.random() * currentTreeElement.children.length);
      setCurrentTreeElement(treeElement.children[randomIndex]);

      setCurrentCombination(treeElement.children[randomIndex].combination);
    }
  }

  if (!rootIsLoaded) {
    return <h1>Loading...</h1>;
  } else if (error || !currentCombination) {
    return <h1>Ooops! Error occurred. Please try again later.</h1>;
  } else {
    return (
      <div className="game_section">
        <WaitModal humanCanMove={humanCanMove} />
        <GameOverModal
          humanScore={humanScore}
          AIScore={AIScore}
          drawCounter={drawCounter}
          winner={winner}
          isDraw={isDraw}
          restart={() => {
            setCurrentTreeElement(root);
            setCurrentCombination("---------");
            setDraw(false);
            setWinner(null);
            setHumanCanMove(true);
          }}
        />
        <div className="game_field">
          {currentCombination.split("").map((value: string, index: number) => {
            return (
              <FieldElement
                value={value}
                index={index}
                humanMove={humanMove}
                key={index}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default GameField;
