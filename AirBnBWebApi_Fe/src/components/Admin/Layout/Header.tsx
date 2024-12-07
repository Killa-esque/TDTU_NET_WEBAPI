// src/components/Admin/Layout/Header.tsx
import { Row, Col, Button } from "antd";
import { Link, NavLink } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineMenu } from "react-icons/ai";
import ROUTES from "@/constants/routes";

type Props = {
  name: string;
  subName: string;
  onPress: () => void;
};

function Header({ name, subName, onPress }: Props) {

  // Giả định luôn có user đăng nhập với tên là "John Doe"
  const userName = "John Doe";

  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md">
      <Row className="flex-1">
        <Col>
          <NavLink to="/" className="text-lg font-semibold">
            {name}
          </NavLink>
        </Col>
      </Row>
      <Button type="link" className="lg:hidden" onClick={() => onPress()}>
        <AiOutlineMenu />
      </Button>
      <Link to={ROUTES.ADMIN_PROFILE} className="flex items-center space-x-2 text-blue-500">
        <FaUserCircle />
        <span>{userName}</span>
      </Link>
    </div>
  );
}

export { Header };
