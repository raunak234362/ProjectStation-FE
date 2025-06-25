/* eslint-disable react/prop-types */

const Button = ({children, type='button',className="bg-teal-400",...props}) => {
    return (
    <button
    type={type}
    className={`${className} md:px-5 px-3 md:py-1 py-0  text-white md:text-lg text-sm rounded-xl`}
    {...props}
    >
        {children}
    </button>
  )
}

export default Button