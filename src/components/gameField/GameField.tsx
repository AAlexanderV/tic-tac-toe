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
  // // const combinationTest = "xoxoxoxox";
  // let humanMovesFirst: boolean;
  // let humanCanMove: boolean;
  // let root: any;
  // // let currentTreeElement: any;

  const [root, setRoot] = useState(treeFromLS);
  const [currentTreeElement, setCurrentTreeElement] = useState(root);
  const [currentCombination, setCurrentCombination] = useState(currentTreeElement.combination);

  const [humanCanMove, setHumanCanMove] = useState(true);
  const [humanMovesFirst, setHumanMovesFirst] = useState(true);

  const [winner, setWinner] = useState<string | null>(null);
  const [isDraw, setDraw] = useState<boolean>(false);

  const [humanScore, setHumanScore] = useState(humanScoreFromLS);
  const [AIScore, setAIScore] = useState(AIScoreFromLS);
  const [drawCounter, setDrawCounter] = useState(drawsFromLS);

  //
  // console.log(currentCombination);
  //

  useEffect(() => {
    const AIWon = checkVictory(currentTreeElement.combination); // => x || o || false
    // setDraw(checkDraw(currentTreeElement.combination));

    if (AIWon) {
      setWinner("AI");

      setAIScore(AIScore + 1);
      localStorage.setItem("AIScore", JSON.stringify(AIScore + 1));
      setHumanCanMove(false);
    }
  }, [winner, AIScore, humanCanMove, currentTreeElement.combination]);

  //
  // HUMAN made a move:
  function humanMove(cellIndex: number) {
    // console.log("cellIndex:", cellIndex);

    if (!humanCanMove || winner || isDraw) return;

    setHumanCanMove(false);
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

    if (childIndex !== false) {
      setCurrentTreeElement(currentTreeElement.children[childIndex]);

      AIMove(newCurrentCombination, currentTreeElement.children[childIndex]);
    } else {
      const child = new NodeElement(newCurrentCombination);
      currentTreeElement.children.push(child);
      setCurrentTreeElement(child);
      localStorage.setItem("combinationsTree", JSON.stringify(root));

      console.log("child", child);

      AIMove(newCurrentCombination, child);
    }

    //
    // AIMove
    // setTimeout(() => {
    //   AIMove(newCurrentCombination);
    // }, 500);
  }

  //
  // AIMove
  //
  function AIMove(newCurrentCombination: string, treeElement: any) {
    setHumanCanMove(true);
    // проверим, есть ли green "children"
    for (let i = 0; i < treeElement.children.length; i++) {
      if (treeElement.children[i].status === "green") {
        setCurrentTreeElement(treeElement.children[i]);

        setCurrentCombination(treeElement.children[i].combination);

        return;
      }
    }

    const arrCombination = newCurrentCombination.split("");

    // try to create a new "child"
    for (let j = 0; j < 9; j++) {
      if (arrCombination[j] === "-") {
        arrCombination[j] = humanMovesFirst ? "o" : "x";

        if (childExists(treeElement.children, arrCombination.join("")) !== false) {
          arrCombination[j] = "-";
        } else {
          const newChild = new NodeElement(arrCombination.join(""));
          treeElement.children.push(newChild);
          setCurrentTreeElement(newChild);
          localStorage.setItem("combinationsTree", JSON.stringify(root));

          setCurrentCombination(newChild.combination);

          return;
        }
      }
    }

    //if all routes exist, find "yellow"
    for (let i = 0; i < treeElement.children.length; i++) {
      if (treeElement.children[i].status === "yellow") {
        // if we enter here & found yellow, then parent el should be yellow as well
        treeElement.status = "yellow";
        localStorage.setItem("combinationsTree", JSON.stringify(root));

        setCurrentTreeElement(treeElement.children[i]);

        setCurrentCombination(treeElement.children[i].combination);

        return;
      }
    }

    // no green, no free space, no yellow => it's red
    currentTreeElement.status = "red";
    localStorage.setItem("combinationsTree", JSON.stringify(root));

    // propose draw
    const drawAccepted = window.confirm("Do you want a draw?");

    //make some random move
    if (drawAccepted) {
      setDraw(drawAccepted);

      setDrawCounter(drawCounter + 1);
      localStorage.setItem("draws", JSON.stringify(drawCounter + 1));

      setHumanCanMove(false);
    } else {
      const randomIndex = Math.floor(Math.random() * currentTreeElement.children.length - 1);
      setCurrentTreeElement(treeElement.children[randomIndex]);

      setCurrentCombination(currentTreeElement.combination);
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
