
import { SVGIcon } from "./SVGIcon";

type ButtonProps = {
    status: 'Default' | 'Hover' | 'Disabled';
    label: string;
};

export const PlayButton: React.FC<ButtonProps> = ({ status, label }) => {
    const baseClasses = "w-[200px] h-[48px] rounded-Round font-pretendard text-Body font-Medium flex items-center justify-center gap-2";

    const statusClasses = {
        Default: "bg-Primary-500 text-White",
        Hover: "hover:bg-Primary-700 text-White",
        Disabled: "bg-Primary-100 text-TextBlack-300",
    };

    return (
        <button 
            disabled={status === 'Disabled'}
            className={`${baseClasses} ${statusClasses[status]}`}
        >
            <SVGIcon name="Play" size={16} />
            <span>{label}</span>
        </button>
    );
};
