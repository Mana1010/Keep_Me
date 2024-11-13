import React from "react";
import { useMediaQuery } from "usehooks-ts";
function useMobileView() {
  const matches = useMediaQuery("(min-width: 640px)");
  return matches;
}

export default useMobileView;
