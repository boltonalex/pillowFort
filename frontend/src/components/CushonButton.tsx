import { useNavigate } from "react-router";

interface CushonButtonProps {
  children: React.ReactNode;
  variant?: "pink" | "white";
  clickTarget: string;
}


const CushonButton: React.FC<CushonButtonProps> = ({ children, variant = 'pink', clickTarget }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(clickTarget);
  }

  if (variant === 'white') {
    return (
      <button
        onClick={handleClick}
        className="cursor-pointer text-pink-500 border-pink-500 border-2 font-semibold rounded-full sm:px-6 px-1 sm:py-2 h-[40px] mt-2 sm:mt-0 flex items-center break-words sm:gap-2 shadow-md hover:bg-pink-200 transition duration-300">
        {children}
      </button>

    )
  }
  return (
    <button
      onClick={handleClick}
      className="cursor-pointer text-white bg-pink-500 font-semibold rounded-full sm:px-6 px-1 sm:py-2 h-[40px] mt-2 sm:mt-0 flex items-center break-words sm:gap-2 shadow-md hover:bg-pink-600 transition duration-300">
      {children}
    </button>

  )

}

export default CushonButton