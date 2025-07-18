import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Cpu, 
  Database, 
  Globe, 
  HardDrive, 
  MemoryStick, 
  Network, 
  Server, 
  Shield, 
  Zap,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/services/advancedApiClient';

interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: {
    api: ServiceStatus;
    database: ServiceStatus;
    redis: ServiceStatus;
    celery: ServiceStatus;
    embeddings: ServiceStatus;
    llm_providers: ServiceStatus;
    storage: ServiceStatus;
  };
  metrics: {
    response_time: number;
    error_rate: number;
    throughput: number;
    active_connections: number;
    memory_usage: number;
    cpu_usage: number;
    disk_usage: number;
  };
  alerts: Alert[];
  last_updated: number;
}

interface ServiceStatus {
  status: 'online' | 'offline' | 'degraded';
  response_time: number;
  error_rate: number;
  last_check: number;
  details?: any;
}

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: number;
  resolved: boolean;
}

interface LLMProviderStatus {
  provider: string;
  status: 'online' | 'offline' | 'rate_limited';
  latency: number;
  error_rate: number;
  quota_used: number;
  quota_limit: number;
}

export const SystemMonitor: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [llmProviders, setLlmProviders] = useState<LLMProviderStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchSystemHealth = async () => {
    try {
      const response = await apiClient.request('/api/system/health');
      setHealth(response.data);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLLMProviders = async () => {
    try {
      const response = await apiClient.request('/api/system/llm-providers');
      setLlmProviders(response.data);
    } catch (error) {
      console.error('Failed to fetch LLM provider status:', error);
    }
  };

  useEffect(() => {
    fetchSystemHealth();
    fetchLLMProviders();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchSystemHealth();
      fetchLLMProviders();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return 'text-green-500';
      case 'degraded':
      case 'rate_limited':
        return 'text-yellow-500';
      case 'unhealthy':
      case 'offline':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'degraded':
      case 'rate_limited':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'unhealthy':
      case 'offline':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatUptime = (timestamp: number) => {
    const uptime = Date.now() - timestamp;
    const hours = Math.floor(uptime / (1000 * 60 * 60));
    const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const formatBytes = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
      bytes /= 1024;
      i++;
    }
    return `${bytes.toFixed(1)} ${units[i]}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
          <span>Loading system status...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-500 font-medium">Failed to load system status</p>
          <p className="text-gray-500 text-sm mt-1">{error}</p>
          <Button 
            onClick={fetchSystemHealth} 
            className="mt-4"
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!health) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">System Monitor</h2>
          <div className="flex items-center gap-2">
            {getStatusIcon(health.status)}
            <span className={`font-medium ${getStatusColor(health.status)}`}>
              {health.status.toUpperCase()}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? 'Disable' : 'Enable'} Auto-refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchSystemHealth();
              fetchLLMProviders();
            }}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {health.alerts.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-lg">Active Alerts</h3>
          {health.alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border ${
                alert.type === 'error' ? 'bg-red-50 border-red-200' :
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {alert.type === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                {alert.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                {alert.type === 'info' && <CheckCircle className="w-4 h-4 text-blue-500" />}
                <span className="font-medium">{alert.message}</span>
                <span className="text-xs text-gray-500 ml-auto">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {health.metrics.response_time}ms
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <TrendingUp className="w-3 h-3" />
              Average
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4" />
              Throughput
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {health.metrics.throughput}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <TrendingUp className="w-3 h-3" />
              Requests/min
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <AlertTriangle className="w-4 h-4" />
              Error Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(health.metrics.error_rate * 100).toFixed(2)}%
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <TrendingDown className="w-3 h-3" />
              Last 5 minutes
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Server className="w-4 h-4" />
              API Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(health.services.api.status)}
                <span className={getStatusColor(health.services.api.status)}>
                  {health.services.api.status}
                </span>
              </div>
              <Badge variant="outline">
                {health.services.api.response_time}ms
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Database className="w-4 h-4" />
              Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(health.services.database.status)}
                <span className={getStatusColor(health.services.database.status)}>
                  {health.services.database.status}
                </span>
              </div>
              <Badge variant="outline">
                {health.services.database.response_time}ms
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <MemoryStick className="w-4 h-4" />
              Redis Cache
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(health.services.redis.status)}
                <span className={getStatusColor(health.services.redis.status)}>
                  {health.services.redis.status}
                </span>
              </div>
              <Badge variant="outline">
                {health.services.redis.response_time}ms
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4" />
              Celery Workers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(health.services.celery.status)}
                <span className={getStatusColor(health.services.celery.status)}>
                  {health.services.celery.status}
                </span>
              </div>
              <Badge variant="outline">
                {health.services.celery.details?.active_workers || 0} workers
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Network className="w-4 h-4" />
              Embeddings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(health.services.embeddings.status)}
                <span className={getStatusColor(health.services.embeddings.status)}>
                  {health.services.embeddings.status}
                </span>
              </div>
              <Badge variant="outline">
                {health.services.embeddings.response_time}ms
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <HardDrive className="w-4 h-4" />
              Storage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(health.services.storage.status)}
                <span className={getStatusColor(health.services.storage.status)}>
                  {health.services.storage.status}
                </span>
              </div>
              <Badge variant="outline">
                {formatBytes(health.services.storage.details?.used || 0)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resource Usage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Cpu className="w-4 h-4" />
              CPU Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Current</span>
                <span className="text-sm font-medium">
                  {health.metrics.cpu_usage.toFixed(1)}%
                </span>
              </div>
              <Progress value={health.metrics.cpu_usage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <MemoryStick className="w-4 h-4" />
              Memory Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Current</span>
                <span className="text-sm font-medium">
                  {health.metrics.memory_usage.toFixed(1)}%
                </span>
              </div>
              <Progress value={health.metrics.memory_usage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <HardDrive className="w-4 h-4" />
              Disk Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Current</span>
                <span className="text-sm font-medium">
                  {health.metrics.disk_usage.toFixed(1)}%
                </span>
              </div>
              <Progress value={health.metrics.disk_usage} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* LLM Providers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            LLM Providers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {llmProviders.map((provider) => (
              <div key={provider.provider} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(provider.status)}
                  <div>
                    <span className="font-medium">{provider.provider}</span>
                    <div className="text-sm text-gray-500">
                      {provider.latency}ms • {(provider.error_rate * 100).toFixed(1)}% error rate
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {provider.quota_used} / {provider.quota_limit}
                  </div>
                  <div className="text-xs text-gray-500">Quota used</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500">
        Last updated: {new Date(health.last_updated).toLocaleString()}
      </div>
    </div>
  );
};