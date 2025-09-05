import { SVGIcon } from "./SVGIcon";

type ButtonProps = {
    status: 'Default' | 'Hover' | 'Disabled';
    label: string;
};

export const PlayButton: React.FC<ButtonProps> = ({ status, label }) => {
    const styles = {
        Default: { backgroundColor: '#51aa55', color: '#ffffff' },
        Hover: { backgroundColor: '#418844', color: '#ffffff' }, // Assuming darker shade for hover
        Disabled: { backgroundColor: '#b9daba', color: 'rgba(0, 0, 0, 0.3)' },
    };

    return (
        <button 
            style={{
                width: '200px',
                height: '48px',
                borderRadius: '200px',
                fontFamily: 'Pretendard',
                fontSize: '16px',
                fontWeight: 500,
                ...styles[status]
            }}
            disabled={status === 'Disabled'}
            className="flex items-center justify-center gap-2"
        >
            <SVGIcon name="Play" size={16} />
            <span>{label}</span>
        </button>
    );
};