/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { urlService } from "@/services";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ExternalLink,
  Copy,
  BarChart2,
  LogOut,
  MoreVertical,
  Pencil,
  Trash,
} from "lucide-react";
import { toast } from "sonner";
import type { Url } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ShottyLogo from "@/components/ShottyLogo";
import CreateUrlDialog from "@/components/CreateUrlDialog";
import EditUrlDialog from "@/components/EditUrlDialog";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [urls, setUrls] = useState<Url[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUrl, setEditingUrl] = useState<Url | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    loadUrls();
  }, []);

  const loadUrls = async () => {
    try {
      setIsLoading(true);
      const data = await urlService.getAll();
      setUrls(data);
    } catch (error) {
      toast.error("Failed to load URLs");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (shortUrl: string) => {
    const fullUrl = `${window.location.origin}/${shortUrl}`;
    await navigator.clipboard.writeText(fullUrl);
    toast.success("Link copied to clipboard!");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
    toast.success("Logged out successfully");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;

    try {
      await urlService.delete(id);
      toast.success("Link deleted successfully");
      loadUrls();
    } catch {
      toast.error("Failed to delete link");
    }
  };

  const handleEdit = (url: Url) => {
    setEditingUrl(url);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <ShottyLogo size="sm" />
              <span className="font-semibold text-lg">Shotty</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar>
                    <AvatarFallback>
                      {user ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.emailId}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Your Links</h1>
              <p className="text-muted-foreground mt-1">
                Manage and track all your shortened URLs
              </p>
            </div>
            <CreateUrlDialog onSuccess={loadUrls} />
          </div>

          {/* URLs List */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : urls.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="text-center space-y-3">
                  <div className="mx-auto w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                    <ExternalLink className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg">No links yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Get started by creating your first shortened URL
                  </p>
                  <div className="mt-4">
                    <CreateUrlDialog onSuccess={loadUrls} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {urls.map((url) => (
                <Card key={url._id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 space-y-2">
                        <CardTitle className="text-lg truncate">
                          {window.location.origin}/{url.shortUrl}
                        </CardTitle>
                        <CardDescription className="truncate">
                          {url.originalUrl}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(url.shortUrl)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            window.open(`/${url.shortUrl}`, "_blank")
                          }
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(url)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(url._id)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BarChart2 className="h-4 w-4" />
                      <span>{url.clicks} clicks</span>
                      <span>•</span>
                      <span>
                        Created {new Date(url.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <EditUrlDialog
        url={editingUrl}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={loadUrls}
      />
    </div>
  );
}
