import {
  LayoutDashboard, FileText, ClipboardList, Package, Route as RouteIcon, MapPin,
  Building2, Users, Truck, IdCard, Gauge, Warehouse, Boxes, PackageCheck,
  FileCheck, Receipt, CreditCard, BarChart3, Settings, UserCog, ShieldCheck, History,
  Ship, Headset, Handshake, Palette,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** module.view permission key required to see this item; omit to always show */
  permission?: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Operations",
    items: [
      { href: "", label: "Overview", icon: LayoutDashboard },
      { href: "quotes", label: "Quotes", icon: FileText, permission: "quotes.view" },
      { href: "orders", label: "Orders", icon: ClipboardList, permission: "orders.view" },
      { href: "shipments", label: "Shipments", icon: Package, permission: "shipments.view" },
      { href: "routes", label: "Routes", icon: RouteIcon, permission: "routes.view" },
      { href: "tracking", label: "Tracking", icon: MapPin, permission: "vehicles.view" },
      { href: "branches", label: "Branches", icon: Building2 },
    ],
  },
  {
    label: "Fleet & Warehouse",
    items: [
      { href: "customers", label: "Customers", icon: Users, permission: "customers.view" },
      { href: "vehicles", label: "Vehicles", icon: Truck, permission: "vehicles.view" },
      { href: "drivers", label: "Drivers", icon: IdCard, permission: "drivers.view" },
      { href: "fleet", label: "Fleet", icon: Gauge, permission: "vehicles.view" },
      { href: "warehouses", label: "Warehouses", icon: Warehouse, permission: "warehouses.view" },
      { href: "inventory", label: "Inventory", icon: Boxes, permission: "inventory.view" },
      { href: "deliveries", label: "Deliveries", icon: PackageCheck, permission: "deliveries.view" },
      { href: "customs", label: "Customs", icon: FileCheck, permission: "customs.view" },
      { href: "ports", label: "Ports", icon: Ship, permission: "ports.view" },
    ],
  },
  {
    label: "Finance",
    items: [
      { href: "invoices", label: "Invoices", icon: Receipt, permission: "invoices.view" },
      { href: "payments", label: "Payments", icon: CreditCard, permission: "payments.view" },
      { href: "procurement", label: "Procurement", icon: Handshake, permission: "procurement.view" },
      { href: "reports", label: "Reports", icon: BarChart3, permission: "reports.view" },
    ],
  },
  {
    label: "Administration",
    items: [
      { href: "support", label: "Support", icon: Headset, permission: "support.view" },
      { href: "settings", label: "Settings", icon: Settings },
      { href: "users", label: "Users", icon: UserCog, permission: "users.view" },
      { href: "roles", label: "Roles", icon: ShieldCheck, permission: "users.view" },
      { href: "audit", label: "Audit", icon: History, permission: "reports.view" },
      { href: "design-system", label: "Design System", icon: Palette },
    ],
  },
];
