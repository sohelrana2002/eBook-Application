import "./customLoading.css";

export default function CustomLoading({ width = "96vw" }) {
  return (
    <div className={`loading__container w-[${width}]`}>
      <span className="loader"></span>
    </div>
  );
}
