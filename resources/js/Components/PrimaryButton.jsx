export default function PrimaryButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={
                `from-primary to-secondary inline-flex items-center rounded-md bg-gradient-to-br px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition-[background-position] duration-500 ease-in-out [background-position:0%_50%] [background-size:200%_100%] hover:[background-position:100%_50%] disabled:hover:[background-position:0%_50%] ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
