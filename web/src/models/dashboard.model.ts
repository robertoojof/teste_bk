export type Period = {
  startDate: string;
  endDate: string;
};

export type DashboardSummary = {
  startDate: string;
  endDate: string;
  ordersCount: number;
  revenue: number;
  totalCost: number;
  profit: number;
  skusWithoutCost: string[];
};
