import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, RefreshCw, Zap, AlertCircle } from "lucide-react";

const CATEGORIES = ["quantum", "health", "AI", "telecom", "infrastructure", "data", "security", "web", "mobile", "other"];

export default function ReposPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [displayRepos, setDisplayRepos] = useState<any[]>([]);

  const listRepos = trpc.repos.list.useQuery();
  const syncRepos = trpc.repos.syncRepositories.useMutation();

  useEffect(() => {
    if (listRepos.data) {
      setDisplayRepos(listRepos.data);
    }
  }, [listRepos.data]);

  const handleSearch = () => {
    if (!listRepos.data) return;

    if (searchQuery.trim()) {
      const filtered = listRepos.data.filter(
        (repo: any) =>
          repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          repo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          repo.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setDisplayRepos(filtered);
    } else {
      setDisplayRepos(listRepos.data);
    }
  };

  const handleCategoryFilter = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setDisplayRepos(listRepos.data || []);
    } else {
      setSelectedCategory(category);
      if (listRepos.data) {
        const filtered = listRepos.data.filter(
          (repo: any) => repo.intelligence?.category === category
        );
        setDisplayRepos(filtered);
      }
    }
  };

  const handleSync = async () => {
    await syncRepos.mutateAsync();
    await listRepos.refetch();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-neon-cyan">Repository Browser</h1>
        <p className="text-muted-foreground">Explore all public repositories from the onegayunicorn organization</p>
      </div>

      {/* Sync Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSync}
          disabled={syncRepos.isPending}
          className="bg-neon-magenta/20 hover:bg-neon-magenta/30 text-neon-magenta border border-neon-magenta"
        >
          {syncRepos.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync Repositories
            </>
          )}
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-neon-cyan/50" />
          <Input
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10 bg-sidebar border-neon-cyan/30 text-foreground placeholder:text-muted-foreground focus:border-neon-cyan"
          />
        </div>
        <Button
          onClick={handleSearch}
          className="bg-neon-cyan/20 hover:bg-neon-cyan/30 text-neon-cyan border border-neon-cyan"
        >
          Search
        </Button>
      </div>

      {/* Category Filters */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-neon-magenta">Filter by Category</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`cursor-pointer transition-all ${
                selectedCategory === category
                  ? "bg-neon-purple text-white border-neon-purple"
                  : "border-neon-purple/30 text-neon-purple hover:border-neon-purple"
              }`}
              onClick={() => handleCategoryFilter(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {listRepos.isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-neon-cyan" />
        </div>
      ) : displayRepos.length === 0 ? (
        <Card className="p-8 text-center border-neon-purple/30 bg-sidebar/50">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-neon-magenta" />
          <p className="text-muted-foreground">No repositories found</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayRepos.map((repo: any) => (
            <Card
              key={repo.id}
              className="p-4 border-neon-cyan/30 bg-sidebar/50 hover:bg-sidebar/80 hover:border-neon-cyan transition-all cursor-pointer group neon-glow-cyan"
            >
              <div className="space-y-3">
                {/* Title */}
                <div className="flex items-start justify-between gap-2">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-neon-cyan hover:text-neon-lime transition-colors truncate flex-1"
                  >
                    {repo.name}
                  </a>
                  {repo.visibility === "private" && (
                    <Badge variant="outline" className="text-xs border-neon-magenta text-neon-magenta">
                      Private
                    </Badge>
                  )}
                </div>

                {/* Description */}
                {repo.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{repo.description}</p>
                )}

                {/* Language */}
                {repo.language && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neon-lime" />
                    <span className="text-xs text-neon-lime">{repo.language}</span>
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-neon-purple/20">
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-neon-magenta" />
                    <span>Score: {repo.intelligence?.healthScore || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-neon-cyan" />
                    <span>{repo.intelligence?.category || "uncategorized"}</span>
                  </div>
                </div>

                {/* Tags */}
                {repo.intelligence?.tags && (
                  <div className="flex flex-wrap gap-1 pt-2">
                    {(typeof repo.intelligence.tags === "string" 
                      ? repo.intelligence.tags.split(",") 
                      : []
                    ).slice(0, 3).map((tag: string) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs border-neon-lime/30 text-neon-lime"
                      >
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Stats Footer */}
      <div className="pt-6 border-t border-neon-purple/30 text-sm text-muted-foreground text-center">
        Showing {displayRepos.length} of {listRepos.data?.length || 0} repositories
      </div>
    </div>
  );
}
