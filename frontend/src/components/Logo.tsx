import { useNavigate } from "react-router";

const Logo = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/');
  }
  return (
    <button onClick={handleClick}>
      <img src='/logo.png' className="max-w-60 h-auto object-contain cursor-pointer" />
    </button>
  )
}

export default Logo