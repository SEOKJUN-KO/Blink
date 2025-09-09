'use client'
import { useState } from "react";
import { SVGIcon } from "./SVGIcon";

type ButtonProps = {
    status: 'Default' | 'Hover' | 'Disabled' | 'Play' | 'Pause';
    label: string;
    onStart: () => void;
    onStop: () => void;
};

export const PlayButton: React.FC<ButtonProps> = ({ status, label, onStart, onStop }) => {
    const baseClasses = "w-[200px] h-[48px] rounded-Round font-pretendard text-Body font-Medium flex items-center justify-center gap-2";

    const statusClasses = {
        Default: "bg-Primary-500 text-White",
        Hover: "hover:bg-Primary-700 text-White",
        Disabled: "bg-Primary-100 text-TextBlack-300",
        Play: "bg-Primary-500 text-White",
        Pause: "bg-Primary-500 text-White",
    };

    const [enter, setEnter] = useState(false)

    return (
        <button 
            disabled={status === 'Disabled'}
            className={`${baseClasses} ${enter ? statusClasses.Hover  : statusClasses[status]}`}
            onMouseEnter={()=>setEnter(true)}
            onMouseLeave={()=>setEnter(false)}
            onClick={() => {
                if (status === 'Play') { onStop() }
                else { onStart() }
            }}
        >
            <SVGIcon name={status === 'Play' ? "Pause" : 'Play'} size={16} />
            <span>{label}</span>
        </button>
    );
};
