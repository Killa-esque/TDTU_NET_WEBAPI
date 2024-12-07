import { useState } from "react";

const useDrawer = () => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => setVisible(true);
  const hideDrawer = () => setVisible(false);

  return {
    visible,
    showDrawer,
    hideDrawer,
  };
};

export default useDrawer;
