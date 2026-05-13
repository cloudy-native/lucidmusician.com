import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Strips trailing slashes from URLs to prevent duplicate content issues.
 * Redirects /about/ → /about, /blog/ → /blog, etc.
 * Does not affect the root path /.
 */
export function TrailingSlashRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname !== "/" && location.pathname.endsWith("/")) {
      navigate(
        {
          pathname: location.pathname.slice(0, -1),
          search: location.search,
          hash: location.hash,
        },
        { replace: true },
      );
    }
  }, [location, navigate]);

  return null;
}
