interface ChildProps {
  onButtonClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  activeCollection: String;
}

export default function Navigation({ onButtonClick, activeCollection }: ChildProps){

    const buttons = [
        { id: "savings", label: "Savings Jugs" },
        { id: "collections", label: "Jug Collection" },
        { id: "broken", label: "Broken Jugs" },
    ];

    return(
        <>
            <div className="w-[500px] flex flex-col gap-5 items-center py-5 text-xl font-semibold text-[#5a410e] bg-[#1F2A44]">
                {buttons.map((btn) => (
                    <button
                        key={btn.id}
                        id={btn.id}
                        onClick={onButtonClick}
                        className={`${
                        activeCollection === btn.id ? "bg-[#4ea11a]" : "bg-[#89DB55]"
                        } hover:bg-[#67c246] rounded-md py-1 w-3/4`}
                    >
                        {btn.label}
                    </button>
                ))}
            </div>
        </>
    );
}