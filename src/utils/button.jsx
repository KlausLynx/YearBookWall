export const Button = ({children, onChangeStatus}) => {
    return (
        <button onClick={onChangeStatus} type="button" className='text-accent-white text-accent bg-brand flex items-center justify-center rounded-2xl p-2 cursor-pointer transition hover:scale-105'>
            {children}
        </button>
    )
    
}

export const SubmitButton = ({children, disabled}) => {
    return (
        <button type="submit" disabled={disabled} className='text-accent-white text-accent bg-brand flex items-center justify-center rounded-2xl p-2 px-4 cursor-pointer transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'>
            {children}
        </button>
    )
    
}