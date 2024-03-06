type props = {
  name: string;
  onClick: () => void;
  isDisabled: boolean;
  isDeleteButton?: boolean;
};

export function DynamicButton({
  name,
  onClick,
  isDisabled,
  isDeleteButton,
}: props) {
  return (
    <div className="flex-auto w-full">
      <button
        className={`w-full h-12 border-2 rounded-[5px] bg-[#F5F5F5]  border-black shadow-[5px_5px_4px_0px]
        shadow-gray-400 text-gray-700 disabled:text-slate-400 ${
          isDeleteButton
            ? "hover:bg-[#FE9191] focus:bg-[#FEACAC] bg-[#F27373]"
            : "hover:bg-[#DDE5DE] focus:bg-[#C7DAC9] bg-[#F5F5F5]"
        }`}
        onClick={onClick}
        disabled={isDisabled}
      >
        {name}
      </button>
      <div
        className={`text-xs text-lime-700 ${!isDisabled && "invisible"}`}
      >{`Please do something to enable the ${name} Button`}</div>
    </div>
  );
}
