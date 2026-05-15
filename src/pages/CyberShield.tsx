import CyberShieldMonitor from "@/components/CyberShieldMonitor";

export default function CyberShield() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">CyberShield Monitor</h1>
        <p className="text-muted-foreground">Security intelligence and VPS system telemetry</p>
      </div>
      <CyberShieldMonitor />
    </div>
  );
}
