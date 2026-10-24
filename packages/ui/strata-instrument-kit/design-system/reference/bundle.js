/* @ds-bundle: {"format":4,"namespace":"Strata","components":[{"name":"Card"},{"name":"Field"},{"name":"Input"},{"name":"TextArea"},{"name":"NumberInput"},{"name":"Select"},{"name":"MultiSelect"},{"name":"Chip"},{"name":"DatePicker"},{"name":"Button"}]} */
(function () {
  "use strict";
  var React = window.React;
  var h = React.createElement, useState = React.useState, useRef = React.useRef, useEffect = React.useEffect;
  function cx() { var o = []; for (var i = 0; i < arguments.length; i++) if (arguments[i]) o.push(arguments[i]); return o.join(" "); }
  function attr(b) { return b ? "" : undefined; }

  /* Line icons: 14px, 1.5 stroke, currentColor — stand-ins for Lucide */
  var P = {
    chevronDown: "M4.5 6.5L8 10l3.5-3.5", chevronUpDown: "M5 6l3-3 3 3M5 10l3 3 3-3", chevronLeft: "M10 4L6 8l4 4", chevronRight: "M6 4l4 4-4 4", check: "M3.5 8.5l3 3 6-7",
    x: "M4.5 4.5l7 7M11.5 4.5l-7 7", plus: "M8 3.5v9M3.5 8h9", minus: "M3.5 8h9", up: "M4 10l4-4 4 4", down: "M4 6l4 4 4-4",
    search: "M7 12A5 5 0 1 0 7 2a5 5 0 0 0 0 10zM14 14l-3.5-3.5", calendar: "M2.5 4.5h11v9h-11zM2.5 7.5h11M5.5 2.5v3M10.5 2.5v3",
    alert: "M8 5v3.5M8 11v.01M8 14.5A6.5 6.5 0 1 0 8 1.5a6.5 6.5 0 0 0 0 13z", branch: "M5 3v10M11 3v3a3 3 0 0 1-3 3H5M11 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
    cmd: "M6 6V4.5A1.5 1.5 0 1 0 4.5 6H11.5A1.5 1.5 0 1 0 10 4.5V11.5A1.5 1.5 0 1 0 11.5 10H4.5A1.5 1.5 0 1 0 6 11.5z", dots: "M4 8h.01M8 8h.01M12 8h.01"
  };
  function Icon(p) {
    return h("svg", { className: p.small ? "st-icon-sm" : "st-icon", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, style: p.style }, h("path", { d: P[p.name] || "" }));
  }
  function Kbd(p) { return h("kbd", { className: "st-kbd" }, p.children); }

  /* Status meter: four segments fill as work moves right; blocked shows ✕ */
  var TONE_FILL = { neutral: 0, info: 2, review: 3, success: 4, warning: 2 };
  function Status(p) {
    var tone = p.tone || "neutral", n = p.progress != null ? p.progress : TONE_FILL[tone], segs = [];
    if (tone === "danger") return h("span", { className: "st-status st-status-danger" }, h(Icon, { name: "x", small: true }), p.children);
    for (var i = 0; i < 4; i++) segs.push(h("i", { key: i, "data-on": attr(i < n) }));
    return h("span", { className: "st-status st-status-" + tone }, h("span", { className: "st-meter", "aria-hidden": true }, segs), p.children);
  }
  var PRIO = { highest: "P0", high: "P1", medium: "P2", low: "P3", lowest: "P4" };
  function Prio(p) { return h("span", { className: "st-prio", style: { color: "var(--priority-" + p.level + ")" }, title: p.level + " priority" }, PRIO[p.level]); }

  function useOutside(ref, open, close) {
    useEffect(function () {
      if (!open) return;
      function on(e) { if (ref.current && !ref.current.contains(e.target)) close(); }
      function key(e) { if (e.key === "Escape") close(); }
      document.addEventListener("mousedown", on); document.addEventListener("keydown", key);
      return function () { document.removeEventListener("mousedown", on); document.removeEventListener("keydown", key); };
    }, [open]);
  }

  /* Button — optional shortcut hint */
  function Button(p) {
    var v = p.variant || "secondary", s = p.size || "md";
    var rest = Object.assign({}, p); ["variant", "size", "icon", "iconOnly", "className", "shortcut"].forEach(function (k) { delete rest[k]; });
    return h("button", Object.assign({ type: "button", "aria-keyshortcuts": p.shortcut }, rest, { className: cx("st-btn", "st-btn-" + v, s !== "md" && "st-btn-" + s, p.iconOnly && "st-btn-icon", p.className) }),
      p.icon && h(Icon, { name: p.icon }), p.iconOnly ? h("span", { className: "st-sr" }, p.children) : p.children, p.shortcut && !p.iconOnly && h(Kbd, null, p.shortcut));
  }

  /* Field */
  function Field(p) {
    return h("div", { className: "st-field", "data-invalid": attr(p.error), style: p.style },
      p.label && h("label", { className: "st-label", htmlFor: p.htmlFor }, h("span", { className: p.scrub ? "st-scrub" : null, title: p.scrub ? "Drag to change" : null }, p.label), p.required && h("span", { className: "st-req", "aria-hidden": true }, "*"), p.scrub && h("span", { "aria-hidden": true }, "↔")),
      p.children,
      p.error ? h("div", { className: "st-error", role: "alert" }, h(Icon, { name: "alert", small: true }), p.error)
        : p.description && h("div", { className: "st-desc" }, p.description));
  }

  /* Input */
  function Input(p) {
    var size = p.size || "md";
    return h("div", { className: cx("st-control", size !== "md" && "st-control-" + size), "data-invalid": attr(p.invalid), "data-disabled": attr(p.disabled) },
      p.prefix && h("span", { className: "st-prefix" }, p.prefix),
      p.leadingIcon && h(Icon, { name: p.leadingIcon }),
      h("input", { className: cx("st-native", p.mono && "st-mono-input"), id: p.id, type: p.type || "text", placeholder: p.placeholder, defaultValue: p.defaultValue, value: p.value, onChange: p.onChange, disabled: p.disabled, "aria-invalid": p.invalid || undefined }),
      p.shortcut && h(Kbd, null, p.shortcut), p.trailing);
  }

  /* TextArea — writing surface + status bar */
  function TextArea(p) {
    var st = useState(p.defaultValue || ""), v = st[0], set = st[1];
    var over = p.maxLength && v.length > p.maxLength;
    return h("div", { className: "st-control st-textarea", "data-invalid": attr(p.invalid || over), "data-disabled": attr(p.disabled) },
      h("textarea", { className: "st-native", id: p.id, rows: p.rows || 4, placeholder: p.placeholder, value: v, disabled: p.disabled, onChange: function (e) { set(e.target.value); } }),
      h("div", { className: "st-ta-bar" }, h("span", { className: "st-counter" }, p.markdown !== false ? "MD" : ""), h("span", { className: "st-spacer" }),
        p.maxLength ? h("span", { className: "st-counter", "data-over": attr(over) }, v.length + "/" + p.maxLength) : h("span", { className: "st-counter" }, v.length + " chars"),
        p.submitHint && h("span", { className: "st-counter" }, h(Kbd, null, "⌘↵"), " ", p.submitHint)));
  }

  /* NumberInput — mono figure, vertical stepper rack */
  function NumberInput(p) {
    var step = p.step || 1, min = p.min, max = p.max;
    var st = useState(p.defaultValue == null ? null : p.defaultValue), v = st[0], set = st[1];
    function clamp(n) { if (min != null && n < min) n = min; if (max != null && n > max) n = max; return Math.round(n * 1000) / 1000; }
    function bump(d) { set(clamp((v == null ? (min != null ? min : 0) : v) + d * step)); }
    return h("div", { className: cx("st-control st-number", p.size === "lg" && "st-control-lg"), "data-invalid": attr(p.invalid), "data-disabled": attr(p.disabled) },
      h("input", { className: "st-native", id: p.id, inputMode: "decimal", placeholder: p.placeholder, disabled: p.disabled, value: v == null ? "" : String(v),
        onChange: function (e) { var t = e.target.value.replace(/[^0-9.\-]/g, ""); set(t === "" ? null : (isNaN(+t) ? v : +t)); },
        onKeyDown: function (e) { var m = e.shiftKey ? 10 : 1; if (e.key === "ArrowUp") { e.preventDefault(); bump(m); } if (e.key === "ArrowDown") { e.preventDefault(); bump(-m); } } }),
      p.unit && h("span", { className: "st-unit" }, p.unit),
      h("span", { className: "st-rack" },
        h("button", { type: "button", className: "st-step", "aria-label": "Increase", tabIndex: -1, disabled: p.disabled || (max != null && v != null && v >= max), onClick: function () { bump(1); } }, h(Icon, { name: "up" })),
        h("button", { type: "button", className: "st-step", "aria-label": "Decrease", tabIndex: -1, disabled: p.disabled || (min != null && v != null && v <= min), onClick: function () { bump(-1); } }, h(Icon, { name: "down" }))));
  }

  function OptionLead(o) {
    if (o.status) return h(Status, { tone: o.status, progress: o.progress });
    if (o.avatar) return h("span", { className: "st-who" }, o.avatar);
    return null;
  }
  function PopFoot(p) {
    return h("div", { className: "st-popup-foot" },
      h("span", { className: "st-hint" }, h(Kbd, null, "↑↓"), "move"), h("span", { className: "st-hint" }, h(Kbd, null, "↵"), p.enter || "select"),
      h("span", { className: "st-spacer" }), p.right ? h("span", { className: "st-hint" }, p.right) : h("span", { className: "st-hint" }, h(Kbd, null, "esc")));
  }

  /* Select — options carry number shortcuts 1–9 */
  function Select(p) {
    var ref = useRef(null);
    var so = useState(!!p.defaultOpen), open = so[0], setOpen = so[1];
    var sv = useState(p.defaultValue), val = sv[0], setVal = sv[1];
    var sh = useState(p.defaultValue), hi = sh[0], setHi = sh[1];
    useOutside(ref, open, function () { setOpen(false); });
    var opts = p.options || [], cur = opts.filter(function (o) { return o.value === val; })[0];
    function pick(o) { if (!o || o.disabled) return; setVal(o.value); setOpen(false); }
    function onKey(e) {
      var en = opts.filter(function (o) { return !o.disabled; }), i = en.map(function (o) { return o.value; }).indexOf(hi);
      if (e.key === "ArrowDown") { e.preventDefault(); if (!open) setOpen(true); setHi((en[Math.min(i + 1, en.length - 1)] || {}).value); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setHi((en[Math.max(i - 1, 0)] || {}).value); }
      else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (open && hi != null) pick(opts.filter(function (o) { return o.value === hi; })[0]); else setOpen(true); }
      else if (open && /^[1-9]$/.test(e.key)) { e.preventDefault(); pick(opts[+e.key - 1]); }
    }
    return h("div", { className: "st-anchor", ref: ref },
      h("button", { type: "button", id: p.id, className: cx("st-control st-trigger", p.size === "sm" && "st-control-sm", p.size === "lg" && "st-control-lg"), "data-popup-open": attr(open), "data-invalid": attr(p.invalid), "data-disabled": attr(p.disabled), disabled: p.disabled,
        "aria-haspopup": "listbox", "aria-expanded": open, onClick: function () { setOpen(!open); }, onKeyDown: onKey },
        h("span", { className: "st-value" }, cur ? (cur.status ? h(Status, { tone: cur.status, progress: cur.progress }, cur.label) : [OptionLead(cur), h("span", { key: "l" }, cur.label)]) : h("span", { className: "st-placeholder" }, p.placeholder || "Select…")),
        p.shortcut && !open && h(Kbd, null, p.shortcut),
        h("span", { className: "st-chev" }, h(Icon, { name: "chevronUpDown" }))),
      open && h("div", { className: "st-popup", role: "listbox" },
        h("div", { className: "st-popup-list" }, opts.map(function (o, i) {
          var sel = o.value === val;
          return h("div", { key: o.value, role: "option", "aria-selected": sel, className: "st-option", "data-selected": attr(sel), "data-highlighted": attr(o.value === hi), "data-disabled": attr(o.disabled),
            onMouseEnter: function () { if (!o.disabled) setHi(o.value); }, onMouseDown: function (e) { e.preventDefault(); pick(o); } },
            o.status ? h(Status, { tone: o.status, progress: o.progress }) : OptionLead(o), h("span", null, o.label),
            h("span", { className: "st-end" }, o.description && h("span", { className: "st-opt-desc" }, o.description), sel && h(Icon, { name: "check" }), i < 9 && h(Kbd, null, i + 1)));
        })),
        h(PopFoot, { right: h(React.Fragment, null, h(Kbd, null, "1–" + Math.min(opts.length, 9)), "jump") })));
  }

  /* Chip — status meter, tag, removable token, or filter segment */
  function Chip(p) {
    var tone = p.tone || "neutral", s = useState(!!p.defaultPressed);
    if (p.toggle) return h("button", { type: "button", className: "st-chip-toggle", "aria-pressed": s[0], onClick: function () { s[1](!s[0]); } }, p.children, p.count != null && h("span", { className: "st-count" }, " " + p.count));
    if (p.status || p.dot) return h(Status, { tone: tone, progress: p.progress }, p.children);
    return h("span", { className: cx("st-chip", "st-chip-" + tone, p.size === "md" && "st-chip-md") },
      p.avatar && h("span", { className: "st-who", style: { width: 14, height: 14, lineHeight: "14px", fontSize: 7 } }, p.avatar),
      h("span", { style: { overflow: "hidden", textOverflow: "ellipsis" } }, p.children),
      p.onRemove && h("button", { type: "button", className: "st-chip-remove", "aria-label": "Remove " + p.children, onMouseDown: function (e) { e.stopPropagation(); }, onClick: function (e) { e.stopPropagation(); p.onRemove(); } }, h(Icon, { name: "x", small: true })));
  }

  /* MultiSelect */
  function MultiSelect(p) {
    var ref = useRef(null), inp = useRef(null);
    var so = useState(!!p.defaultOpen), open = so[0], setOpen = so[1];
    var sv = useState(p.defaultValue || []), val = sv[0], setVal = sv[1];
    var sq = useState(""), q = sq[0], setQ = sq[1];
    var sh = useState(null), hi = sh[0], setHi = sh[1];
    useOutside(ref, open, function () { setOpen(false); setQ(""); });
    var opts = p.options || [], byV = {}; opts.forEach(function (o) { byV[o.value] = o; });
    var shown = opts.filter(function (o) { return !q || o.label.toLowerCase().indexOf(q.toLowerCase()) >= 0; });
    var hv = hi != null ? hi : (shown[0] || {}).value;
    function toggle(v) { setVal(val.indexOf(v) >= 0 ? val.filter(function (x) { return x !== v; }) : val.concat([v])); }
    function onKey(e) {
      var i = shown.map(function (o) { return o.value; }).indexOf(hv);
      if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setHi((shown[Math.min(i + 1, shown.length - 1)] || {}).value); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setHi((shown[Math.max(i - 1, 0)] || {}).value); }
      else if (e.key === "Enter" && open && hv != null) { e.preventDefault(); toggle(hv); setQ(""); }
      else if (e.key === "Backspace" && !q && val.length) setVal(val.slice(0, -1));
    }
    return h("div", { className: "st-anchor", ref: ref },
      h("div", { className: cx("st-control st-multi", p.size === "lg" && "st-control-lg"), "data-popup-open": attr(open), "data-invalid": attr(p.invalid), onClick: function () { setOpen(true); inp.current && inp.current.focus(); } },
        val.map(function (v) { var o = byV[v] || { label: v }; return h(Chip, { key: v, tone: p.chipTone || "neutral", avatar: o.avatar, onRemove: function () { toggle(v); } }, o.label); }),
        h("input", { ref: inp, id: p.id, className: "st-native", value: q, placeholder: val.length ? "" : (p.placeholder || "Select…"), role: "combobox", "aria-expanded": open,
          onChange: function (e) { setQ(e.target.value); setOpen(true); setHi(null); }, onFocus: function () { setOpen(true); }, onKeyDown: onKey }),
        h("span", { className: "st-chev" }, h(Icon, { name: "chevronUpDown" }))),
      open && h("div", { className: "st-popup", role: "listbox", "aria-multiselectable": true },
        h("div", { className: "st-popup-list" }, shown.length ? shown.map(function (o) {
          var sel = val.indexOf(o.value) >= 0;
          return h("div", { key: o.value, role: "option", "aria-selected": sel, className: "st-option", "data-selected": attr(sel), "data-highlighted": attr(o.value === hv),
            onMouseEnter: function () { setHi(o.value); }, onMouseDown: function (e) { e.preventDefault(); toggle(o.value); } },
            h("span", { className: "st-box" }, sel && h(Icon, { name: "check", small: true })), OptionLead(o), h("span", null, o.label), o.description && h("span", { className: "st-end" }, h("span", { className: "st-opt-desc" }, o.description)));
        }) : h("div", { className: "st-empty" }, "0 results for “" + q + "”")),
        h(PopFoot, { enter: "toggle", right: val.length + " selected" })));
  }

  /* Card — issue card or panel */
  var STATUS_LABEL = { neutral: "To do", info: "In progress", review: "In review", success: "Done", danger: "Blocked", warning: "At risk" };
  function Card(p) {
    if (p.variant === "issue") {
      return h("article", { className: "st-card st-issue", tabIndex: 0, "data-selected": attr(p.selected) },
        h("div", { className: "st-issue-top" }, h("span", { className: "st-meta" }, p.issueKey), p.labels && p.labels.map(function (l) { return h(Chip, { key: l, tone: "outline" }, l); }), h("span", { className: "st-spacer" }), p.priority && h(Prio, { level: p.priority })),
        h("p", { className: "st-issue-title" }, p.title),
        h("div", { className: "st-issue-meta" },
          p.status && h(Status, { tone: p.status }, STATUS_LABEL[p.status]),
          h("span", { className: "st-spacer" }),
          p.due && h("span", { className: "st-due", "data-over": attr(p.dueState === "over"), "data-soon": attr(p.dueState === "soon") }, p.due),
          p.points != null && h("span", { className: "st-meta", title: "Story points" }, p.points + "pt"),
          p.assignee && h("span", { className: "st-who", title: p.assignee }, p.assignee)));
    }
    return h("section", { className: "st-card", style: p.style },
      (p.title || p.actions) && h("header", { className: "st-panel-head" }, h("h3", null, p.title), p.actions),
      p.children && h("div", { className: "st-card-body" }, p.children),
      p.footer && h("footer", { className: "st-card-footer" }, p.footer));
  }

  /* DatePicker — type a date ("fri", "+3d", "next mon") or pick one */
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var DOW = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"], DNAMES = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  function day0(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function same(a, b) { return a && b && +day0(a) === +day0(b); }
  function iso(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function fmt(d) { return d ? String(d.getDate()).padStart(2, "0") + " " + MONTHS[d.getMonth()].slice(0, 3) + " " + d.getFullYear() : ""; }
  function rel(d, today) { var n = Math.round((day0(d) - day0(today)) / 864e5); return n === 0 ? "today" : n > 0 ? "T-" + n + "D" : Math.abs(n) + "D OVER"; }
  function parse(s, today) {
    s = s.trim().toLowerCase(); var t = day0(today), m;
    if (!s) return null;
    if (s === "today" || s === "tod") return t;
    if (s === "tomorrow" || s === "tom") return new Date(t.getFullYear(), t.getMonth(), t.getDate() + 1);
    if ((m = /^\+(\d+)\s*([dw])$/.exec(s))) return new Date(t.getFullYear(), t.getMonth(), t.getDate() + (+m[1]) * (m[2] === "w" ? 7 : 1));
    if ((m = /^(next\s+)?(sun|mon|tue|wed|thu|fri|sat)/.exec(s))) { var k = DNAMES.indexOf(m[2]), diff = (k - t.getDay() + 7) % 7 || 7; if (m[1]) diff += diff < 7 ? 7 : 0; return new Date(t.getFullYear(), t.getMonth(), t.getDate() + diff); }
    if ((m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s))) return new Date(+m[1], +m[2] - 1, +m[3]);
    return null;
  }
  function DatePicker(p) {
    var ref = useRef(null);
    var today = p.today ? new Date(p.today) : new Date();
    var init = p.defaultValue ? new Date(p.defaultValue) : null;
    var so = useState(!!p.defaultOpen), open = so[0], setOpen = so[1];
    var sv = useState(init), val = sv[0], setVal = sv[1];
    var sq = useState(p.defaultQuery || ""), q = sq[0], setQ = sq[1];
    var base = init || today, sm = useState(new Date(base.getFullYear(), base.getMonth(), 1)), month = sm[0], setMonth = sm[1];
    useOutside(ref, open, function () { setOpen(false); });
    var parsed = parse(q, today);
    var first = new Date(month.getFullYear(), month.getMonth(), 1), off = (first.getDay() + 6) % 7, days = [];
    for (var i = 0; i < 42; i++) days.push(new Date(month.getFullYear(), month.getMonth(), 1 - off + i));
    if (days[35].getMonth() !== month.getMonth()) days = days.slice(0, 35);
    var over = val && day0(val) < day0(today);
    function choose(d) { setVal(d); setQ(""); setOpen(false); }
    return h("div", { className: "st-anchor", ref: ref },
      h("button", { type: "button", id: p.id, className: cx("st-control st-trigger", p.size === "lg" && "st-control-lg"), "data-popup-open": attr(open), "data-invalid": attr(p.invalid), "aria-haspopup": "dialog", "aria-expanded": open, onClick: function () { setOpen(!open); } },
        h(Icon, { name: "calendar", style: { color: over && p.dueStyle ? "var(--danger)" : "var(--ink-muted)" } }),
        h("span", { className: "st-value" }, val ? h("span", { className: "st-mono-input" }, fmt(val)) : h("span", { className: "st-placeholder" }, p.placeholder || "Pick or type a date")),
        val && h("span", { className: "st-rel", "data-over": attr(over && p.dueStyle) }, rel(val, today)),
        !val && p.shortcut && h(Kbd, null, p.shortcut)),
      open && h("div", { className: "st-popup st-cal", role: "dialog", "aria-label": "Choose date" },
        h("div", { className: "st-nl" }, h(Icon, { name: "search", small: true, style: { color: "var(--ink-muted)" } }),
          h("input", { value: q, autoFocus: !p.defaultOpen, placeholder: "fri, +3d, next mon, 2026-11-02", "aria-label": "Type a date", onChange: function (e) { setQ(e.target.value); var d = parse(e.target.value, today); if (d) setMonth(new Date(d.getFullYear(), d.getMonth(), 1)); },
            onKeyDown: function (e) { if (e.key === "Enter" && parsed) { e.preventDefault(); choose(parsed); } } }),
          parsed ? h("span", { className: "st-parsed" }, "→ " + fmt(parsed).slice(0, 6) + " ↵") : h(Kbd, null, "↵")),
        h("div", { className: "st-cal-body" },
          h("div", { className: "st-cal-head" },
            h("span", { className: "st-cal-title", "aria-live": "polite" }, MONTHS[month.getMonth()].slice(0, 3) + " " + month.getFullYear()),
            h("span", null,
              h(Button, { variant: "ghost", size: "sm", iconOnly: true, icon: "chevronLeft", onClick: function () { setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1)); } }, "Previous month"),
              h(Button, { variant: "ghost", size: "sm", iconOnly: true, icon: "chevronRight", onClick: function () { setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1)); } }, "Next month"))),
          h("div", { className: "st-cal-grid", role: "grid" },
            DOW.map(function (d) { return h("div", { key: d, className: "st-cal-dow", role: "columnheader" }, d); }),
            days.map(function (d) {
              var hit = same(d, val), prev = parsed && same(d, parsed) && !hit;
              return h("button", { key: +d, type: "button", className: "st-day", "data-outside": attr(d.getMonth() !== month.getMonth()), "data-today": attr(same(d, today)), "data-selected": attr(hit), "data-preview": attr(prev), "aria-pressed": !!hit,
                "aria-label": fmt(d) + (same(d, today) ? ", today" : ""), onClick: function () { choose(d); } }, d.getDate());
            }))),
        h(PopFoot, { enter: "set", right: h(React.Fragment, null, h(Kbd, null, "T"), "today") })));
  }

  var Strata = { Card: Card, Field: Field, Input: Input, TextArea: TextArea, NumberInput: NumberInput, Select: Select, MultiSelect: MultiSelect, Chip: Chip, DatePicker: DatePicker, Button: Button, Icon: Icon, Kbd: Kbd, Status: Status, Priority: Prio, parseDate: parse, iso: iso };
  window.Strata = Object.assign(window.Strata || {}, Strata);
})();
