type Props = {
  children: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function TextInput({ children, name, value, onChange }: Props) {
  return (
    <div className="text-left text-sm">
      <label htmlFor={name}>{children}</label>
      <input
        className="w-full h-8 rounded-[5px] border-2 shadow-[5px_5px_4px_0px] shadow-gray-400 border-black "
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
