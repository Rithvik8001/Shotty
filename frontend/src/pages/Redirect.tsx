import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function Redirect() {
  const { shortUrl } = useParams<{ shortUrl: string }>();

  useEffect(() => {
    if (shortUrl) {
      // Redirect to backend endpoint which handles the actual redirect
      window.location.href = `${import.meta.env.VITE_API_URL}/${shortUrl}`;
    }
  }, [shortUrl]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Skeleton className="h-12 w-64 mx-auto" />
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}
