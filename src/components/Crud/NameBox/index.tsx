type props = {
  fullName: { name: string; surname: string; id: string };
  currentId: string | undefined;
};

export default function NameBox({ fullName, currentId }: props) {
  return (
    <p
      className={
        fullName.id === currentId
          ? "text-left pl-2 bg-emphasis text-gray-100"
          : "text-left pl-2"
      }
    >
      {fullName.name}, {fullName.surname}
    </p>
  );
}
