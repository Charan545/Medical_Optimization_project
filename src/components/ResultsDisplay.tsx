
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, AlertTriangle, Download, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ResultsDisplayProps {
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
  onReset: () => void;
}

const ResultsDisplay = ({ result, onReset }: ResultsDisplayProps) => {
  const [activeTab, setActiveTab] = useState("distribution");

  if (!result) {
    return null;
  }

  const { distribution, totalCost, supplyStatus, demandStatus, isFeasible, message } = result;

  const handleDownloadCSV = () => {
    // Generate the CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add a header row with hospital identifiers
    csvContent += "Supply Center," + Array.from({ length: distribution[0]?.length || 0 }, (_, i) => `Hospital ${i + 1}`).join(",") + "\n";
    
    // Add distribution data rows
    distribution.forEach((row, index) => {
      csvContent += `Center ${index + 1},` + row.join(",") + "\n";
    });
    
    // Create a download link and trigger a click
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "supply_distribution.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-scale-in opacity-0">
      <Card className="medical-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-primary">Optimization Results</h2>
          <div className="flex space-x-2">
            {isFeasible ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center px-3 py-1">
                <Check className="mr-1 h-3 w-3" />
                Feasible Solution
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center px-3 py-1">
                <AlertTriangle className="mr-1 h-3 w-3" />
                Infeasible Solution
              </Badge>
            )}
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
              Total Cost: {totalCost}
            </Badge>
          </div>
        </div>

        {!isFeasible && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-700">
            <p className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              {message}
            </p>
          </div>
        )}

        <Tabs defaultValue="distribution" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="distribution">Distribution Matrix</TabsTrigger>
            <TabsTrigger value="supply">Supply Center Status</TabsTrigger>
            <TabsTrigger value="demand">Hospital Demand Status</TabsTrigger>
          </TabsList>
          
          <TabsContent value="distribution" className="space-y-4">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr>
                    <th className="matrix-header rounded-tl-md"></th>
                    {distribution[0]?.map((_, colIndex) => (
                      <th key={`col-${colIndex}`} className="matrix-header">
                        Hospital {colIndex + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {distribution.map((row, rowIndex) => (
                    <tr key={`row-${rowIndex}`}>
                      <th className="matrix-header">Center {rowIndex + 1}</th>
                      {row.map((value, colIndex) => (
                        <td
                          key={`cell-${rowIndex}-${colIndex}`}
                          className={`matrix-cell font-medium ${
                            value > 0 ? "optimal-cell" : ""
                          }`}
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                className="flex items-center space-x-2"
                onClick={handleDownloadCSV}
              >
                <Download className="h-4 w-4 mr-2" />
                Download as CSV
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="supply" className="space-y-4">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr>
                    <th className="matrix-header rounded-tl-md">Supply Center</th>
                    <th className="matrix-header">Initial Supply</th>
                    <th className="matrix-header">Remaining Supply</th>
                    <th className="matrix-header">Utilized</th>
                    <th className="matrix-header">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {supplyStatus.map((status) => (
                    <tr key={`supply-${status.centerId}`}>
                      <th className="matrix-header">Center {status.centerId + 1}</th>
                      <td className="matrix-cell">{status.initialSupply}</td>
                      <td className="matrix-cell">{status.remainingSupply}</td>
                      <td className="matrix-cell">{status.percentUtilized}%</td>
                      <td className="matrix-cell">
                        {parseFloat(status.percentUtilized) === 100 ? (
                          <Badge className="bg-medical-success">Fully Utilized</Badge>
                        ) : parseFloat(status.percentUtilized) > 90 ? (
                          <Badge className="bg-medical-warning">Nearly Depleted</Badge>
                        ) : (
                          <Badge className="bg-medical-accent text-medical-dark">Capacity Available</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="demand" className="space-y-4">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr>
                    <th className="matrix-header rounded-tl-md">Hospital</th>
                    <th className="matrix-header">Total Demand</th>
                    <th className="matrix-header">Fulfilled</th>
                    <th className="matrix-header">Fulfillment %</th>
                    <th className="matrix-header">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {demandStatus.map((status) => (
                    <tr key={`demand-${status.hospitalId}`}>
                      <th className="matrix-header">Hospital {status.hospitalId + 1}</th>
                      <td className="matrix-cell">{status.totalDemand}</td>
                      <td className="matrix-cell">{status.fulfilledDemand}</td>
                      <td className="matrix-cell">{status.percentFulfilled}%</td>
                      <td className="matrix-cell">
                        {parseFloat(status.percentFulfilled) === 100 ? (
                          <Badge className="bg-medical-success">Fully Satisfied</Badge>
                        ) : parseFloat(status.percentFulfilled) > 0 ? (
                          <Badge className="bg-medical-warning">Partially Filled</Badge>
                        ) : (
                          <Badge className="bg-medical-danger">Unfulfilled</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button
            variant="outline"
            onClick={onReset}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Optimization
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
