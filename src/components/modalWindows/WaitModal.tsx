function WaitModal({ humanCanMove }: { humanCanMove: boolean }) {
  if (!humanCanMove) return <div className="WaitModal"></div>;
  else return null;
}

export default WaitModal;
