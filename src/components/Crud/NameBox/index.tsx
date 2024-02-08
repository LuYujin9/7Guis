import "./index.css";
type props = {
  fullName: { name: string; surname: string; id: string };
  currentId: string | undefined;
};

export default function NameBox({ fullName, currentId }: props) {
  return (
    <div className={fullName.id === currentId ? "current-name-box" : ""}>
      <p className="name">
        {fullName.name}, {fullName.surname}
      </p>
    </div>
  );
}
