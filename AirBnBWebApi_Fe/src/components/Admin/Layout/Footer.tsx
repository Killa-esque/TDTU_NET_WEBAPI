import { Layout } from "antd";
import { HeartFilled } from "@ant-design/icons";
import { NavLink } from "react-router-dom";

const { Footer: AntFooter } = Layout;

function Footer() {
  return (
    <AntFooter className="bg-gray-100 py-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left text-gray-600 mb-4 md:mb-0">
          © 2024, made with{" "}
          <HeartFilled className="text-red-500" /> by{" "}
          <NavLink to="/about" className="font-semibold text-gray-800 hover:text-pinkCustom">
            Phu Vinh
          </NavLink>{" "}
          for a better web.
        </div>
        <div className="flex space-x-4">
          <NavLink to="#" className="text-gray-600 hover:text-pinkCustom">
            Phu Vinh
          </NavLink>
          <NavLink to="#" className="text-gray-600 hover:text-pinkCustom">
            About Us
          </NavLink>
          <NavLink to="#" className="text-gray-600 hover:text-pinkCustom">
            Blog
          </NavLink>
          <NavLink to="#" className="text-gray-600 hover:text-pinkCustom">
            License
          </NavLink>
        </div>
      </div>
    </AntFooter>
  );
}

export { Footer };
