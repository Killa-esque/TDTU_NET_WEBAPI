import { useState } from "react";

const useSideNavType = () => {
  const [sidenavType, setSidenavType] = useState("transparent");

  const changeSidenavType = (type: string) => setSidenavType(type);

  return {
    sidenavType,
    changeSidenavType,
  };
};

export default useSideNavType;
