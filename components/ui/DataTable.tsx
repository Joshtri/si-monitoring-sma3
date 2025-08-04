"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/react";

interface Column {
  key: string;
  label: string;
  align?: "start" | "center" | "end";
}

interface DataTableProps<T> {
  columns: Column[];
  rows: T[];
  loading?: boolean;
  empty?: React.ReactNode;
}

export function DataTable<T extends { key: string }>({
  columns,
  rows,
  loading = false,
  empty,
}: DataTableProps<T>) {
  if (loading) {
    return <div className="text-center text-gray-500">Memuat data...</div>;
  }

  if (rows.length === 0) {
    return (
      empty ?? (
        <div className="text-center text-gray-400">Data tidak tersedia.</div>
      )
    );
  }

  return (
    <Table aria-label="Data Table">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.key} align={column.align ?? "start"}>
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={rows}>
        {(item) => (
          <TableRow key={item.key}>
            {(columnKey) => (
              <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}