
'use client';
import React, { useEffect, useMemo, useRef, useState } from "react";
import './notion-table.css';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Plus } from "lucide-react";

// ----------------- types -----------------
export type Column = {
  id: string;
  name: string;
  type: 'text' | 'number' | 'checkbox' | 'select' | 'date';
  options?: string[];
};

export type Row = {
  id: string;
  values: Record<string, any>;
};

export type NotionTableData = {
    columns: Column[];
    rows: Row[];
}

type NotionTableProps = {
  columns?: Column[];
  rows?: Row[];
  storageKey?: string;
  onChange?: (data: NotionTableData) => void;
  className?: string;
  style?: React.CSSProperties;
};


// ----------------- helpers -----------------
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const defaultValueForType = (type: Column['type']) => {
  switch (type) {
    case "text":
      return "";
    case "number":
      return null;
    case "checkbox":
      return false;
    case "select":
      return null; // one of options
    case "date":
      return ""; // YYYY-MM-DD
    default:
      return "";
  }
};

const coerceValue = (value: any, type: Column['type'], options: string[] = []) => {
  if (value === undefined) value = defaultValueForType(type);
  switch (type) {
    case "text":
      return value == null ? "" : String(value);
    case "number": {
      if (value === "" || value == null) return null;
      const n = Number(value);
      return Number.isFinite(n) ? n : null;
    }
    case "checkbox":
      return Boolean(value);
    case "select":
      return options.includes(value) ? value : null;
    case "date": {
      // Expect YYYY-MM-DD
      if (!value) return "";
      const s = String(value).slice(0, 10);
      // rudimentary check
      return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : "";
    }
    default:
      return value;
  }
};

const normalizeForSort = (val: any) => {
  if (val == null) return "";
  if (typeof val === "number") return val;
  return String(val).toLowerCase();
};

const debounce = (fn: Function, ms = 300) => {
  let t: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};

// ----------------- component -----------------
export default function NotionTable({
  columns: columnsProp,
  rows: rowsProp,
  storageKey,
  onChange,
  className,
  style,
}: NotionTableProps) {
  // ---- initial state bootstrap (localStorage > props > default) ----
  const loadFromStorage = () => {
    if (!storageKey) return null;
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const saved = useMemo(loadFromStorage, [storageKey]);

  const [columns, setColumns] = useState<Column[]>(() => {
    if (saved?.columns) return saved.columns;
    if (columnsProp?.length) return columnsProp;
    return [
      { id: uid(), name: "Name", type: "text" },
      { id: uid(), name: "Tags", type: "select", options: ["Todo", "Doing", "Done"] },
      { id: uid(), name: "Due", type: "date" },
      { id: uid(), name: "Priority", type: "number" },
      { id: uid(), name: "Done", type: "checkbox" },
    ];
  });

  const [rows, setRows] = useState<Row[]>(() => {
    if (saved?.rows) return saved.rows;
    if (rowsProp?.length) return rowsProp;
    return [
      {
        id: uid(),
        values: {
          [columns[0].id]: "Sample task",
          [columns[1].id]: "Todo",
          [columns[2].id]: "",
          [columns[3].id]: 1,
          [columns[4].id]: false,
        },
      },
    ];
  });

  // If props change, update state
    useEffect(() => {
        if(columnsProp) setColumns(columnsProp);
    }, [columnsProp]);

    useEffect(() => {
        if(rowsProp) setRows(rowsProp);
    }, [rowsProp]);


  const [sortBy, setSortBy] = useState<{ columnId: string; dir: 'asc'|'desc' } | null>(null);
  const [filter, setFilter] = useState("");

  // ---- persistence and change hook ----
  const emitChange = useMemo(
    () =>
      debounce((state: NotionTableData) => {
        if (onChange) onChange(state);
      }, 300),
    [onChange]
  );

  useEffect(() => {
    const state = { columns, rows };
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(state));
      } catch {}
    }
    emitChange(state);
  }, [columns, rows, storageKey, emitChange]);

  // ---- computed rows (filter + sort) ----
  const displayedRows = useMemo(() => {
    let out = rows;
    if (filter.trim()) {
      const f = filter.toLowerCase();
      out = out.filter((r) =>
        columns.some((c) => {
          const v = r.values[c.id];
          if (v == null) return false;
          return String(v).toLowerCase().includes(f);
        })
      );
    }
    if (sortBy?.columnId) {
      const c = columns.find((x) => x.id === sortBy.columnId);
      if (c) {
        const dir = sortBy.dir === "desc" ? -1 : 1;
        out = [...out].sort((a, b) => {
          const av = normalizeForSort(a.values[c.id]);
          const bv = normalizeForSort(b.values[c.id]);
          if (av < bv) return -1 * dir;
          if (av > bv) return 1 * dir;
          return 0;
        });
      }
    }
    return out;
  }, [rows, columns, filter, sortBy]);

  // ---- row and column ops ----
  const addRow = () => {
    const values: Record<string, any> = {};
    columns.forEach((c) => {
      values[c.id] = defaultValueForType(c.type);
    });
    setRows((r) => [...r, { id: uid(), values }]);
  };

  const deleteRow = (rowId: string) => {
    setRows((r) => r.filter((x) => x.id !== rowId));
  };

  const updateCell = (rowId: string, columnId: string, value: any) => {
    setRows((rs) =>
      rs.map((r) => {
        if (r.id !== rowId) return r;
        return { ...r, values: { ...r.values, [columnId]: value } };
      })
    );
  };

  const toggleSort = (columnId: string) => {
    setSortBy((s) => {
      if (!s || s.columnId !== columnId) return { columnId, dir: "asc" };
      if (s.dir === "asc") return { columnId, dir: "desc" };
      return null;
    });
  };

  const addColumn = (type: Column['type'] = "text") => {
    const id = uid();
    const name = type === "text" ? "Text" : type.charAt(0).toUpperCase() + type.slice(1);
    const newCol: Column = { id, name, type, ...(type === "select" ? { options: ["Option A", "Option B"] } : {}) };
    setColumns((cs) => [...cs, newCol]);
    // initialize values for existing rows
    setRows((rs) =>
      rs.map((r) => ({
        ...r,
        values: { ...r.values, [id]: defaultValueForType(type) },
      }))
    );
  };

  const deleteColumn = (columnId: string) => {
    setColumns((cs) => cs.filter((c) => c.id !== columnId));
    setRows((rs) =>
      rs.map((r) => {
        const nv = { ...r.values };
        delete nv[columnId];
        return { ...r, values: nv };
      })
    );
    if (sortBy?.columnId === columnId) setSortBy(null);
  };

  const renameColumn = (columnId: string, name: string) => {
    setColumns((cs) => cs.map((c) => (c.id === columnId ? { ...c, name } : c)));
  };

  const changeColumnType = (columnId: string, type: Column['type']) => {
    setColumns((cs) =>
      cs.map((c) =>
        c.id === columnId
          ? { ...c, type, ...(type === "select" && !c.options ? { options: ["Option A", "Option B"] } : {}) }
          : c
      )
    );
    // coerce existing values
    const col = columns.find((c) => c.id === columnId);
    const options = (col && col.options) || [];
    setRows((rs) =>
      rs.map((r) => ({
        ...r,
        values: { ...r.values, [columnId]: coerceValue(r.values[columnId], type, options) },
      }))
    );
  };

  const updateSelectOptions = (columnId: string, nextOptions: string[]) => {
    setColumns((cs) =>
      cs.map((c) => (c.id === columnId ? { ...c, options: nextOptions } : c))
    );
    // cleanup values not in options
    setRows((rs) =>
      rs.map((r) => {
        const v = r.values[columnId];
        return {
          ...r,
          values: { ...r.values, [columnId]: nextOptions.includes(v) ? v : null },
        };
      })
    );
  };

  // ---- column header menu state ----
  const [openMenu, setOpenMenu] = useState<string | null>(null); // columnId | null
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);

  // ---- render ----
  return (
    <div className={`nt__wrap ${className || ""}`} style={style}>
      <div className="nt__toolbar">
        <div className="nt__search">
          <Input
            placeholder="Filter table..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="nt__controls">
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline"><Plus className="mr-2 h-4 w-4" /> Add Column</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => addColumn("text")}>Text</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addColumn("number")}>Number</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addColumn("checkbox")}>Checkbox</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addColumn("select")}>Select</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addColumn("date")}>Date</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

          <Button onClick={addRow}><Plus className="mr-2 h-4 w-4" /> New</Button>
        </div>
      </div>

      <div className="nt__table">
        <div className="nt__thead">
          <div className="nt__tr">
            {columns.map((c) => (
              <div key={c.id} className="nt__th">
                <div className="nt__thInner">
                  <input
                    className="nt__thName"
                    value={c.name}
                    onChange={(e) => renameColumn(c.id, e.target.value)}
                  />
                  <div className="nt__thActions">
                    <button
                      className="nt__iconBtn"
                      title="Sort"
                      onClick={() => toggleSort(c.id)}
                    >
                      {sortBy?.columnId === c.id ? (sortBy.dir === "asc" ? "▲" : "▼") : "↕"}
                    </button>
                    <button
                      className="nt__iconBtn"
                      title="Column settings"
                      onClick={() => setOpenMenu((m) => (m === c.id ? null : c.id))}
                    >
                      ⚙
                    </button>
                  </div>
                </div>
                {openMenu === c.id && (
                  <div className="nt__menu" ref={menuRef}>
                    <div className="nt__menuRow">
                      <label>Type</label>
                      <select
                        value={c.type}
                        onChange={(e) => changeColumnType(c.id, e.target.value as Column['type'])}
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="select">Select</option>
                        <option value="date">Date</option>
                      </select>
                    </div>
                    {c.type === "select" && (
                      <div className="nt__menuRow">
                        <label>Options</label>
                        <SelectOptionsEditor
                          options={c.options || []}
                          onChange={(opts: string[]) => updateSelectOptions(c.id, opts)}
                        />
                      </div>
                    )}
                    <div className="nt__menuDivider" />
                    <button className="nt__danger" onClick={() => deleteColumn(c.id)}>
                      Delete column
                    </button>
                  </div>
                )}
              </div>
            ))}
            <div className="nt__th nt__th--ghost" />
          </div>
        </div>

        <div className="nt__tbody">
          {displayedRows.map((r) => (
            <div key={r.id} className="nt__tr">
              {columns.map((c) => (
                <div key={c.id} className="nt__td">
                  <CellEditor
                    type={c.type}
                    options={c.options}
                    value={r.values[c.id]}
                    onChange={(v: any) => updateCell(r.id, c.id, coerceValue(v, c.type, c.options))}
                  />
                </div>
              ))}
              <div className="nt__td nt__td--actions">
                <button className="nt__iconBtn" title="Delete row" onClick={() => deleteRow(r.id)}>
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>

        {!displayedRows.length && (
          <div className="nt__empty">
            No rows match your filter.
            <button className="nt__btnLink" onClick={addRow}>Add a row</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------- cell editors -----------------
function CellEditor({ type, value, onChange, options = [] }: {type: Column['type'], value: any, onChange: (v: any) => void, options?: string[]}) {
  switch (type) {
    case "text":
      return (
        <input
          className="nt__cellInput"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type..."
        />
      );
    case "number":
      return (
        <input
          className="nt__cellInput"
          type="number"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
          placeholder="0"
        />
      );
    case "checkbox":
      return (
        <div className="nt__cellCheckbox">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
          />
        </div>
      );
    case "select":
      return (
        <select
          className="nt__cellSelect"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value || null)}
        >
          <option value="">—</option>
          {(options || []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    case "date":
      return (
        <input
          className="nt__cellInput"
          type="date"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    default:
      return <span>{String(value ?? "")}</span>;
  }
}

// ----------------- select options editor -----------------
function SelectOptionsEditor({ options, onChange }: {options: string[], onChange: (opts: string[]) => void}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const v = draft.trim();
    if (!v) return;
    if (options.includes(v)) {
      setDraft("");
      return;
    }
    onChange([...options, v]);
    setDraft("");
  };
  const remove = (opt: string) => {
    onChange(options.filter((o) => o !== opt));
  };

  return (
    <div className="nt__optEditor">
      <div className="nt__optList">
        {options.map((o) => (
          <span key={o} className="nt__optChip">
            {o}
            <button className="nt__chipX" onClick={() => remove(o)}>×</button>
          </span>
        ))}
      </div>
      <div className="nt__optAdd">
        <input
          value={draft}
          placeholder="New option"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") add();
          }}
        />
        <button onClick={add}>Add</button>
      </div>
    </div>
  );
}
