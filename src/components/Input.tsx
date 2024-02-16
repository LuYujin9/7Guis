type Props = {
  children: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function Input({ children, name, value, onChange }: Props) {
  return (
    <label>
      {children}
      <input
        className="m-2 w-20 rounded border border-black"
        type="text"
        name={name}
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
