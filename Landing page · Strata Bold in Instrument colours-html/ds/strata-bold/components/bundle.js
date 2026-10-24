/* @ds-bundle: {"format":4,"namespace":"SprintStack","components":[{"name":"Card"},{"name":"Field"},{"name":"Input"},{"name":"TextArea"},{"name":"NumberInput"},{"name":"Select"},{"name":"MultiSelect"},{"name":"Chip"},{"name":"DatePicker"},{"name":"Button"}]} */
(() => {
  'use strict';
  var React = window.React;
  var h = React.createElement,
    useState = React.useState,
    useRef = React.useRef,
    useEffect = React.useEffect;
  function cx() {
    var o = [];
    for (var i = 0; i < arguments.length; i++) if (arguments[i]) o.push(arguments[i]);
    return o.join(' ');
  }
  function attr(b) {
    return b ? '' : undefined;
  }

  /* Icons: 24px grid, 2px stroke, rounded — stand-ins for Lucide */
  var P = {
    chevronDown: 'M6 9l6 6 6-6',
    chevronLeft: 'M15 6l-6 6 6 6',
    chevronRight: 'M9 6l6 6-6 6',
    check: 'M5 12.5l4.5 4.5L19 7.5',
    x: 'M6 6l12 12M18 6L6 18',
    plus: 'M12 5v14M5 12h14',
    minus: 'M5 12h14',
    search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4',
    calendar: 'M4 6.5h16v13H4zM4 10.5h16M8 3.5v4M16 3.5v4',
    alert: 'M12 8v5M12 16v.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
    clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
    points: 'M4 7h16v12H4zM14 13h3M4 10h16',
    flag: 'M5 21V4M5 4h11l-2 4 2 4H5',
    bookmark: 'M7 4h10v16l-5-3.5L7 20z',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 20a7 7 0 0 1 14 0z',
    lines: 'M4 7h16M4 12h11M4 17h6',
    trash: 'M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13M10 11v6M14 11v6',
    up: 'M7 14l5-5 5 5',
    down: 'M7 10l5 5 5-5',
    sprint: 'M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4',
    arrow: 'M5 12h14M13 6l6 6-6 6',
  };
  function Icon(p) {
    return h(
      'svg',
      {
        className: p.small ? 'st-icon-sm' : 'st-icon',
        viewBox: '0 0 24 24',
        fill: p.fill ? 'currentColor' : 'none',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
        style: p.style,
      },
      h('path', { d: P[p.name] || '' }),
    );
  }

  /* Status badge — condensed caps on a tinted pill */
  var STATUS_LABEL = {
    neutral: 'To do',
    info: 'In progress',
    review: 'In review',
    success: 'Done',
    danger: 'Blocked',
    warning: 'At risk',
  };
  function Badge(p) {
    var tone = p.tone || 'neutral';
    return h('span', { className: 'st-badge st-badge-' + tone }, p.children || STATUS_LABEL[tone]);
  }
  var PRIO_ICON = { highest: 'up', high: 'up', medium: 'lines', low: 'down', lowest: 'down' };
  var PRIO_LABEL = {
    highest: 'Highest',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    lowest: 'Lowest',
  };
  function Prio(p) {
    return h(
      'span',
      { className: 'st-prio', 'data-level': p.level },
      h(Icon, { name: PRIO_ICON[p.level], small: true }),
      PRIO_LABEL[p.level],
    );
  }

  function useOutside(ref, open, close) {
    useEffect(() => {
      if (!open) return;
      function on(e) {
        if (ref.current && !ref.current.contains(e.target)) close();
      }
      function key(e) {
        if (e.key === 'Escape') close();
      }
      document.addEventListener('mousedown', on);
      document.addEventListener('keydown', key);
      return () => {
        document.removeEventListener('mousedown', on);
        document.removeEventListener('keydown', key);
      };
    }, [open]);
  }

  /* Button — pills; "link" renders the underlined red text action */
  function Button(p) {
    var v = p.variant || 'secondary',
      s = p.size || 'md';
    var rest = Object.assign({}, p);
    ['variant', 'size', 'icon', 'iconOnly', 'className', 'iconEnd'].forEach((k) => {
      delete rest[k];
    });
    if (v === 'link')
      return h(
        'button',
        Object.assign({ type: 'button' }, rest, { className: cx('st-link', p.className) }),
        p.children,
      );
    return h(
      'button',
      Object.assign({ type: 'button' }, rest, {
        className: cx(
          'st-btn',
          'st-btn-' + v,
          s !== 'md' && 'st-btn-' + s,
          p.iconOnly && 'st-btn-icon',
          p.className,
        ),
      }),
      p.icon && h(Icon, { name: p.icon }),
      p.iconOnly ? h('span', { className: 'st-sr' }, p.children) : p.children,
      p.iconEnd && h(Icon, { name: p.iconEnd }),
    );
  }

  /* Field */
  function Field(p) {
    return h(
      'div',
      { className: 'st-field', 'data-invalid': attr(p.error), style: p.style },
      p.label &&
        h(
          'label',
          { className: 'st-label', htmlFor: p.htmlFor },
          p.label,
          p.required && h('span', { className: 'st-req', 'aria-hidden': true }, '*'),
        ),
      p.children,
      p.error
        ? h('div', { className: 'st-error', role: 'alert' }, p.error)
        : p.description && h('div', { className: 'st-desc' }, p.description),
    );
  }

  /* Input */
  function Input(p) {
    return h(
      'div',
      {
        className: cx('st-control', p.size === 'sm' && 'st-control-sm'),
        'data-invalid': attr(p.invalid),
        'data-disabled': attr(p.disabled),
        style: p.pill ? { borderRadius: 9999, paddingRight: 6 } : null,
      },
      p.leadingIcon && h(Icon, { name: p.leadingIcon }),
      h('input', {
        className: 'st-native',
        id: p.id,
        type: p.type || 'text',
        placeholder: p.placeholder,
        defaultValue: p.defaultValue,
        value: p.value,
        onChange: p.onChange,
        disabled: p.disabled,
        'aria-invalid': p.invalid || undefined,
      }),
      p.trailing,
    );
  }

  /* TextArea */
  function TextArea(p) {
    var st = useState(p.defaultValue || ''),
      v = st[0],
      set = st[1];
    var over = p.maxLength && v.length > p.maxLength;
    return h(
      'div',
      {
        className: 'st-control st-textarea',
        'data-invalid': attr(p.invalid || over),
        'data-disabled': attr(p.disabled),
      },
      h('textarea', {
        className: 'st-native',
        id: p.id,
        rows: p.rows || 4,
        placeholder: p.placeholder,
        value: v,
        disabled: p.disabled,
        onChange: (e) => {
          set(e.target.value);
        },
      }),
      p.maxLength &&
        h(
          'span',
          { className: 'st-counter', 'data-over': attr(over) },
          v.length + ' / ' + p.maxLength,
        ),
    );
  }

  /* NumberInput — segmented [−] value [+] */
  function NumberInput(p) {
    var step = p.step || 1,
      min = p.min,
      max = p.max;
    var st = useState(p.defaultValue == null ? null : p.defaultValue),
      v = st[0],
      set = st[1];
    function clamp(n) {
      if (min != null && n < min) n = min;
      if (max != null && n > max) n = max;
      return Math.round(n * 1000) / 1000;
    }
    function bump(d) {
      set(clamp((v == null ? (min != null ? min : 0) : v) + d * step));
    }
    return h(
      'div',
      {
        className: 'st-control st-number',
        'data-invalid': attr(p.invalid),
        'data-disabled': attr(p.disabled),
      },
      h(
        'button',
        {
          type: 'button',
          className: 'st-step',
          'aria-label': 'Decrease',
          disabled: p.disabled || (min != null && v != null && v <= min),
          onClick: () => {
            bump(-1);
          },
        },
        h(Icon, { name: 'minus' }),
      ),
      h('input', {
        className: 'st-native',
        id: p.id,
        inputMode: 'decimal',
        placeholder: p.placeholder,
        disabled: p.disabled,
        value: v == null ? '' : String(v),
        onChange: (e) => {
          var t = e.target.value.replace(/[^0-9.-]/g, '');
          set(t === '' ? null : isNaN(+t) ? v : +t);
        },
        onKeyDown: (e) => {
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            bump(1);
          }
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            bump(-1);
          }
        },
      }),
      p.unit && h('span', { className: 'st-unit' }, p.unit),
      h(
        'button',
        {
          type: 'button',
          className: 'st-step',
          'aria-label': 'Increase',
          disabled: p.disabled || (max != null && v != null && v >= max),
          onClick: () => {
            bump(1);
          },
        },
        h(Icon, { name: 'plus' }),
      ),
    );
  }

  function OptionLead(o) {
    if (o.icon) return h(Icon, { name: o.icon });
    if (o.avatar) return h('span', { className: 'st-who' }, o.avatar);
    if (o.status) return h(Badge, { tone: o.status });
    return null;
  }

  /* Select — menu with icons, hairline dividers, red check */
  function Select(p) {
    var ref = useRef(null);
    var so = useState(!!p.defaultOpen),
      open = so[0],
      setOpen = so[1];
    var sv = useState(p.defaultValue),
      val = sv[0],
      setVal = sv[1];
    var sh = useState(p.defaultValue),
      hi = sh[0],
      setHi = sh[1];
    useOutside(ref, open, () => {
      setOpen(false);
    });
    var opts = p.options || [],
      cur = opts.filter((o) => o.value === val)[0];
    function pick(o) {
      if (!o || o.disabled) return;
      if (o.action) {
        o.action();
        setOpen(false);
        return;
      }
      setVal(o.value);
      setOpen(false);
    }
    function onKey(e) {
      var en = opts.filter((o) => !o.disabled),
        i = en.map((o) => o.value).indexOf(hi);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!open) setOpen(true);
        setHi((en[Math.min(i + 1, en.length - 1)] || {}).value);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHi((en[Math.max(i - 1, 0)] || {}).value);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (open && hi != null) pick(opts.filter((o) => o.value === hi)[0]);
        else setOpen(true);
      }
    }
    return h(
      'div',
      { className: 'st-anchor', ref: ref },
      h(
        'button',
        {
          type: 'button',
          id: p.id,
          className: cx('st-control st-trigger', p.size === 'sm' && 'st-control-sm'),
          'data-popup-open': attr(open),
          'data-invalid': attr(p.invalid),
          'data-disabled': attr(p.disabled),
          disabled: p.disabled,
          'aria-haspopup': 'listbox',
          'aria-expanded': open,
          onClick: () => {
            setOpen(!open);
          },
          onKeyDown: onKey,
        },
        h(
          'span',
          { className: 'st-value' },
          cur
            ? [
                h(React.Fragment, { key: 'i' }, OptionLead(cur)),
                cur.status ? null : h('span', { key: 'l' }, cur.label),
              ]
            : h('span', { className: 'st-placeholder' }, p.placeholder || 'Select…'),
        ),
        h('span', { className: 'st-caret' }),
      ),
      open &&
        h(
          'div',
          { className: 'st-popup', role: 'listbox' },
          opts.map((o) => {
            var sel = o.value === val;
            return h(
              'div',
              {
                key: o.value,
                role: 'option',
                'aria-selected': sel,
                className: 'st-option',
                'data-selected': attr(sel),
                'data-highlighted': attr(o.value === hi),
                'data-disabled': attr(o.disabled),
                'data-danger': attr(o.danger),
                onMouseEnter: () => {
                  if (!o.disabled) setHi(o.value);
                },
                onMouseDown: (e) => {
                  e.preventDefault();
                  pick(o);
                },
              },
              OptionLead(o),
              o.status ? null : h('span', null, o.label),
              o.description && h('span', { className: 'st-opt-desc' }, o.description),
              sel && h('span', { className: 'st-check' }, h(Icon, { name: 'check' })),
            );
          }),
        ),
    );
  }

  /* Chip — filter pill, value pill, removable, or status badge */
  function Chip(p) {
    var tone = p.tone || 'neutral',
      s = useState(!!p.defaultPressed);
    if (p.toggle)
      return h(
        'button',
        {
          type: 'button',
          className: 'st-chip st-chip-toggle',
          'aria-pressed': s[0],
          onClick: () => {
            s[1](!s[0]);
          },
        },
        p.children,
        p.count != null && h('span', { className: 'st-count' }, p.count),
      );
    if (p.dot || p.status) return h(Badge, { tone: tone }, p.children);
    return h(
      'span',
      {
        className: cx('st-chip', 'st-chip-' + tone, p.size !== 'md' && p.onRemove && 'st-chip-sm'),
      },
      p.avatar &&
        h(
          'span',
          {
            className: 'st-who',
            style: { width: 22, height: 22, lineHeight: '22px', fontSize: 10, marginLeft: -8 },
          },
          p.avatar,
        ),
      h('span', { style: { overflow: 'hidden', textOverflow: 'ellipsis' } }, p.children),
      p.onRemove &&
        h(
          'button',
          {
            type: 'button',
            className: 'st-chip-remove',
            'aria-label': 'Remove ' + p.children,
            onMouseDown: (e) => {
              e.stopPropagation();
            },
            onClick: (e) => {
              e.stopPropagation();
              p.onRemove();
            },
          },
          h(Icon, { name: 'x', small: true }),
        ),
    );
  }

  /* MultiSelect — ink pills in the field, checkbox menu */
  function MultiSelect(p) {
    var ref = useRef(null),
      inp = useRef(null);
    var so = useState(!!p.defaultOpen),
      open = so[0],
      setOpen = so[1];
    var sv = useState(p.defaultValue || []),
      val = sv[0],
      setVal = sv[1];
    var sq = useState(''),
      q = sq[0],
      setQ = sq[1];
    var sh = useState(null),
      hi = sh[0],
      setHi = sh[1];
    useOutside(ref, open, () => {
      setOpen(false);
      setQ('');
    });
    var opts = p.options || [],
      byV = {};
    opts.forEach((o) => {
      byV[o.value] = o;
    });
    var shown = opts.filter((o) => !q || o.label.toLowerCase().indexOf(q.toLowerCase()) >= 0);
    var hv = hi != null ? hi : (shown[0] || {}).value;
    function toggle(v) {
      setVal(val.indexOf(v) >= 0 ? val.filter((x) => x !== v) : val.concat([v]));
    }
    function onKey(e) {
      var i = shown.map((o) => o.value).indexOf(hv);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setOpen(true);
        setHi((shown[Math.min(i + 1, shown.length - 1)] || {}).value);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHi((shown[Math.max(i - 1, 0)] || {}).value);
      } else if (e.key === 'Enter' && open && hv != null) {
        e.preventDefault();
        toggle(hv);
        setQ('');
      } else if (e.key === 'Backspace' && !q && val.length) setVal(val.slice(0, -1));
    }
    return h(
      'div',
      { className: 'st-anchor', ref: ref },
      h(
        'div',
        {
          className: 'st-control st-multi',
          'data-popup-open': attr(open),
          'data-invalid': attr(p.invalid),
          onClick: () => {
            setOpen(true);
            inp.current && inp.current.focus();
          },
        },
        val.map((v) => {
          var o = byV[v] || { label: v };
          return h(
            Chip,
            {
              key: v,
              tone: p.chipTone || 'ink',
              onRemove: () => {
                toggle(v);
              },
            },
            o.label,
          );
        }),
        h('input', {
          ref: inp,
          id: p.id,
          className: 'st-native',
          value: q,
          placeholder: val.length ? '' : p.placeholder || 'Select…',
          role: 'combobox',
          'aria-expanded': open,
          onChange: (e) => {
            setQ(e.target.value);
            setOpen(true);
            setHi(null);
          },
          onFocus: () => {
            setOpen(true);
          },
          onKeyDown: onKey,
        }),
        h('span', { className: 'st-chev' }, h(Icon, { name: 'chevronDown' })),
      ),
      open &&
        h(
          'div',
          { className: 'st-popup', role: 'listbox', 'aria-multiselectable': true },
          shown.length
            ? shown.map((o) => {
                var sel = val.indexOf(o.value) >= 0;
                return h(
                  'div',
                  {
                    key: o.value,
                    role: 'option',
                    'aria-selected': sel,
                    className: 'st-option',
                    'data-selected': attr(sel),
                    'data-highlighted': attr(o.value === hv),
                    onMouseEnter: () => {
                      setHi(o.value);
                    },
                    onMouseDown: (e) => {
                      e.preventDefault();
                      toggle(o.value);
                    },
                  },
                  h(
                    'span',
                    { className: 'st-box' },
                    sel && h(Icon, { name: 'check', small: true }),
                  ),
                  OptionLead(o),
                  h('span', null, o.label),
                  o.description && h('span', { className: 'st-opt-desc' }, o.description),
                );
              })
            : h('div', { className: 'st-empty' }, 'No matches for “' + q + '”'),
        ),
    );
  }

  /* Card — panel, issue card, or solid tile */
  function Card(p) {
    var s = useState(!!p.watched);
    if (p.variant === 'tile') {
      return h(
        'section',
        { className: cx('st-tile', 'st-tile-' + (p.tone || 'brand')), style: p.style },
        p.eyebrow && h('span', { className: 'st-eyebrow' }, p.eyebrow),
        h('span', { style: { flex: 1 } }),
        p.children,
      );
    }
    if (p.variant === 'issue') {
      return h(
        'article',
        {
          className: 'st-card',
          tabIndex: 0,
          'data-interactive': '',
          'data-selected': attr(p.selected),
        },
        h(
          'div',
          { className: 'st-card-head' },
          p.status ? h(Badge, { tone: p.status }) : h('span', { className: 'st-meta' }, p.issueKey),
          h('span', { className: 'st-spacer' }),
          p.updated
            ? h('span', { className: 'st-meta' }, p.updated)
            : h(
                'button',
                {
                  type: 'button',
                  className: 'st-fav',
                  'aria-pressed': s[0],
                  'aria-label': s[0] ? 'Unwatch' : 'Watch',
                  onClick: (e) => {
                    e.stopPropagation();
                    s[1](!s[0]);
                  },
                },
                h(Icon, { name: 'bookmark', fill: s[0] }),
              ),
        ),
        h('h3', { className: 'st-card-title', style: { marginTop: 12 } }, p.title),
        h(
          'p',
          { className: 'st-issue-sub' },
          [p.status && p.issueKey, p.project].filter(Boolean).join(' · '),
        ),
        p.progress != null
          ? h(
              'div',
              {
                className: 'st-bar',
                role: 'progressbar',
                'aria-valuenow': p.progress,
                'aria-valuemin': 0,
                'aria-valuemax': 100,
                'aria-label': 'Subtasks done',
              },
              h('i', { style: { width: p.progress + '%' } }),
            )
          : h(
              'div',
              { className: 'st-issue-meta' },
              p.priority && h(Prio, { level: p.priority }),
              p.points != null &&
                h('span', null, h(Icon, { name: 'points', small: true }), p.points + ' pts'),
              p.due &&
                h(
                  'span',
                  { className: cx(p.overdue && 'st-overdue') },
                  h(Icon, { name: 'clock', small: true }),
                  p.due,
                ),
            ),
        p.progress == null &&
          h(
            'div',
            { className: 'st-card-footer' },
            p.assignee && h('span', { className: 'st-who' }, p.assignee),
            h('span', { className: 'st-meta' }, p.age || ''),
            h('span', { className: 'st-spacer' }),
            h(Button, { variant: 'link' }, p.linkLabel || 'View issue'),
          ),
      );
    }
    return h(
      'section',
      { className: 'st-card', style: p.style },
      (p.title || p.actions) &&
        h(
          'header',
          { className: 'st-card-head' },
          h('h3', { className: 'st-card-title' }, p.title),
          p.actions,
        ),
      p.children && h('div', { className: 'st-card-body' }, p.children),
      p.footer && h('footer', { className: 'st-card-footer' }, p.footer),
    );
  }

  /* DatePicker — round days, today ringed, selected in red; tap the title for months */
  var MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  var DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  function same(a, b) {
    return (
      a &&
      b &&
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }
  function fmt(d) {
    return d ? d.getDate() + ' ' + MONTHS[d.getMonth()].slice(0, 3) + ' ' + d.getFullYear() : '';
  }
  function DatePicker(p) {
    var ref = useRef(null);
    var today = p.today ? new Date(p.today) : new Date();
    var init = p.defaultValue ? new Date(p.defaultValue) : null;
    var so = useState(!!p.defaultOpen),
      open = so[0],
      setOpen = so[1];
    var sv = useState(init),
      val = sv[0],
      setVal = sv[1];
    var sw = useState(p.defaultView || 'days'),
      view = sw[0],
      setView = sw[1];
    var base = init || today,
      sm = useState(new Date(base.getFullYear(), base.getMonth(), 1)),
      month = sm[0],
      setMonth = sm[1];
    useOutside(ref, open, () => {
      setOpen(false);
    });
    var first = new Date(month.getFullYear(), month.getMonth(), 1),
      off = (first.getDay() + 6) % 7,
      days = [];
    for (var i = 0; i < 42; i++)
      days.push(new Date(month.getFullYear(), month.getMonth(), 1 - off + i));
    while (days.length > 35 && days[days.length - 7].getMonth() !== month.getMonth())
      days = days.slice(0, days.length - 7);
    var over =
      val && p.dueStyle && val < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    function nav(d) {
      setMonth(
        view === 'days'
          ? new Date(month.getFullYear(), month.getMonth() + d, 1)
          : new Date(month.getFullYear() + d, month.getMonth(), 1),
      );
    }
    return h(
      'div',
      { className: 'st-anchor', ref: ref },
      h(
        'button',
        {
          type: 'button',
          id: p.id,
          className: 'st-control st-trigger',
          'data-popup-open': attr(open),
          'data-invalid': attr(p.invalid),
          'aria-haspopup': 'dialog',
          'aria-expanded': open,
          onClick: () => {
            setOpen(!open);
          },
        },
        h(Icon, {
          name: 'calendar',
          style: { color: over ? 'var(--brand-ink)' : 'var(--ink-muted)' },
        }),
        h(
          'span',
          { className: 'st-value' },
          val
            ? h(
                'span',
                { style: over ? { color: 'var(--brand-ink)', fontWeight: 700 } : null },
                fmt(val) + (over ? ' · Overdue' : ''),
              )
            : h('span', { className: 'st-placeholder' }, p.placeholder || 'Choose a date'),
        ),
        h('span', { className: 'st-caret' }),
      ),
      open &&
        h(
          'div',
          { className: 'st-popup st-cal', role: 'dialog', 'aria-label': 'Choose date' },
          h(
            'div',
            { className: 'st-cal-head' },
            h(
              Button,
              {
                variant: 'ghost',
                size: 'sm',
                iconOnly: true,
                icon: 'chevronLeft',
                onClick: () => {
                  nav(-1);
                },
              },
              view === 'days' ? 'Previous month' : 'Previous year',
            ),
            h(
              'button',
              {
                type: 'button',
                className: 'st-cal-title',
                'aria-live': 'polite',
                onClick: () => {
                  setView(view === 'days' ? 'months' : 'days');
                },
              },
              view === 'days'
                ? MONTHS[month.getMonth()] + ' ' + month.getFullYear()
                : String(month.getFullYear()),
            ),
            h(
              Button,
              {
                variant: 'ghost',
                size: 'sm',
                iconOnly: true,
                icon: 'chevronRight',
                onClick: () => {
                  nav(1);
                },
              },
              view === 'days' ? 'Next month' : 'Next year',
            ),
          ),
          view === 'days'
            ? h(
                'div',
                { className: 'st-cal-grid', role: 'grid' },
                DOW.map((d, i) =>
                  h('div', { key: i, className: 'st-cal-dow', role: 'columnheader' }, d),
                ),
                days.map((d) =>
                  h(
                    'button',
                    {
                      key: +d,
                      type: 'button',
                      className: 'st-day',
                      'data-outside': attr(d.getMonth() !== month.getMonth()),
                      'data-today': attr(same(d, today)),
                      'data-selected': attr(same(d, val)),
                      'aria-pressed': !!same(d, val),
                      'aria-label': fmt(d) + (same(d, today) ? ', today' : ''),
                      onClick: () => {
                        setVal(d);
                        setOpen(false);
                      },
                    },
                    d.getDate(),
                  ),
                ),
              )
            : h(
                'div',
                { className: 'st-months' },
                MONTHS.map((m, i) => {
                  var sel =
                    val && val.getFullYear() === month.getFullYear() && val.getMonth() === i;
                  return h(
                    'button',
                    {
                      key: m,
                      type: 'button',
                      className: 'st-month',
                      'data-selected': attr(sel),
                      onClick: () => {
                        setMonth(new Date(month.getFullYear(), i, 1));
                        setView('days');
                      },
                    },
                    m.slice(0, 3),
                  );
                }),
              ),
          h(
            'div',
            { className: 'st-cal-foot' },
            h(
              Button,
              {
                variant: 'link',
                onClick: () => {
                  setVal(null);
                },
              },
              'Clear',
            ),
            h(
              Button,
              {
                variant: 'primary',
                size: 'sm',
                onClick: () => {
                  setVal(today);
                  setMonth(new Date(today.getFullYear(), today.getMonth(), 1));
                  setView('days');
                  setOpen(false);
                },
              },
              'Today',
            ),
          ),
        ),
    );
  }

  var SprintStack = {
    Card: Card,
    Field: Field,
    Input: Input,
    TextArea: TextArea,
    NumberInput: NumberInput,
    Select: Select,
    MultiSelect: MultiSelect,
    Chip: Chip,
    DatePicker: DatePicker,
    Button: Button,
    Icon: Icon,
    Badge: Badge,
    Priority: Prio,
  };
  window.SprintStack = Object.assign(window.SprintStack || {}, SprintStack);
})();
