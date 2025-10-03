/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { urlService } from "@/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Copy,
  BarChart2,
  LogOut,
  MoreVertical,
  Pencil,
  Trash,
  Link2,
  Search,
  Filter,
  SlidersHorizontal,
  Menu,
  X,
} from "lucide-react";
import { toast } from "sonner";
import type { Url } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    loadUrls();
  }, []);

  // Keyboard shortcut: Press 'c' to open create dialog
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Check if user is not typing in an input field
      if (
        e.key === "c" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault(); // Prevent 'c' from being typed
        setIsCreateDialogOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
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

  const filteredUrls = urls.filter(
    (url) =>
      url.shortUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      url.originalUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 border-r flex flex-col bg-background transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="h-14 flex items-center justify-between px-6 border-b">
          <div className="flex items-center gap-2">
            <ShottyLogo size="sm" />
            <span className="font-semibold text-base leading-none">Shotty</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-secondary cursor-pointer">
              <Link2 className="h-4 w-4" />
              Links
            </button>
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-secondary transition-colors cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {user ? getInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.emailId}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 border-b flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Links</h1>
          </div>
          <CreateUrlDialog
            onSuccess={loadUrls}
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          />
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
              <div className="relative flex-1 sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by short link or URL"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none"
                  onClick={() => toast.info("Filter feature coming soon!")}
                >
                  <Filter className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none"
                  onClick={() =>
                    toast.info("Display customization coming soon!")
                  }
                >
                  <SlidersHorizontal className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Display</span>
                </Button>
              </div>
            </div>

            {/* Links List */}
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                  >
                    <Skeleton className="h-4 w-[250px] mb-2" />
                    <Skeleton className="h-3 w-[200px]" />
                  </div>
                ))}
              </div>
            ) : filteredUrls.length === 0 ? (
              <div className="border rounded-lg p-16 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <Link2 className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">
                  {searchQuery ? "No links found" : "No links yet"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery
                    ? "Try adjusting your search"
                    : "Get started by creating your first shortened URL"}
                </p>
                {!searchQuery && (
                  <CreateUrlDialog
                    onSuccess={loadUrls}
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                  />
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredUrls.map((url) => (
                  <div
                    key={url._id}
                    className="border rounded-lg p-3 sm:p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                        <div className="mt-1 p-1.5 sm:p-2 rounded-md bg-secondary shrink-0">
                          <Link2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 sm:gap-2 mb-1">
                            <button
                              onClick={() => copyToClipboard(url.shortUrl)}
                              className="font-medium text-xs sm:text-sm hover:underline truncate cursor-pointer"
                            >
                              {window.location.host}/{url.shortUrl}
                            </button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 sm:h-6 sm:w-6 shrink-0"
                              onClick={() => copyToClipboard(url.shortUrl)}
                            >
                              <Copy className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            </Button>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">
                            {url.originalUrl}
                          </p>
                          <div className="flex items-center gap-2 sm:gap-3 mt-2 text-[10px] sm:text-xs text-muted-foreground">
                            <span className="flex items-center gap-0.5 sm:gap-1">
                              <BarChart2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                              {url.clicks} clicks
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span className="hidden sm:inline">
                              {new Date(url.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 sm:h-8 sm:w-8 shrink-0"
                          >
                            <MoreVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
                ))}
              </div>
            )}

            {/* Footer Info */}
            {!isLoading && filteredUrls.length > 0 && (
              <div className="mt-6 text-center text-sm text-muted-foreground">
                Viewing 1-{filteredUrls.length} of {filteredUrls.length} link
                {filteredUrls.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>
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
