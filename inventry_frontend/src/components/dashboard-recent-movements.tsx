"use client";

import {
  ArrowDownLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  BoxesIcon,
  ClockIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuickCreate } from "@/context/quick-create-context";

export interface StockMovementItem {
  id: number;
  product: number;
  product_name: string;
  product_sku: string;
  movement_type: "IN" | "OUT";
  quantity: number;
  timestamp: string;
  performed_by_username?: string;
  notes?: string;
}

export function DashboardRecentMovements({
  initialMovements = [],
}: {
  initialMovements?: StockMovementItem[];
}) {
  const { open } = useQuickCreate();

  return (
    <Card className="mx-4 lg:mx-6 border-border/80 shadow-xs">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-4">
        <div>
          <CardTitle className="text-lg font-semibold tracking-tight">
            Recent Stock Activity
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Live audit log of recent inbound restocks and outbound dispatches
          </CardDescription>
        </div>
        <CardAction className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-8"
            onClick={() => open("movement")}
          >
            Record Movement
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-8 gap-1"
            render={
              <Link href="/movements">
                View All <ArrowRightIcon className="size-3.5" />
              </Link>
            }
          />
        </CardAction>
      </CardHeader>

      <CardContent className="px-0 pb-0">
        {initialMovements.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center px-4">
            <BoxesIcon className="size-10 text-muted-foreground/40 mb-3" />
            <h3 className="text-sm font-medium text-foreground">
              No stock activity logged yet
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Use the Quick Create drawer or Record Movement button to log your
              first stock transaction.
            </p>
            <Button
              size="sm"
              className="mt-4 text-xs"
              onClick={() => open("movement")}
            >
              Record Movement
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[180px] pl-6 text-xs font-semibold">
                    Type
                  </TableHead>
                  <TableHead className="text-xs font-semibold">
                    Product
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-right">
                    Quantity
                  </TableHead>
                  <TableHead className="text-xs font-semibold">User</TableHead>
                  <TableHead className="text-xs font-semibold">
                    Date & Time
                  </TableHead>
                  <TableHead className="text-xs font-semibold pr-6">
                    Notes / Reference
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialMovements.slice(0, 8).map((m) => {
                  const isIn = m.movement_type === "IN";
                  const dateStr = new Date(m.timestamp).toLocaleString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  );

                  return (
                    <TableRow
                      key={m.id}
                      className="hover:bg-muted/40 transition-colors"
                    >
                      <TableCell className="pl-6 font-medium">
                        <Badge
                          variant="outline"
                          className={
                            isIn
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 gap-1 text-xs"
                              : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 gap-1 text-xs"
                          }
                        >
                          {isIn ? (
                            <ArrowDownLeftIcon className="size-3 text-emerald-600" />
                          ) : (
                            <ArrowUpRightIcon className="size-3 text-rose-600" />
                          )}
                          {isIn ? "Stock In" : "Stock Out"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm text-foreground">
                            {m.product_name || `Product #${m.product}`}
                          </span>
                          {m.product_sku && (
                            <span className="text-xs text-muted-foreground font-mono">
                              {m.product_sku}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-sm tabular-nums">
                        <span
                          className={
                            isIn
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-foreground"
                          }
                        >
                          {isIn
                            ? `+${m.quantity.toLocaleString()}`
                            : `-${m.quantity.toLocaleString()}`}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <UserIcon className="size-3.5" />
                          <span>{m.performed_by_username || "System"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <ClockIcon className="size-3.5" />
                          <span>{dateStr}</span>
                        </div>
                      </TableCell>
                      <TableCell className="pr-6 text-xs text-muted-foreground max-w-[200px] truncate">
                        {m.notes || "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
