import { useLocation, useSearchParams } from "react-router-dom";
import {
  CloudOutlined,
  FireOutlined,
  HomeOutlined,
  ThunderboltOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import Container from "@/components/Wrapper/Container";
import CategoryBox from "@/components/User/Common/CategoryBox";


// Các danh mục, sử dụng icon từ Ant Design
export const categories = [
  {
    label: "Beach",
    icon: <CloudOutlined />,
    description: "This property is close to the beach!",
  },
  {
    label: "Windmills",
    icon: <ThunderboltOutlined />,
    description: "This property is has windmills!",
  },
  {
    label: "Modern",
    icon: <HomeOutlined />,
    description: "This property is modern!",
  },
  {
    label: "Countryside",
    icon: <EnvironmentOutlined />,
    description: "This property is in the countryside!",
  },
  {
    label: "Pools",
    icon: <FireOutlined />,
    description: "This is property has a beautiful pool!",
  },
  {
    label: "Islands",
    icon: <GlobalOutlined />,
    description: "This property is on an island!",
  },
  {
    label: "Lux",
    icon: <CrownOutlined />,
    description: "This property is brand new and luxurious!",
  },
];

type Props = {};

function Categories({ }: Props) {
  const [searchParams] = useSearchParams(); // Hook từ react-router-dom
  const location = useLocation(); // Hook từ react-router-dom
  const category = searchParams.get("category");

  // Kiểm tra nếu pathname là "/"
  const isMainPage = location.pathname === "/";

  if (!isMainPage) {
    return null;
  }

  return (
    <Container>
      <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto">
        {categories.map((item, index) => (
          <CategoryBox
            key={index}
            icon={item.icon}
            label={item.label}
            selected={category === item.label}
          />
        ))}
      </div>
    </Container>
  );
}

export default Categories;
