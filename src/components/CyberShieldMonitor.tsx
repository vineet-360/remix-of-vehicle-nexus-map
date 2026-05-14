import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Activity, AlertTriangle, ShieldCheck, Ban, RefreshCw, Wifi, Clock,
  Download, Search, ShieldAlert, Globe2,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend,
} from "recharts";
import { toast } from "sonner";

type SeverityKey = "info" | "low" | "medium" | "high" | "critical";

const severityColors: Record<SeverityKey, string> = {
  info: "#22d3ee",
  low: "#34d399",
  medium: "#f59e0b",
  high: "#f97316",
  critical: "#ef4444",
};

interface BlockedIP {
  ip: string;
  countryCode: string;
  country: string;
  isp: string;
  events: number;
  severity: SeverityKey;
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
  { type: "UNBLOCK", color: "emerald", ip: "58.210.182.18", text: "fail2ban.actions [37187]: NOTICE [sshd] Unban 58.210.182.18", ago: "25 minutes ago" },
  { type: "BLOCK", color: "red", ip: "80.94.92.171", text: "fail2ban.actions [37187]: NOTICE [sshd] Ban 80.94.92.171", ago: "about 1 hour ago" },
  { type: "INFO", color: "cyan", ip: "", text: "fail2ban.filter [37187]: INFO [sshd] Found 80.94.92.171 - 2026-05-14 05:20:17", ago: "about 1 hour ago" },
  { type: "UNBLOCK", color: "emerald", ip: "165.154.6.34", text: "fail2ban.actions [37187]: NOTICE [sshd] Unban 165.154.6.34", ago: "about 1 hour ago" },
  { type: "INFO", color: "cyan", ip: "", text: "fail2ban.filter [37187]: INFO [sshd] Found 80.94.92.171 - 2026-05-14 05:16:51", ago: "about 1 hour ago" },
  { type: "BLOCK", color: "red", ip: "2.57.122.193", text: "fail2ban.actions: NOTICE [sshd] Ban 2.57.122.193", ago: "about 2 hours ago" },
  { type: "BLOCK", color: "red", ip: "195.178.110.30", text: "fail2ban.actions: NOTICE [sshd] Ban 195.178.110.30", ago: "about 2 hours ago" },
];

// Approximate country pin coordinates as percentages over the map SVG (x,y)
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

export default function CyberShieldMonitor() {
  const [now, setNow] = useState(() => new Date());
  const [trend, setTrend] = useState(genTrend);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 15;

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
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(
    () => blockedIPs.filter(
      (b) =>
        !filter ||
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
    a.href = url;
    a.download = `blocked-ips-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported blocked IPs CSV");
  };

  return (
    <div className="rounded-xl bg-[hsl(230_30%_6%)] text-slate-100 p-4 md:p-6 space-y-6 border border-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-700 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-wide">CyberShield Monitor</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
              VPS Security Intelligence Platform
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-emerald-400">
            <Wifi className="h-3.5 w-3.5" /> ubuntu@vps-2452670b
          </span>
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/15">
            ● LIVE VPS
          </Badge>
          <span className="text-slate-400 flex items-center gap-1">
            Updated <span className="text-slate-200">{Math.floor((Date.now() - now.getTime()) / 60000) || 0} minutes ago</span>
          </span>
          <span className="flex items-center gap-1 text-emerald-400">
            ● sshd ACTIVE
          </span>
          <Button size="sm" variant="outline" className="bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatTile color="amber" label="Total Events" value="2.4K" sub="All ingested log events" icon={<AlertTriangle className="h-3.5 w-3.5" />} />
        <StatTile color="rose" label="Blocks (Recent)" value="34" sub="Block actions in last 200 events" icon={<Ban className="h-3.5 w-3.5" />} />
        <StatTile color="violet" label="High / Critical" value="0" sub="High & critical severity count" icon={<ShieldAlert className="h-3.5 w-3.5" />} />
        <StatTile color="rose" label="Top Source IP" value="195.178.110.30" sub="Most frequent attacker" icon={<Globe2 className="h-3.5 w-3.5" />} valueClass="text-base" />
        <StatTile color="emerald" label="Fail2Ban" value="ACTIVE" sub="sshd jail monitoring" icon={<ShieldCheck className="h-3.5 w-3.5" />} />
        <StatTile color="cyan" label="Last Updated" value="2 minutes ago" sub="Data refresh time" icon={<Clock className="h-3.5 w-3.5" />} valueClass="text-base" />
      </div>

      {/* Live attack trend */}
      <Card className="bg-[hsl(230_30%_8%)] border-slate-800 p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="text-amber-400 text-xs uppercase tracking-wider font-semibold">Live Attack Trend</div>
            <div className="text-[11px] text-slate-400">Security events & blocks — last 4 hours (10-min intervals)</div>
          </div>
          <span className="text-xs text-rose-400">● LIVE</span>
        </div>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="evGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="blGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1f2937" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: "#94a3b8", fontSize: 10 }} stroke="#334155" />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} stroke="#334155" width={28} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="blocks" stroke="#a855f7" fill="url(#blGrad)" name="New Blocks" />
              <Area type="monotone" dataKey="events" stroke="#ef4444" fill="url(#evGrad)" name="Security Events" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Map + severity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 bg-[hsl(230_30%_8%)] border-slate-800 p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="text-amber-400 text-xs uppercase tracking-wider font-semibold">Global Attack Origin Map</div>
              <div className="text-[11px] text-slate-400">15 countries · 62 unique IPs — live geo lookup</div>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-300">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" /> High</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400" /> Med</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-yellow-300" /> Low</span>
            </div>
          </div>
          <WorldMap />
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-3 text-xs">
            {countriesList.map((c) => (
              <div key={c.code} className="flex items-center justify-between border-b border-slate-800/50 py-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-mono w-5">{c.code}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                  <span className="text-slate-200">{c.name}</span>
                </div>
                <span className="text-amber-400 font-semibold">{c.count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-[hsl(230_30%_8%)] border-slate-800 p-4">
          <div className="mb-3">
            <div className="text-amber-400 text-xs uppercase tracking-wider font-semibold">Events by Severity</div>
            <div className="text-[11px] text-slate-400">Live breakdown from fail2ban logs</div>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData} layout="vertical">
                <CartesianGrid stroke="#1f2937" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 10 }} stroke="#334155" />
                <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} stroke="#334155" width={60} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", fontSize: 12 }} />
                <Bar dataKey="value" fill="#22d3ee" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Event feed + threat level */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 bg-[hsl(230_30%_8%)] border-slate-800 p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-cyan-400 text-xs uppercase tracking-wider font-semibold">Security Event Feed</div>
              <div className="text-[11px] text-slate-400">Live fail2ban log — 200 events</div>
            </div>
            <span className="text-xs text-cyan-400">● LIVE</span>
          </div>
          <ScrollArea className="h-[320px] pr-3">
            <div className="space-y-2">
              {eventFeed.map((e, i) => (
                <div key={i} className={`rounded border-l-2 px-3 py-2 bg-slate-900/50 ${
                  e.color === "emerald" ? "border-emerald-500" :
                  e.color === "red" ? "border-rose-500" : "border-cyan-500"
                }`}>
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-[10px] py-0 px-1.5 ${
                        e.color === "emerald" ? "border-emerald-500/40 text-emerald-400" :
                        e.color === "red" ? "border-rose-500/40 text-rose-400" :
                        "border-cyan-500/40 text-cyan-400"
                      }`}>
                        {e.type}
                      </Badge>
                      {e.ip && <span className="font-mono text-amber-300">{e.ip}</span>}
                    </div>
                    <span className="text-slate-500">{e.ago}</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono mt-1">
                    2026-05-14 {String(5 + (i % 3)).padStart(2, "0")}:{String(i * 7 % 60).padStart(2, "0")}:{String(i * 11 % 60).padStart(2, "0")} {e.text}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        <Card className="bg-[hsl(230_30%_8%)] border-slate-800 p-4">
          <div className="text-emerald-400 text-xs uppercase tracking-wider font-semibold mb-3">Threat Level</div>
          <div className="flex flex-col items-center text-center">
            <div className="relative h-32 w-32 rounded-full border-4 border-emerald-500/40 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.35)]">
              <ShieldCheck className="h-12 w-12 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-400 mt-3 tracking-wider">LOW</div>
            <div className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
              System is secure. Normal activity levels detected.
            </div>
            <div className="w-full mt-4">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Risk Score</span><span className="text-amber-400 font-semibold">1/100</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full w-[1%] bg-gradient-to-r from-emerald-400 to-amber-400" />
              </div>
              <div className="grid grid-cols-4 gap-1 mt-3 text-[10px] font-semibold">
                <span className="rounded py-1 text-center bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">LOW</span>
                <span className="rounded py-1 text-center text-amber-400 border border-slate-700">MEDIUM</span>
                <span className="rounded py-1 text-center text-orange-400 border border-slate-700">HIGH</span>
                <span className="rounded py-1 text-center text-rose-400 border border-slate-700">CRITICAL</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Blocked IPs */}
      <Card className="bg-[hsl(230_30%_8%)] border-slate-800 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <div className="text-amber-400 text-xs uppercase tracking-wider font-semibold">Blocked Attacking IPs</div>
            <div className="text-[11px] text-slate-400">{filtered.length} unique source IPs — sorted by block count</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <Input
                value={filter}
                onChange={(e) => { setFilter(e.target.value); setPage(1); }}
                placeholder="Filter by IP, country, ISP…"
                className="h-8 w-64 pl-7 bg-slate-900 border-slate-700 text-xs"
              />
            </div>
            <Button size="sm" variant="outline" onClick={downloadCSV}
              className="bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20">
              <Download className="h-3.5 w-3.5" /> CSV
            </Button>
          </div>
        </div>
        <div className="rounded border border-slate-800 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-[10px] uppercase text-slate-500 w-12">#</TableHead>
                <TableHead className="text-[10px] uppercase text-slate-500">IP Address</TableHead>
                <TableHead className="text-[10px] uppercase text-slate-500">Country</TableHead>
                <TableHead className="text-[10px] uppercase text-slate-500">ISP / Org</TableHead>
                <TableHead className="text-[10px] uppercase text-slate-500 text-right">Events</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageData.map((b, i) => (
                <TableRow key={b.ip} className="border-slate-800 hover:bg-slate-900/50">
                  <TableCell className="text-slate-500 text-xs">{(page - 1) * pageSize + i + 1}</TableCell>
                  <TableCell className="font-mono text-xs" style={{ color: severityColors[b.severity] }}>{b.ip}</TableCell>
                  <TableCell className="text-xs text-slate-200">
                    <span className="text-[10px] text-slate-500 font-mono mr-2">{b.countryCode}</span>{b.country}
                  </TableCell>
                  <TableCell className="text-xs text-cyan-400">{b.isp}</TableCell>
                  <TableCell className="text-right font-semibold" style={{ color: severityColors[b.severity] }}>{b.events}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
          <span>Page {page} of {totalPages} · {filtered.length} results</span>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`h-7 w-7 rounded text-xs ${
                  page === i + 1
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    : "bg-slate-900 text-slate-400 border border-slate-700 hover:bg-slate-800"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Footer */}
      <div className="text-center text-[10px] uppercase tracking-[0.25em] text-cyan-500/70 border-t border-slate-800 pt-3">
        ◆ CyberShield Monitor · Fail2Ban SSHD · Live Data · {now.toLocaleTimeString()} ◆
      </div>
    </div>
  );
}

function StatTile({
  color, label, value, sub, icon, valueClass,
}: {
  color: "amber" | "rose" | "violet" | "emerald" | "cyan";
  label: string; value: string; sub: string; icon: React.ReactNode; valueClass?: string;
}) {
  const map: Record<string, { border: string; text: string; ring: string }> = {
    amber: { border: "border-amber-500/30", text: "text-amber-400", ring: "bg-amber-500/10" },
    rose: { border: "border-rose-500/30", text: "text-rose-400", ring: "bg-rose-500/10" },
    violet: { border: "border-violet-500/30", text: "text-violet-400", ring: "bg-violet-500/10" },
    emerald: { border: "border-emerald-500/30", text: "text-emerald-400", ring: "bg-emerald-500/10" },
    cyan: { border: "border-cyan-500/30", text: "text-cyan-400", ring: "bg-cyan-500/10" },
  };
  const c = map[color];
  return (
    <div className={`rounded-lg border ${c.border} bg-slate-900/40 p-3 relative`}>
      <div className="flex items-center justify-between">
        <span className={`text-[10px] uppercase tracking-wider font-semibold ${c.text}`}>{label}</span>
        <span className={`h-5 w-5 rounded flex items-center justify-center ${c.ring} ${c.text}`}>{icon}</span>
      </div>
      <div className={`mt-2 font-extrabold ${c.text} ${valueClass ?? "text-2xl"}`}>{value}</div>
      <div className="text-[10px] text-slate-500 mt-1">{sub}</div>
    </div>
  );
}

function WorldMap() {
  return (
    <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden bg-slate-950/60 border border-slate-800">
      {/* Simple stylized world via SVG continents silhouettes (abstract) */}
      <svg viewBox="0 0 100 50" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#1e293b" strokeWidth="0.1" />
          </pattern>
        </defs>
        <rect width="100" height="50" fill="url(#grid)" />
        {/* abstract continent blobs */}
        <g fill="#1e293b" opacity="0.85">
          <ellipse cx="22" cy="22" rx="10" ry="8" />
          <ellipse cx="28" cy="38" rx="6" ry="9" />
          <ellipse cx="50" cy="20" rx="14" ry="7" />
          <ellipse cx="55" cy="36" rx="10" ry="8" />
          <ellipse cx="75" cy="22" rx="14" ry="9" />
          <ellipse cx="82" cy="40" rx="6" ry="4" />
        </g>
      </svg>
      {mapPins.map((p, i) => {
        const colorClass = p.intensity === "high" ? "bg-rose-500" : p.intensity === "med" ? "bg-amber-400" : "bg-yellow-300";
        const size = p.intensity === "high" ? 14 : p.intensity === "med" ? 10 : 7;
        return (
          <div key={i} className="absolute" style={{ left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%,-50%)" }}>
            {p.intensity === "high" && (
              <div className="absolute inset-0 -m-6 rounded-full bg-rose-500/30 blur-2xl animate-pulse" style={{ width: 80, height: 80 }} />
            )}
            <div className={`relative rounded-full ${colorClass} shadow-[0_0_10px_currentColor]`} style={{ width: size, height: size }} />
            {(p.intensity === "high" || p.intensity === "med") && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[8px] text-slate-300 whitespace-nowrap">
                {p.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
