import { Oval } from "react-loader-spinner"

import { Button, ButtonProps } from "./../ui/button"

interface SpinnerButtonProps extends ButtonProps {
    state: boolean
    name: string
}

export const SpinnerButton = ({
    state,
    name,
    ...props
}: SpinnerButtonProps) => {
    return (
        <Button {...props}>
            {state ? (
                <Oval
                    visible={true}
                    height="24"
                    width="85"
                    color="#FFFFFF"
                    ariaLabel="oval-loading"
                    wrapperStyle={{minWidth:"85"}} // minWidth:"90"
                    wrapperClass=""
                    strokeWidth="7"
                />
            ) : (
                <span>{name}</span>
            )}
        </Button>
    )
}