import { useEffect } from "react";
import { useLocation } from "react-router";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    window.onload = () => {
        window.scrollTo(0, 0);
    }
  }, [pathname,window.onload]);

  return null;
}
