import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

function Table({ className, ...props }) {
  return (
    <table
      data-slot="table"
      className={cn(
        "caption-bottom text-sm",
        className
      )}
      {...props}
    />
  );
}

function TableHeader({ className, ...props }) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b transition-colors",
        "hover:bg-muted/50",
        "data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2",
        "text-left align-middle font-medium",
        "whitespace-nowrap",
        "[&:has([role=checkbox])]:pr-0",
        "[&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle",
        "whitespace-nowrap",
        "[&:has([role=checkbox])]:pr-0",
        "[&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }) {
  return (
    <caption
      data-slot="table-caption"
      className={cn(
        "text-muted-foreground mt-4 text-sm",
        className
      )}
      {...props}
    />
  );
}

const ShadCNTable = ({ headers = [], data = [], keyMapping = {}, columnStyles = {}, pagination = false, rowsPerPage = 5, onSelectAllChange, onRowCheckChange, className = "", tableClassName = "" }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const paginatedData = pagination ? data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage) : data;
  const isAllChecked = data.length > 0 && data.every((row) => !!row.checked);
  const isSomeChecked = data.some((row) => !!row.checked) && !isAllChecked;

  const cellBorder = (index) => {
    return cn("border-r border-indigo-200", index === headers.length - 1 && "border-r-0");
  };

  const handlePageChange = (page) => {setCurrentPage(page)};

  return (
    <div className="w-full">
      <div
        className={cn("relative w-full", "max-h-95", "overflow-auto", "custom-scrollbar",className)}
        style={{
          scrollbarGutter: "stable",
        }}
      >
       <Table className={cn("min-w-full","table-fixed","border-separate","border-spacing-0",tableClassName)}>
          <TableHeader>
            <TableRow>
              {headers.map((header, index) => {
                const key = keyMapping[header];

                return (
                  <TableHead
                    key={header || index}
                    style={columnStyles[header]}
                    className={cn( "sticky top-0 z-30", "bg-[#083c76]", "text-white", "text-center", "font-semibold", "shadow-[0_1px_0_0_#c7d2fe]", "whitespace-normal", "break-words", "leading-tight", "px-2", "py-3", "align-middle", cellBorder(index))}
                  >
                    {key === "checked" ? (
                      <div className="flex justify-center">
                        <Checkbox
                          checked={isSomeChecked ? "indeterminate" : isAllChecked}
                          onCheckedChange={(checked) => {
                            onSelectAllChange?.(checked === true);
                          }}
                          className="border-white data-[state=checked]:bg-white data-[state=checked]:text-[#083c76]"
                        />
                      </div>
                    ) : (
                      header
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>

          <TableBody className="text-center">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className={cn("border-b", "border-indigo-100", "hover:bg-indigo-50", "transition-colors")}
                >
                  {headers.map((header, colIndex) => {
                    const key = keyMapping[header];
                    const value = row[key];
                    return (
                      <TableCell
                        key={`${rowIndex}-${colIndex}`}
                        style={columnStyles[header]}
                        className={cn( cellBorder(colIndex), "whitespace-normal", "break-words", "leading-tight", "px-2", "py-3", "align-middle")}
                        title={typeof value === "string" ? value : ""}
                      >
                        {key === "rowcheck" || key === "checked" ? (
                          <div className="flex justify-center">
                            <Checkbox
                              checked={!!row.checked}
                              onCheckedChange={(checked) => {
                                onRowCheckChange?.(row, checked === true);
                              }}
                            />
                          </div>
                        ) : (value ?? "-")}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={headers.length}
                  className="py-8 text-center text-red-600"
                >
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 py-3">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() =>
              handlePageChange(currentPage - 1)
            }
            className={cn( "rounded-md", "border border-indigo-300", "px-3 py-1.5", "text-sm font-medium", "transition-colors", currentPage === 1 ? "cursor-not-allowed opacity-50" : "hover:bg-indigo-50")}
          >
            Previous
          </button>

          <span className="text-sm font-semibold">Page {currentPage} of {totalPages}</span>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() =>
              handlePageChange(currentPage + 1)
            }
            className={cn("rounded-md", "border border-indigo-300", "px-3 py-1.5", "text-sm font-medium", "transition-colors", currentPage === totalPages ? "cursor-not-allowed opacity-50" : "hover:bg-indigo-50")}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};

export default ShadCNTable;