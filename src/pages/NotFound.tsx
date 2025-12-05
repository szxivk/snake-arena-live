import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <Helmet>
        <title>404 - Page Not Found | Snake Arena</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Helmet>

      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h1 className="text-6xl font-mono font-bold mb-4">404</h1>
        <p className="text-xl font-mono text-muted-foreground mb-8">
          PAGE NOT FOUND
        </p>
        <Link to="/">
          <Button className="font-mono">
            RETURN HOME
          </Button>
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
