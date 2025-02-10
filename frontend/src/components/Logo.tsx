import { Link } from "react-router";

const Logo = () => {
  return (
    <Link to='/' >
      <button>
        <img src='/logo.png' className="max-w-60 h-auto object-contain cursor-pointer" />
      </button>
    </Link >
  )
}

export default Logo