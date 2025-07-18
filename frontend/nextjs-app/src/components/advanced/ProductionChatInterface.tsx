import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  AlertCircle, 
  Loader2, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Zap, 
  Shield,
  TrendingUp,
  Activity,
  RefreshCw,
  Settings,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { InputForm } from '@/components/InputForm';
import { AgentActivityStream } from '@/components/AgentActivityStream';
import { DownloadMenu } from '@/components/DownloadMenu';
import { useAdvancedChat } from '@/hooks/useAdvancedChat';

interface ProductionChatInterfaceProps {
  sessionId?: string;
  onSessionChange?: (sessionId: string) => void;
  initialMode?: string;
  className?: string;
}

export const ProductionChatInterface: React.FC<ProductionChatInterfaceProps> = ({
  sessionId,
  onSessionChange,
  initialMode = 'general',
  className = ''
}) => {
  const [mode, setMode] = useState(initialMode);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSystemInfo, setShowSystemInfo] = useState(false);
  const [costBudget, setCostBudget] = useState(10.0); // $10 budget
  const [qualityThreshold, setQualityThreshold] = useState(0.85);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    isProcessing,
    isLoadingSession,
    estimatedCost,
    estimatedTime,
    routingDecision,
    events,
    totalCost,
    plagiarismScore,
    qualityScore,
    derivatives,
    isConnected,
    connectionError,
    sendMessage,
    cancelRequest,
    createSession,
    retryCount,
    maxRetries,
    error,
    session
  } = useAdvancedChat({
    sessionId,
    onMessage: (message) => {
      console.log('New message:', message);
    },
    onError: (error) => {
      console.error('Chat error:', error);
    },
    onCostUpdate: (cost) => {
      if (cost > costBudget * 0.8) {
        console.warn('Approaching cost budget limit');
      }
    },
    onQualityUpdate: (score) => {
      if (score < qualityThreshold) {
        console.warn('Quality score below threshold');
      }
    }
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle form submission
  const handleSubmit = useCallback(async (
    inputValue: string,
    writeupType: string,
    model: string,
    fileIds: string[]
  ) => {
    try {
      await sendMessage(inputValue, writeupType, {
        model,
        citationStyle: 'Harvard',
        wordCount: 3000
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [sendMessage]);

  // Get system status
  const getSystemStatus = () => {
    if (!isConnected && !connectionError) {
      return { status: 'connecting', color: 'bg-yellow-500', label: 'Connecting...' };
    }
    
    if (connectionError) {
      return { status: 'error', color: 'bg-red-500', label: 'Connection Error' };
    }
    
    if (isProcessing) {
      return { status: 'processing', color: 'bg-blue-500', label: 'Processing' };
    }
    
    if (isConnected) {
      return { status: 'connected', color: 'bg-green-500', label: 'Connected' };
    }
    
    return { status: 'idle', color: 'bg-gray-500', label: 'Idle' };
  };

  const systemStatus = getSystemStatus();

  // Calculate estimated completion time
  const getEstimatedCompletion = () => {
    if (!estimatedTime) return null;
    
    const completionTime = new Date(Date.now() + estimatedTime * 1000);
    return completionTime.toLocaleTimeString();
  };

  // Get quality indicator
  const getQualityIndicator = () => {
    if (qualityScore === undefined) return null;
    
    if (qualityScore >= 0.9) return { color: 'text-green-500', label: 'Excellent' };
    if (qualityScore >= 0.8) return { color: 'text-blue-500', label: 'Good' };
    if (qualityScore >= 0.7) return { color: 'text-yellow-500', label: 'Fair' };
    return { color: 'text-red-500', label: 'Poor' };
  };

  const qualityIndicator = getQualityIndicator();

  return (
    <div className={`flex flex-col h-full bg-gray-900 ${className}`}>
      {/* Header with system status and controls */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 ${systemStatus.color} rounded-full`} />
            <span className="text-sm font-medium text-white">{systemStatus.label}</span>
          </div>
          
          {routingDecision && (
            <Badge variant="outline" className="border-gray-600 text-gray-300">
              {routingDecision.system} • {Math.round(routingDecision.confidence * 100)}%
            </Badge>
          )}
          
          {retryCount > 0 && (
            <Badge variant="destructive" className="bg-red-900 text-red-300">
              Retry {retryCount}/{maxRetries}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Cost tracking */}
          {totalCost !== undefined && (
            <div className="flex items-center gap-1 text-sm text-gray-300">
              <DollarSign className="w-4 h-4" />
              <span>${totalCost.toFixed(2)}</span>
              <span className="text-gray-500">/ ${costBudget.toFixed(2)}</span>
            </div>
          )}
          
          {/* Quality indicator */}
          {qualityIndicator && (
            <div className={`flex items-center gap-1 text-sm ${qualityIndicator.color}`}>
              <TrendingUp className="w-4 h-4" />
              <span>{qualityIndicator.label}</span>
            </div>
          )}
          
          {/* Estimated completion */}
          {estimatedTime && isProcessing && (
            <div className="flex items-center gap-1 text-sm text-gray-300">
              <Clock className="w-4 h-4" />
              <span>~{getEstimatedCompletion()}</span>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSystemInfo(!showSystemInfo)}
            className="text-gray-300 hover:text-white"
          >
            <Settings className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-300 hover:text-white"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* System information panel */}
      {showSystemInfo && (
        <div className="p-4 bg-gray-800 border-b border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300">
                Events: {events.length}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">
                Originality: {plagiarismScore !== undefined ? `${plagiarismScore}%` : 'N/A'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-300">
                Model: {routingDecision?.system || 'Auto'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-purple-400" />
              <span className="text-gray-300">
                Session: {session?.id?.slice(-8) || 'New'}
              </span>
            </div>
          </div>
          
          {/* Cost budget progress */}
          {totalCost !== undefined && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">Cost Budget</span>
                <span className="text-sm text-gray-300">
                  ${totalCost.toFixed(2)} / ${costBudget.toFixed(2)}
                </span>
              </div>
              <Progress 
                value={(totalCost / costBudget) * 100} 
                className="h-2"
              />
            </div>
          )}
        </div>
      )}

      {/* Messages area */}
      <ScrollArea className="flex-grow" ref={scrollAreaRef}>
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
          {isLoadingSession && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
              <span className="ml-2 text-gray-300">Loading session...</span>
            </div>
          )}
          
          {messages.length === 0 && !isLoadingSession && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Ready to assist</h3>
                <p className="text-sm">Start a conversation or upload files to begin</p>
              </div>
              
              {routingDecision && (
                <Card className="mt-6 bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-sm text-gray-300">System Readiness</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-400">
                      <div className="flex items-center justify-between">
                        <span>Routing System:</span>
                        <span className="text-green-400">{routingDecision.system}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Confidence:</span>
                        <span className="text-blue-400">{Math.round(routingDecision.confidence * 100)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.type === 'human' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${msg.type === 'human' ? 'ml-auto' : 'mr-auto'}`}>
                <div className={`p-4 rounded-2xl ${
                  msg.type === 'human' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-800 text-gray-100 border border-gray-700'
                }`}>
                  <div className="whitespace-pre-wrap break-words">
                    {msg.content}
                  </div>
                  
                  {/* Message metadata */}
                  {msg.metadata && (
                    <div className="mt-2 pt-2 border-t border-gray-600 text-xs text-gray-400">
                      <div className="flex items-center gap-4">
                        {msg.metadata.model && (
                          <span>Model: {msg.metadata.model}</span>
                        )}
                        {msg.metadata.tokens && (
                          <span>Tokens: {msg.metadata.tokens}</span>
                        )}
                        {msg.metadata.cost && (
                          <span>Cost: ${msg.metadata.cost.toFixed(3)}</span>
                        )}
                        {msg.metadata.processing_time && (
                          <span>Time: {msg.metadata.processing_time}s</span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Download menu for AI messages */}
                  {msg.type === 'ai' && derivatives.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-600">
                      <DownloadMenu
                        traceId={msg.id}
                        derivatives={derivatives}
                        plagiarismScore={plagiarismScore}
                        qualityScore={qualityScore}
                        onOriginalityCheck={() => {
                          window.open(`/originality/${msg.id}`, '_blank');
                        }}
                      />
                    </div>
                  )}
                </div>
                
                {/* Message attribution */}
                <div className={`text-xs text-gray-400 mt-1 ${msg.type === 'human' ? 'text-right' : 'text-left'}`}>
                  {msg.type === 'human' ? 'You' : 'HandyWriterz'}
                  <span className="ml-2">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {/* Error display */}
          {error && (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Error</span>
              </div>
              <p className="text-red-300 mt-2">{error.message}</p>
              {retryCount > 0 && (
                <p className="text-red-400 text-sm mt-1">
                  Retry attempt {retryCount} of {maxRetries}
                </p>
              )}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Activity stream */}
      {isProcessing && (
        <div className="border-t border-gray-700 bg-gray-800/50">
          <AgentActivityStream 
            events={events}
            totalCost={totalCost}
            plagiarismScore={plagiarismScore}
            qualityScore={qualityScore}
            derivatives={derivatives}
          />
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-gray-700 bg-gray-900">
        <InputForm
          onSubmit={handleSubmit}
          isLoading={isProcessing}
          onCancel={cancelRequest}
          hasHistory={messages.length > 0}
        />
      </div>
      
      {/* Connection status indicator */}
      {connectionError && (
        <div className="absolute bottom-4 right-4 bg-red-900 text-red-300 px-3 py-2 rounded-lg text-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Connection lost</span>
          </div>
        </div>
      )}
    </div>
  );
};