"use client";

import { useState } from "react";
import { Package, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Dialog } from "@/components/ui/dialog";
import { Drawer } from "@/components/ui/drawer";
import { Tabs } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Tooltip } from "@/components/ui/tooltip";
import { Alert } from "@/components/ui/alert";
import { useToast } from "@/components/ui/toast";
import { Timeline } from "@/components/ui/timeline";
import { Stepper } from "@/components/ui/stepper";
import { Progress } from "@/components/ui/progress";
import { ChartCard } from "@/components/ui/chart-card";
import { FileUpload } from "@/components/ui/file-upload";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { FinanceBarChart } from "../views/finance-chart";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground-muted">{title}</h2>
      {children}
    </div>
  );
}

export function DesignSystemShowcase({ companyId }: { companyId: string }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toast = useToast();

  return (
    <div className="max-w-4xl">
      <Section title="Buttons">
        <div className="flex flex-wrap gap-2">
          <Button>Default</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button disabled>Disabled</Button>
        </div>
      </Section>

      <Section title="Inputs">
        <div className="grid max-w-md gap-3">
          <Input placeholder="Text input" />
          <Select defaultValue="">
            <option value="" disabled>Select an option</option>
            <option value="a">Option A</option>
            <option value="b">Option B</option>
          </Select>
          <DatePicker />
        </div>
      </Section>

      <Section title="Badges & Alerts">
        <div className="mb-3 flex flex-wrap gap-2">
          <StatusBadge status="draft" />
          <StatusBadge status="pending_approval" />
          <StatusBadge status="approved" />
          <StatusBadge status="delivered" />
          <StatusBadge status="rejected" />
        </div>
        <div className="space-y-2">
          <Alert variant="info" title="Info">This is an informational message.</Alert>
          <Alert variant="success" title="Success">Your changes were saved.</Alert>
          <Alert variant="warning" title="Warning">This invoice is due soon.</Alert>
          <Alert variant="error" title="Error">Something went wrong.</Alert>
        </div>
      </Section>

      <Section title="Overlays">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setDialogOpen(true)}>Open dialog</Button>
          <Button variant="outline" onClick={() => setDrawerOpen(true)}>Open drawer</Button>
          <DropdownMenu trigger={<Button variant="outline">Dropdown</Button>}>
            <DropdownMenuItem onClick={() => toast({ title: "Clicked item 1", variant: "info" })}>Item one</DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast({ title: "Clicked item 2", variant: "info" })}>Item two</DropdownMenuItem>
            <DropdownMenuItem destructive onClick={() => toast({ title: "Deleted", variant: "error" })}>Delete</DropdownMenuItem>
          </DropdownMenu>
          <Tooltip content="This is a tooltip">
            <Button variant="outline">Hover me</Button>
          </Tooltip>
          <Button
            variant="outline"
            onClick={() => toast({ title: "Toast fired", description: "This is a real toast notification.", variant: "success" })}
          >
            Fire toast
          </Button>
        </div>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Example dialog">
          <p className="text-sm text-foreground-muted">This is dialog content. Click outside or press Escape to close.</p>
        </Dialog>
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Example drawer">
          <p className="text-sm text-foreground-muted">This is drawer content.</p>
        </Drawer>
      </Section>

      <Section title="Tabs">
        <Tabs
          tabs={[
            { value: "one", label: "Overview", content: <p className="text-sm text-foreground-muted">Overview content.</p> },
            { value: "two", label: "Details", content: <p className="text-sm text-foreground-muted">Details content.</p> },
            { value: "three", label: "History", content: <p className="text-sm text-foreground-muted">History content.</p> },
          ]}
        />
      </Section>

      <Section title="Timeline & Stepper">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Timeline
              activeIndex={2}
              steps={[
                { label: "Booked", timestamp: "09:00" },
                { label: "Dispatched", timestamp: "09:45" },
                { label: "In transit", timestamp: "10:15" },
                { label: "Delivered" },
              ]}
            />
          </div>
          <div className="flex items-start pt-4">
            <Stepper steps={["Quote", "Order", "Shipment", "Invoice"]} activeIndex={2} />
          </div>
        </div>
      </Section>

      <Section title="Progress">
        <div className="max-w-sm space-y-3">
          <Progress value={30} />
          <Progress value={65} />
          <Progress value={90} />
        </div>
      </Section>

      <Section title="KPI & Chart cards">
        <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-3">
          <KpiCard label="Example metric" value={1284} icon={<Package className="h-4 w-4" />} accent="navy" />
          <KpiCard label="Growth" value={24} suffix="%" icon={<TrendingUp className="h-4 w-4" />} accent="teal" />
        </div>
        <ChartCard title="Example chart">
          <FinanceBarChart data={[{ label: "Mon", value: 12 }, { label: "Tue", value: 19 }, { label: "Wed", value: 8 }]} />
        </ChartCard>
      </Section>

      <Section title="File upload">
        <p className="mb-2 text-xs text-foreground-muted">
          Real upload — drop a file to send it to the &quot;documents&quot; Supabase Storage bucket.
        </p>
        <FileUpload
          bucket="documents"
          companyId={companyId}
          onUploaded={(path) => toast({ title: "File uploaded", description: path, variant: "success" })}
          className="max-w-sm"
        />
      </Section>

      <Section title="Card">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Card title</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground-muted">Card content goes here.</p>
          </CardContent>
        </Card>
      </Section>
    </div>
  );
}
