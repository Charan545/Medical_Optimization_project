
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, MinusCircle, RotateCw } from "lucide-react";

interface InputFormProps {
  onSubmit: (data: {
    supplyCenters: number;
    hospitals: number;
    supplies: number[];
    demands: number[];
    costs: number[][];
  }) => void;
}

const InputForm = ({ onSubmit }: InputFormProps) => {
  const [supplyCenters, setSupplyCenters] = useState<number>(3);
  const [hospitals, setHospitals] = useState<number>(4);
  const [supplies, setSupplies] = useState<number[]>([100, 150, 200]);
  const [demands, setDemands] = useState<number[]>([80, 90, 120, 160]);
  const [costs, setCosts] = useState<number[][]>([
    [4, 6, 8, 5],
    [7, 3, 4, 9],
    [5, 8, 3, 2],
  ]);

  // Handle supply centers count change
  const handleSupplyCentersChange = (value: number) => {
    if (value < 2) return; // Minimum 2 supply centers
    if (value > 10) return; // Maximum 10 supply centers
    
    const newSupplies = [...supplies];
    const newCosts = [...costs];
    
    if (value > supplyCenters) {
      // Add new supply centers
      for (let i = supplyCenters; i < value; i++) {
        newSupplies.push(100); // Default supply value
        newCosts.push(Array(hospitals).fill(5)); // Default cost values
      }
    } else {
      // Remove supply centers
      newSupplies.splice(value);
      newCosts.splice(value);
    }
    
    setSupplyCenters(value);
    setSupplies(newSupplies);
    setCosts(newCosts);
  };

  // Handle hospitals count change
  const handleHospitalsChange = (value: number) => {
    if (value < 2) return; // Minimum 2 hospitals
    if (value > 10) return; // Maximum 10 hospitals
    
    const newDemands = [...demands];
    const newCosts = costs.map(row => [...row]);
    
    if (value > hospitals) {
      // Add new hospitals
      for (let i = hospitals; i < value; i++) {
        newDemands.push(100); // Default demand value
        
        // Add new column to each cost row
        for (let j = 0; j < supplyCenters; j++) {
          newCosts[j].push(5); // Default cost value
        }
      }
    } else {
      // Remove hospitals
      newDemands.splice(value);
      
      // Remove columns from each cost row
      for (let i = 0; i < supplyCenters; i++) {
        newCosts[i].splice(value);
      }
    }
    
    setHospitals(value);
    setDemands(newDemands);
    setCosts(newCosts);
  };

  // Handle supply value change
  const handleSupplyChange = (index: number, value: number) => {
    if (value < 0) return; // No negative supplies
    const newSupplies = [...supplies];
    newSupplies[index] = value;
    setSupplies(newSupplies);
  };

  // Handle demand value change
  const handleDemandChange = (index: number, value: number) => {
    if (value < 0) return; // No negative demands
    const newDemands = [...demands];
    newDemands[index] = value;
    setDemands(newDemands);
  };

  // Handle cost value change
  const handleCostChange = (supplyIndex: number, hospitalIndex: number, value: number) => {
    if (value < 0) return; // No negative costs
    const newCosts = [...costs];
    newCosts[supplyIndex][hospitalIndex] = value;
    setCosts(newCosts);
  };

  // Reset the form to default values
  const handleReset = () => {
    setSupplyCenters(3);
    setHospitals(4);
    setSupplies([100, 150, 200]);
    setDemands([80, 90, 120, 160]);
    setCosts([
      [4, 6, 8, 5],
      [7, 3, 4, 9],
      [5, 8, 3, 2],
    ]);
  };

  // Submit the form data
  const handleSubmit = () => {
    // Check if total supply meets total demand
    const totalSupply = supplies.reduce((sum, value) => sum + value, 0);
    const totalDemand = demands.reduce((sum, value) => sum + value, 0);
    
    if (totalSupply < totalDemand) {
      alert("Total supply must be greater than or equal to total demand.");
      return;
    }
    
    onSubmit({
      supplyCenters,
      hospitals,
      supplies,
      demands,
      costs,
    });
  };

  return (
    <div className="animate-slide-up opacity-0">
      <Card className="medical-card p-6">
        <h2 className="text-xl font-bold text-primary mb-6">Supply & Demand Configuration</h2>
        
        {/* Supply Centers & Hospitals Count */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="supplyCenters">Number of Supply Centers</Label>
              <div className="flex items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => handleSupplyCentersChange(supplyCenters - 1)}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <span className="mx-2 font-medium w-8 text-center">{supplyCenters}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => handleSupplyCentersChange(supplyCenters + 1)}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Supply Values */}
            <div className="space-y-3 mt-4">
              <Label>Supply Center Capacities</Label>
              {supplies.map((supply, index) => (
                <div key={`supply-${index}`} className="flex items-center space-x-2">
                  <Label htmlFor={`supply-${index}`} className="w-24">Center {index + 1}</Label>
                  <Input
                    id={`supply-${index}`}
                    type="number"
                    value={supply}
                    onChange={(e) => handleSupplyChange(index, parseInt(e.target.value) || 0)}
                    min="0"
                    className="border-primary/30 focus:border-primary"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="hospitals">Number of Hospitals</Label>
              <div className="flex items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => handleHospitalsChange(hospitals - 1)}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <span className="mx-2 font-medium w-8 text-center">{hospitals}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => handleHospitalsChange(hospitals + 1)}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Demand Values */}
            <div className="space-y-3 mt-4">
              <Label>Hospital Demand Requirements</Label>
              {demands.map((demand, index) => (
                <div key={`demand-${index}`} className="flex items-center space-x-2">
                  <Label htmlFor={`demand-${index}`} className="w-24">Hospital {index + 1}</Label>
                  <Input
                    id={`demand-${index}`}
                    type="number"
                    value={demand}
                    onChange={(e) => handleDemandChange(index, parseInt(e.target.value) || 0)}
                    min="0"
                    className="border-primary/30 focus:border-primary"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Cost Matrix */}
        <h3 className="text-lg font-semibold text-primary mb-4">Transportation Cost Matrix</h3>
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="matrix-header rounded-tl-md"></th>
                {Array.from({ length: hospitals }).map((_, index) => (
                  <th key={`hospital-header-${index}`} className="matrix-header">
                    Hospital {index + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {costs.map((row, supplyIndex) => (
                <tr key={`cost-row-${supplyIndex}`}>
                  <th className="matrix-header">
                    Center {supplyIndex + 1}
                  </th>
                  {row.map((cost, hospitalIndex) => (
                    <td key={`cost-${supplyIndex}-${hospitalIndex}`} className="matrix-cell p-0">
                      <Input
                        type="number"
                        value={cost}
                        onChange={(e) => handleCostChange(supplyIndex, hospitalIndex, parseInt(e.target.value) || 0)}
                        min="0"
                        className="border-0 h-10 text-center focus:ring-1 focus:ring-primary"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="flex items-center space-x-2"
          >
            <RotateCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/90"
          >
            Optimize Distribution
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default InputForm;
