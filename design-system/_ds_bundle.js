/* @ds-bundle: {"format":4,"namespace":"CakeLakeDesignSystem_0e660f","components":[{"name":"ItemCard","sourcePath":"components/commerce/ItemCard.jsx"},{"name":"LocationCard","sourcePath":"components/commerce/LocationCard.jsx"},{"name":"OfferCard","sourcePath":"components/commerce/OfferCard.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Chip","sourcePath":"components/core/Chip.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"SectionHead","sourcePath":"components/core/SectionHead.jsx"},{"name":"Stat","sourcePath":"components/core/Stat.jsx"},{"name":"StatusPill","sourcePath":"components/core/StatusPill.jsx"},{"name":"Tab","sourcePath":"components/core/Tab.jsx"},{"name":"OrderTracker","sourcePath":"components/tracking/OrderTracker.jsx"}],"sourceHashes":{"components/commerce/ItemCard.jsx":"bc026a7cf3bf","components/commerce/LocationCard.jsx":"cca4a3ab7f96","components/commerce/OfferCard.jsx":"16d4edec0f2a","components/core/Button.jsx":"bdc0276b9ad4","components/core/Chip.jsx":"11cb9d5b7581","components/core/Eyebrow.jsx":"5e1b6badd57d","components/core/IconButton.jsx":"1ddf82180a7f","components/core/SectionHead.jsx":"6df500607b8c","components/core/Stat.jsx":"df2f8c436e60","components/core/StatusPill.jsx":"01e16da3147b","components/core/Tab.jsx":"c0ec7e3c0a06","components/tracking/OrderTracker.jsx":"8d3e652940a9","ui_kits/cakelake-site/HomeScreen.jsx":"610d59d3e195","ui_kits/cakelake-site/LocationsScreen.jsx":"41c6e14eab39","ui_kits/cakelake-site/MenuScreen.jsx":"18770f525910","ui_kits/cakelake-site/SiteChrome.jsx":"23c74c61f3ba","ui_kits/cakelake-site/TrackOrderScreen.jsx":"8d63ea43d0f2","ui_kits/cakelake-site/app.jsx":"2bb950ffa29a","ui_kits/cakelake-site/data.jsx":"14a72f47c2ca"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CakeLakeDesignSystem_0e660f = window.CakeLakeDesignSystem_0e660f || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const base = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  borderRadius: 'var(--radius-pill)',
  fontFamily: 'var(--font-body)',
  fontWeight: 600,
  border: '1.5px solid transparent',
  cursor: 'pointer',
  transition: 'var(--transition-btn)',
  textDecoration: 'none',
  whiteSpace: 'nowrap'
};
const sizes = {
  md: {
    padding: '14px 26px',
    fontSize: '15px'
  },
  sm: {
    padding: '9px 16px',
    fontSize: '13px'
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  href,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const variants = {
    primary: {
      background: hover ? 'var(--action-primary-hover)' : 'var(--action-primary)',
      color: 'var(--action-primary-text)',
      boxShadow: 'var(--shadow-primary)'
    },
    ghost: {
      background: hover ? 'var(--ink)' : 'transparent',
      borderColor: 'var(--ink)',
      color: hover ? 'var(--cream)' : 'var(--ink)'
    },
    inverse: {
      background: 'transparent',
      borderColor: hover ? 'var(--honey)' : 'var(--ink-line-soft)',
      color: hover ? 'var(--honey)' : 'var(--on-ink)',
      padding: '9px 16px',
      fontSize: '12.5px'
    }
  };
  const Tag = href ? 'a' : 'button';
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    disabled: !href ? disabled : undefined,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      ...base,
      ...sizes[size],
      ...variants[variant],
      opacity: disabled ? 0.45 : 1,
      pointerEvents: disabled ? 'none' : 'auto',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Chip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Chip({
  tone = 'neutral',
  children,
  style,
  ...rest
}) {
  const tones = {
    neutral: {
      background: 'var(--cream)',
      color: 'var(--ink-soft)',
      border: '1px solid var(--line)',
      fontSize: 'var(--text-chip)',
      padding: '3px 8px'
    },
    offer: {
      background: 'var(--pistachio-soft)',
      color: 'var(--pistachio)',
      border: '1px solid transparent',
      fontSize: '11px',
      padding: '4px 10px',
      fontWeight: 700
    },
    pay: {
      background: 'transparent',
      color: 'var(--ink-soft)',
      border: '1px solid var(--line)',
      fontSize: '11px',
      padding: '6px 10px',
      borderRadius: '8px'
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      fontFamily: 'var(--font-mono)',
      borderRadius: 'var(--radius-pill)',
      display: 'inline-block',
      whiteSpace: 'nowrap',
      ...tones[tone],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Chip.jsx", error: String((e && e.message) || e) }); }

// components/commerce/OfferCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function OfferCard({
  tag,
  title,
  description,
  code,
  punchColor = 'var(--cream)',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: 'var(--surface-card)',
      border: '1.5px dashed var(--berry)',
      borderRadius: 'var(--radius-card-alt)',
      padding: '22px',
      position: 'relative',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, rest), ['left', 'right'].map(side => /*#__PURE__*/React.createElement("span", {
    key: side,
    style: {
      position: 'absolute',
      width: 18,
      height: 18,
      background: punchColor,
      borderRadius: '50%',
      top: '50%',
      transform: 'translateY(-50%)',
      [side]: -9
    }
  })), tag && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '12px'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Chip, {
    tone: "offer"
  }, tag)), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--display-weight)',
      fontSize: '19px',
      margin: '0 0 6px'
    }
  }, title), description && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '13.5px',
      color: 'var(--ink-soft)',
      margin: '0 0 14px'
    }
  }, description), code && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: '1px dashed var(--line)',
      paddingTop: '12px',
      fontFamily: 'var(--font-mono)',
      fontSize: '12.5px'
    }
  }, /*#__PURE__*/React.createElement("span", null, "CODE"), /*#__PURE__*/React.createElement("span", null, code)));
}
Object.assign(__ds_scope, { OfferCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/OfferCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Eyebrow({
  tone = 'berry',
  children,
  style,
  ...rest
}) {
  const color = tone === 'honey' ? 'var(--honey)' : 'var(--berry-deep)';
  const dot = tone === 'honey' ? 'var(--honey)' : 'var(--berry)';
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-eyebrow)',
      letterSpacing: 'var(--eyebrow-tracking)',
      textTransform: 'uppercase',
      color,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: dot,
      display: 'inline-block',
      flex: 'none'
    }
  }), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function IconButton({
  variant = 'add',
  badge,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const variants = {
    add: {
      width: 38,
      height: 38,
      background: hover ? 'var(--action-accent)' : 'var(--ink)',
      color: 'var(--cream)',
      border: 'none',
      fontSize: 18
    },
    outline: {
      width: 42,
      height: 42,
      background: 'var(--paper)',
      color: 'var(--ink)',
      border: '1.5px solid var(--line)',
      fontSize: 16
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontFamily: 'var(--font-body)',
      transition: 'background var(--dur-fast) var(--ease)',
      ...variants[variant],
      ...style
    }
  }, rest), children, badge != null && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: -5,
      right: -5,
      background: 'var(--berry)',
      color: '#fff',
      fontSize: '10.5px',
      fontWeight: 700,
      width: 18,
      height: 18,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-mono)'
    }
  }, badge));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/commerce/ItemCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ItemCard({
  name,
  description,
  price,
  chips = [],
  image,
  onAdd,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius)',
      padding: '22px',
      border: '1px solid var(--line)',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      transition: 'var(--transition-card)',
      transform: hover ? 'translateY(var(--lift-y))' : 'none',
      boxShadow: hover ? 'var(--shadow)' : 'none',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-media)',
      borderRadius: 'var(--radius-media)',
      height: 150,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }
  }, typeof image === 'string' ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: "",
    style: {
      width: 88,
      height: 88,
      display: 'block'
    }
  }) : image), chips.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '6px',
      flexWrap: 'wrap'
    }
  }, chips.map(c => /*#__PURE__*/React.createElement(__ds_scope.Chip, {
    key: c
  }, c))), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--display-weight)',
      letterSpacing: 'var(--display-tracking)',
      fontSize: '18px',
      margin: 0
    }
  }, name), description && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '13px',
      color: 'var(--ink-soft)',
      margin: 0,
      lineHeight: 1.5
    }
  }, description), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 'auto',
      paddingTop: '8px',
      borderTop: '1px dashed var(--line)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 700,
      fontSize: '16px'
    }
  }, price), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    variant: "add",
    onClick: onAdd,
    "aria-label": 'Add ' + name
  }, "+")));
}
Object.assign(__ds_scope, { ItemCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/ItemCard.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionHead.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SectionHead({
  eyebrow,
  title,
  description,
  action,
  tone = 'light',
  style,
  ...rest
}) {
  const dark = tone === 'dark';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      marginBottom: '28px',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: '20px',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", null, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '10px'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Eyebrow, {
    tone: dark ? 'honey' : 'berry'
  }, eyebrow)), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--display-weight)',
      letterSpacing: 'var(--display-tracking)',
      fontSize: 'var(--text-h2)',
      margin: 0,
      color: dark ? 'var(--cream)' : 'var(--ink)'
    }
  }, title)), action), description && /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      color: dark ? 'var(--on-ink)' : 'var(--ink-soft)',
      fontSize: '15px',
      lineHeight: 'var(--body-leading)',
      maxWidth: 'var(--measure)',
      margin: '14px 0 0'
    }
  }, description));
}
Object.assign(__ds_scope, { SectionHead });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionHead.jsx", error: String((e && e.message) || e) }); }

// components/core/Stat.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Stat({
  value,
  label,
  tone = 'light',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      fontFamily: 'var(--font-mono)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("b", {
    style: {
      display: 'block',
      fontSize: '20px',
      color: tone === 'dark' ? '#fff' : 'var(--ink)'
    }
  }, value), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '11.5px',
      color: tone === 'dark' ? 'var(--on-ink-muted)' : 'var(--ink-soft)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--chip-tracking)'
    }
  }, label));
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Stat.jsx", error: String((e && e.message) || e) }); }

// components/core/StatusPill.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function StatusPill({
  status = 'open',
  children,
  style,
  ...rest
}) {
  const open = status === 'open';
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontFamily: 'var(--font-mono)',
      fontSize: '11px',
      fontWeight: 700,
      padding: '5px 10px',
      borderRadius: 'var(--radius-pill)',
      background: open ? 'var(--status-open-bg)' : 'var(--status-soon-bg)',
      color: open ? 'var(--status-open-fg)' : 'var(--status-soon-fg)',
      border: open ? '1px solid transparent' : '1px solid var(--line)',
      ...style
    }
  }, rest), open && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'var(--pistachio)'
    }
  }), children);
}
Object.assign(__ds_scope, { StatusPill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StatusPill.jsx", error: String((e && e.message) || e) }); }

// components/commerce/LocationCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function LocationCard({
  status = 'open',
  statusLabel,
  name,
  address,
  hours,
  style,
  ...rest
}) {
  const soon = status === 'soon';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      borderRadius: 'var(--radius)',
      padding: '28px',
      fontFamily: 'var(--font-body)',
      background: soon ? 'transparent' : 'var(--paper)',
      border: soon ? '1.5px dashed var(--line)' : '1px solid var(--line)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: soon ? 'center' : 'flex-start',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.StatusPill, {
    status: status,
    style: {
      marginBottom: '14px'
    }
  }, statusLabel || (soon ? 'Opening soon' : 'Open now')), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--display-weight)',
      fontSize: '19px',
      margin: '0 0 8px'
    }
  }, name), address && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '14px',
      color: 'var(--ink-soft)',
      margin: 0,
      lineHeight: 'var(--body-leading)'
    }
  }, address), hours && /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: '12.5px',
      color: 'var(--ink-soft)',
      margin: '12px 0 0'
    }
  }, hours));
}
Object.assign(__ds_scope, { LocationCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/LocationCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Tab.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tab({
  active = false,
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    style: {
      padding: '10px 18px',
      borderRadius: 'var(--radius-pill)',
      border: '1.5px solid ' + (active ? 'var(--ink)' : 'var(--line)'),
      background: active ? 'var(--ink)' : 'var(--paper)',
      color: active ? 'var(--cream)' : 'var(--ink-soft)',
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: '13.5px',
      cursor: 'pointer',
      transition: 'all var(--dur-fast) var(--ease)',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Tab });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tab.jsx", error: String((e && e.message) || e) }); }

// components/tracking/OrderTracker.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const DEFAULT_STAGES = [{
  title: 'Order placed',
  sub: 'Confirmed 09:14'
}, {
  title: 'In the oven',
  sub: 'Baking now'
}, {
  title: 'Decorating',
  sub: 'Buttercream & finishing'
}, {
  title: 'Ready for collection',
  sub: 'We text you'
}];
function Cake({
  lit
}) {
  const layers = [{
    x: 45,
    y: 150,
    w: 130,
    h: 42,
    fill: 'var(--honey)'
  }, {
    x: 58,
    y: 105,
    w: 104,
    h: 45,
    fill: 'var(--pistachio)'
  }, {
    x: 70,
    y: 62,
    w: 80,
    h: 43,
    fill: 'var(--berry)'
  }];
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 220 220",
    fill: "none",
    style: {
      width: '100%',
      maxWidth: 220,
      margin: '0 auto',
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("ellipse", {
    cx: "110",
    cy: "196",
    rx: "80",
    ry: "10",
    fill: "var(--ink-shadow)"
  }), layers.map((l, i) => /*#__PURE__*/React.createElement("rect", {
    key: i,
    x: l.x,
    y: l.y,
    width: l.w,
    height: l.h,
    rx: "10",
    fill: l.fill,
    opacity: lit > i ? 1 : 0.18,
    style: {
      transition: 'opacity var(--dur-slow) var(--ease)'
    }
  })), /*#__PURE__*/React.createElement("circle", {
    cx: "110",
    cy: "50",
    r: "13",
    fill: "var(--candle)",
    opacity: lit > 3 ? 1 : 0.18,
    style: {
      transition: 'opacity var(--dur-slow) var(--ease)'
    }
  }));
}
function OrderTracker({
  stages = DEFAULT_STAGES,
  current = 1,
  orderId,
  eta,
  footer,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: 'var(--ink-raised)',
      borderRadius: 'var(--radius-inverse-inner)',
      padding: '32px',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, rest), (orderId || eta) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '22px',
      fontFamily: 'var(--font-mono)',
      fontSize: '12.5px',
      color: 'var(--on-ink-muted)',
      borderBottom: '1px dashed var(--ink-line)',
      paddingBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("span", null, orderId), /*#__PURE__*/React.createElement("span", null, eta)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '40px',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Cake, {
    lit: current + 1
  }), /*#__PURE__*/React.createElement("div", null, stages.map((s, i) => {
    const done = i < current,
      active = i === current;
    return /*#__PURE__*/React.createElement("div", {
      key: s.title,
      style: {
        display: 'flex',
        gap: '16px',
        padding: '16px 0',
        borderBottom: i === stages.length - 1 ? 'none' : '1px solid var(--ink-line)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 26,
        height: 26,
        borderRadius: '50%',
        flex: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        border: '2px solid ' + (done ? 'var(--stage-done)' : active ? 'var(--stage-active)' : 'var(--stage-idle)'),
        background: done ? 'var(--stage-done)' : active ? 'var(--stage-active)' : 'transparent',
        color: done ? 'var(--on-pistachio)' : active ? 'var(--on-honey)' : 'var(--stage-idle)'
      }
    }, done ? '✓' : i + 1), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600,
        fontSize: '15px',
        color: done || active ? '#fff' : 'var(--on-ink-dim)'
      }
    }, s.title), s.sub && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '12.5px',
        color: 'var(--on-ink-muted)',
        marginTop: 2
      }
    }, s.sub)));
  }), footer)));
}
Object.assign(__ds_scope, { OrderTracker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/tracking/OrderTracker.jsx", error: String((e && e.message) || e) }); }

// ui_kits/cakelake-site/HomeScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Button,
  Eyebrow,
  Stat,
  SectionHead,
  Tab,
  Chip,
  IconButton,
  ItemCard,
  OfferCard,
  LocationCard,
  OrderTracker
} = window.CakeLakeDesignSystem_0e660f;
const ICON = 'https://unpkg.com/lucide-static@0.436.0/icons/';
const {
  wrap
} = window;
const {
  ITEMS,
  CATEGORIES,
  OFFERS,
  LOCATIONS
} = window;
function Hero({
  onRoute
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      ...wrap,
      padding: '64px var(--gutter) 40px',
      display: 'grid',
      gridTemplateColumns: '1.05fr 0.95fr',
      gap: '40px',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Dubai \xB7 since 2019"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      letterSpacing: 'var(--display-tracking)',
      fontSize: 'var(--text-hero)',
      lineHeight: 'var(--display-leading)',
      margin: '18px 0 20px'
    }
  }, "Cake, ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: 'italic',
      color: 'var(--berry)',
      fontWeight: 500
    }
  }, "made properly"), "."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '17px',
      color: 'var(--ink-soft)',
      maxWidth: 440,
      lineHeight: 'var(--body-leading)',
      marginBottom: '28px'
    }
  }, "Custom cakes, cupcakes and celebration bakes \u2014 ordered online, baked the morning you collect."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '14px',
      flexWrap: 'wrap',
      marginBottom: '34px'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: () => onRoute('menu')
  }, "Order online \u2192"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: () => onRoute('track')
  }, "Track an order")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '28px',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    value: "12,400+",
    label: "Cakes baked"
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "4.9 \u2605",
    label: "Google rating"
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "48h",
    label: "Pre-order notice"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/layer-cake.svg",
    alt: "",
    style: {
      width: '100%',
      maxWidth: 420
    }
  }), [['8%', '12%', 'var(--berry)', 18], ['70%', '6%', 'var(--honey)', 12], ['24%', '86%', 'var(--pistachio)', 14]].map(([t, l, c, s], i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      position: 'absolute',
      top: t,
      left: l,
      width: s,
      height: s,
      borderRadius: '50%',
      background: c,
      opacity: .8,
      animation: 'float var(--float-dur) ease-in-out infinite',
      animationDelay: i * 0.8 + 's'
    }
  }))));
}
function HomeScreen({
  onRoute,
  onAdd
}) {
  const [stage, setStage] = React.useState(1);
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(Hero, {
    onRoute: onRoute
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      ...wrap,
      padding: 'var(--section-y) var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "This week",
    title: "Offers on now",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm"
    }, "All offers")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '16px',
      overflowX: 'auto',
      paddingBottom: '8px'
    }
  }, OFFERS.map(o => /*#__PURE__*/React.createElement(OfferCard, _extends({
    key: o.code
  }, o, {
    style: {
      flex: 'none',
      width: 280
    }
  }))))), /*#__PURE__*/React.createElement("section", {
    style: {
      ...wrap,
      padding: '0 var(--gutter) var(--section-y)'
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Menu",
    title: "Pick your bake",
    description: "Everything is baked the morning you collect it. Celebration sizes need 48 hours.",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      onClick: () => onRoute('menu')
    }, "See the full menu")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 'var(--grid-gap)'
    }
  }, ITEMS.slice(0, 3).map(i => /*#__PURE__*/React.createElement(ItemCard, _extends({
    key: i.id
  }, i, {
    image: "../../assets/cake-icon.svg",
    onAdd: () => onAdd(i)
  }))))), /*#__PURE__*/React.createElement("section", {
    style: {
      ...wrap,
      padding: '0 var(--gutter) var(--section-y)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-inverse)',
      color: 'var(--cream)',
      borderRadius: 'var(--radius-inverse)',
      padding: '56px 40px'
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    tone: "dark",
    eyebrow: "Order tracking",
    title: "Watch your cake get built",
    description: "Every order shows exactly where it is \u2014 placed, in the oven, being decorated, ready to collect."
  }), /*#__PURE__*/React.createElement(OrderTracker, {
    current: stage,
    orderId: "ORDER #LY-4471",
    eta: "READY ~16:40",
    footer: /*#__PURE__*/React.createElement(Button, {
      variant: "inverse",
      style: {
        marginTop: 18
      },
      onClick: () => setStage((stage + 1) % 4)
    }, "Simulate next stage")
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      ...wrap,
      padding: '0 var(--gutter) var(--section-y)',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '48px',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--ink)',
      borderRadius: 'var(--radius-phone)',
      padding: '14px',
      maxWidth: 260,
      margin: '0 auto',
      boxShadow: 'var(--shadow)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--paper)',
      borderRadius: '24px',
      overflow: 'hidden',
      padding: '16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--cream)',
      borderRadius: '12px',
      padding: '14px',
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      marginBottom: '12px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: ICON + 'qr-code.svg',
    width: "38",
    height: "38",
    alt: "",
    style: {
      flex: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", {
    style: {
      fontSize: '13px'
    }
  }, "Scan in store"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11.5px',
      color: 'var(--ink-soft)'
    }
  }, "Collect points on the counter"))), [['Pistachio cake', 'AED 145'], ['Cupcake box of six', 'AED 72']].map(([n, p]) => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: '1px dashed var(--line)',
      padding: '10px 0',
      fontSize: '12.5px'
    }
  }, /*#__PURE__*/React.createElement("span", null, n), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 700
    }
  }, p))), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    style: {
      width: '100%',
      justifyContent: 'center',
      marginTop: 10
    }
  }, "Checkout"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "In store",
    title: "Same account, either counter",
    description: "Order ahead on your phone, or scan at the till \u2014 points, past orders and saved cakes follow you."
  }), /*#__PURE__*/React.createElement("ul", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      padding: 0,
      margin: 0
    }
  }, [['Skip the queue', 'Pick a 15-minute collection slot.'], ['Reorder in two taps', 'Your last five bakes stay saved.'], ['Points either way', 'Scan in store or check out online.']].map(([b, s]) => /*#__PURE__*/React.createElement("li", {
    key: b,
    style: {
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start',
      listStyle: 'none',
      fontSize: '14.5px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--berry)',
      marginTop: 6,
      flex: 'none'
    }
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
    style: {
      display: 'block'
    }
  }, b), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-soft)',
      fontSize: '13px'
    }
  }, s))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      ...wrap,
      padding: '0 var(--gutter) var(--section-y)'
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Locations",
    title: "Where to find us"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px'
    }
  }, LOCATIONS.map(l => /*#__PURE__*/React.createElement(LocationCard, _extends({
    key: l.name
  }, l))))));
}
window.HomeScreen = HomeScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/cakelake-site/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/cakelake-site/LocationsScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Button,
  Eyebrow,
  Stat,
  SectionHead,
  Tab,
  Chip,
  IconButton,
  ItemCard,
  OfferCard,
  LocationCard,
  OrderTracker
} = window.CakeLakeDesignSystem_0e660f;
const ICON = 'https://unpkg.com/lucide-static@0.436.0/icons/';
const {
  wrap
} = window;
const {
  ITEMS,
  CATEGORIES,
  OFFERS,
  LOCATIONS
} = window;
function LocationsScreen() {
  return /*#__PURE__*/React.createElement("main", {
    style: {
      ...wrap,
      padding: '56px var(--gutter) var(--section-y)'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Locations"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      letterSpacing: 'var(--display-tracking)',
      fontSize: 'var(--text-page-title)',
      margin: '16px 0 14px'
    }
  }, "Two shops, two more coming"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--ink-soft)',
      fontSize: '16px',
      maxWidth: 'var(--measure)',
      lineHeight: 'var(--body-leading)',
      marginBottom: 32
    }
  }, "Collection from either counter. The Al Quoz bakery is where the celebration cakes are made."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px'
    }
  }, LOCATIONS.map(l => /*#__PURE__*/React.createElement(LocationCard, _extends({
    key: l.name
  }, l)))));
}
window.LocationsScreen = LocationsScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/cakelake-site/LocationsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/cakelake-site/MenuScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Button,
  Eyebrow,
  Stat,
  SectionHead,
  Tab,
  Chip,
  IconButton,
  ItemCard,
  OfferCard,
  LocationCard,
  OrderTracker
} = window.CakeLakeDesignSystem_0e660f;
const ICON = 'https://unpkg.com/lucide-static@0.436.0/icons/';
const {
  wrap
} = window;
const {
  ITEMS,
  CATEGORIES,
  OFFERS,
  LOCATIONS
} = window;
function MenuScreen({
  onAdd
}) {
  const [cat, setCat] = React.useState('All bakes');
  const shown = cat === 'All bakes' ? ITEMS : ITEMS.filter(i => i.cat === cat);
  return /*#__PURE__*/React.createElement("main", {
    style: {
      ...wrap,
      padding: '56px var(--gutter) var(--section-y)'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Menu"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      letterSpacing: 'var(--display-tracking)',
      fontSize: 'var(--text-page-title)',
      margin: '16px 0 14px'
    }
  }, "Everything we bake"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--ink-soft)',
      fontSize: '16px',
      maxWidth: 'var(--measure)',
      lineHeight: 'var(--body-leading)',
      marginBottom: 32
    }
  }, "Celebration sizes need 48 hours' notice. Everything else is baked the morning you collect."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      marginBottom: '32px'
    }
  }, CATEGORIES.map(c => /*#__PURE__*/React.createElement(Tab, {
    key: c,
    active: c === cat,
    onClick: () => setCat(c)
  }, c))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 'var(--grid-gap)'
    }
  }, shown.map(i => /*#__PURE__*/React.createElement(ItemCard, _extends({
    key: i.id
  }, i, {
    image: "../../assets/cake-icon.svg",
    onAdd: () => onAdd(i)
  })))));
}
window.MenuScreen = MenuScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/cakelake-site/MenuScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/cakelake-site/SiteChrome.jsx
try { (() => {
const {
  Button,
  Eyebrow,
  Stat,
  SectionHead,
  Tab,
  Chip,
  IconButton,
  ItemCard,
  OfferCard,
  LocationCard,
  OrderTracker
} = window.CakeLakeDesignSystem_0e660f;
const ICON = 'https://unpkg.com/lucide-static@0.436.0/icons/';
const wrap = {
  maxWidth: 'var(--content-max)',
  margin: '0 auto',
  padding: '0 var(--gutter)'
};
function SiteHeader({
  route,
  onRoute,
  cartCount
}) {
  const links = [['home', 'Home'], ['menu', 'Menu'], ['track', 'Track order'], ['locations', 'Locations']];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'var(--scrim-header)',
      backdropFilter: 'var(--blur-header)',
      WebkitBackdropFilter: 'var(--blur-header)',
      borderBottom: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px var(--gutter)',
      maxWidth: 'var(--content-max)',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onRoute('home');
    },
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: '24px',
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      gap: '9px',
      color: 'var(--ink)',
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-mark.svg",
    width: "26",
    height: "26",
    alt: ""
  }), "Cake Lake"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '34px',
      fontWeight: 500,
      fontSize: '14.5px'
    }
  }, links.map(([id, label]) => /*#__PURE__*/React.createElement("a", {
    key: id,
    href: "#",
    onClick: e => {
      e.preventDefault();
      onRoute(id);
    },
    style: {
      position: 'relative',
      padding: '4px 0',
      color: 'var(--ink)',
      textDecoration: 'none',
      borderBottom: '2px solid ' + (route === id ? 'var(--berry)' : 'transparent')
    }
  }, label))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    variant: "outline",
    badge: cartCount || undefined,
    "aria-label": "Cart"
  }, /*#__PURE__*/React.createElement("img", {
    src: ICON + 'shopping-bag.svg',
    width: "18",
    height: "18",
    alt: ""
  })), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => onRoute('menu')
  }, "Order online"))));
}
function SiteFooter() {
  const cols = [['Shop', ['Celebration cakes', 'Cupcakes', 'Loaves & bakes', 'Gift boxes']], ['Visit', ['Jumeirah 1', 'Al Quoz', 'Saadiyat — 2026', 'Opening hours']], ['Company', ['Our bakers', 'Wholesale', 'Careers', 'Contact']]];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: '1px solid var(--line)',
      padding: '56px 0 32px',
      marginTop: '20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
      gap: '40px',
      marginBottom: '44px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: '24px',
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      gap: '9px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-mark.svg",
    width: "26",
    height: "26",
    alt: ""
  }), "Cake Lake"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--ink-soft)',
      fontSize: '14px',
      lineHeight: 'var(--body-leading)',
      margin: '14px 0 0',
      maxWidth: 260
    }
  }, "A small bakery making celebration cakes properly \u2014 baked the morning you collect them."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
      marginTop: '14px'
    }
  }, ['VISA', 'MASTERCARD', 'APPLE PAY', 'TABBY'].map(p => /*#__PURE__*/React.createElement(Chip, {
    key: p,
    tone: "pay"
  }, p)))), cols.map(([h, items]) => /*#__PURE__*/React.createElement("div", {
    key: h
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: '12.5px',
      textTransform: 'uppercase',
      letterSpacing: '.08em',
      color: 'var(--ink-soft)',
      marginBottom: '14px',
      fontWeight: 600
    }
  }, h), items.map(i => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      display: 'block',
      fontSize: '14px',
      padding: '6px 0',
      color: 'var(--ink)',
      textDecoration: 'none'
    }
  }, i))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingTop: '24px',
      borderTop: '1px solid var(--line)',
      fontSize: '12.5px',
      color: 'var(--ink-soft)',
      flexWrap: 'wrap',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Cake Lake Bakery"), /*#__PURE__*/React.createElement("span", null, "Dubai, UAE"))));
}
Object.assign(window, {
  wrap,
  SiteHeader,
  SiteFooter
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/cakelake-site/SiteChrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/cakelake-site/TrackOrderScreen.jsx
try { (() => {
const {
  Button,
  Eyebrow,
  Stat,
  SectionHead,
  Tab,
  Chip,
  IconButton,
  ItemCard,
  OfferCard,
  LocationCard,
  OrderTracker
} = window.CakeLakeDesignSystem_0e660f;
const ICON = 'https://unpkg.com/lucide-static@0.436.0/icons/';
const {
  wrap
} = window;
const {
  ITEMS,
  CATEGORIES,
  OFFERS,
  LOCATIONS
} = window;
function TrackOrderScreen() {
  const [stage, setStage] = React.useState(1);
  return /*#__PURE__*/React.createElement("main", {
    style: {
      ...wrap,
      padding: '56px var(--gutter) var(--section-y)'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Track an order"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      letterSpacing: 'var(--display-tracking)',
      fontSize: 'var(--text-page-title)',
      margin: '16px 0 24px'
    }
  }, "Order #LY-4471"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-inverse)',
      borderRadius: 'var(--radius-inverse)',
      padding: '40px'
    }
  }, /*#__PURE__*/React.createElement(OrderTracker, {
    current: stage,
    orderId: "ORDER #LY-4471",
    eta: "READY ~16:40",
    footer: /*#__PURE__*/React.createElement(Button, {
      variant: "inverse",
      style: {
        marginTop: 18
      },
      onClick: () => setStage((stage + 1) % 4)
    }, "Simulate next stage")
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
      marginTop: '22px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--paper)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--radius)',
      padding: '28px'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: '19px',
      margin: '0 0 14px'
    }
  }, "In this order"), [['Pistachio celebration cake', 'AED 145'], ['Cupcake box of six', 'AED 72']].map(([n, p]) => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      borderTop: '1px dashed var(--line)',
      padding: '12px 0',
      fontSize: '14px'
    }
  }, /*#__PURE__*/React.createElement("span", null, n), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 700
    }
  }, p))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      borderTop: '1.5px solid var(--line)',
      paddingTop: '12px',
      marginTop: '4px',
      fontFamily: 'var(--font-mono)',
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement("span", null, "TOTAL"), /*#__PURE__*/React.createElement("span", null, "AED 217"))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--paper)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--radius)',
      padding: '28px'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: '19px',
      margin: '0 0 10px'
    }
  }, "Collection"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--ink-soft)',
      fontSize: '14px',
      lineHeight: 'var(--body-leading)',
      margin: '0 0 14px'
    }
  }, "Jumeirah 1 \u2014 Al Wasl Road, next to the beach car park."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '6px',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Chip, null, "Today 16:30 \u2014 16:45"), /*#__PURE__*/React.createElement(Chip, null, "Eggless"), /*#__PURE__*/React.createElement(Chip, null, "Gift note added")))));
}
window.TrackOrderScreen = TrackOrderScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/cakelake-site/TrackOrderScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/cakelake-site/app.jsx
try { (() => {
const {
  Button,
  Eyebrow,
  Stat,
  SectionHead,
  Tab,
  Chip,
  IconButton,
  ItemCard,
  OfferCard,
  LocationCard,
  OrderTracker
} = window.CakeLakeDesignSystem_0e660f;
const ICON = 'https://unpkg.com/lucide-static@0.436.0/icons/';
function App() {
  const [route, setRoute] = React.useState('home');
  const [cart, setCart] = React.useState(0);
  const add = () => setCart(c => c + 1);
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);
  const screens = {
    home: /*#__PURE__*/React.createElement(window.HomeScreen, {
      onRoute: setRoute,
      onAdd: add
    }),
    menu: /*#__PURE__*/React.createElement(window.MenuScreen, {
      onAdd: add
    }),
    track: /*#__PURE__*/React.createElement(window.TrackOrderScreen, null),
    locations: /*#__PURE__*/React.createElement(window.LocationsScreen, null)
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(window.SiteHeader, {
    route: route,
    onRoute: setRoute,
    cartCount: cart
  }), screens[route], /*#__PURE__*/React.createElement(window.SiteFooter, null));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/cakelake-site/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/cakelake-site/data.jsx
try { (() => {
const ITEMS = [{
  id: 'pistachio',
  cat: 'Celebration cakes',
  name: 'Pistachio celebration cake',
  description: 'Three layers, rose-water buttercream, pistachio crumb.',
  price: 'AED 145',
  chips: ['Bestseller']
}, {
  id: 'berry',
  cat: 'Celebration cakes',
  name: 'Berry cream layer cake',
  description: 'Raspberry compote between vanilla sponge.',
  price: 'AED 165',
  chips: ['Pre-order 72h']
}, {
  id: 'choc',
  cat: 'Celebration cakes',
  name: 'Dark chocolate fudge',
  description: 'Seven layers, 70% Valrhona ganache.',
  price: 'AED 180',
  chips: ['Eggless option']
}, {
  id: 'cup6',
  cat: 'Cupcakes',
  name: 'Cupcake box of six',
  description: 'Mix of vanilla bean, red velvet and salted caramel.',
  price: 'AED 72',
  chips: ['Bestseller']
}, {
  id: 'cardamom',
  cat: 'Loaves & bakes',
  name: 'Cardamom loaf',
  description: 'Baked each morning, sliced or whole.',
  price: 'AED 48',
  chips: []
}, {
  id: 'basque',
  cat: 'Loaves & bakes',
  name: 'Basque cheesecake',
  description: 'Burnt top, soft centre, no crust.',
  price: 'AED 98',
  chips: ['Bestseller']
}];
const CATEGORIES = ['All bakes', 'Celebration cakes', 'Cupcakes', 'Loaves & bakes'];
const OFFERS = [{
  tag: 'Ends Fri',
  title: '20% off Eid boxes',
  description: 'Any celebration cake, when you order 48h ahead.',
  code: 'EID20'
}, {
  tag: 'This month',
  title: 'Free delivery over AED 200',
  description: 'Dubai only, same-day slots before 14:00.',
  code: 'CAKE200'
}, {
  tag: 'Members',
  title: 'Every 10th bake free',
  description: 'Scan in store or use your account at checkout.',
  code: 'LOYAL'
}];
const LOCATIONS = [{
  name: 'Jumeirah 1',
  address: 'Al Wasl Road, next to the beach car park, Dubai',
  hours: 'DAILY 08:00 — 22:00',
  status: 'open'
}, {
  name: 'Al Quoz — the bakery',
  address: 'Alserkal Avenue, Unit 12, Dubai',
  hours: 'TUE — SUN 09:00 — 18:00',
  status: 'open'
}, {
  name: 'Saadiyat',
  address: 'Abu Dhabi',
  status: 'soon',
  statusLabel: 'Opening 2026'
}, {
  name: 'Sharjah',
  address: 'Al Majaz waterfront',
  status: 'soon',
  statusLabel: 'Opening 2026'
}];
Object.assign(window, {
  ITEMS,
  CATEGORIES,
  OFFERS,
  LOCATIONS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/cakelake-site/data.jsx", error: String((e && e.message) || e) }); }

__ds_ns.ItemCard = __ds_scope.ItemCard;

__ds_ns.LocationCard = __ds_scope.LocationCard;

__ds_ns.OfferCard = __ds_scope.OfferCard;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.SectionHead = __ds_scope.SectionHead;

__ds_ns.Stat = __ds_scope.Stat;

__ds_ns.StatusPill = __ds_scope.StatusPill;

__ds_ns.Tab = __ds_scope.Tab;

__ds_ns.OrderTracker = __ds_scope.OrderTracker;

})();
