export interface DashboardResponseDto {

  chart: string;
  data: {
    field: string[];
    count: number[];
  };

}
