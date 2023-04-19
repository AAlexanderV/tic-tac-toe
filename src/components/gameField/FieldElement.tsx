function FieldElement({
  value,
  index,
  humanMove,
}: {
  value: string;
  index: number;
  humanMove: (cellIndex: number) => void;
}) {
  //
  function clickHandler() {
    if (value === "-") {
      humanMove(index);
    }
  }

  return (
    <div
      onClick={clickHandler}
      className={"field_element number-" + (index + 1)}
    >
      {(() => {
        switch (value) {
          case "x":
            return <div className="x"></div>;
          case "o":
            return <div className="zero"></div>;
          default:
            return null;
        }
      })()}
    </div>
  );
}

export default FieldElement;
