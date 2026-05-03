import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, Circle } from "lucide-react";

export default function ActionPlanPage() {
  const actionPlan = trpc.metrics.getActionPlan.useQuery();
  const updateItem = trpc.metrics.updateActionPlanItem.useMutation();

  const handleToggleCompletion = async (id: number, completed: number) => {
    await updateItem.mutateAsync({ id, completed: completed ? 0 : 1 });
    actionPlan.refetch();
  };

  const groupedByWeek = actionPlan.data?.reduce((acc: any, item: any) => {
    const week = item.week || 1;
    if (!acc[week]) acc[week] = [];
    acc[week].push(item);
    return acc;
  }, {});

  const weeks = [1, 2, 3, 4];
  const weekTitles: Record<number, string> = {
    1: "Week 1: Foundation & Setup",
    2: "Week 2: Security & Partnerships",
    3: "Week 3: Team & Funding",
    4: "Week 4: Launch & Growth",
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-neon-cyan">30-Day Action Plan</h1>
        <p className="text-muted-foreground">Milestone tracker for Global Digital Health Foundation execution</p>
      </div>

      {/* Timeline */}
      {actionPlan.isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-neon-cyan" />
        </div>
      ) : (
        <div className="space-y-6">
          {weeks.map((week) => {
            const items = groupedByWeek?.[week] || [];
            const completedCount = items.filter((item: any) => item.completed).length;
            const totalCount = items.length;
            const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

            return (
              <div key={week} className="space-y-3">
                {/* Week Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-neon-magenta">{weekTitles[week]}</h2>
                    <Badge variant="outline" className="border-neon-cyan text-neon-cyan">
                      {completedCount}/{totalCount} completed
                    </Badge>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-sidebar rounded-full h-2 overflow-hidden border border-neon-purple/30">
                    <div
                      className="h-full bg-gradient-to-r from-neon-cyan to-neon-magenta transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {items.length === 0 ? (
                    <Card className="p-4 border-neon-purple/30 bg-sidebar/50 text-center text-muted-foreground">
                      No items for this week
                    </Card>
                  ) : (
                    items.map((item: any) => (
                      <Card
                        key={item.id}
                        className={`p-4 border-2 transition-all ${
                          item.completed
                            ? "border-neon-lime/50 bg-neon-lime/5"
                            : "border-neon-cyan/30 bg-sidebar/50 hover:border-neon-cyan"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Checkbox */}
                          <button
                            onClick={() => handleToggleCompletion(item.id, item.completed)}
                            className="mt-1 flex-shrink-0 transition-colors"
                          >
                            {item.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-neon-lime" />
                            ) : (
                              <Circle className="w-5 h-5 text-neon-cyan" />
                            )}
                          </button>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h3
                              className={`font-semibold ${
                                item.completed ? "line-through text-muted-foreground" : "text-foreground"
                              }`}
                            >
                              {item.title}
                            </h3>
                            {item.description && (
                              <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                            )}
                          </div>

                          {/* Priority Badge */}
                          {item.priority && (
                            <Badge
                              variant="outline"
                              className={`flex-shrink-0 ${
                                item.priority === "high"
                                  ? "border-neon-magenta text-neon-magenta"
                                  : item.priority === "medium"
                                  ? "border-neon-cyan text-neon-cyan"
                                  : "border-neon-lime text-neon-lime"
                              }`}
                            >
                              {item.priority}
                            </Badge>
                          )}
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary */}
      {actionPlan.data && (
        <Card className="p-6 border-neon-purple/30 bg-sidebar/50 neon-glow-purple">
          <h3 className="text-lg font-bold text-neon-purple mb-4">Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Items</p>
              <p className="text-2xl font-bold text-neon-cyan">{actionPlan.data.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-neon-lime">
                {actionPlan.data.filter((item: any) => item.completed).length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className="text-2xl font-bold text-neon-magenta">
                {actionPlan.data.filter((item: any) => !item.completed).length}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
