import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { urlService } from "@/services";
import { toast } from "sonner";
import { createUrlSchema } from "@/lib/validations";
import { ZodError } from "zod";
import { ApiError } from "@/services";
import type { Url } from "@/types";

interface EditUrlDialogProps {
  url: Url | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function EditUrlDialog({
  url,
  open,
  onOpenChange,
  onSuccess,
}: EditUrlDialogProps) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Update the input when url prop changes
  useEffect(() => {
    if (url) {
      setOriginalUrl(url.originalUrl);
    }
  }, [url]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setError("");
    setIsLoading(true);

    try {
      // Validate with Zod
      const validated = createUrlSchema.parse({ originalUrl });

      // Update URL
      await urlService.update(url._id, validated);
      toast.success("Link updated successfully!");
      setOriginalUrl("");
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      if (err instanceof ZodError) {
        setError(err.issues[0]?.message || "Invalid URL");
      } else if (err instanceof ApiError) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError("Failed to update link");
        toast.error("Failed to update link");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Short Link</DialogTitle>
            <DialogDescription>
              Update the destination URL for {url?.shortUrl}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="url">Original URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/your-long-url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                disabled={isLoading}
                className={error ? "border-destructive" : ""}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
