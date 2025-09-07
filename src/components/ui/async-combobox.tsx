/** @format */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { useDebouncedValue } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Search, X, Check } from "lucide-react";

type FetchPageResult<TItem> = {
  items: TItem[];
  nextPage?: string | null;
};

export type AsyncComboboxProps<TItem, TValue> = {
  // Value
  value: TValue | null;
  onChange: (value: TValue | null, item: TItem | null) => void;
  multiple?: false; // reserved for future multi-select extension

  // Mapping helpers
  getOptionValue: (item: TItem) => TValue;
  getOptionLabel: (item: TItem) => string;

  // Fetching
  queryKey: unknown[]; // base query key (will be extended with search)
  fetchPage: (args: {
    search: string;
    pageParam?: string;
    signal?: AbortSignal;
  }) => Promise<FetchPageResult<TItem>>;
  getNextPageParam?: (
    lastPage: FetchPageResult<TItem>
  ) => string | undefined | null;

  // UX
  placeholder?: string;
  emptyText?: string;
  loadingText?: string;
  notReadyText?: string;
  minChars?: number; // min chars before fetching
  debounceMs?: number;
  disabled?: boolean;
  className?: string;
  dropdownClassName?: string;
  renderOption?: (item: TItem, selected: boolean) => React.ReactNode;
  renderValue?: (value: TValue | null) => React.ReactNode; // fallback render if label unknown
  noBorder?: boolean; // useful if embedding into other inputs
};

export function AsyncCombobox<TItem, TValue extends string | number>(
  props: AsyncComboboxProps<TItem, TValue>
) {
  const {
    value,
    onChange,
    getOptionLabel,
    getOptionValue,
    queryKey,
    fetchPage,
    getNextPageParam,
    placeholder = "Cari...",
    emptyText = "Tidak ada hasil",
    loadingText = "Memuat...",
    notReadyText = "Ketik untuk mencari",
    minChars = 0,
    debounceMs = 250,
    disabled,
    className,
    dropdownClassName,
    renderOption,
    renderValue,
    noBorder,
  } = props;

  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const debounced = useDebouncedValue(input, debounceMs);

  const enabled = open && debounced.length >= (minChars ?? 0) && !disabled;

  // Keep a small cache of known labels for selected value rendering
  const labelMapRef = React.useRef(new Map<TValue, string>());

  const query = useInfiniteQuery<
    FetchPageResult<TItem>, // TQueryFnData
    Error, // TError
    InfiniteData<FetchPageResult<TItem>, string | undefined>, // TData (keep InfiniteData shape)
    any, // TQueryKey
    string | undefined // TPageParam
  >({
    queryKey: [...queryKey, { q: debounced }],
    enabled,
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam, signal }) => {
      const res = await fetchPage({ search: debounced, pageParam, signal });
      // Update known labels cache
      for (const it of res.items) {
        const v = getOptionValue(it);
        if (!labelMapRef.current.has(v)) {
          labelMapRef.current.set(v, getOptionLabel(it));
        }
      }
      return res;
    },
    getNextPageParam: (lastPage) => {
      if (getNextPageParam) return getNextPageParam(lastPage) ?? undefined;
      return lastPage?.nextPage ?? undefined;
    },
    staleTime: 30_000,
  });

  // Infinite scroll sentinel
  const loadMoreRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (!open) return;
    const el = loadMoreRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (
        first.isIntersecting &&
        query.hasNextPage &&
        !query.isFetchingNextPage
      ) {
        query.fetchNextPage();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [open, query]);

  const items = React.useMemo<TItem[]>(() => {
    return query.data?.pages.flatMap((p) => p.items as TItem[]) ?? [];
  }, [query.data]);

  const selectedLabel = React.useMemo(() => {
    if (value == null) return "";
    const cached = labelMapRef.current.get(value);
    if (cached) return cached;
    // If not cached, try to find in current items
    const found = items.find((it) => getOptionValue(it) === value);
    if (found) return getOptionLabel(found);
    return "";
  }, [value, items, getOptionLabel, getOptionValue]);

  // Keyboard nav
  const [highlightIndex, setHighlightIndex] = React.useState<number>(-1);
  React.useEffect(() => {
    if (!open) return;
    setHighlightIndex(items.length ? 0 : -1);
  }, [open, items.length]);

  const rootRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  const handleSelect = React.useCallback(
    (item: TItem | null) => {
      if (!item) {
        onChange(null, null);
        return;
      }
      const v = getOptionValue(item);
      const lbl = getOptionLabel(item);
      labelMapRef.current.set(v, lbl);
      onChange(v, item);
      setOpen(false);
    },
    [getOptionLabel, getOptionValue, onChange]
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, Math.max(0, items.length - 1)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const it = items[highlightIndex];
      if (it) handleSelect(it);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  const showHelper = !enabled;
  const isLoading = query.isFetching && items.length === 0;

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <div className={cn("flex items-center gap-2", noBorder ? "" : "")}>
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
          <Input
            value={open ? input : selectedLabel || ""}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "pl-8 pr-8",
              !open && !selectedLabel ? "text-muted-foreground" : ""
            )}
          />
          {value != null && !open ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange(null, null);
              }}
              className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
              aria-label="Clear"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>
      </div>

      {open && (
        <div
          className={cn(
            "bg-popover text-popover-foreground absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-md border shadow-md",
            dropdownClassName
          )}
        >
          <ScrollArea className="max-h-72">
            <div className="py-1">
              {showHelper ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  {disabled
                    ? "Dinonaktifkan"
                    : debounced.length < (minChars ?? 0)
                    ? notReadyText
                    : notReadyText}
                </div>
              ) : isLoading ? (
                <div className="px-3 py-2 text-sm text-muted-foreground inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" /> {loadingText}
                </div>
              ) : items.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  {emptyText}
                </div>
              ) : (
                items.map((item: TItem, idx: number) => {
                  const v = getOptionValue(item);
                  const selected = value != null && v === value;
                  return (
                    <button
                      key={
                        typeof v === "string" || typeof v === "number" ? v : idx
                      }
                      type="button"
                      onMouseEnter={() => setHighlightIndex(idx)}
                      onClick={() => handleSelect(item)}
                      className={cn(
                        "w-full px-2 py-1.5 text-left text-sm flex items-center gap-2",
                        idx === highlightIndex
                          ? "bg-accent text-accent-foreground"
                          : ""
                      )}
                    >
                      {selected ? (
                        <Check className="size-4" />
                      ) : (
                        <span className="w-4" />
                      )}
                      <span className="line-clamp-1">
                        {renderOption
                          ? renderOption(item, selected)
                          : getOptionLabel(item)}
                      </span>
                    </button>
                  );
                })
              )}

              {query.hasNextPage && (
                <div
                  ref={loadMoreRef}
                  className="px-3 py-2 text-center text-xs text-muted-foreground"
                >
                  {query.isFetchingNextPage ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" /> Memuat lagi...
                    </span>
                  ) : (
                    "Gulir untuk memuat selanjutnya"
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Hidden render for when label unknown */}
      {!open && !selectedLabel && renderValue && (
        <div className="sr-only" aria-hidden>
          {renderValue(value)}
        </div>
      )}
    </div>
  );
}

export default AsyncCombobox;
