import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Package, Search, ArrowUpDown, Trash2, Send, Activity,
  Clock, AlertTriangle, CheckCircle, Box, Truck, Database,
  Filter, BarChart3, Settings, RefreshCw, Target, Zap,
  Calendar, MapPin, Weight, Thermometer, Star, User,
  TrendingUp, TrendingDown, Eye, Brain, Lightbulb, Timer
} from 'lucide-react';

// Data Structures
interface CargoItem {
  id: string;
  name: string;
  category: 'FOOD' | 'MEDICAL' | 'EQUIPMENT' | 'RESEARCH' | 'MAINTENANCE' | 'PERSONAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  weight: number; // kg
  volume: number; // liters
  expiryDate?: Date;
  status: 'ACTIVE' | 'EXPIRED' | 'WASTE' | 'CONSUMED';
  location: string;
  addedDate: Date;
  lastAccessed?: Date;
  accessCount: number;
  temperature?: number; // Celsius
  fragile: boolean;
  description: string;
}

interface OptimizationSuggestion {
  id: string;
  type: 'PLACEMENT' | 'RETRIEVAL' | 'REARRANGEMENT' | 'DISPOSAL' | 'PREPARATION';
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  estimatedTime: number; // minutes
  energySaving: number; // percentage
  items: string[]; // item IDs
  location: string;
  reason: string;
}

interface ActionLog {
  id: string;
  timestamp: Date;
  astronaut: string;
  action: 'ADD' | 'REMOVE' | 'MOVE' | 'ACCESS' | 'DISPOSE' | 'OPTIMIZE';
  itemId: string;
  itemName: string;
  fromLocation?: string;
  toLocation?: string;
  duration: number; // minutes
  success: boolean;
  notes?: string;
}

interface AnalyticsData {
  totalItems: number;
  totalWeight: number;
  totalVolume: number;
  categoryBreakdown: Record<string, number>;
  priorityBreakdown: Record<string, number>;
  utilizationRate: number;
  averageAccessTime: number;
  expiringItems: number;
  wasteItems: number;
  criticalItems: number;
}

export const CargoManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'optimization' | 'analytics' | 'logs'>('inventory');
  const [items, setItems] = useState<CargoItem[]>([]);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'priority' | 'expiry' | 'access'>('priority');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Initialize demo data
  useEffect(() => {
    initializeDemoData();
  }, []);

  const initializeDemoData = () => {
    const demoItems: CargoItem[] = [
      {
        id: 'item-001',
        name: 'Emergency Medical Kit',
        category: 'MEDICAL',
        priority: 'CRITICAL',
        weight: 2.5,
        volume: 8.0,
        status: 'ACTIVE',
        location: 'Module-A-Compartment-1',
        addedDate: new Date('2025-01-15'),
        lastAccessed: new Date('2025-01-20'),
        accessCount: 3,
        fragile: true,
        description: 'Advanced emergency medical supplies for critical situations'
      },
      {
        id: 'item-002',
        name: 'Protein Bars (50 pack)',
        category: 'FOOD',
        priority: 'HIGH',
        weight: 3.2,
        volume: 12.0,
        expiryDate: new Date('2025-06-15'),
        status: 'ACTIVE',
        location: 'Module-B-Compartment-3',
        addedDate: new Date('2025-01-10'),
        lastAccessed: new Date('2025-02-01'),
        accessCount: 12,
        fragile: false,
        description: 'High-energy protein bars for daily nutrition'
      },
      {
        id: 'item-003',
        name: 'Solar Panel Diagnostic Tool',
        category: 'EQUIPMENT',
        priority: 'MEDIUM',
        weight: 1.8,
        volume: 5.5,
        status: 'ACTIVE',
        location: 'Module-C-Compartment-2',
        addedDate: new Date('2025-01-08'),
        lastAccessed: new Date('2025-01-25'),
        accessCount: 5,
        fragile: true,
        description: 'Precision instrument for solar panel maintenance'
      },
      {
        id: 'item-004',
        name: 'Water Purification Tablets',
        category: 'MEDICAL',
        priority: 'HIGH',
        weight: 0.5,
        volume: 2.0,
        expiryDate: new Date('2025-12-31'),
        status: 'ACTIVE',
        location: 'Module-A-Compartment-4',
        addedDate: new Date('2025-01-12'),
        lastAccessed: new Date('2025-01-30'),
        accessCount: 8,
        fragile: false,
        description: 'Emergency water purification supplies'
      },
      {
        id: 'item-005',
        name: 'Expired Ration Pack',
        category: 'FOOD',
        priority: 'LOW',
        weight: 1.2,
        volume: 4.0,
        expiryDate: new Date('2025-01-20'),
        status: 'EXPIRED',
        location: 'Module-B-Compartment-1',
        addedDate: new Date('2024-11-15'),
        lastAccessed: new Date('2025-01-18'),
        accessCount: 2,
        fragile: false,
        description: 'Expired food ration requiring disposal'
      }
    ];

    const demoSuggestions: OptimizationSuggestion[] = [
      {
        id: 'sug-001',
        type: 'PLACEMENT',
        title: 'Optimize Medical Supply Placement',
        description: 'Move critical medical items to more accessible locations near the main airlock',
        priority: 'HIGH',
        estimatedTime: 15,
        energySaving: 25,
        items: ['item-001'],
        location: 'Module-A-Compartment-1',
        reason: 'Frequently accessed items should be in primary access zones'
      },
      {
        id: 'sug-002',
        type: 'DISPOSAL',
        title: 'Schedule Waste Disposal',
        description: 'Remove expired food items and prepare for next cargo return mission',
        priority: 'MEDIUM',
        estimatedTime: 10,
        energySaving: 15,
        items: ['item-005'],
        location: 'Waste Storage Module',
        reason: 'Expired items consume valuable storage space'
      },
      {
        id: 'sug-003',
        type: 'REARRANGEMENT',
        title: 'Rebalance Module-B Storage',
        description: 'Redistribute weight in Module-B to improve center of gravity',
        priority: 'LOW',
        estimatedTime: 30,
        energySaving: 10,
        items: ['item-002'],
        location: 'Module-B-Compartment-2',
        reason: 'Current weight distribution may affect station stability'
      }
    ];

    const demoLogs: ActionLog[] = [
      {
        id: 'log-001',
        timestamp: new Date('2025-02-05T10:30:00Z'),
        astronaut: 'Commander Sarah Chen',
        action: 'ACCESS',
        itemId: 'item-001',
        itemName: 'Emergency Medical Kit',
        fromLocation: 'Module-A-Compartment-1',
        duration: 5,
        success: true,
        notes: 'Routine medical supplies inventory check'
      },
      {
        id: 'log-002',
        timestamp: new Date('2025-02-04T14:15:00Z'),
        astronaut: 'Engineer Alex Rodriguez',
        action: 'MOVE',
        itemId: 'item-003',
        itemName: 'Solar Panel Diagnostic Tool',
        fromLocation: 'Module-C-Compartment-1',
        toLocation: 'Module-C-Compartment-2',
        duration: 12,
        success: true,
        notes: 'Relocated for better organization'
      },
      {
        id: 'log-003',
        timestamp: new Date('2025-02-03T16:45:00Z'),
        astronaut: 'Scientist Dr. Kim Park',
        action: 'ADD',
        itemId: 'item-004',
        itemName: 'Water Purification Tablets',
        toLocation: 'Module-A-Compartment-4',
        duration: 8,
        success: true,
        notes: 'Added new emergency supplies from recent cargo delivery'
      }
    ];

    setItems(demoItems);
    setSuggestions(demoSuggestions);
    setActionLogs(demoLogs);
  };

  // Generate AI optimization suggestions
  const generateOptimizationSuggestions = useCallback(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      const newSuggestions: OptimizationSuggestion[] = [];

      // Check for expired items
      const expiredItems = items.filter(item => 
        item.expiryDate && item.expiryDate < new Date() && item.status === 'ACTIVE'
      );
      
      if (expiredItems.length > 0) {
        newSuggestions.push({
          id: `sug-disposal-${Date.now()}`,
          type: 'DISPOSAL',
          title: `Dispose ${expiredItems.length} Expired Items`,
          description: 'Move expired items to waste storage for next cargo return',
          priority: 'HIGH',
          estimatedTime: expiredItems.length * 3,
          energySaving: 20,
          items: expiredItems.map(item => item.id),
          location: 'Waste Storage Module',
          reason: 'Expired items pose health risks and waste storage space'
        });
      }

      // Check for frequently accessed items in poor locations
      const frequentItems = items.filter(item => item.accessCount > 5);
      frequentItems.forEach(item => {
        if (!item.location.includes('Compartment-1')) {
          newSuggestions.push({
            id: `sug-placement-${item.id}`,
            type: 'PLACEMENT',
            title: `Relocate Frequently Used ${item.name}`,
            description: 'Move to primary access compartment for easier retrieval',
            priority: 'MEDIUM',
            estimatedTime: 10,
            energySaving: 30,
            items: [item.id],
            location: 'Module-A-Compartment-1',
            reason: 'High access frequency items should be in primary zones'
          });
        }
      });

      // Check for critical items accessibility
      const criticalItems = items.filter(item => item.priority === 'CRITICAL');
      criticalItems.forEach(item => {
        if (item.location.includes('Compartment-3') || item.location.includes('Compartment-4')) {
          newSuggestions.push({
            id: `sug-critical-${item.id}`,
            type: 'PLACEMENT',
            title: `Prioritize Critical Item: ${item.name}`,
            description: 'Move critical priority item to immediate access location',
            priority: 'CRITICAL',
            estimatedTime: 8,
            energySaving: 35,
            items: [item.id],
            location: 'Module-A-Compartment-1',
            reason: 'Critical items require immediate accessibility for emergencies'
          });
        }
      });

      setSuggestions(prev => [...prev, ...newSuggestions]);
      setIsLoading(false);
    }, 2000);
  }, [items]);

  // Analytics calculations
  const analytics = useMemo((): AnalyticsData => {
    const totalItems = items.length;
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    const totalVolume = items.reduce((sum, item) => sum + item.volume, 0);
    
    const categoryBreakdown = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const priorityBreakdown = items.reduce((acc, item) => {
      acc[item.priority] = (acc[item.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const activeItems = items.filter(item => item.status === 'ACTIVE');
    const utilizationRate = activeItems.length / totalItems * 100;
    
    const averageAccessTime = activeItems.reduce((sum, item) => sum + item.accessCount, 0) / activeItems.length;
    
    const now = new Date();
    const expiringItems = items.filter(item => 
      item.expiryDate && 
      item.expiryDate > now && 
      item.expiryDate <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    ).length;

    const wasteItems = items.filter(item => item.status === 'EXPIRED' || item.status === 'WASTE').length;
    const criticalItems = items.filter(item => item.priority === 'CRITICAL').length;

    return {
      totalItems,
      totalWeight,
      totalVolume,
      categoryBreakdown,
      priorityBreakdown,
      utilizationRate,
      averageAccessTime,
      expiringItems,
      wasteItems,
      criticalItems
    };
  }, [items]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let filtered = items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'ALL' || item.category === filterCategory;
      const matchesPriority = filterPriority === 'ALL' || item.priority === filterPriority;
      
      return matchesSearch && matchesCategory && matchesPriority;
    });

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'priority':
          const priorityOrder = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'expiry':
          if (!a.expiryDate && !b.expiryDate) return 0;
          if (!a.expiryDate) return 1;
          if (!b.expiryDate) return -1;
          return a.expiryDate.getTime() - b.expiryDate.getTime();
        case 'access':
          return b.accessCount - a.accessCount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [items, searchQuery, filterCategory, filterPriority, sortBy]);

  const renderInventory = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-gray-800/50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="ALL">All Categories</option>
            <option value="FOOD">Food</option>
            <option value="MEDICAL">Medical</option>
            <option value="EQUIPMENT">Equipment</option>
            <option value="RESEARCH">Research</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="PERSONAL">Personal</option>
          </select>
          
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="priority">Sort by Priority</option>
            <option value="name">Sort by Name</option>
            <option value="expiry">Sort by Expiry</option>
            <option value="access">Sort by Access Count</option>
          </select>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className={`bg-gray-800/50 rounded-lg p-6 border-l-4 transition-all hover:shadow-lg ${
              item.priority === 'CRITICAL' ? 'border-red-500' :
              item.priority === 'HIGH' ? 'border-orange-500' :
              item.priority === 'MEDIUM' ? 'border-yellow-500' : 'border-green-500'
            } ${item.status === 'EXPIRED' ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  item.priority === 'CRITICAL' ? 'bg-red-600 text-white' :
                  item.priority === 'HIGH' ? 'bg-orange-600 text-white' :
                  item.priority === 'MEDIUM' ? 'bg-yellow-600 text-black' :
                  'bg-green-600 text-white'
                }`}>
                  {item.priority}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${
                  item.status === 'ACTIVE' ? 'bg-green-600/20 text-green-300' :
                  item.status === 'EXPIRED' ? 'bg-red-600/20 text-red-300' :
                  'bg-gray-600/20 text-gray-300'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <span className="text-gray-400">Weight:</span>
                <span className="text-cyan-400 ml-2">{item.weight}kg</span>
              </div>
              <div>
                <span className="text-gray-400">Volume:</span>
                <span className="text-cyan-400 ml-2">{item.volume}L</span>
              </div>
              <div>
                <span className="text-gray-400">Category:</span>
                <span className="text-cyan-400 ml-2">{item.category}</span>
              </div>
              <div>
                <span className="text-gray-400">Access:</span>
                <span className="text-cyan-400 ml-2">{item.accessCount}x</span>
              </div>
            </div>

            <div className="text-sm mb-4">
              <div className="flex items-center mb-2">
                <MapPin className="text-gray-400 mr-2" size={16} />
                <span className="text-gray-300">{item.location}</span>
              </div>
              {item.expiryDate && (
                <div className="flex items-center">
                  <Clock className="text-orange-400 mr-2" size={16} />
                  <span className={`${
                    item.expiryDate < new Date() ? 'text-red-400' :
                    item.expiryDate < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? 'text-orange-400' :
                    'text-green-400'
                  }`}>
                    Expires: {item.expiryDate.toLocaleDateString()}
                  </span>
                </div>
              )}
              {item.fragile && (
                <div className="flex items-center mt-1">
                  <AlertTriangle className="text-yellow-400 mr-2" size={16} />
                  <span className="text-yellow-400 text-xs">Fragile Item</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => {
                  // Handle item access
                  setItems(prev => prev.map(i => 
                    i.id === item.id 
                      ? { ...i, accessCount: i.accessCount + 1, lastAccessed: new Date() }
                      : i
                  ));
                }}
                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-sm transition-colors"
              >
                Access Item
              </button>
              <div className="text-xs text-gray-500">
                Added: {item.addedDate.toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto mb-4 text-gray-400" size={64} />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No Items Found</h3>
          <p className="text-gray-500">
            {searchQuery || filterCategory !== 'ALL' || filterPriority !== 'ALL' 
              ? 'Try adjusting your search criteria' 
              : 'No cargo items in inventory'}
          </p>
        </div>
      )}
    </div>
  );

  const renderOptimization = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-cyan-400 flex items-center mb-4 lg:mb-0">
            <Brain className="mr-2" />
            AI Optimization Engine
          </h3>
          <button
            onClick={generateOptimizationSuggestions}
            disabled={isLoading}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center"
          >
            {isLoading ? (
              <RefreshCw className="mr-2 animate-spin" size={16} />
            ) : (
              <Lightbulb className="mr-2" size={16} />
            )}
            {isLoading ? 'Analyzing...' : 'Generate New Suggestions'}
          </button>
        </div>

        {isLoading && (
          <div className="bg-purple-900/20 border border-purple-500 rounded-lg p-6 mb-6">
            <div className="flex items-center space-y-0 space-x-4">
              <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
              <div>
                <h4 className="text-purple-400 font-bold">AI Analysis in Progress</h4>
                <p className="text-purple-300 text-sm">
                  Analyzing cargo placement efficiency, access patterns, and optimization opportunities...
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {suggestions.map((suggestion) => (
            <div 
              key={suggestion.id}
              className={`border rounded-lg p-6 ${
                suggestion.priority === 'CRITICAL' ? 'bg-red-900/20 border-red-500' :
                suggestion.priority === 'HIGH' ? 'bg-orange-900/20 border-orange-500' :
                suggestion.priority === 'MEDIUM' ? 'bg-yellow-900/20 border-yellow-500' :
                'bg-green-900/20 border-green-500'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className={`text-lg font-bold mb-2 ${
                    suggestion.priority === 'CRITICAL' ? 'text-red-400' :
                    suggestion.priority === 'HIGH' ? 'text-orange-400' :
                    suggestion.priority === 'MEDIUM' ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    {suggestion.title}
                  </h4>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    suggestion.priority === 'CRITICAL' ? 'bg-red-600 text-white' :
                    suggestion.priority === 'HIGH' ? 'bg-orange-600 text-white' :
                    suggestion.priority === 'MEDIUM' ? 'bg-yellow-600 text-black' :
                    'bg-green-600 text-white'
                  }`}>
                    {suggestion.type}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-cyan-400">
                    {suggestion.energySaving}%
                  </div>
                  <div className="text-xs text-gray-400">Energy Saved</div>
                </div>
              </div>

              <p className="text-gray-300 mb-4">{suggestion.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <span className="text-gray-400">Time Required:</span>
                  <span className="text-cyan-400 ml-2">{suggestion.estimatedTime} min</span>
                </div>
                <div>
                  <span className="text-gray-400">Items Affected:</span>
                  <span className="text-cyan-400 ml-2">{suggestion.items.length}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400">Target Location:</span>
                  <span className="text-cyan-400 ml-2">{suggestion.location}</span>
                </div>
              </div>

              <div className="bg-gray-700/30 rounded p-3 mb-4">
                <h5 className="text-sm font-semibold text-gray-300 mb-1">AI Reasoning:</h5>
                <p className="text-xs text-gray-400">{suggestion.reason}</p>
              </div>

              <div className="flex justify-between items-center">
                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors">
                  Implement Suggestion
                </button>
                <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors">
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>

        {suggestions.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Target className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Active Suggestions</h3>
            <p className="text-gray-500 mb-4">
              Your cargo management is optimized! Generate new suggestions to find improvements.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-900/30 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Package className="text-blue-400 mr-2" size={20} />
            <span className="text-sm text-gray-300">Total Items</span>
          </div>
          <span className="text-2xl font-bold text-blue-400">{analytics.totalItems}</span>
        </div>

        <div className="bg-purple-900/30 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Weight className="text-purple-400 mr-2" size={20} />
            <span className="text-sm text-gray-300">Total Weight</span>
          </div>
          <span className="text-2xl font-bold text-purple-400">{analytics.totalWeight.toFixed(1)}kg</span>
        </div>

        <div className="bg-green-900/30 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <TrendingUp className="text-green-400 mr-2" size={20} />
            <span className="text-sm text-gray-300">Utilization</span>
          </div>
          <span className="text-2xl font-bold text-green-400">{analytics.utilizationRate.toFixed(1)}%</span>
        </div>

        <div className="bg-red-900/30 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <AlertTriangle className="text-red-400 mr-2" size={20} />
            <span className="text-sm text-gray-300">Critical Items</span>
          </div>
          <span className="text-2xl font-bold text-red-400">{analytics.criticalItems}</span>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center">
          <BarChart3 className="mr-2" />
          Category Distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(analytics.categoryBreakdown).map(([category, count]) => (
            <div key={category} className="bg-gray-700/30 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">{category}</span>
                <span className="text-cyan-400 font-bold">{count}</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div
                  className="bg-cyan-500 h-2 rounded-full"
                  style={{ width: `${(count / analytics.totalItems) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {((count / analytics.totalItems) * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Priority and Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 rounded-lg p-6">
          <h4 className="text-lg font-bold text-cyan-400 mb-4">Priority Breakdown</h4>
          <div className="space-y-3">
            {Object.entries(analytics.priorityBreakdown).map(([priority, count]) => (
              <div key={priority} className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  priority === 'CRITICAL' ? 'bg-red-600 text-white' :
                  priority === 'HIGH' ? 'bg-orange-600 text-white' :
                  priority === 'MEDIUM' ? 'bg-yellow-600 text-black' :
                  'bg-green-600 text-white'
                }`}>
                  {priority}
                </span>
                <span className="text-cyan-400 font-bold">{count} items</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-6">
          <h4 className="text-lg font-bold text-cyan-400 mb-4">Status Overview</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Expiring Soon (30 days)</span>
              <span className="text-orange-400 font-bold">{analytics.expiringItems} items</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Waste Items</span>
              <span className="text-red-400 font-bold">{analytics.wasteItems} items</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Average Access Count</span>
              <span className="text-cyan-400 font-bold">{analytics.averageAccessTime.toFixed(1)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Volume Used</span>
              <span className="text-purple-400 font-bold">{analytics.totalVolume.toFixed(1)}L</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLogs = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-cyan-400 mb-6 flex items-center">
          <Activity className="mr-2" />
          Astronaut Action Logs
        </h3>

        <div className="space-y-4">
          {actionLogs.map((log) => (
            <div key={log.id} className="bg-gray-700/30 rounded-lg p-4 border-l-4 border-cyan-500">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-2">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="text-cyan-400" size={16} />
                    <span className="font-semibold text-white">{log.astronaut}</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    log.action === 'ADD' ? 'bg-green-600 text-white' :
                    log.action === 'REMOVE' ? 'bg-red-600 text-white' :
                    log.action === 'MOVE' ? 'bg-blue-600 text-white' :
                    log.action === 'ACCESS' ? 'bg-purple-600 text-white' :
                    log.action === 'DISPOSE' ? 'bg-orange-600 text-white' :
                    'bg-gray-600 text-white'
                  }`}>
                    {log.action}
                  </span>
                  {log.success ? (
                    <CheckCircle className="text-green-400" size={16} />
                  ) : (
                    <AlertTriangle className="text-red-400" size={16} />
                  )}
                </div>
                <div className="text-sm text-gray-400 mt-2 lg:mt-0">
                  {log.timestamp.toLocaleString()}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Item:</span>
                  <span className="text-cyan-400 ml-2">{log.itemName}</span>
                </div>
                {log.fromLocation && (
                  <div>
                    <span className="text-gray-400">From:</span>
                    <span className="text-orange-400 ml-2">{log.fromLocation}</span>
                  </div>
                )}
                {log.toLocation && (
                  <div>
                    <span className="text-gray-400">To:</span>
                    <span className="text-green-400 ml-2">{log.toLocation}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-purple-400 ml-2">{log.duration} min</span>
                </div>
              </div>

              {log.notes && (
                <div className="mt-3 bg-gray-600/30 rounded p-2">
                  <span className="text-xs text-gray-400">Notes: </span>
                  <span className="text-xs text-gray-300">{log.notes}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {actionLogs.length === 0 && (
          <div className="text-center py-12">
            <Activity className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Activity Logs</h3>
            <p className="text-gray-500">Astronaut actions will be logged here</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-4">
            Cargo Management System
          </h1>
          <p className="text-xl text-gray-300">
            AI-Powered Space Station Inventory Management
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Smart Placement • Quick Retrieval • Waste Management • Activity Tracking
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-8 space-x-1">
          {[
            { key: 'inventory', label: 'Inventory', icon: Package },
            { key: 'optimization', label: 'AI Optimization', icon: Target },
            { key: 'analytics', label: 'Analytics', icon: BarChart3 },
            { key: 'logs', label: 'Action Logs', icon: Activity }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center px-6 py-3 rounded-lg transition-colors m-1 ${
                activeTab === key
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Icon className="mr-2" size={20} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="transition-opacity duration-300">
          {activeTab === 'inventory' && renderInventory()}
          {activeTab === 'optimization' && renderOptimization()}
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'logs' && renderLogs()}
        </div>
      </div>
    </div>
  );
};

export default CargoManagement;
