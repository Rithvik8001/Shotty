import ShottyLogo from "../ShottyLogo";
import { Button } from "../ui/button";

const Nav = () => {
  return (
    <>
      <nav className="max-w-5xl w-full h-16 mx-auto border-gray-200 border-b bg-gray-50">
        <div className="p-4 flex items-center justify-between h-full">
          <div className="flex-1">
            <ShottyLogo size="md" className="mt-2 cursor-pointer" />
          </div>
          <div className="flex gap-2">
            <Button className="px-6 py-0.5 cursor-pointer relative">
              Login
            </Button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;
