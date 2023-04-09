import { useState, useEffect } from "react";
import FieldElement from "./FieldElement";
import treeFromLS from "../../app/treeFromLS";

import humanScoreFromLS from "../../app/humanScoreFromLS";
import AIScoreFromLS from "../../app/AIScoreFromLS";
import drawsFromLS from "../../app/drawsFromLS";

import childExists from "../../app/childExists";
import checkVictory from "../../app/checkVictory";
import checkDraw from "../../app/checkDraw";

import NodeElement from "../../app/NodeElement";

function GameField() {
  // const combinationTest = "xoxoxoxox";
  let humanMovesFirst: boolean;
  let humanCanMove: boolean;
  let root: any;
  // let currentTreeElement: any;

  useEffect(() => {
    // оформить в USEFFECT{
    humanMovesFirst = true;
    humanCanMove = true;

    root = treeFromLS;
    // currentTreeElement = root;
    // оформить в USEFFECT}
  });

  const [currentTreeElement, setCurrentTreeElement] = useState(treeFromLS);
  const [currentCombination, setCurrentCombination] = useState(currentTreeElement.combination);

  const [winner, setWinner] = useState<string | null>(null);
  const [isDraw, setDraw] = useState<boolean>(false);

  const [humanScore, setHumanScore] = useState(humanScoreFromLS);
  const [AIScore, setAIScore] = useState(AIScoreFromLS);
  const [drawCounter, setDrawCounter] = useState(drawsFromLS);

  //
  console.log(currentCombination);
  //

  //
  // HUMAN made a move:
  function humanMove(cellIndex: number) {
    // console.log("cellIndex:", cellIndex);

    if (!humanCanMove || winner || isDraw) return;

    humanCanMove = false;
    const combinationArray = currentCombination.split("");
    combinationArray[cellIndex] = humanMovesFirst ? "x" : "o";
    const newCurrentCombination = combinationArray.join("");
    console.log("newCurrentCombination", newCurrentCombination);

    //reflect changes on the screen
    setCurrentCombination(newCurrentCombination);

    const humanWon = checkVictory(newCurrentCombination); // => x || o || false
    console.log("humanWon: ", humanWon);

    if (humanWon) {
      currentTreeElement.status = "red";
      localStorage.setItem("combinationsTree", JSON.stringify(root));

      setWinner("human");

      setHumanScore(humanScore + 1);
      localStorage.setItem("humanScore", JSON.stringify(humanScore + 1));

      return;
    } else if (checkDraw(newCurrentCombination)) {
      currentTreeElement.status = "yellow";
      localStorage.setItem("combinationsTree", JSON.stringify(root));

      setDraw(true);
      setDrawCounter(drawCounter + 1);
      localStorage.setItem("draws", JSON.stringify(drawCounter + 1));

      return;
    }

    // check if element has child with the same combination
    const childIndex = childExists(currentTreeElement.children, newCurrentCombination); // Number || false

    if (childIndex) {
      currentTreeElement = currentTreeElement.children[childIndex];
    } else {
      const child = new NodeElement(newCurrentCombination);
      currentTreeElement.children.push(child);
      currentTreeElement = child;

      console.log("child", child);

      localStorage.setItem("combinationsTree", JSON.stringify(root));
    }

    //
    // AIMove
    AIMove(newCurrentCombination);
    setTimeout(() => {
      AIMove(newCurrentCombination);
    }, 500);
  }

  //
  // AIMove
  //
  function AIMove(newCurrentCombination: string) {
    humanCanMove = true;
    // проверим, есть ли потенциально выигрышные/неисследованные "children"
    for (let i = 0; i < currentTreeElement.children.length; i++) {
      if (currentTreeElement.children[i].status === "green") {
        currentTreeElement = currentTreeElement.children[i];

        setCurrentCombination(currentTreeElement.combination);

        return;
      }
    }

    const arrCombination = newCurrentCombination.split("");

    // try to create a new "child"
    for (let j = 0; j < 9; j++) {
      if (arrCombination[j] === "-") {
        arrCombination[j] = humanMovesFirst ? "o" : "x";

        if (childExists(currentTreeElement.children, arrCombination.join(""))) {
          arrCombination[j] = "-";
        } else {
          const newChild = new NodeElement(arrCombination.join(""));
          currentTreeElement.children.push(newChild);
          currentTreeElement = newChild;

          localStorage.setItem("combinationsTree", JSON.stringify(root));

          setCurrentCombination(currentTreeElement.combination);

          return;
        }
      }
    }

    //if all routes exist, find "yellow"
    for (let i = 0; i < currentTreeElement.children.length; i++) {
      if (currentTreeElement.children[i].status === "yellow") {
        // if we enter here & found yellow, then parent el should be yellow as well
        currentTreeElement.status = "yellow";
        localStorage.setItem("combinationsTree", JSON.stringify(root));

        currentTreeElement = currentTreeElement.children[i];

        setCurrentCombination(currentTreeElement.combination);

        return;
      }
    }

    // propose draw
    setDraw(window.confirm("Do you want a draw?"));
    currentTreeElement.status = "red";

    //make some random move
    if (!isDraw) {
      const randomIndex = Math.floor(Math.random() * currentTreeElement.children.length - 1);
      currentTreeElement = currentTreeElement.children[randomIndex];

      setCurrentCombination(currentTreeElement.combination);
    }

    if (isDraw) return;

    const AIWon = checkVictory(currentTreeElement.combination); // => x || o || false
    // setDraw(checkDraw(currentTreeElement.combination));

    if (AIWon) {
      setWinner("AI");

      setAIScore(AIScore + 1);
      localStorage.setItem("AIScore", JSON.stringify(AIScore + 1));
      humanCanMove = false;
    } else if (isDraw) {
      // currentTreeElement.status = "yellow";
      // localStorage.setItem("combinationsTree", JSON.stringify(root));

      setDrawCounter(drawCounter + 1);
      localStorage.setItem("draws", JSON.stringify(drawCounter + 1));
      humanCanMove = false;
    }
  }

  return (
    <div className="game_section">
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

export default GameField;
