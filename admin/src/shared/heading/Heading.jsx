import "./Heading.css";

const Heading = ({ icon, title }) => {
  return (
    <div className="heading__container">
      <span>{icon}</span>
      <h1>{title}</h1>
    </div>
  );
};

export default Heading;
