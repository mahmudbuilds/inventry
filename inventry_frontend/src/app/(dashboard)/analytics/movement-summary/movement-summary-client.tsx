"use client";

import {
  ActivityIcon,
  ArrowDownLeftIcon,
  ArrowLeftRightIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  ClockIcon,
  ScaleIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import type { StockMovementItem } from "@/components/dashboard-recent-movements";
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

export interface MovementSummaryData {
  total_in: number;
  total_out: number;
  net_change: number;
  total_movements: number;
}

export function MovementSummaryClient({
  summary,
  recentMovements = [],
}: {
  summary: MovementSummaryData;
  recentMovements: StockMovementItem[];
}) {
  const totalVolume = (summary.total_in || 0) + (summary.total_out || 0);
  const inPct =
    totalVolume > 0 ? ((summary.total_in || 0) / totalVolume) * 100 : 50;
  const outPct =
    totalVolume > 0 ? ((summary.total_out || 0) / totalVolume) * 100 : 50;

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium">
              Total Inbound Restocked
            </CardDescription>
            <ArrowDownLeftIcon className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              +{summary.total_in.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Cumulative units received
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium">
              Total Outbound Dispatched
            </CardDescription>
            <ArrowUpRightIcon className="size-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
              -{summary.total_out.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Cumulative units fulfilled
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium">
              Net Stock Balance Delta
            </CardDescription>
            <ScaleIcon className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.net_change >= 0
                ? `+${summary.net_change.toLocaleString()}`
                : summary.net_change.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Net inventory retention
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium">
              Audited Transactions
            </CardDescription>
            <ActivityIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.total_movements.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Movement operations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Inflow vs Outflow Ratio Card */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold tracking-tight">
            Inflow vs Outflow Balance Ratio
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Visual comparison of overall inventory replenishment versus sales
            dispatch volume
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <ArrowDownLeftIcon className="size-4" /> Inbound:{" "}
                {summary.total_in.toLocaleString()} units ({inPct.toFixed(1)}%)
              </span>
              <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold">
                <ArrowUpRightIcon className="size-4" /> Outbound:{" "}
                {summary.total_out.toLocaleString()} units ({outPct.toFixed(1)}
                %)
              </span>
            </div>

            <div className="h-4 w-full overflow-hidden rounded-full bg-muted flex">
              <div
                className="bg-emerald-500 transition-all duration-500"
                style={{ width: `${inPct}%` }}
                title={`Inbound: ${inPct.toFixed(1)}%`}
              />
              <div
                className="bg-rose-500 transition-all duration-500"
                style={{ width: `${outPct}%` }}
                title={`Outbound: ${outPct.toFixed(1)}%`}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Movements Table Card */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">
              Recent Movement Audit
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Detailed chronological record of inventory transfers
            </CardDescription>
          </div>
          <CardAction>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8 gap-1.5"
              nativeButton={false}
              render={
                <Link href="/movements">
                  Open Full Ledger <ArrowRightIcon className="size-3.5" />
                </Link>
              }
            />
          </CardAction>
        </CardHeader>

        <CardContent className="px-0 py-0">
          {recentMovements.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center px-4">
              <ArrowLeftRightIcon className="size-12 text-muted-foreground/30 mb-3" />
              <h3 className="text-base font-semibold text-foreground">
                No movements logged
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Record restocking or dispatches to see your ledger summary here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[160px] pl-6 text-xs font-semibold">
                      Type
                    </TableHead>
                    <TableHead className="text-xs font-semibold">
                      Product & SKU
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-right">
                      Quantity
                    </TableHead>
                    <TableHead className="text-xs font-semibold">
                      User
                    </TableHead>
                    <TableHead className="text-xs font-semibold">
                      Timestamp
                    </TableHead>
                    <TableHead className="text-xs font-semibold pr-6">
                      Notes / Reference
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentMovements.map((m) => {
                    const isIn = m.movement_type === "IN";
                    const dateStr = new Date(m.timestamp).toLocaleString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    );

                    return (
                      <TableRow
                        key={m.id}
                        className="hover:bg-muted/40 transition-colors"
                      >
                        <TableCell className="pl-6">
                          <Badge
                            variant="outline"
                            className={
                              isIn
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800 gap-1 text-xs"
                                : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800 gap-1 text-xs"
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
                            <span className="font-semibold text-sm text-foreground">
                              {m.product_name || `Product #${m.product}`}
                            </span>
                            {m.product_sku && (
                              <span className="text-xs text-muted-foreground font-mono">
                                {m.product_sku}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-bold text-sm tabular-nums">
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
                        <TableCell className="pr-6 text-xs text-muted-foreground max-w-xs truncate">
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
    </div>
  );
}
