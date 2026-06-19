import React, { useState, useEffect, useRef } from 'react';
import { Activity, Play, Pause, Terminal, Cpu, Database, Hash, Sparkles, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface LiveTelemetryProps {
  accentColor?: string;
}

interface LogEntry {
  id: string;
  time: string;
  type: 'info' | 'warn' | 'error' | 'system';
  message: string;
}

const LiveTelemetry: React.FC<LiveTelemetryProps> = ({ accentColor = '#0055ff' }) => {
  const toast = useToast();
  const consoleRef = useRef<HTMLDivElement>(null);

  // Telemetry Engine Control States
  const [isActive, setIsActive] = useState(true);
  const [mode, setMode] = useState<'normal' | 'spike' | 'error'>('normal');
  const [isRestarting, setIsRestarting] = useState(false);

  // Live Metrics States
  const [rps, setRps] = useState(124);
  const [latency, setLatency] = useState(24);
  const [cpu, setCpu] = useState(18);
  const [wsConnections, setWsConnections] = useState(1428);
  const [dbPool, setDbPool] = useState(7);

  // History & Console Logs
  const [rpsHistory, setRpsHistory] = useState<number[]>(
    Array.from({ length: 20 }, () => 110 + Math.floor(Math.random() * 20))
  );
  
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', time: new Date(Date.now() - 60000).toLocaleTimeString(), type: 'system', message: 'Vibe Telemetry Daemon v4.1 initialized.' },
    { id: '2', time: new Date(Date.now() - 50000).toLocaleTimeString(), type: 'info', message: 'Inbound WS gateway listener bound to port 8080.' },
    { id: '3', time: new Date(Date.now() - 40000).toLocaleTimeString(), type: 'info', message: 'Database connection pool initialized: 7/50 active.' },
    { id: '4', time: new Date(Date.now() - 30000).toLocaleTimeString(), type: 'info', message: 'Memcached replica cluster connection online (latency 0.2ms).' },
    { id: '5', time: new Date(Date.now() - 20000).toLocaleTimeString(), type: 'info', message: 'Real-time sync channels established over Supabase WebSocket.' },
    { id: '6', time: new Date(Date.now() - 10000).toLocaleTimeString(), type: 'system', message: 'System diagnostics reporting 100% SLA uptime.' }
  ]);

  const [terminalInput, setTerminalInput] = useState('');

  // Auto-scroll terminal console to bottom
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);

  // Simulation loop ticker
  useEffect(() => {
    if (!isActive || isRestarting) return;

    const interval = setInterval(() => {
      const timeStr = new Date().toLocaleTimeString();
      let nextRps = rps;
      let nextLatency = latency;
      let nextCpu = cpu;
      let nextWs = wsConnections;
      let nextDb = dbPool;
      let logType: 'info' | 'warn' | 'error' = 'info';
      let logMsg = '';

      if (mode === 'normal') {
        nextRps = 110 + Math.floor(Math.random() * 25);
        nextLatency = 18 + Math.floor(Math.random() * 11);
        nextCpu = 12 + Math.floor(Math.random() * 13);
        nextWs = 1410 + Math.floor(Math.random() * 26);
        nextDb = 4 + Math.floor(Math.random() * 5);

        // Simulated Normal Log Messages
        const randomChoice = Math.random();
        if (randomChoice < 0.25) {
          logMsg = `[API] GET /api/v1/whitelabel/config - 200 OK (${nextLatency}ms)`;
        } else if (randomChoice < 0.5) {
          logMsg = `[DB_POOL] Query success: SELECT * FROM whitelabel_configs (Pool: ${nextDb}/50)`;
        } else if (randomChoice < 0.75) {
          logMsg = `[WS_ROUTER] Routed message event 'fanzone:reaction' to ${nextWs} clients`;
        } else {
          logMsg = `[CACHE] Memcached hit: session_token_${Math.floor(Math.random() * 9000 + 1000)} (0.4ms)`;
        }
      } else if (mode === 'spike') {
        nextRps = 790 + Math.floor(Math.random() * 160);
        nextLatency = 72 + Math.floor(Math.random() * 45);
        nextCpu = 78 + Math.floor(Math.random() * 17);
        nextWs = 4350 + Math.floor(Math.random() * 320);
        nextDb = 38 + Math.floor(Math.random() * 11);
        logType = 'warn';

        // Simulated Spike Log Messages
        const randomChoice = Math.random();
        if (randomChoice < 0.33) {
          logMsg = `[LOAD_BALANCER] WARNING: High traffic load detected on node cluster api-v3 (RPS: ${nextRps})`;
        } else if (randomChoice < 0.66) {
          logMsg = `[DB_POOL] Threshold warning: Active connection pool high (${nextDb}/50 allocations)`;
        } else {
          logMsg = `[WS_ROUTER] Event broadcast latency surge: reaction dispatch took ${Math.floor(nextLatency / 5)}ms`;
        }
      } else if (mode === 'error') {
        nextRps = 6 + Math.floor(Math.random() * 11);
        nextLatency = 1500 + Math.floor(Math.random() * 800);
        nextCpu = 97 + Math.floor(Math.random() * 4);
        nextWs = 110 + Math.floor(Math.random() * 70);
        nextDb = 50;
        logType = 'error';

        // Simulated Error Log Messages
        const randomChoice = Math.random();
        if (randomChoice < 0.33) {
          logMsg = `[DB_POOL] FATAL: Connection pool exhausted (50/50 limits reached). Transaction timeouts imminent.`;
        } else if (randomChoice < 0.66) {
          logMsg = `[GATEWAY] ERROR: 504 Gateway Timeout - Upstream server took too long to respond (${nextLatency}ms)`;
        } else {
          logMsg = `[PROCESS_WATCHER] CRITICAL: CPU thermal throttling active. CPU load pinned at ${nextCpu}%`;
        }
      }

      // Update states
      setRps(nextRps);
      setLatency(nextLatency);
      setCpu(nextCpu);
      setWsConnections(nextWs);
      setDbPool(nextDb);

      setRpsHistory(prev => [...prev.slice(1), nextRps]);
      
      const newEntry: LogEntry = {
        id: Math.random().toString(),
        time: timeStr,
        type: logType,
        message: logMsg
      };
      setLogs(prev => [...prev.slice(-29), newEntry]);

    }, 1500);

    return () => clearInterval(interval);
  }, [isActive, mode, rps, latency, cpu, wsConnections, dbPool, isRestarting]);

  // Terminal commands interpreter
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCmd = terminalInput.trim().toLowerCase();
    if (!cleanCmd) return;

    const timeStr = new Date().toLocaleTimeString();
    const userLog: LogEntry = {
      id: Math.random().toString(),
      time: timeStr,
      type: 'system',
      message: `GOD_VIEW:~$ ${terminalInput}`
    };

    setLogs(prev => [...prev.slice(-29), userLog]);
    setTerminalInput('');

    // Command matching
    const parts = cleanCmd.split(' ');
    const mainCommand = parts[0];

    setTimeout(() => {
      const responseTimeStr = new Date().toLocaleTimeString();
      let responseMsg = '';
      let responseType: 'info' | 'warn' | 'error' | 'system' = 'system';

      if (mainCommand === 'help') {
        responseMsg = 'Available commands: [status, clear, restart, scale <n>, spike, normal, error, toggle]';
      } else if (mainCommand === 'clear') {
        setLogs([]);
        return;
      } else if (mainCommand === 'toggle') {
        setIsActive(prev => !prev);
        responseMsg = `Telemetry simulator engine ${!isActive ? 'RESUMED' : 'PAUSED'}.`;
      } else if (mainCommand === 'normal') {
        setMode('normal');
        responseMsg = 'Simulation mode switched to NORMAL. Restoring load parameters.';
      } else if (mainCommand === 'spike') {
        setMode('spike');
        responseMsg = 'Simulation mode switched to LOAD SPIKE. Simulating traffic surge.';
        responseType = 'warn';
      } else if (mainCommand === 'error') {
        setMode('error');
        responseMsg = 'Simulation mode switched to SERVER ERROR. Simulating upstream crash.';
        responseType = 'error';
      } else if (mainCommand === 'restart') {
        setIsRestarting(true);
        setMode('normal');
        setRps(0);
        setLatency(0);
        setCpu(0);
        setWsConnections(0);
        setDbPool(0);
        setRpsHistory(Array(20).fill(0));

        setLogs(prev => [
          ...prev,
          { id: Math.random().toString(), time: responseTimeStr, type: 'error', message: '[SYSTEM] Initiating warm reboot sequence...' },
          { id: Math.random().toString(), time: responseTimeStr, type: 'warn', message: '[SYSTEM] Draining active WebSocket listener nodes...' },
          { id: Math.random().toString(), time: responseTimeStr, type: 'info', message: '[SYSTEM] Reallocating memory stack & clear daemon caches...' }
        ]);

        setTimeout(() => {
          const restartTimeStr = new Date().toLocaleTimeString();
          setIsRestarting(false);
          setRps(124);
          setLatency(24);
          setCpu(18);
          setWsConnections(1428);
          setDbPool(7);
          setRpsHistory(Array.from({ length: 20 }, () => 110 + Math.floor(Math.random() * 20)));
          setLogs(prev => [
            ...prev,
            { id: Math.random().toString(), time: restartTimeStr, type: 'system', message: 'Vibe Telemetry Daemon restarted successfully.' },
            { id: Math.random().toString(), time: restartTimeStr, type: 'info', message: 'System SLA fully online (100% capacity restored).' }
          ]);
          toast.success('Platform Telemetry Engine successfully rebooted!');
        }, 3000);
        return;
      } else if (mainCommand === 'scale') {
        const replicas = parts[1] ? parseInt(parts[1]) : 5;
        if (isNaN(replicas) || replicas < 1 || replicas > 100) {
          responseMsg = 'Error: Invalid scale allocation. Range must be between 1 and 100.';
          responseType = 'error';
        } else {
          setLogs(prev => [
            ...prev,
            { id: Math.random().toString(), time: responseTimeStr, type: 'system', message: `[SYSTEM] Scaling API gateway nodes to ${replicas} running container replicas...` }
          ]);
          setTimeout(() => {
            const scaleDoneTime = new Date().toLocaleTimeString();
            setLogs(prev => [
              ...prev,
              { id: Math.random().toString(), time: scaleDoneTime, type: 'info', message: `[SYSTEM] Scale complete: ${replicas}/${replicas} gateway pods reporting healthy.` }
            ]);
            toast.success(`Gateway successfully scaled to ${replicas} instances.`);
          }, 1500);
          return;
        }
      } else if (mainCommand === 'status') {
        setLogs(prev => [
          ...prev,
          { id: Math.random().toString(), time: responseTimeStr, type: 'system', message: `===========================================` },
          { id: Math.random().toString(), time: responseTimeStr, type: 'info', message: `PLATFORM CORE CONFIG: Active | Simulation: ${mode.toUpperCase()}` },
          { id: Math.random().toString(), time: responseTimeStr, type: 'info', message: `RPS: ${rps} requests/sec | Latency: ${latency}ms | Load: ${cpu}%` },
          { id: Math.random().toString(), time: responseTimeStr, type: 'info', message: `Sockets: ${wsConnections} active channels | DB Allocations: ${dbPool}/50` },
          { id: Math.random().toString(), time: responseTimeStr, type: 'system', message: `===========================================` }
        ]);
        return;
      } else {
        responseMsg = `CONSOLE ERROR: Unknown control instruction '${mainCommand}'. Type 'help' for diagnostics.`;
        responseType = 'error';
      }

      setLogs(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          time: responseTimeStr,
          type: responseType,
          message: responseMsg
        }
      ]);
    }, 400);

  };

  // SVG dimensions for chart plotting
  const chartWidth = 500;
  const chartHeight = 120;
  const maxRpsVal = mode === 'spike' ? 1200 : mode === 'error' ? 200 : 250;
  const minRpsVal = 0;

  // Calculate coordinates for SVG sparkline
  const points = rpsHistory.map((val, idx) => {
    const x = (idx / (rpsHistory.length - 1)) * chartWidth;
    // Map val to y-coordinate (inverted because SVG 0 is top)
    const y = chartHeight - ((val - minRpsVal) / (maxRpsVal - minRpsVal)) * (chartHeight - 16) - 8;
    return { x, y };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return acc + (idx === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`);
  }, '');

  // Fill path going down to bottom-left/right corners for area gradient
  const fillD = pathD + ` L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Simulation Controls row */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Activity size={24} color={mode === 'error' ? '#ff3b30' : mode === 'spike' ? '#ff9500' : '#00ff88'} style={{ animation: isActive && !isRestarting ? 'pulse 2s infinite' : 'none' }} />
            {isActive && !isRestarting && (
              <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 6px #00ff88' }} />
            )}
          </div>
          <div>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>Platform Daemon Simulator</h4>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
              {isRestarting ? 'Daemon rebooting...' : isActive ? `Active • Simulating ${mode.toUpperCase()} load` : 'Telemetry system paused'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            onClick={() => setMode('normal')}
            disabled={isRestarting}
            style={{ 
              padding: '10px 18px', 
              background: mode === 'normal' ? 'rgba(0,255,136,0.12)' : 'rgba(255,255,255,0.02)', 
              color: mode === 'normal' ? '#00ff88' : '#888',
              border: mode === 'normal' ? '1px solid rgba(0,255,136,0.3)' : '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            Normal Load
          </button>
          <button 
            onClick={() => setMode('spike')}
            disabled={isRestarting}
            style={{ 
              padding: '10px 18px', 
              background: mode === 'spike' ? 'rgba(255,149,0,0.12)' : 'rgba(255,255,255,0.02)', 
              color: mode === 'spike' ? '#ff9500' : '#888',
              border: mode === 'spike' ? '1px solid rgba(255,149,0,0.3)' : '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            Traffic Spike
          </button>
          <button 
            onClick={() => setMode('error')}
            disabled={isRestarting}
            style={{ 
              padding: '10px 18px', 
              background: mode === 'error' ? 'rgba(255,59,48,0.12)' : 'rgba(255,255,255,0.02)', 
              color: mode === 'error' ? '#ff3b30' : '#888',
              border: mode === 'error' ? '1px solid rgba(255,59,48,0.3)' : '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            System Crash
          </button>
          
          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 8px' }} />

          <button 
            onClick={() => setIsActive(!isActive)}
            disabled={isRestarting}
            style={{ 
              width: '42px', height: '42px', borderRadius: '12px', 
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s'
            }}
            title={isActive ? 'Pause Simulator' : 'Play Simulator'}
            onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'}
            onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.04)'}
          >
            {isActive ? <Pause size={18} /> : <Play size={18} />}
          </button>
        </div>
      </div>

      {/* Main Grid for Meters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        
        {/* Metric 1: RPS */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Request Rate</span>
            <Hash size={16} color={accentColor} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, marginBottom: '6px', fontFamily: 'monospace' }}>{rps} <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>req/s</span></div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min((rps / 1000) * 100, 100)}%`, height: '100%', background: mode === 'error' ? '#ff3b30' : mode === 'spike' ? '#ff9500' : accentColor, borderRadius: '3px', transition: 'width 0.4s' }} />
          </div>
        </div>

        {/* Metric 2: Latency */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Avg Latency</span>
            <Activity size={16} color={latency > 150 ? '#ff3b30' : latency > 50 ? '#ff9500' : '#00ff88'} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, marginBottom: '6px', fontFamily: 'monospace', color: latency > 500 ? '#ff3b30' : 'inherit' }}>
            {latency >= 1000 ? `${(latency/1000).toFixed(2)}s` : `${latency}ms`}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: latency > 300 ? '#ff3b30' : latency > 50 ? '#ff9500' : '#00ff88' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold' }}>
              {latency > 300 ? 'Severe Lag/Timeout' : latency > 50 ? 'Moderate Queueing' : 'Connection Optimal'}
            </span>
          </div>
        </div>

        {/* Metric 3: CPU Load */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>CPU Load</span>
            <Cpu size={16} color={cpu > 80 ? '#ff3b30' : '#00ff88'} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, marginBottom: '6px', fontFamily: 'monospace' }}>{cpu}%</div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${cpu}%`, height: '100%', background: cpu > 85 ? '#ff3b30' : cpu > 60 ? '#ff9500' : '#00ff88', borderRadius: '3px', transition: 'width 0.4s' }} />
          </div>
        </div>

        {/* Metric 4: DB pool */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>DB Pool Allocation</span>
            <Database size={16} color={dbPool > 40 ? '#ff3b30' : '#00ff88'} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, marginBottom: '6px', fontFamily: 'monospace' }}>{dbPool}<span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: 'bold' }}>/50</span></div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold' }}>
            {dbPool === 50 ? 'Pool fully locked (Crash)' : `${(50 - dbPool)} queries available`}
          </div>
        </div>

      </div>

      {/* Split Grid for SVG Line Chart & Terminal Console */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '30px' }} className="flex-col-mobile">
        
        {/* SVG Sparkline Graph */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} color={accentColor} />
              <span style={{ fontWeight: 'bold', fontSize: '15px' }}>RPS Analytics Stream (20 Interval History)</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
              Scale Limit: {maxRpsVal} RPS
            </div>
          </div>

          <div style={{ width: '100%', position: 'relative', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)', padding: '10px 0', overflow: 'hidden' }}>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" height={chartHeight} style={{ overflow: 'visible', display: 'block' }}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={mode === 'error' ? '#ff3b30' : mode === 'spike' ? '#ff9500' : accentColor} stopOpacity="0.25"/>
                  <stop offset="100%" stopColor={mode === 'error' ? '#ff3b30' : mode === 'spike' ? '#ff9500' : accentColor} stopOpacity="0"/>
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1={chartHeight * 0.25} x2={chartWidth} y2={chartHeight * 0.25} stroke="rgba(255,255,255,0.04)" strokeDasharray="3" />
              <line x1="0" y1={chartHeight * 0.5} x2={chartWidth} y2={chartHeight * 0.5} stroke="rgba(255,255,255,0.04)" strokeDasharray="3" />
              <line x1="0" y1={chartHeight * 0.75} x2={chartWidth} y2={chartHeight * 0.75} stroke="rgba(255,255,255,0.04)" strokeDasharray="3" />

              {/* Area Under Curve */}
              <path d={fillD} fill="url(#areaGradient)" style={{ transition: 'd 0.4s ease' }} />

              {/* Glowing Thick Line duplicate */}
              <path d={pathD} fill="none" stroke={mode === 'error' ? '#ff3b30' : mode === 'spike' ? '#ff9500' : accentColor} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity="0.15" style={{ transition: 'd 0.4s ease' }} />
              
              {/* Main Line */}
              <path d={pathD} fill="none" stroke={mode === 'error' ? '#ff3b30' : mode === 'spike' ? '#ff9500' : accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'd 0.4s ease' }} />

              {/* Animated scanning bar marker */}
              {points.length > 0 && (
                <>
                  <line x1={points[points.length - 1].x} y1="0" x2={points[points.length - 1].x} y2={chartHeight} stroke={accentColor} strokeWidth="1" opacity="0.4" />
                  <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="5" fill={mode === 'error' ? '#ff3b30' : mode === 'spike' ? '#ff9500' : accentColor} stroke="#fff" strokeWidth="1.5" />
                </>
              )}
            </svg>
          </div>
        </div>

        {/* Console Logs Terminal */}
        <div style={{ background: '#050508', border: '1px solid rgba(0,85,255,0.15)', borderRadius: '24px', display: 'flex', flexDirection: 'column', height: '240px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.6)' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={14} color="#00ff88" />
              <span style={{ fontSize: '12px', fontWeight: 'bold', fontFamily: 'monospace', color: '#00ff88' }}>live_daemon@vibe_console</span>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f56' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#27c93f' }} />
            </div>
          </div>

          {/* Terminal log logs content */}
          <div ref={consoleRef} style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'monospace', fontSize: '11px', color: '#a5b4fc', lineHeight: 1.4 }} className="hide-scrollbar">
            {logs.length === 0 ? (
              <span style={{ color: '#4b5563', fontStyle: 'italic' }}>Terminal log buffer cleared. Waiting for events...</span>
            ) : (
              logs.map((log) => {
                let color = '#fff';
                if (log.type === 'warn') color = '#ff9500';
                else if (log.type === 'error') color = '#ff3b30';
                else if (log.type === 'system') color = '#00ff88';
                else color = '#94a3b8';

                return (
                  <div key={log.id} style={{ wordBreak: 'break-all' }}>
                    <span style={{ color: '#475569', marginRight: '8px' }}>[{log.time}]</span>
                    <span style={{ color }}>{log.message}</span>
                  </div>
                );
              })
            )}
          </div>

          {/* Command execution input footer */}
          <form onSubmit={handleCommandSubmit} style={{ borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', background: 'rgba(0,0,0,0.3)', flexShrink: 0 }}>
            <span style={{ color: '#00ff88', padding: '12px 0 12px 16px', fontFamily: 'monospace', fontSize: '12px', fontWeight: 'bold' }}>~$</span>
            <input 
              type="text"
              placeholder="Inject diagnostic instruction... (try 'help')"
              value={terminalInput}
              onChange={e => setTerminalInput(e.target.value)}
              disabled={isRestarting}
              style={{
                flex: 1, background: 'transparent', border: 'none', color: '#00ff88',
                padding: '12px', fontFamily: 'monospace', fontSize: '12px', outline: 'none'
              }}
            />
          </form>
        </div>

      </div>

    </div>
  );
};

export default LiveTelemetry;
