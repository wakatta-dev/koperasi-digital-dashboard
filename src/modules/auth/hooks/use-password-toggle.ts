/** @format */

import { useCallback, useState } from "react";

export function usePasswordToggle(initialVisible = false) {
  const [visible, setVisible] = useState(initialVisible);

  const toggle = useCallback(() => {
    setVisible((prev) => !prev);
  }, []);

  return {
    visible,
    type: visible ? "text" : "password",
    toggle,
  };
}
