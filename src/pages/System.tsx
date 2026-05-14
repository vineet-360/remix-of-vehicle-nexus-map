import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/contexts/UserRoleContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ShieldAlert, Cpu, MemoryStick, HardDrive, Network, Power, Download,
  FileText, Activity, AlertTriangle, Lock, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

type Severity = 'low' | 'medium' | 'high' | 'critical';

interface Incident {
  id: string;
  type: string;
  severity: Severity;
  source: string;
  timestamp: string;
}

interface Process {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
  user: string;
}

const initialIncidents: Incident[] = [
  { id: 'INC-1042', type: 'Failed SSH login attempts', severity: 'high', source: '203.0.113.42', timestamp: '2026-05-14 09:14:22' },
  { id: 'INC-1041', type: 'Suspicious API rate spike', severity: 'medium', source: 'api-gateway', timestamp: '2026-05-14 08:42:11' },
  { id: 'INC-1040', type: 'Outdated TLS cipher detected', severity: 'low', source: 'nginx', timestamp: '2026-05-13 22:05:48' },
  { id: 'INC-1039', type: 'Privileged role assignment', severity: 'critical', source: 'auth-service', timestamp: '2026-05-13 18:31:09' },
  { id: 'INC-1038', type: 'Geofence breach alert flood', severity: 'medium', source: 'geofence-engine', timestamp: '2026-05-13 14:02:55' },
];

const mockProcesses: Process[] = [
  { pid: 1024, name: 'node /server', cpu: 12.4, memory: 8.2, user: 'app' },
  { pid: 1188, name: 'postgres', cpu: 7.1, memory: 14.6, user: 'postgres' },
  { pid: 1342, name: 'nginx', cpu: 1.8, memory: 1.2, user: 'www-data' },
  { pid: 1501, name: 'redis-server', cpu: 2.3, memory: 3.4, user: 'redis' },
  { pid: 1622, name: 'systemd-journald', cpu: 0.4, memory: 0.9, user: 'root' },
  { pid: 1789, name: 'fluent-bit', cpu: 1.1, memory: 1.5, user: 'root' },
];

const severityVariant: Record<Severity, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  low: 'secondary',
  medium: 'outline',
  high: 'default',
  critical: 'destructive',
};

export default function System() {
  const { role } = useUserRole();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    cpu: 38,
    memory: 62,
    disk: 47,
    networkIn: 142,
    networkOut: 88,
    uptime: '14d 6h 22m',
  });
  const [restarting, setRestarting] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setStats((s) => ({
        ...s,
        cpu: Math.max(5, Math.min(95, s.cpu + (Math.random() * 10 - 5))),
        memory: Math.max(20, Math.min(95, s.memory + (Math.random() * 6 - 3))),
        networkIn: Math.max(20, s.networkIn + (Math.random() * 40 - 20)),
        networkOut: Math.max(10, s.networkOut + (Math.random() * 30 - 15)),
      }));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  if (role !== 'admin') {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <Card className="max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-destructive" />
              <CardTitle>Access Restricted</CardTitle>
            </div>
            <CardDescription>
              The System section is restricted to administrators only. Please contact your
              administrator if you require access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => navigate('/')}>Back to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleRestart = () => {
    setRestarting(true);
    toast.warning('Restarting VPS cloud server...', { description: 'Estimated downtime: ~30 seconds' });
    setTimeout(() => {
      setRestarting(false);
      toast.success('VPS cloud server restarted successfully');
    }, 3000);
  };

  const handleDownloadLogs = () => {
    const logLines = [
      `# System logs export — generated ${new Date().toISOString()}`,
      ...Array.from({ length: 50 }).map((_, i) => {
        const t = new Date(Date.now() - i * 60000).toISOString();
        const lvls = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
        const lvl = lvls[i % lvls.length];
        return `[${t}] ${lvl} system: sample log line #${i + 1}`;
      }),
    ].join('\n');
    const blob = new Blob([logLines], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-logs-${Date.now()}.log`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Logs downloaded');
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">System</h1>
              <Badge variant="destructive" className="gap-1">
                <Lock className="h-3 w-3" /> Admin only
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              Security incidents, VPS cloud status, and administrative controls.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadLogs}>
              <Download className="h-4 w-4" /> Download Logs
            </Button>
            <Button variant="destructive" onClick={handleRestart} disabled={restarting}>
              {restarting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Power className="h-4 w-4" />}
              {restarting ? 'Restarting...' : 'Restart VPS'}
            </Button>
          </div>
        </div>

        {/* VPS stat cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<Cpu className="h-4 w-4" />} label="CPU Usage" value={`${stats.cpu.toFixed(0)}%`} progress={stats.cpu} />
          <StatCard icon={<MemoryStick className="h-4 w-4" />} label="Memory" value={`${stats.memory.toFixed(0)}%`} progress={stats.memory} />
          <StatCard icon={<HardDrive className="h-4 w-4" />} label="Disk" value={`${stats.disk}%`} progress={stats.disk} />
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5">
                <Network className="h-4 w-4" /> Network
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">In</span><span className="font-medium">{stats.networkIn.toFixed(0)} KB/s</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Out</span><span className="font-medium">{stats.networkOut.toFixed(0)} KB/s</span></div>
              <div className="flex justify-between pt-1 border-t mt-2"><span className="text-muted-foreground">Uptime</span><span className="font-medium">{stats.uptime}</span></div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="incidents">
          <TabsList>
            <TabsTrigger value="incidents"><ShieldAlert className="h-4 w-4 mr-1" /> Security Incidents</TabsTrigger>
            <TabsTrigger value="processes"><Activity className="h-4 w-4 mr-1" /> Processes</TabsTrigger>
            <TabsTrigger value="logs"><FileText className="h-4 w-4 mr-1" /> Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="incidents">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  Recent Security Incidents
                </CardTitle>
                <CardDescription>Latest detected events from intrusion, auth, and anomaly detectors.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {initialIncidents.map((inc) => (
                      <TableRow key={inc.id}>
                        <TableCell className="font-mono text-xs">{inc.id}</TableCell>
                        <TableCell>{inc.type}</TableCell>
                        <TableCell><Badge variant={severityVariant[inc.severity]}>{inc.severity}</Badge></TableCell>
                        <TableCell className="text-muted-foreground">{inc.source}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">{inc.timestamp}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="processes">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Running Processes</CardTitle>
                <CardDescription>Top processes by resource consumption.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PID</TableHead>
                      <TableHead>Process</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>CPU %</TableHead>
                      <TableHead>Memory %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockProcesses.map((p) => (
                      <TableRow key={p.pid}>
                        <TableCell className="font-mono text-xs">{p.pid}</TableCell>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell className="text-muted-foreground">{p.user}</TableCell>
                        <TableCell>{p.cpu.toFixed(1)}%</TableCell>
                        <TableCell>{p.memory.toFixed(1)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">System Logs</CardTitle>
                  <CardDescription>Live tail of system journal.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleDownloadLogs}>
                  <Download className="h-4 w-4" /> Download
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] rounded border bg-muted/30 p-3">
                  <pre className="text-xs font-mono leading-relaxed">
{Array.from({ length: 40 }).map((_, i) => {
  const t = new Date(Date.now() - i * 60000).toISOString();
  const lvls = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
  const lvl = lvls[i % lvls.length];
  return `[${t}] ${lvl.padEnd(5)} system: sample log line #${i + 1}\n`;
}).join('')}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}

function StatCard({ icon, label, value, progress }: { icon: React.ReactNode; label: string; value: string; progress: number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription className="flex items-center gap-1.5">{icon} {label}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold mb-2">{value}</div>
        <Progress value={progress} className="h-2" />
      </CardContent>
    </Card>
  );
}
