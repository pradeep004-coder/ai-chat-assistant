import { useState } from "react";
import { SlArrowDown } from "react-icons/sl";


export function Collapsible({ children }) {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="mb-3">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className=" flex items-center p-3
                            hover:bg-zinc-800 
                            text-zinc-200 hover:text-white 
                            text-sm font-semibold 
                            rounded-full shadow-sm transition-all duration-200
                            select-none"
            >
                <span
                    className={`transform transition-transform duration-300 ${isOpen ? "rotate-0" : "-rotate-90"}`}
                >
                    <SlArrowDown />
                </span>
            </button>
            {isOpen && <div className="whitespace-normal">{children}</div>}
        </div>
    )
}