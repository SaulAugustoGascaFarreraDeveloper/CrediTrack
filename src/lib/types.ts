import { ColumnDef } from "@tanstack/react-table";

export type ColumnDefWithActions<T> = ColumnDef<T> & {
    actions?: (row: T) => React.ReactNode;
  };