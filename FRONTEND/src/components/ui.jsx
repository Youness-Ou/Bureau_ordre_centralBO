import { useState } from "react";

// ─── PALETTE TGR ─────────────────────────────────────────────────
export const C = {
  // Orange TGR (couleur identitaire du logo)
  orange: "#E87722", orangeD: "#C4601A", orangeL: "#FEF3E8", orangeXL: "#FDF8F2",
  orangeGrad: "linear-gradient(135deg, #E87722 0%, #C4601A 100%)",

  // Neutres
  grey: "#6B7280", greyD: "#1F2937", greyM: "#9CA3AF", greyL: "#E5E7EB", greyXL: "#F9FAFB",
  greyBorder: "#D1D5DB",

  // Sémantiques
  white: "#FFFFFF", black: "#111827",
  green: "#059669", greenL: "#D1FAE5", greenD: "#065F46",
  red: "#DC2626", redL: "#FEE2E2", redD: "#991B1B",
  blue: "#2563EB", blueL: "#DBEAFE", blueD: "#1E40AF",
  purple: "#7C3AED", purpleL: "#EDE9FE", purpleD: "#5B21B6",
  teal: "#0D9488", tealL: "#CCFBF1", tealD: "#0F766E",

  // Sidebar
  sidebarBg: "#1A1D23",
  sidebarBorder: "rgba(255,255,255,0.06)",
  sidebarText: "rgba(255,255,255,0.55)",
  sidebarActive: "rgba(232,119,34,0.15)",
};

// ─── OMBRES ──────────────────────────────────────────────────────
export const shadows = {
  xs: "0 1px 2px rgba(0,0,0,0.05)",
  sm: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
  md: "0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04)",
  lg: "0 10px 15px rgba(0,0,0,0.07), 0 4px 6px rgba(0,0,0,0.04)",
  xl: "0 20px 25px rgba(0,0,0,0.08), 0 10px 10px rgba(0,0,0,0.03)",
  orange: "0 4px 14px rgba(232,119,34,0.35)",
};

// ─── ROLE CONFIG ─────────────────────────────────────────────────
export const ROLE_CFG = {
  admin:    { label: "Administrateur", bg: C.purple,  light: C.purpleL, dark: C.purpleD, icon: "★" },
  agent_bo: { label: "Agent B.O.",     bg: C.teal,    light: C.tealL,   dark: C.tealD,   icon: "◈" },
  employe:  { label: "Employé",        bg: C.blue,    light: C.blueL,   dark: C.blueD,   icon: "◉" },
};
export const getRoleCfg = (lib) =>
  ROLE_CFG[lib] || { label: lib, bg: C.grey, light: C.greyL, dark: C.greyD, icon: "?" };

// ─── BADGES ──────────────────────────────────────────────────────
export const RoleBadge = ({ libelle }) => {
  const r = getRoleCfg(libelle);
  return (
    <span style={{
      background: r.light,
      color: r.dark,
      padding: "3px 10px 3px 8px",
      borderRadius: 6,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: 0.2,
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      border: `1px solid ${r.bg}30`,
    }}>
      <span style={{ fontSize: 9, color: r.bg }}>{r.icon}</span>{r.label}
    </span>
  );
};

export const StatusBadge = ({ actif }) => (
  <span style={{
    background: actif ? C.greenL : C.redL,
    color: actif ? C.greenD : C.redD,
    padding: "3px 10px 3px 8px",
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    border: `1px solid ${actif ? C.green : C.red}25`,
  }}>
    <span style={{ width: 5, height: 5, borderRadius: "50%", background: actif ? C.green : C.red, display: "inline-block" }} />
    {actif ? "Actif" : "Inactif"}
  </span>
);

// ─── AVATAR ──────────────────────────────────────────────────────
export const Avatar = ({ nom = "", prenom = "", size = 36, fontSize = 13 }) => (
  <div style={{
    width: size,
    height: size,
    borderRadius: "50%",
    background: C.orangeGrad,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: C.white,
    fontSize,
    fontWeight: 700,
    flexShrink: 0,
    boxShadow: shadows.orange,
    letterSpacing: 0.5,
  }}>
    {(prenom[0] || "?").toUpperCase()}{(nom[0] || "").toUpperCase()}
  </div>
);

// ─── LOGO TGR ────────────────────────────────────────────────────
export const TGRLogo = ({ size = 40, showText = true }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div style={{
      width: size,
      height: size,
      background: C.white,
      borderRadius: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: shadows.md,
      overflow: "hidden",
      flexShrink: 0,
    }}>
      <img
        src="/logo-tgr.png"
        alt="TGR Logo"
        style={{ width: "85%", height: "85%", objectFit: "contain" }}
        onError={(e) => {
          e.target.style.display = "none";
          e.target.parentNode.innerHTML = '<span style="font-size:' + Math.round(size * 0.45) + 'px">🏛</span>';
        }}
      />
    </div>
    {showText && (
      <div>
        <div style={{ color: C.white, fontWeight: 700, fontSize: 12, lineHeight: 1.3, letterSpacing: 0.2 }}>Bureau d'Ordre</div>
        <div style={{ color: C.orange, fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginTop: 1 }}>TGR — BOC</div>
      </div>
    )}
  </div>
);

// ─── BUTTONS ─────────────────────────────────────────────────────
const BTN_STYLES = {
  primary:   { background: C.orangeGrad, color: C.white, border: "none", boxShadow: shadows.orange },
  secondary: { background: C.white, color: C.greyD, border: `1px solid ${C.greyBorder}`, boxShadow: shadows.xs },
  danger:    { background: C.redL, color: C.redD, border: `1px solid ${C.red}30` },
  ghost:     { background: "transparent", color: C.grey, border: `1px solid ${C.greyBorder}` },
  success:   { background: C.greenL, color: C.greenD, border: `1px solid ${C.green}30` },
};

const BTN_SIZES = {
  sm: { padding: "5px 12px", fontSize: 12, borderRadius: 7 },
  md: { padding: "9px 18px", fontSize: 13, borderRadius: 8 },
  lg: { padding: "12px 24px", fontSize: 14, borderRadius: 9 },
};

export const Btn = ({ children, variant = "primary", size = "md", onClick, disabled, style: s = {}, ...p }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      {...p}
      style={{
        ...BTN_SIZES[size],
        ...BTN_STYLES[variant],
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        transition: "all .15s ease",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "inherit",
        outline: "none",
        transform: hov && !disabled ? "translateY(-1px)" : "none",
        ...s,
      }}
    >
      {children}
    </button>
  );
};

// ─── FORM PRIMITIVES ─────────────────────────────────────────────
export const Field = ({ label, error, hint, required, children, style: s = {} }) => (
  <div style={{ marginBottom: 18, ...s }}>
    {label && (
      <label style={{
        display: "block",
        fontSize: 11.5,
        fontWeight: 600,
        color: C.greyD,
        marginBottom: 6,
        letterSpacing: 0.3,
      }}>
        {label}
        {required && <span style={{ color: C.orange, marginLeft: 3 }}>*</span>}
      </label>
    )}
    {children}
    {hint && !error && <div style={{ fontSize: 11, color: C.greyM, marginTop: 4 }}>{hint}</div>}
    {error && (
      <div style={{ fontSize: 11, color: C.redD, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 10 }}>⚠</span>{error}
      </div>
    )}
  </div>
);

export const inputBase = (err = false, focused = false) => ({
  width: "100%",
  padding: "10px 12px",
  border: `1.5px solid ${err ? C.red : focused ? C.orange : C.greyBorder}`,
  borderRadius: 8,
  fontSize: 13,
  color: C.greyD,
  background: C.white,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color .15s, box-shadow .15s",
  fontFamily: "inherit",
  boxShadow: focused ? `0 0 0 3px ${C.orange}18` : err ? `0 0 0 3px ${C.red}12` : "none",
});

export const Input = ({ error, ...p }) => {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...p}
      style={{ ...inputBase(error, focused), ...p.style }}
      onFocus={(e) => { setFocused(true); p.onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); p.onBlur?.(e); }}
    />
  );
};

export const Select = ({ error, children, ...p }) => {
  const [focused, setFocused] = useState(false);
  return (
    <select
      {...p}
      style={{ ...inputBase(error, focused), cursor: "pointer", ...p.style }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {children}
    </select>
  );
};

// ─── MODAL ───────────────────────────────────────────────────────
export const Modal = ({ title, subtitle, onClose, children, width = 520, icon }) => (
  <div
    style={{
      position: "fixed", inset: 0,
      background: "rgba(17,24,39,0.6)",
      zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16,
      backdropFilter: "blur(4px)",
    }}
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div style={{
      background: C.white,
      borderRadius: 14,
      width: "100%",
      maxWidth: width,
      maxHeight: "90vh",
      overflowY: "auto",
      boxShadow: "0 25px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.06)",
      animation: "modalIn .18s ease",
    }}>
      {/* Header */}
      <div style={{
        padding: "18px 22px",
        borderBottom: `1px solid ${C.greyL}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: C.greyD,
        borderRadius: "14px 14px 0 0",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {icon && (
            <div style={{
              width: 36, height: 36,
              borderRadius: 8,
              background: "rgba(232,119,34,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 17,
            }}>{icon}</div>
          )}
          <div>
            <div style={{ color: C.white, fontWeight: 700, fontSize: 14.5 }}>{title}</div>
            {subtitle && <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11.5, marginTop: 1 }}>{subtitle}</div>}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            width: 30, height: 30,
            borderRadius: "50%",
            border: "none",
            background: "rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.7)",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, lineHeight: 1,
            transition: "background .15s",
          }}
        >×</button>
      </div>
      <div style={{ padding: "22px 24px" }}>{children}</div>
    </div>
  </div>
);

// ─── CONFIRM DIALOG ──────────────────────────────────────────────
export const Confirm = ({ title, message, onConfirm, onCancel, variant = "danger" }) => (
  <div style={{
    position: "fixed", inset: 0,
    background: "rgba(17,24,39,0.65)",
    zIndex: 1100,
    display: "flex", alignItems: "center", justifyContent: "center",
    backdropFilter: "blur(4px)",
  }}>
    <div style={{
      background: C.white,
      borderRadius: 14,
      width: 400,
      padding: "28px 28px 24px",
      boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
      animation: "modalIn .18s ease",
      textAlign: "center",
    }}>
      <div style={{
        width: 52, height: 52,
        borderRadius: "50%",
        background: variant === "danger" ? C.redL : C.orangeL,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, margin: "0 auto 16px",
      }}>
        {variant === "danger" ? "⚠️" : "❓"}
      </div>
      <div style={{ fontWeight: 700, fontSize: 16, color: C.greyD, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 13.5, color: C.grey, marginBottom: 24, lineHeight: 1.6 }}>{message}</div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <Btn variant="ghost" onClick={onCancel}>Annuler</Btn>
        <Btn variant={variant === "danger" ? "danger" : "primary"} onClick={onConfirm}>Confirmer</Btn>
      </div>
    </div>
  </div>
);

// ─── TOAST CONTAINER ─────────────────────────────────────────────
const TOAST_COLORS = {
  success: { bg: C.greenD,   icon: "✓" },
  error:   { bg: "#B91C1C",  icon: "✕" },
  warning: { bg: C.orangeD,  icon: "⚠" },
  info:    { bg: C.blueD,    icon: "ℹ" },
};

export const ToastContainer = ({ items, pop }) => (
  <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 2000, display: "flex", flexDirection: "column-reverse", gap: 8 }}>
    {items.map((t) => {
      const cfg = TOAST_COLORS[t.type] || TOAST_COLORS.info;
      return (
        <div key={t.id} style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "12px 16px",
          borderRadius: 10,
          background: cfg.bg,
          color: C.white,
          minWidth: 280, maxWidth: 380,
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          animation: "toastIn .2s ease",
          fontSize: 13.5, fontWeight: 500,
        }}>
          <span style={{
            width: 22, height: 22,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, flexShrink: 0,
          }}>{cfg.icon}</span>
          <span style={{ flex: 1 }}>{t.msg}</span>
          <button
            onClick={() => pop(t.id)}
            style={{
              background: "none", border: "none",
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 0,
              flexShrink: 0,
            }}
          >×</button>
        </div>
      );
    })}
  </div>
);

// ─── STAT CARD ───────────────────────────────────────────────────
export const StatCard = ({ icon, label, value, color, trend, sub }) => (
  <div style={{
    background: C.white,
    borderRadius: 12,
    padding: "18px 20px",
    boxShadow: shadows.sm,
    border: `1px solid ${C.greyL}`,
    borderTop: `3px solid ${color}`,
    position: "relative",
    overflow: "hidden",
  }}>
    <div style={{
      position: "absolute", right: -14, top: -14,
      width: 70, height: 70,
      borderRadius: "50%",
      background: color,
      opacity: 0.06,
    }} />
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: C.grey, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>{label}</div>
        <div style={{ fontSize: 30, fontWeight: 800, color: C.greyD, lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ fontSize: 11.5, color: C.greyM, marginTop: 5 }}>{sub}</div>}
      </div>
      <div style={{
        width: 42, height: 42,
        borderRadius: 10,
        background: `${color}15`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18,
        flexShrink: 0,
      }}>{icon}</div>
    </div>
    {trend !== undefined && (
      <div style={{
        marginTop: 12, fontSize: 11.5,
        display: "flex", alignItems: "center", gap: 4,
        color: trend >= 0 ? C.green : C.red,
      }}>
        <span>{trend >= 0 ? "↑" : "↓"}</span> {Math.abs(trend)}% ce mois
      </div>
    )}
  </div>
);

// ─── TOPBAR ──────────────────────────────────────────────────────
export const Topbar = ({ title, subtitle, actions }) => (
  <div style={{
    height: 60,
    background: C.white,
    borderBottom: `1px solid ${C.greyL}`,
    padding: "0 24px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    position: "sticky", top: 0, zIndex: 50,
    boxShadow: shadows.xs,
  }}>
    <div>
      <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.greyD, lineHeight: 1.2 }}>{title}</h1>
      {subtitle && <p style={{ margin: "2px 0 0", fontSize: 11.5, color: C.grey }}>{subtitle}</p>}
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {actions}
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "4px 10px",
        background: C.greenL,
        borderRadius: 20,
        border: `1px solid ${C.green}25`,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green }} />
        <span style={{ fontSize: 11, color: C.greenD, fontWeight: 600 }}>Connecté</span>
      </div>
    </div>
  </div>
);

// ─── PAGE HEADER ─────────────────────────────────────────────────
export const PageHeader = ({ icon, title, subtitle, actions }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: 24,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {icon && (
        <div style={{
          width: 40, height: 40,
          borderRadius: 10,
          background: C.orangeL,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18,
        }}>{icon}</div>
      )}
      <div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: C.greyD }}>{title}</h2>
        {subtitle && <p style={{ margin: "2px 0 0", fontSize: 12.5, color: C.grey }}>{subtitle}</p>}
      </div>
    </div>
    {actions && <div style={{ display: "flex", gap: 8 }}>{actions}</div>}
  </div>
);

// ─── CARD ────────────────────────────────────────────────────────
export const Card = ({ children, style: s = {}, padding = "20px 22px" }) => (
  <div style={{
    background: C.white,
    borderRadius: 12,
    border: `1px solid ${C.greyL}`,
    boxShadow: shadows.sm,
    padding,
    ...s,
  }}>
    {children}
  </div>
);