import Header from "@/components/core/Header";
import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex min-h-screen max-w-[1440px] w-full flex-col">
      <Header />
      <div className="flex flex-1 justify-center mt-10 items-start md:items-center">
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
