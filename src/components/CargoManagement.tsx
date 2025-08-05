import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Package, Search, ArrowUpDown, Trash2, Send, Activity, 
  Clock, AlertTriangle, CheckCircle, Box, Truck, Database,
  Filter, BarChart3, Settings, RefreshCw, Target, Zap,
  Calendar, MapPin, Weight, Thermometer, Star
} from 'lucide-react';

// Data Structures
interface CargoItem {
  id: string;
  name: string;
  category: 'FOOD' | 'MEDICAL' | 'EQUIPMENT' | 'RESEARCH' | 'MAINTENANCE' | 'PERSONAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  weight: number; // kg
  volume: number; // cubic meters
  expiryDate?: Date;
  location?: StorageLocation;
  status: 'ACTIVE' | 'EXPIRED' | 'WASTE' | 'CONSUMED';
  acquisitionDate: Date;
  lastAccessed?: Date;
  accessFrequency: number;
  temperature?: 'AMBIENT' | 'COLD' | 'FROZEN';
  fragile: boolean;
}

interface StorageLocation {
  compartment: string;
  rack: string;
  position: { x: number; y: number; z: number };
  accessibility: number; // 1-10 scale
  maxWeight: number;
  maxVolume: number;
  currentWeight: number;
  currentVolume: number;
  temperature: 'AMBIENT' | 'COLD' | 'FROZEN';
}

interface ActionLog {
  id: string;
  timestamp: Date;
  action: 'STORE' | 'RETRIEVE' | 'REARRANGE' | 'DISPOSE' | 'RETURN';
  itemId: string;
  itemName: string;
  location?: string;
  astronautId: string;
  duration: number; // seconds
  success: boolean;
  notes?: string;
}

interface OptimizationSuggestion {
  type: 'PLACEMENT' | 'RETRIEVAL' | 'REARRANGE' | 'DISPOSAL' | 'RETURN';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  title: string;
  description: string;
  estimatedTime: number;
  energyImpact: number;
  items: string[];
  actions: string[];
}

export const CargoManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'optimization' | 'analytics' | 'logs'>('inventory');
  const [cargoItems, setCargoItems] = useState<CargoItem[]>([]);
  const [storageLocations, setStorageLocations] = useState<StorageLocation[]>([]);
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);

  // Initialize demo data
  useEffect(() => {
    initializeDemoData();
  }, []);

  const initializeDemoData = () => {
    // Demo storage locations
    const locations: StorageLocation[] = [
      {
        compartment: 'Node 1',
        rack: 'A-1',
        position: { x: 0, y: 0, z: 0 },
        accessibility: 9,
        maxWeight: 50,
        maxVolume: 2.5,
        currentWeight: 32,
        currentVolume: 1.8,
        temperature: 'AMBIENT'
      },
      {
        compartment: 'Node 1',
        rack: 'A-2',
        position: { x: 1, y: 0, z: 0 },
        accessibility: 8,
        maxWeight: 50,
        maxVolume: 2.5,
        currentWeight: 45,
        currentVolume: 2.2,
        temperature: 'COLD'
      },
      {
        compartment: 'Node 2',
        rack: 'B-1',
        position: { x: 0, y: 1, z: 0 },
        accessibility: 7,
        maxWeight: 75,
        maxVolume: 3.0,
        currentWeight: 60,
        currentVolume: 2.1,
        temperature: 'FROZEN'
      },
      {
        compartment: 'Node 2',
        rack: 'B-2',
        position: { x: 1, y: 1, z: 0 },
        accessibility: 6,
        maxWeight: 75,
        maxVolume: 3.0,
        currentWeight: 25,
        currentVolume: 1.0,
        temperature: 'AMBIENT'
      }
    ];

    // Demo cargo items
    const items: CargoItem[] = [
      {
        id: 'FOOD-001',
        name: 'Rehydratable Beef Stew',
        category: 'FOOD',
        priority: 'HIGH',
        weight: 0.3,
        volume: 0.1,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        location: locations[0],
        status: 'ACTIVE',
        acquisitionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        lastAccessed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        accessFrequency: 15,
        temperature: 'AMBIENT',
        fragile: false
      },
      {
        id: 'MED-001',
        name: 'Emergency Medical Kit',
        category: 'MEDICAL',
        priority: 'CRITICAL',
        weight: 2.5,
        volume: 0.5,
        location: locations[0],
        status: 'ACTIVE',
        acquisitionDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        lastAccessed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        accessFrequency: 3,
        fragile: true
      },
      {
        id: 'EQP-001',
        name: 'Orbital Repair Tool Set',
        category: 'EQUIPMENT',
        priority: 'MEDIUM',
        weight: 5.2,
        volume: 0.8,
        location: locations[1],
        status: 'ACTIVE',
        acquisitionDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        lastAccessed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        accessFrequency: 8,
        fragile: false
      },
      {
        id: 'RES-001',
        name: 'Microgravity Plant Samples',
        category: 'RESEARCH',
        priority: 'HIGH',
        weight: 1.8,
        volume: 0.3,
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        location: locations[2],
        status: 'ACTIVE',
        acquisitionDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        lastAccessed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        accessFrequency: 25,
        temperature: 'COLD',
        fragile: true
      },
      {
        id: 'FOOD-002',
        name: 'Expired Protein Bars',
        category: 'FOOD',
        priority: 'LOW',
        weight: 0.8,
        volume: 0.2,
        expiryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        location: locations[3],
        status: 'EXPIRED',
        acquisitionDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        lastAccessed: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        accessFrequency: 0,
        fragile: false
      }
    ];

    // Demo action logs
    const logs: ActionLog[] = [
      {
        id: 'LOG-001',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        action: 'RETRIEVE',
        itemId: 'FOOD-001',
        itemName: 'Rehydratable Beef Stew',
        location: 'Node 1 - A-1',
        astronautId: 'AST-001',
        duration: 45,
        success: true,
        notes: 'Retrieved for lunch preparation'
      },
      {
        id: 'LOG-002',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        action: 'STORE',
        itemId: 'RES-001',
        itemName: 'Microgravity Plant Samples',
        location: 'Node 2 - B-1',
        astronautId: 'AST-002',
        duration: 120,
        success: true,
        notes: 'Stored in cold storage for preservation'
      },
      {
        id: 'LOG-003',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        action: 'REARRANGE',
        itemId: 'EQP-001',
        itemName: 'Orbital Repair Tool Set',
        location: 'Node 1 - A-2',
        astronautId: 'AST-001',
        duration: 180,
        success: true,
        notes: 'Moved to more accessible location before EVA'
      }
    ];

    setCargoItems(items);
    setStorageLocations(locations);
    setActionLogs(logs);
  };

  // Efficient search and filter with memoization
  const filteredItems = useMemo(() => {
    return cargoItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchesPriority = selectedPriority === 'ALL' || item.priority === selectedPriority;
      
      return matchesSearch && matchesCategory && matchesPriority;
    });
  }, [cargoItems, searchQuery, selectedCategory, selectedPriority]);

  // AI-Powered Optimization Algorithms
  const generateOptimizationSuggestions = useCallback(() => {
    setIsOptimizing(true);
    
    setTimeout(() => {
      const newSuggestions: OptimizationSuggestion[] = [];

      // 1. Quick Retrieval Optimization
      const frequentItems = cargoItems
        .filter(item => item.status === 'ACTIVE')
        .sort((a, b) => b.accessFrequency - a.accessFrequency)
        .slice(0, 5);

      frequentItems.forEach(item => {
        if (item.location && item.location.accessibility < 8) {
          newSuggestions.push({
            type: 'REARRANGE',
            priority: 'MEDIUM',
            title: `Move ${item.name} to High-Access Location`,
            description: `Item accessed ${item.accessFrequency} times. Current accessibility: ${item.location.accessibility}/10`,
            estimatedTime: 180,
            energyImpact: 2,
            items: [item.id],
            actions: [`Move to rack with accessibility ≥ 8`]
          });
        }
      });

      // 2. Expiry Management
      const expiringItems = cargoItems.filter(item => 
        item.expiryDate && 
        item.status === 'ACTIVE' && 
        item.expiryDate.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000
      );

      if (expiringItems.length > 0) {
        newSuggestions.push({
          type: 'RETRIEVAL',
          priority: 'HIGH',
          title: `${expiringItems.length} Items Expiring Soon`,
          description: 'Prioritize usage or prepare for disposal',
          estimatedTime: 300,
          energyImpact: 3,
          items: expiringItems.map(item => item.id),
          actions: ['Use items before expiry', 'Prepare disposal plan']
        });
      }

      // 3. Waste Management
      const wasteItems = cargoItems.filter(item => item.status === 'EXPIRED' || item.status === 'WASTE');
      
      if (wasteItems.length > 0) {
        newSuggestions.push({
          type: 'DISPOSAL',
          priority: 'URGENT',
          title: `${wasteItems.length} Items Ready for Disposal`,
          description: 'Free up storage space and prepare for waste return',
          estimatedTime: 240,
          energyImpact: 4,
          items: wasteItems.map(item => item.id),
          actions: ['Move to waste container', 'Schedule return mission']
        });
      }

      // 4. Space Optimization
      const overloadedLocations = storageLocations.filter(loc => 
        (loc.currentWeight / loc.maxWeight) > 0.85 || 
        (loc.currentVolume / loc.maxVolume) > 0.85
      );

      overloadedLocations.forEach(location => {
        newSuggestions.push({
          type: 'REARRANGE',
          priority: 'MEDIUM',
          title: `Optimize ${location.compartment} - ${location.rack}`,
          description: `Storage at ${Math.round((location.currentVolume / location.maxVolume) * 100)}% capacity`,
          estimatedTime: 420,
          energyImpact: 5,
          items: [],
          actions: ['Redistribute items to underutilized locations', 'Consolidate similar items']
        });
      });

      // 5. Temperature Optimization
      const tempMismatches = cargoItems.filter(item => 
        item.location && 
        item.temperature && 
        item.temperature !== item.location.temperature
      );

      if (tempMismatches.length > 0) {
        newSuggestions.push({
          type: 'REARRANGE',
          priority: 'HIGH',
          title: `${tempMismatches.length} Temperature Mismatches`,
          description: 'Items stored at incorrect temperatures',
          estimatedTime: 180,
          energyImpact: 6,
          items: tempMismatches.map(item => item.id),
          actions: ['Move to appropriate temperature zones']
        });
      }

      setSuggestions(newSuggestions.sort((a, b) => {
        const priorityOrder = { 'URGENT': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }));
      
      setIsOptimizing(false);
    }, 2000);
  }, [cargoItems, storageLocations]);

  // Logging function
  const logAction = (action: ActionLog['action'], itemId: string, itemName: string, duration: number, success: boolean, notes?: string) => {
    const newLog: ActionLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date(),
      action,
      itemId,
      itemName,
      location: cargoItems.find(item => item.id === itemId)?.location?.compartment,
      astronautId: 'AST-001', // In real implementation, this would be the current user
      duration,
      success,
      notes
    };

    setActionLogs(prev => [newLog, ...prev]);
  };

  // Calculate analytics
  const analytics = useMemo(() => {
    const totalItems = cargoItems.length;
    const activeItems = cargoItems.filter(item => item.status === 'ACTIVE').length;
    const expiredItems = cargoItems.filter(item => item.status === 'EXPIRED').length;
    const wasteItems = cargoItems.filter(item => item.status === 'WASTE').length;
    
    const totalWeight = cargoItems.reduce((sum, item) => sum + item.weight, 0);
    const totalVolume = cargoItems.reduce((sum, item) => sum + item.volume, 0);
    
    const storageUtilization = storageLocations.reduce((sum, loc) => sum + (loc.currentVolume / loc.maxVolume), 0) / storageLocations.length;
    
    const avgAccessTime = actionLogs
      .filter(log => log.action === 'RETRIEVE')
      .reduce((sum, log) => sum + log.duration, 0) / Math.max(actionLogs.filter(log => log.action === 'RETRIEVE').length, 1);

    return {
      totalItems,
      activeItems,
      expiredItems,
      wasteItems,
      totalWeight: Math.round(totalWeight * 10) / 10,
      totalVolume: Math.round(totalVolume * 10) / 10,
      storageUtilization: Math.round(storageUtilization * 100),
      avgAccessTime: Math.round(avgAccessTime)
    };
  }, [cargoItems, storageLocations, actionLogs]);

  const renderInventory = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-gray-800/50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
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
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Package className="text-cyan-400" size={20} />
                <span className="font-semibold text-white">{item.name}</span>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                item.priority === 'CRITICAL' ? 'bg-red-600 text-white' :
                item.priority === 'HIGH' ? 'bg-orange-600 text-white' :
                item.priority === 'MEDIUM' ? 'bg-yellow-600 text-black' :
                'bg-green-600 text-white'
              }`}>
                {item.priority}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Category:</span>
                <span className="text-cyan-400">{item.category}</span>
              </div>
              <div className="flex justify-between">
                <span>Weight:</span>
                <span>{item.weight} kg</span>
              </div>
              <div className="flex justify-between">
                <span>Volume:</span>
                <span>{item.volume} m³</span>
              </div>
              {item.location && (
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span>{item.location.compartment} - {item.location.rack}</span>
                </div>
              )}
              {item.expiryDate && (
                <div className="flex justify-between">
                  <span>Expires:</span>
                  <span className={
                    item.expiryDate.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000 
                      ? 'text-red-400' : 'text-green-400'
                  }>
                    {item.expiryDate.toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Access Freq:</span>
                <span>{item.accessFrequency} times</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-3">
              <span className={`w-3 h-3 rounded-full ${
                item.status === 'ACTIVE' ? 'bg-green-500' :
                item.status === 'EXPIRED' ? 'bg-red-500' :
                item.status === 'WASTE' ? 'bg-gray-500' : 'bg-yellow-500'
              }`}></span>
              <span className="text-sm text-gray-400">{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOptimization = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-cyan-400 flex items-center">
            <Target className="mr-2" />
            AI-Powered Cargo Optimization
          </h3>
          <button
            onClick={generateOptimizationSuggestions}
            disabled={isOptimizing}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              isOptimizing 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-cyan-600 hover:bg-cyan-700'
            } text-white`}
          >
            {isOptimizing ? (
              <RefreshCw className="mr-2 animate-spin" size={16} />
            ) : (
              <Zap className="mr-2" size={16} />
            )}
            {isOptimizing ? 'Analyzing...' : 'Generate Suggestions'}
          </button>
        </div>

        {isOptimizing ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-300">Running optimization algorithms...</p>
            </div>
          </div>
        ) : suggestions.length > 0 ? (
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="bg-gray-700/50 rounded-lg p-4 border-l-4 border-cyan-500">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg font-semibold text-cyan-400">{suggestion.title}</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      suggestion.priority === 'URGENT' ? 'bg-red-600 text-white' :
                      suggestion.priority === 'HIGH' ? 'bg-orange-600 text-white' :
                      suggestion.priority === 'MEDIUM' ? 'bg-yellow-600 text-black' :
                      'bg-green-600 text-white'
                    }`}>
                      {suggestion.priority}
                    </span>
                    <span className="text-sm text-gray-400">{suggestion.type}</span>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-3">{suggestion.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="text-blue-400" size={16} />
                    <span className="text-sm text-gray-300">{suggestion.estimatedTime}s</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="text-yellow-400" size={16} />
                    <span className="text-sm text-gray-300">Energy: {suggestion.energyImpact}/10</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Package className="text-green-400" size={16} />
                    <span className="text-sm text-gray-300">{suggestion.items.length} items</span>
                  </div>
                </div>
                
                <div>
                  <span className="text-sm text-gray-400 block mb-1">Recommended Actions:</span>
                  <ul className="text-sm text-gray-300">
                    {suggestion.actions.map((action, actionIndex) => (
                      <li key={actionIndex} className="mb-1">• {action}</li>
                    ))}
                  </ul>
                </div>
                
                <button 
                  onClick={() => logAction('REARRANGE', suggestion.items[0] || 'SYSTEM', 'Optimization Action', suggestion.estimatedTime, true, suggestion.title)}
                  className="mt-3 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm transition-colors"
                >
                  Execute Suggestion
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Target className="mx-auto mb-4 text-cyan-400" size={48} />
            <p className="text-gray-300 text-lg mb-4">No optimization suggestions available</p>
            <p className="text-gray-400">Click "Generate Suggestions" to analyze your cargo</p>
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
        
        <div className="bg-green-900/30 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <CheckCircle className="text-green-400 mr-2" size={20} />
            <span className="text-sm text-gray-300">Active Items</span>
          </div>
          <span className="text-2xl font-bold text-green-400">{analytics.activeItems}</span>
        </div>
        
        <div className="bg-red-900/30 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <AlertTriangle className="text-red-400 mr-2" size={20} />
            <span className="text-sm text-gray-300">Expired/Waste</span>
          </div>
          <span className="text-2xl font-bold text-red-400">{analytics.expiredItems + analytics.wasteItems}</span>
        </div>
        
        <div className="bg-purple-900/30 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <BarChart3 className="text-purple-400 mr-2" size={20} />
            <span className="text-sm text-gray-300">Storage Util.</span>
          </div>
          <span className="text-2xl font-bold text-purple-400">{analytics.storageUtilization}%</span>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-cyan-400 mb-6 flex items-center">
          <BarChart3 className="mr-2" />
          Cargo Analytics Dashboard
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-yellow-400">Physical Metrics</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total Weight:</span>
                <span className="text-cyan-400 font-bold">{analytics.totalWeight} kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total Volume:</span>
                <span className="text-cyan-400 font-bold">{analytics.totalVolume} m³</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Avg Access Time:</span>
                <span className="text-cyan-400 font-bold">{analytics.avgAccessTime}s</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-yellow-400">Storage Locations</h4>
            <div className="space-y-2">
              {storageLocations.map((location, index) => (
                <div key={index} className="bg-gray-700/50 rounded p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-300">{location.compartment} - {location.rack}</span>
                    <span className="text-xs text-gray-400">Access: {location.accessibility}/10</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                      style={{ width: `${(location.currentVolume / location.maxVolume) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{location.currentVolume.toFixed(1)} / {location.maxVolume} m³</span>
                    <span>{Math.round((location.currentVolume / location.maxVolume) * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-cyan-400 mb-4">Category Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {['FOOD', 'MEDICAL', 'EQUIPMENT', 'RESEARCH', 'MAINTENANCE', 'PERSONAL'].map(category => {
            const count = cargoItems.filter(item => item.category === category).length;
            const percentage = count > 0 ? Math.round((count / cargoItems.length) * 100) : 0;
            
            return (
              <div key={category} className="bg-gray-700/50 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-300">{category}</span>
                  <span className="text-cyan-400 font-bold">{count}</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-400">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderLogs = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-cyan-400 mb-6 flex items-center">
          <Activity className="mr-2" />
          Action Log History
        </h3>
        
        <div className="space-y-3">
          {actionLogs.length > 0 ? actionLogs.map((log) => (
            <div key={log.id} className="bg-gray-700/50 rounded-lg p-4 border-l-4 border-cyan-500">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    log.success ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    log.action === 'RETRIEVE' ? 'bg-blue-600 text-white' :
                    log.action === 'STORE' ? 'bg-green-600 text-white' :
                    log.action === 'REARRANGE' ? 'bg-yellow-600 text-black' :
                    log.action === 'DISPOSE' ? 'bg-red-600 text-white' :
                    'bg-purple-600 text-white'
                  }`}>
                    {log.action}
                  </span>
                  <span className="font-semibold text-white">{log.itemName}</span>
                </div>
                <div className="text-right text-sm text-gray-400">
                  <div>{log.timestamp.toLocaleDateString()}</div>
                  <div>{log.timestamp.toLocaleTimeString()}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                <div>
                  <span className="text-gray-400">Item ID: </span>
                  <span>{log.itemId}</span>
                </div>
                <div>
                  <span className="text-gray-400">Duration: </span>
                  <span>{log.duration}s</span>
                </div>
                <div>
                  <span className="text-gray-400">Astronaut: </span>
                  <span>{log.astronautId}</span>
                </div>
              </div>
              
              {log.location && (
                <div className="mt-2 text-sm">
                  <span className="text-gray-400">Location: </span>
                  <span className="text-cyan-400">{log.location}</span>
                </div>
              )}
              
              {log.notes && (
                <div className="mt-2 text-sm text-gray-300">
                  <span className="text-gray-400">Notes: </span>
                  <span>{log.notes}</span>
                </div>
              )}
            </div>
          )) : (
            <div className="text-center py-12">
              <Activity className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-400">No action logs available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-4">
            Space Station Cargo Management System
          </h1>
          <p className="text-xl text-gray-300">
            AI-Powered Stowage Advisory • Efficient Space Utilization • Smart Retrieval
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Optimized for minimal power consumption and maximum efficiency in space operations
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-8 space-x-1">
          {[
            { key: 'inventory', label: 'Cargo Inventory', icon: Package },
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
