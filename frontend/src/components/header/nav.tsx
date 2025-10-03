import { Link } from "react-router-dom";
import ShottyLogo from "../ShottyLogo";
import { Button } from "../ui/button";

const Nav = () => {
  return (
    <>
      <nav className="max-w-5xl w-full h-16 mx-auto border-gray-200 border-b bg-gray-50">
        <div className="p-4 flex items-center justify-between h-full">
          <div className="flex-1">
            <Link to="/">
              <ShottyLogo size="md" className="mt-2 cursor-pointer" />
            </Link>
          </div>
          <div className="flex gap-2">
            <Link to="/login">
              <Button className="px-6 py-0.5 cursor-pointer relative">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;
