export default function Loading({ width = "96vw" }) {
  return (
    <div className={`loading__container w-[${width}]`}>
      <span className="loader"></span>
    </div>
  );
}
