import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle, ShieldCheck, Ban, RefreshCw, Wifi, Clock, Download, Search,
  ShieldAlert, Globe2, Cpu, MemoryStick, HardDrive, Network, Activity,
  Server, Thermometer, Power, Database, Gauge,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, LineChart, Line,
} from "recharts";
import { toast } from "sonner";

type SeverityKey = "info" | "low" | "medium" | "high" | "critical";

interface BlockedIP {
  ip: string; countryCode: string; country: string; isp: string; events: number; severity: SeverityKey;
}

const blockedIPs: BlockedIP[] = [
  { ip: "195.178.110.30", countryCode: "AD", country: "Andorra", isp: "Techoff SRV Limited", events: 8, severity: "high" },
  { ip: "2.57.122.193", countryCode: "NL", country: "The Netherlands", isp: "Unmanaged LTD", events: 8, severity: "high" },
  { ip: "2.57.122.189", countryCode: "NL", country: "The Netherlands", isp: "Unmanaged LTD", events: 8, severity: "high" },
  { ip: "2.57.122.190", countryCode: "NL", country: "The Netherlands", isp: "Unmanaged LTD", events: 8, severity: "high" },
  { ip: "2.57.122.191", countryCode: "NL", country: "The Netherlands", isp: "Unmanaged LTD", events: 8, severity: "high" },
  { ip: "2.57.122.192", countryCode: "NL", country: "The Netherlands", isp: "Unmanaged LTD", events: 8, severity: "high" },
  { ip: "2.57.122.194", countryCode: "NL", country: "The Netherlands", isp: "Unmanaged LTD", events: 8, severity: "high" },
  { ip: "2.57.122.195", countryCode: "NL", country: "The Netherlands", isp: "Unmanaged LTD", events: 8, severity: "high" },
  { ip: "2.57.122.196", countryCode: "NL", country: "The Netherlands", isp: "Unmanaged LTD", events: 8, severity: "high" },
  { ip: "2.57.122.197", countryCode: "NL", country: "The Netherlands", isp: "Unmanaged LTD", events: 8, severity: "high" },
  { ip: "80.94.92.167", countryCode: "NL", country: "The Netherlands", isp: "Unmanaged LTD", events: 2, severity: "medium" },
  { ip: "45.149.10.147", countryCode: "NL", country: "Netherlands", isp: "Techoff SRV Limited", events: 2, severity: "medium" },
  { ip: "58.210.182.18", countryCode: "CN", country: "China", isp: "Chinanet", events: 1, severity: "low" },
  { ip: "80.94.92.171", countryCode: "NL", country: "The Netherlands", isp: "Unmanaged LTD", events: 1, severity: "low" },
  { ip: "165.154.6.34", countryCode: "HK", country: "Hong Kong", isp: "UCLOUD INFORMATION TECHNOLOGY (HK) LIMITED", events: 1, severity: "low" },
];

const countriesList = [
  { code: "US", name: "United States", count: 3 },
  { code: "BR", name: "Brazil", count: 1 },
  { code: "QA", name: "Qatar", count: 1 },
  { code: "KR", name: "South Korea", count: 1 },
  { code: "CL", name: "Chile", count: 1 },
  { code: "FR", name: "France", count: 1 },
  { code: "BG", name: "Bulgaria", count: 1 },
  { code: "AE", name: "United Arab Emirates", count: 1 },
  { code: "RU", name: "Russia", count: 1 },
  { code: "IQ", name: "Iraq", count: 1 },
];

const eventFeed = [
  { type: "UNBLOCK", tone: "online", ip: "58.210.182.18", text: "fail2ban.actions [37187]: NOTICE [sshd] Unban 58.210.182.18", ago: "25 minutes ago" },
  { type: "BLOCK", tone: "offline", ip: "80.94.92.171", text: "fail2ban.actions [37187]: NOTICE [sshd] Ban 80.94.92.171", ago: "about 1 hour ago" },
  { type: "INFO", tone: "primary", ip: "", text: "fail2ban.filter [37187]: INFO [sshd] Found 80.94.92.171 - 2026-05-14 05:20:17", ago: "about 1 hour ago" },
  { type: "UNBLOCK", tone: "online", ip: "165.154.6.34", text: "fail2ban.actions [37187]: NOTICE [sshd] Unban 165.154.6.34", ago: "about 1 hour ago" },
  { type: "INFO", tone: "primary", ip: "", text: "fail2ban.filter [37187]: INFO [sshd] Found 80.94.92.171 - 2026-05-14 05:16:51", ago: "about 1 hour ago" },
  { type: "BLOCK", tone: "offline", ip: "2.57.122.193", text: "fail2ban.actions: NOTICE [sshd] Ban 2.57.122.193", ago: "about 2 hours ago" },
  { type: "BLOCK", tone: "offline", ip: "195.178.110.30", text: "fail2ban.actions: NOTICE [sshd] Ban 195.178.110.30", ago: "about 2 hours ago" },
];

const mapPins = [
  { x: 49, y: 36, intensity: "high", label: "Germany" },
  { x: 47, y: 37, intensity: "med", label: "Netherlands" },
  { x: 46, y: 35, intensity: "med", label: "UK" },
  { x: 50, y: 40, intensity: "low", label: "France" },
  { x: 53, y: 35, intensity: "low", label: "Bulgaria" },
  { x: 60, y: 30, intensity: "low", label: "Russia" },
  { x: 63, y: 45, intensity: "low", label: "UAE" },
  { x: 58, y: 43, intensity: "low", label: "Iraq" },
  { x: 60, y: 47, intensity: "low", label: "Qatar" },
  { x: 75, y: 41, intensity: "med", label: "China" },
  { x: 82, y: 42, intensity: "med", label: "Japan" },
  { x: 78, y: 47, intensity: "low", label: "Taiwan" },
  { x: 76, y: 52, intensity: "low", label: "Vietnam" },
  { x: 74, y: 41, intensity: "low", label: "South Korea" },
  { x: 22, y: 45, intensity: "low", label: "United States" },
  { x: 30, y: 70, intensity: "low", label: "Chile" },
  { x: 33, y: 62, intensity: "low", label: "Brazil" },
];

function genTrend() {
  const points = 24;
  return Array.from({ length: points }).map((_, i) => {
    const t = new Date(Date.now() - (points - i) * 10 * 60000);
    const hh = String(t.getHours()).padStart(2, "0");
    const mm = String(t.getMinutes()).padStart(2, "0");
    const baseEvents = 2 + Math.sin(i / 2) * 3;
    const spike = i > 16 && i < 20 ? Math.random() * 10 : 0;
    return {
      time: `${hh}:${mm}`,
      events: Math.max(0, Math.round(baseEvents + Math.random() * 3 + spike)),
      blocks: Math.max(0, Math.round(Math.random() * 3 + (i > 17 ? 4 : 0))),
    };
  });
}

function genUsageHistory() {
  return Array.from({ length: 30 }).map((_, i) => ({
    t: `-${30 - i}m`,
    cpu: Math.round(20 + Math.sin(i / 3) * 15 + Math.random() * 10),
    mem: Math.round(45 + Math.cos(i / 4) * 10 + Math.random() * 8),
    disk: Math.round(60 + Math.random() * 4),
  }));
}

const mockProcesses = [
  { pid: 1024, name: "node /server", cpu: 12.4, memory: 8.2, user: "app" },
  { pid: 1188, name: "postgres", cpu: 7.1, memory: 14.6, user: "postgres" },
  { pid: 1342, name: "nginx", cpu: 1.8, memory: 1.2, user: "www-data" },
  { pid: 1501, name: "redis-server", cpu: 2.3, memory: 3.4, user: "redis" },
  { pid: 1622, name: "systemd-journald", cpu: 0.4, memory: 0.9, user: "root" },
  { pid: 1789, name: "fluent-bit", cpu: 1.1, memory: 1.5, user: "root" },
  { pid: 1942, name: "mapbox-tileserver", cpu: 4.3, memory: 5.7, user: "app" },
  { pid: 2055, name: "fail2ban-server", cpu: 0.8, memory: 1.1, user: "root" },
];

const services = [
  { name: "nginx", status: "running", uptime: "14d 6h" },
  { name: "postgresql", status: "running", uptime: "14d 6h" },
  { name: "redis-server", status: "running", uptime: "14d 6h" },
  { name: "fail2ban", status: "running", uptime: "14d 6h" },
  { name: "node-app", status: "running", uptime: "2d 11h" },
  { name: "docker", status: "running", uptime: "30d 2h" },
];

export default function CyberShieldMonitor() {
  const [now, setNow] = useState(() => new Date());
  const [trend, setTrend] = useState(genTrend);
  const [usage, setUsage] = useState(genUsageHistory);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const [stats, setStats] = useState({
    cpu: 38, memory: 62, disk: 47, swap: 12,
    networkIn: 142, networkOut: 88, temp: 52,
    load1: 0.42, load5: 0.61, load15: 0.55,
  });

  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
      setTrend((prev) => {
        const next = [...prev.slice(1)];
        const t = new Date();
        const hh = String(t.getHours()).padStart(2, "0");
        const mm = String(t.getMinutes()).padStart(2, "0");
        next.push({
          time: `${hh}:${mm}`,
          events: Math.round(2 + Math.random() * 8),
          blocks: Math.round(Math.random() * 3),
        });
        return next;
      });
      setStats((s) => ({
        ...s,
        cpu: clamp(s.cpu + (Math.random() * 10 - 5), 5, 95),
        memory: clamp(s.memory + (Math.random() * 6 - 3), 20, 95),
        networkIn: Math.max(20, s.networkIn + (Math.random() * 40 - 20)),
        networkOut: Math.max(10, s.networkOut + (Math.random() * 30 - 15)),
        temp: clamp(s.temp + (Math.random() * 2 - 1), 38, 78),
        load1: +(clamp(s.load1 + (Math.random() * 0.2 - 0.1), 0.05, 3)).toFixed(2),
      }));
      setUsage((u) => [...u.slice(1), {
        t: "now",
        cpu: Math.round(20 + Math.random() * 40),
        mem: Math.round(40 + Math.random() * 25),
        disk: Math.round(60 + Math.random() * 4),
      }]);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(
    () => blockedIPs.filter(
      (b) => !filter ||
        b.ip.includes(filter) ||
        b.country.toLowerCase().includes(filter.toLowerCase()) ||
        b.isp.toLowerCase().includes(filter.toLowerCase()),
    ),
    [filter],
  );
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const severityData = [
    { name: "info", value: 1700 },
    { name: "medium", value: 760 },
  ];

  const downloadCSV = () => {
    const rows = [
      ["IP", "Country", "ISP", "Events"],
      ...filtered.map((b) => [b.ip, b.country, b.isp, String(b.events)]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `blocked-ips-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported blocked IPs CSV");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-lg font-bold">CyberShield Monitor</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              VPS Security Intelligence Platform
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-[hsl(var(--status-online))]">
            <Wifi className="h-3.5 w-3.5" /> ubuntu@vps-2452670b
          </span>
          <Badge variant="outline" className="border-[hsl(var(--status-online))]/40 text-[hsl(var(--status-online))]">
            ● LIVE VPS
          </Badge>
          <span className="text-muted-foreground flex items-center gap-1">
            Updated <span className="text-foreground font-medium">{Math.max(0, Math.floor((Date.now() - now.getTime()) / 60000))}m ago</span>
          </span>
          <Badge variant="outline" className="border-[hsl(var(--status-online))]/40 text-[hsl(var(--status-online))]">● sshd ACTIVE</Badge>
          <Button size="sm" variant="outline">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview"><ShieldAlert className="h-4 w-4 mr-1.5" /> Security Overview</TabsTrigger>
          <TabsTrigger value="system"><Server className="h-4 w-4 mr-1.5" /> System Usage</TabsTrigger>
        </TabsList>

        {/* ==================== OVERVIEW ==================== */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <StatTile tone="warning" label="Total Events" value="2.4K" sub="All ingested log events" icon={<AlertTriangle className="h-3.5 w-3.5" />} />
            <StatTile tone="danger" label="Blocks (Recent)" value="34" sub="Block actions in last 200 events" icon={<Ban className="h-3.5 w-3.5" />} />
            <StatTile tone="primary" label="High / Critical" value="0" sub="High & critical severity count" icon={<ShieldAlert className="h-3.5 w-3.5" />} />
            <StatTile tone="danger" label="Top Source IP" value="195.178.110.30" sub="Most frequent attacker" icon={<Globe2 className="h-3.5 w-3.5" />} valueClass="text-base" />
            <StatTile tone="success" label="Fail2Ban" value="ACTIVE" sub="sshd jail monitoring" icon={<ShieldCheck className="h-3.5 w-3.5" />} />
            <StatTile tone="primary" label="Last Updated" value={`${Math.max(0, Math.floor((Date.now() - now.getTime()) / 60000))}m ago`} sub="Data refresh time" icon={<Clock className="h-3.5 w-3.5" />} valueClass="text-base" />
          </div>

          {/* Trend */}
          <Card className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-sm font-semibold">Live Attack Trend</div>
                <div className="text-xs text-muted-foreground">Security events &amp; blocks — last 4 hours (10-min intervals)</div>
              </div>
              <span className="text-xs text-[hsl(var(--status-offline))] flex items-center gap-1">● LIVE</span>
            </div>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend}>
                  <defs>
                    <linearGradient id="evGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--status-offline))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--status-offline))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="blGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="time" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} stroke="hsl(var(--border))" />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} stroke="hsl(var(--border))" width={28} />
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", fontSize: 12, color: "hsl(var(--foreground))" }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="blocks" stroke="hsl(var(--primary))" fill="url(#blGrad)" name="New Blocks" />
                  <Area type="monotone" dataKey="events" stroke="hsl(var(--status-offline))" fill="url(#evGrad)" name="Security Events" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Map + severity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2 p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-sm font-semibold">Global Attack Origin Map</div>
                  <div className="text-xs text-muted-foreground">15 countries · 62 unique IPs — live geo lookup</div>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[hsl(var(--status-offline))]" /> High</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[hsl(var(--status-idle))]" /> Med</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Low</span>
                </div>
              </div>
              <WorldMap />
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-3 text-xs">
                {countriesList.map((c) => (
                  <div key={c.code} className="flex items-center justify-between border-b border-border py-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground font-mono w-5">{c.code}</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{c.name}</span>
                    </div>
                    <span className="text-primary font-semibold">{c.count}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <div className="mb-3">
                <div className="text-sm font-semibold">Events by Severity</div>
                <div className="text-xs text-muted-foreground">Live breakdown from fail2ban logs</div>
              </div>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={severityData} layout="vertical">
                    <CartesianGrid stroke="hsl(var(--border))" horizontal={false} />
                    <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} stroke="hsl(var(--border))" />
                    <YAxis type="category" dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} stroke="hsl(var(--border))" width={60} />
                    <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", fontSize: 12, color: "hsl(var(--foreground))" }} />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Event feed + threat */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2 p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-sm font-semibold">Security Event Feed</div>
                  <div className="text-xs text-muted-foreground">Live fail2ban log — 200 events</div>
                </div>
                <span className="text-xs text-primary flex items-center gap-1">● LIVE</span>
              </div>
              <ScrollArea className="h-[320px] pr-3">
                <div className="space-y-2">
                  {eventFeed.map((e, i) => (
                    <div key={i} className={`rounded-md border-l-2 px-3 py-2 bg-muted/40 ${
                      e.tone === "online" ? "border-[hsl(var(--status-online))]" :
                      e.tone === "offline" ? "border-[hsl(var(--status-offline))]" :
                      "border-primary"
                    }`}>
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`text-[10px] py-0 px-1.5 ${
                            e.tone === "online" ? "border-[hsl(var(--status-online))]/40 text-[hsl(var(--status-online))]" :
                            e.tone === "offline" ? "border-[hsl(var(--status-offline))]/40 text-[hsl(var(--status-offline))]" :
                            "border-primary/40 text-primary"
                          }`}>
                            {e.type}
                          </Badge>
                          {e.ip && <span className="font-mono text-foreground">{e.ip}</span>}
                        </div>
                        <span className="text-muted-foreground">{e.ago}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono mt-1 break-all">
                        2026-05-14 {String(5 + (i % 3)).padStart(2, "0")}:{String(i * 7 % 60).padStart(2, "0")}:{String(i * 11 % 60).padStart(2, "0")} {e.text}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>

            <Card className="p-4">
              <div className="text-sm font-semibold mb-3">Threat Level</div>
              <div className="flex flex-col items-center text-center">
                <div className="relative h-32 w-32 rounded-full border-4 border-[hsl(var(--status-online))]/40 flex items-center justify-center"
                     style={{ boxShadow: "0 0 30px hsl(var(--status-online) / 0.25)" }}>
                  <ShieldCheck className="h-12 w-12 text-[hsl(var(--status-online))]" />
                </div>
                <div className="text-3xl font-extrabold text-[hsl(var(--status-online))] mt-3 tracking-wider">LOW</div>
                <div className="text-[11px] text-muted-foreground mt-1 max-w-[200px]">
                  System is secure. Normal activity levels detected.
                </div>
                <div className="w-full mt-4">
                  <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                    <span>Risk Score</span><span className="text-foreground font-semibold">1/100</span>
                  </div>
                  <Progress value={1} className="h-1.5" />
                  <div className="grid grid-cols-4 gap-1 mt-3 text-[10px] font-semibold">
                    <span className="rounded py-1 text-center bg-[hsl(var(--status-online))]/10 text-[hsl(var(--status-online))] border border-[hsl(var(--status-online))]/30">LOW</span>
                    <span className="rounded py-1 text-center text-[hsl(var(--status-idle))] border border-border">MEDIUM</span>
                    <span className="rounded py-1 text-center text-orange-500 border border-border">HIGH</span>
                    <span className="rounded py-1 text-center text-[hsl(var(--status-offline))] border border-border">CRITICAL</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Blocked IPs */}
          <Card className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div>
                <div className="text-sm font-semibold">Blocked Attacking IPs</div>
                <div className="text-xs text-muted-foreground">{filtered.length} unique source IPs — sorted by block count</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={filter}
                    onChange={(e) => { setFilter(e.target.value); setPage(1); }}
                    placeholder="Filter by IP, country, ISP…"
                    className="h-8 w-64 pl-7 text-xs"
                  />
                </div>
                <Button size="sm" variant="outline" onClick={downloadCSV}>
                  <Download className="h-3.5 w-3.5" /> CSV
                </Button>
              </div>
            </div>
            <div className="rounded border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[10px] uppercase w-12">#</TableHead>
                    <TableHead className="text-[10px] uppercase">IP Address</TableHead>
                    <TableHead className="text-[10px] uppercase">Country</TableHead>
                    <TableHead className="text-[10px] uppercase">ISP / Org</TableHead>
                    <TableHead className="text-[10px] uppercase text-right">Events</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageData.map((b, i) => (
                    <TableRow key={b.ip}>
                      <TableCell className="text-muted-foreground text-xs">{(page - 1) * pageSize + i + 1}</TableCell>
                      <TableCell className="font-mono text-xs font-semibold">
                        <span className={
                          b.severity === "high" ? "text-[hsl(var(--status-offline))]" :
                          b.severity === "medium" ? "text-[hsl(var(--status-idle))]" :
                          "text-foreground"
                        }>{b.ip}</span>
                      </TableCell>
                      <TableCell className="text-xs">
                        <span className="text-[10px] text-muted-foreground font-mono mr-2">{b.countryCode}</span>{b.country}
                      </TableCell>
                      <TableCell className="text-xs text-primary">{b.isp}</TableCell>
                      <TableCell className="text-right font-semibold text-foreground">{b.events}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <span>Page {page} of {totalPages} · {filtered.length} results</span>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`h-7 w-7 rounded text-xs border ${
                      page === i + 1
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border hover:bg-muted"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* ==================== SYSTEM USAGE ==================== */}
        <TabsContent value="system" className="space-y-6">
          {/* Server identity strip */}
          <Card className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-xs">
              <Identity label="Hostname" value="vps-2452670b" />
              <Identity label="OS" value="Ubuntu 24.04 LTS" />
              <Identity label="Kernel" value="6.8.0-31-generic" />
              <Identity label="Architecture" value="x86_64" />
              <Identity label="Region" value="EU-Central-1" />
              <Identity label="Uptime" value="14d 6h 22m" />
            </div>
          </Card>

          {/* Resource cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <ResourceCard icon={<Cpu className="h-4 w-4" />} label="CPU Usage" value={`${stats.cpu.toFixed(0)}%`} progress={stats.cpu} sub="8 cores · 16 threads" />
            <ResourceCard icon={<MemoryStick className="h-4 w-4" />} label="Memory" value={`${stats.memory.toFixed(0)}%`} progress={stats.memory} sub="9.9 / 16 GB" />
            <ResourceCard icon={<HardDrive className="h-4 w-4" />} label="Disk" value={`${stats.disk}%`} progress={stats.disk} sub="235 / 500 GB" />
            <ResourceCard icon={<Database className="h-4 w-4" />} label="Swap" value={`${stats.swap}%`} progress={stats.swap} sub="0.5 / 4 GB" />
            <ResourceCard icon={<Thermometer className="h-4 w-4" />} label="CPU Temp" value={`${stats.temp.toFixed(0)}°C`} progress={(stats.temp / 100) * 100} sub="Threshold 85°C" />
            <ResourceCard icon={<Gauge className="h-4 w-4" />} label="Load Avg" value={stats.load1.toFixed(2)} progress={Math.min(100, stats.load1 * 25)} sub={`5m ${stats.load5} · 15m ${stats.load15}`} />
            <ResourceCard icon={<Network className="h-4 w-4" />} label="Net In" value={`${stats.networkIn.toFixed(0)} KB/s`} progress={Math.min(100, stats.networkIn / 5)} sub="eth0 · ingress" />
            <ResourceCard icon={<Network className="h-4 w-4" />} label="Net Out" value={`${stats.networkOut.toFixed(0)} KB/s`} progress={Math.min(100, stats.networkOut / 5)} sub="eth0 · egress" />
          </div>

          {/* Usage history chart */}
          <Card className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-sm font-semibold">Resource Usage — last 30 minutes</div>
                <div className="text-xs text-muted-foreground">CPU, Memory, Disk utilization (%)</div>
              </div>
              <span className="text-xs text-primary flex items-center gap-1">● LIVE</span>
            </div>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usage}>
                  <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="t" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} stroke="hsl(var(--border))" />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} stroke="hsl(var(--border))" width={32} />
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", fontSize: 12, color: "hsl(var(--foreground))" }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="cpu" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="CPU %" />
                  <Line type="monotone" dataKey="mem" stroke="hsl(var(--status-idle))" strokeWidth={2} dot={false} name="Memory %" />
                  <Line type="monotone" dataKey="disk" stroke="hsl(var(--status-offline))" strokeWidth={2} dot={false} name="Disk %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Processes + Services */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2 p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-sm font-semibold flex items-center gap-2"><Activity className="h-4 w-4" /> Top Processes</div>
                  <div className="text-xs text-muted-foreground">Sorted by CPU consumption</div>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[10px] uppercase">PID</TableHead>
                    <TableHead className="text-[10px] uppercase">Process</TableHead>
                    <TableHead className="text-[10px] uppercase">User</TableHead>
                    <TableHead className="text-[10px] uppercase text-right">CPU %</TableHead>
                    <TableHead className="text-[10px] uppercase text-right">Mem %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockProcesses.map((p) => (
                    <TableRow key={p.pid}>
                      <TableCell className="font-mono text-xs">{p.pid}</TableCell>
                      <TableCell className="text-xs font-medium">{p.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{p.user}</TableCell>
                      <TableCell className="text-right text-xs">{p.cpu.toFixed(1)}%</TableCell>
                      <TableCell className="text-right text-xs">{p.memory.toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            <Card className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-sm font-semibold flex items-center gap-2"><Power className="h-4 w-4" /> Services</div>
                  <div className="text-xs text-muted-foreground">systemd unit status</div>
                </div>
              </div>
              <div className="space-y-2">
                {services.map((s) => (
                  <div key={s.name} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                    <div>
                      <div className="text-sm font-medium">{s.name}</div>
                      <div className="text-[11px] text-muted-foreground">uptime {s.uptime}</div>
                    </div>
                    <Badge variant="outline" className="border-[hsl(var(--status-online))]/40 text-[hsl(var(--status-online))]">
                      ● {s.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Disk partitions */}
          <Card className="p-4">
            <div className="text-sm font-semibold mb-3 flex items-center gap-2"><HardDrive className="h-4 w-4" /> Disk Partitions</div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[10px] uppercase">Mount</TableHead>
                  <TableHead className="text-[10px] uppercase">Filesystem</TableHead>
                  <TableHead className="text-[10px] uppercase">Size</TableHead>
                  <TableHead className="text-[10px] uppercase">Used</TableHead>
                  <TableHead className="text-[10px] uppercase">Free</TableHead>
                  <TableHead className="text-[10px] uppercase w-[200px]">Usage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { mount: "/", fs: "ext4", size: "500 GB", used: "235 GB", free: "265 GB", pct: 47 },
                  { mount: "/var", fs: "ext4", size: "100 GB", used: "62 GB", free: "38 GB", pct: 62 },
                  { mount: "/home", fs: "ext4", size: "200 GB", used: "44 GB", free: "156 GB", pct: 22 },
                  { mount: "/boot", fs: "ext4", size: "1 GB", used: "0.3 GB", free: "0.7 GB", pct: 30 },
                ].map((p) => (
                  <TableRow key={p.mount}>
                    <TableCell className="font-mono text-xs">{p.mount}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.fs}</TableCell>
                    <TableCell className="text-xs">{p.size}</TableCell>
                    <TableCell className="text-xs">{p.used}</TableCell>
                    <TableCell className="text-xs">{p.free}</TableCell>
                    <TableCell><Progress value={p.pct} className="h-2" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground border-t border-border pt-3">
        ◆ CyberShield Monitor · Fail2Ban SSHD · Live Data · {now.toLocaleTimeString()} ◆
      </div>
    </div>
  );
}

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

function StatTile({
  tone, label, value, sub, icon, valueClass,
}: {
  tone: "warning" | "danger" | "primary" | "success";
  label: string; value: string; sub: string; icon: React.ReactNode; valueClass?: string;
}) {
  const map: Record<string, { text: string; ring: string; border: string }> = {
    warning: { text: "text-[hsl(var(--status-idle))]", ring: "bg-[hsl(var(--status-idle))]/10", border: "border-[hsl(var(--status-idle))]/30" },
    danger:  { text: "text-[hsl(var(--status-offline))]", ring: "bg-[hsl(var(--status-offline))]/10", border: "border-[hsl(var(--status-offline))]/30" },
    primary: { text: "text-primary", ring: "bg-primary/10", border: "border-primary/30" },
    success: { text: "text-[hsl(var(--status-online))]", ring: "bg-[hsl(var(--status-online))]/10", border: "border-[hsl(var(--status-online))]/30" },
  };
  const c = map[tone];
  return (
    <div className={`rounded-lg border ${c.border} bg-card p-3`}>
      <div className="flex items-center justify-between">
        <span className={`text-[10px] uppercase tracking-wider font-semibold ${c.text}`}>{label}</span>
        <span className={`h-5 w-5 rounded flex items-center justify-center ${c.ring} ${c.text}`}>{icon}</span>
      </div>
      <div className={`mt-2 font-extrabold text-foreground ${valueClass ?? "text-2xl"}`}>{value}</div>
      <div className="text-[10px] text-muted-foreground mt-1">{sub}</div>
    </div>
  );
}

function ResourceCard({
  icon, label, value, progress, sub,
}: { icon: React.ReactNode; label: string; value: string; progress: number; sub: string }) {
  return (
    <Card className="p-3">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="flex items-center gap-1.5 text-xs">{icon} {label}</span>
      </div>
      <div className="text-2xl font-bold mt-1 text-foreground">{value}</div>
      <Progress value={progress} className="h-1.5 mt-2" />
      <div className="text-[10px] text-muted-foreground mt-1.5">{sub}</div>
    </Card>
  );
}

function Identity({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold text-foreground mt-0.5">{value}</div>
    </div>
  );
}

function WorldMap() {
  return (
    <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden bg-muted/40 border border-border">
      <svg viewBox="0 0 100 50" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <pattern id="csm-grid" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M 5 0 L 0 0 0 5" fill="none" stroke="hsl(var(--border))" strokeWidth="0.1" />
          </pattern>
        </defs>
        <rect width="100" height="50" fill="url(#csm-grid)" />
        <g fill="hsl(var(--muted-foreground))" opacity="0.25">
          <ellipse cx="22" cy="22" rx="10" ry="8" />
          <ellipse cx="28" cy="38" rx="6" ry="9" />
          <ellipse cx="50" cy="20" rx="14" ry="7" />
          <ellipse cx="55" cy="36" rx="10" ry="8" />
          <ellipse cx="75" cy="22" rx="14" ry="9" />
          <ellipse cx="82" cy="40" rx="6" ry="4" />
        </g>
      </svg>
      {mapPins.map((p, i) => {
        const colorVar = p.intensity === "high" ? "hsl(var(--status-offline))" :
                         p.intensity === "med" ? "hsl(var(--status-idle))" :
                         "hsl(var(--primary))";
        const size = p.intensity === "high" ? 14 : p.intensity === "med" ? 10 : 7;
        return (
          <div key={i} className="absolute" style={{ left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%,-50%)" }}>
            {p.intensity === "high" && (
              <div className="absolute -inset-6 rounded-full blur-2xl animate-pulse"
                   style={{ background: `${colorVar}`, opacity: 0.25 }} />
            )}
            <div className="relative rounded-full"
                 style={{ width: size, height: size, background: colorVar, boxShadow: `0 0 8px ${colorVar}` }} />
            {(p.intensity === "high" || p.intensity === "med") && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[8px] text-foreground whitespace-nowrap">
                {p.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
