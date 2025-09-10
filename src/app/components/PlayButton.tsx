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
    const baseClasses = "w-[200px] h-[48px] rounded-round font-pretendard text-body font-Medium flex items-center justify-center gap-2";

    const statusClasses = {
        Default: "bg-primary-scale-500 text-white",
        Hover: "hover:bg-primary-scale-700 text-white",
        Disabled: "bg-primary-scale-100 text-text-black-300",
        Play: "bg-primary-scale-500 text-white",
        Pause: "bg-primary-scale-500 text-white",
    };

    const [enter, setEnter] = useState(false)

    return (
        <button 
            disabled={status === 'Disabled'}
            className={`${baseClasses} ${enter ? statusClasses.Hover  : statusClasses[status]} mt-16 text-center`}
            onMouseEnter={()=>setEnter(true)}
            onMouseLeave={()=>setEnter(false)}
            onClick={() => {
                if (status === 'Play') { onStop() }
                else { onStart() }
            }}
        >
            <SVGIcon name={status === 'Play' ? "Pause" : 'Play'} width={16} height={16} />
            <span>{label}</span>
        </button>
    );
};
