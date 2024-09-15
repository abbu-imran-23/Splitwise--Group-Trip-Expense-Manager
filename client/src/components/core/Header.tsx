import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/Store";
import { Button } from "@/components/ui/button";
import { AppDispatch } from "@/redux/Store";
import { useNavigate } from "react-router-dom";
import { logout } from "@/services/operations/authApi";
import { Link } from "react-router-dom";
import { CircleUser, Menu, Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

const Header = () => {
  const user = useSelector((state: RootState) => state?.profile.user);
  console.log("User from Redux", user);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout(navigate));
  };

  const showProfileInfo = () => {
    navigate("/profile");
  };

  return (
    <header className="sticky bg-black top-2 flex h-16 items-center gap-4 border-b bg-background px-1 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link to="/home" className="text-slate-100 text-2xl transition-colors">
          Splitwise
        </Link>
        <div className="flex gap-4 mt-1">
          <Link
            to="#"
            className="text-muted-foreground md:text-base transition-colors hover:text-slate-300"
          >
            Dashboard
          </Link>
          <Link
            to="#"
            className="text-muted-foreground md:text-base transition-colors hover:text-slate-300"
          >
            MyTrips
          </Link>
          <Link
            to="#"
            className="text-muted-foreground md:text-base transition-colors hover:text-slate-300"
          >
            TripMates
          </Link>
          <Link
            to="#"
            className="text-muted-foreground md:text-base transition-colors hover:text-slate-300"
          >
            Payments
          </Link>
        </div>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-black" side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              to="/home"
              className="text-slate-100 text-2xl transition-colors"
            >
              Splitwise
            </Link>
            <Link to="#" className="text-muted-foreground hover:text-slate-300">
              Dashboard
            </Link>
            <Link to="#" className="text-muted-foreground hover:text-slate-300">
              MyTrips
            </Link>
            <Link to="#" className="text-muted-foreground hover:text-slate-300">
              TripMates
            </Link>
            <Link to="#" className="text-muted-foreground hover:text-slate-300">
              Payments
            </Link>
            <Link to="#" className="text-muted-foreground hover:text-slate-300">
              Settings
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="hidden md:block absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search"
              className="hidden md:block pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-slate-100"
            />
            <Link
              to="/home"
              className="block md:hidden text-center text-slate-100 text-2xl transition-colors"
            >
              Splitwise
            </Link>
          </div>
        </form>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-black text-white opacity-85"
            align="end"
          >
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={showProfileInfo}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
