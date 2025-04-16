
import { Card } from "@/components/ui/card";
import { Activity, TrendingUp, TrendingDown, Truck, Hospital } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DashboardProps {
  result: {
    distribution: number[][];
    totalCost: number;
    supplyStatus: {
      centerId: number;
      initialSupply: number;
      remainingSupply: number;
      percentUtilized: string;
    }[];
    demandStatus: {
      hospitalId: number;
      totalDemand: number;
      fulfilledDemand: number;
      percentFulfilled: string;
    }[];
    isFeasible: boolean;
    message: string;
  } | null;
}

const Dashboard = ({ result }: DashboardProps) => {
  // Default data for when no optimization has been run
  // In a real application, this might come from an API
  const defaultStats = {
    totalSuppliesMoved: 0,
    avgCostPerUnit: 0,
    totalSupplyUtilization: 0,
    totalDemandSatisfaction: 0,
    highestUtilizedCenter: { id: 0, percent: 0 },
    lowestUtilizedCenter: { id: 0, percent: 100 },
    criticalHospitals: []
  };

  // Calculate real stats when result is available
  const calculatedStats = result ? {
    totalSuppliesMoved: result.distribution.reduce(
      (total, row) => total + row.reduce((sum, val) => sum + val, 0),
      0
    ),
    avgCostPerUnit: result.totalCost / 
      result.distribution.reduce(
        (total, row) => total + row.reduce((sum, val) => sum + val, 0),
        1  // Avoid division by zero
      ),
    totalSupplyUtilization: result.supplyStatus.reduce(
      (avg, center) => avg + parseFloat(center.percentUtilized),
      0
    ) / Math.max(1, result.supplyStatus.length),
    totalDemandSatisfaction: result.demandStatus.reduce(
      (avg, hospital) => avg + parseFloat(hospital.percentFulfilled),
      0
    ) / Math.max(1, result.demandStatus.length),
    highestUtilizedCenter: result.supplyStatus.reduce(
      (highest, center) => parseFloat(center.percentUtilized) > highest.percent 
        ? { id: center.centerId, percent: parseFloat(center.percentUtilized) } 
        : highest,
      { id: 0, percent: 0 }
    ),
    lowestUtilizedCenter: result.supplyStatus.reduce(
      (lowest, center) => parseFloat(center.percentUtilized) < lowest.percent 
        ? { id: center.centerId, percent: parseFloat(center.percentUtilized) } 
        : lowest,
      { id: 0, percent: 100 }
    ),
    criticalHospitals: result.demandStatus
      .filter(hospital => parseFloat(hospital.percentFulfilled) < 100)
      .map(hospital => hospital.hospitalId)
  } : defaultStats;

  const stats = result ? calculatedStats : defaultStats;

  // For animation effects to simulate real-time data
  const animatePulse = !result;

  return (
    <div className="animate-slide-up opacity-0">
      <Card className="medical-card p-6">
        <h2 className="text-xl font-bold text-primary mb-6">Live Status Monitoring</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Supplies Moved */}
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">Total Supplies Moved</p>
                <h3 className={`text-2xl font-bold text-blue-800 dark:text-blue-300 mt-1 ${animatePulse ? 'animate-pulse-gentle' : ''}`}>
                  {stats.totalSuppliesMoved.toLocaleString()}
                </h3>
              </div>
              <Truck className="h-8 w-8 text-blue-500 dark:text-blue-400 opacity-80" />
            </div>
          </Card>
          
          {/* Average Cost Per Unit */}
          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-green-700 dark:text-green-400 font-medium">Avg. Cost Per Unit</p>
                <h3 className={`text-2xl font-bold text-green-800 dark:text-green-300 mt-1 ${animatePulse ? 'animate-pulse-gentle' : ''}`}>
                  {stats.avgCostPerUnit.toFixed(2)}
                </h3>
              </div>
              <Activity className="h-8 w-8 text-green-500 dark:text-green-400 opacity-80" />
            </div>
          </Card>
          
          {/* Supply Utilization */}
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-purple-700 dark:text-purple-400 font-medium">Supply Utilization</p>
                <h3 className={`text-2xl font-bold text-purple-800 dark:text-purple-300 mt-1 ${animatePulse ? 'animate-pulse-gentle' : ''}`}>
                  {stats.totalSupplyUtilization.toFixed(1)}%
                </h3>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500 dark:text-purple-400 opacity-80" />
            </div>
            <Progress 
              value={stats.totalSupplyUtilization} 
              className="h-2 mt-4 bg-purple-200 dark:bg-purple-900/40" 
            />
          </Card>
          
          {/* Demand Satisfaction */}
          <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">Demand Satisfaction</p>
                <h3 className={`text-2xl font-bold text-amber-800 dark:text-amber-300 mt-1 ${animatePulse ? 'animate-pulse-gentle' : ''}`}>
                  {stats.totalDemandSatisfaction.toFixed(1)}%
                </h3>
              </div>
              <Hospital className="h-8 w-8 text-amber-500 dark:text-amber-400 opacity-80" />
            </div>
            <Progress 
              value={stats.totalDemandSatisfaction} 
              className="h-2 mt-4 bg-amber-200 dark:bg-amber-900/40" 
            />
          </Card>
        </div>
        
        {/* Supply Centers Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="p-4 border">
            <h3 className="text-lg font-semibold text-primary mb-4">Supply Center Status</h3>
            <div className="space-y-4">
              {result ? (
                result.supplyStatus.map((center) => (
                  <div key={`center-status-${center.centerId}`} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Center {center.centerId + 1}</p>
                      <p className="text-sm text-muted-foreground">
                        {center.initialSupply - center.remainingSupply} of {center.initialSupply} units sent
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-lg font-bold">{center.percentUtilized}%</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                        <div 
                          className="h-full rounded-full bg-blue-500" 
                          style={{ width: `${center.percentUtilized}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground animate-pulse-gentle">
                  <p>No data available</p>
                  <p className="text-sm">Run optimization to see supply center status</p>
                </div>
              )}
            </div>
          </Card>
          
          {/* Hospital Status */}
          <Card className="p-4 border">
            <h3 className="text-lg font-semibold text-primary mb-4">Hospital Status</h3>
            <div className="space-y-4">
              {result ? (
                result.demandStatus.map((hospital) => (
                  <div key={`hospital-status-${hospital.hospitalId}`} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Hospital {hospital.hospitalId + 1}</p>
                      <p className="text-sm text-muted-foreground">
                        {hospital.fulfilledDemand} of {hospital.totalDemand} units received
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-lg font-bold">{hospital.percentFulfilled}%</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                        <div 
                          className={`h-full rounded-full ${
                            parseFloat(hospital.percentFulfilled) === 100 
                              ? "bg-green-500" 
                              : parseFloat(hospital.percentFulfilled) > 80 
                                ? "bg-yellow-500" 
                                : "bg-red-500"
                          }`} 
                          style={{ width: `${hospital.percentFulfilled}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground animate-pulse-gentle">
                  <p>No data available</p>
                  <p className="text-sm">Run optimization to see hospital status</p>
                </div>
              )}
            </div>
          </Card>
        </div>
        
        {/* Insights Box */}
        <Card className="p-4 bg-slate-50 dark:bg-slate-800/50 border">
          <h3 className="text-lg font-semibold text-primary mb-2">Distribution Insights</h3>
          {result ? (
            <div className="space-y-2 text-sm">
              {stats.highestUtilizedCenter.percent > 0 && (
                <p className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                  Supply Center {stats.highestUtilizedCenter.id + 1} has the highest utilization at {stats.highestUtilizedCenter.percent}%.
                </p>
              )}
              {stats.lowestUtilizedCenter.percent < 100 && (
                <p className="flex items-center">
                  <TrendingDown className="h-4 w-4 text-amber-500 mr-2" />
                  Supply Center {stats.lowestUtilizedCenter.id + 1} has the lowest utilization at {stats.lowestUtilizedCenter.percent}%.
                </p>
              )}
              {stats.criticalHospitals.length > 0 && (
                <p className="flex items-center">
                  <Hospital className="h-4 w-4 text-red-500 mr-2" />
                  {stats.criticalHospitals.length} hospitals have unfulfilled demand.
                </p>
              )}
              {stats.avgCostPerUnit > 0 && (
                <p className="flex items-center">
                  <Activity className="h-4 w-4 text-blue-500 mr-2" />
                  Average transportation cost is {stats.avgCostPerUnit.toFixed(2)} per unit.
                </p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground animate-pulse-gentle">
              Optimize distribution to see insights
            </p>
          )}
        </Card>
      </Card>
    </div>
  );
};

export default Dashboard;
