
import { useState } from "react";
import Navbar from "@/components/Navbar";
import InputForm from "@/components/InputForm";
import ResultsDisplay from "@/components/ResultsDisplay";
import Dashboard from "@/components/Dashboard";
import { solveTransportationProblem } from "@/utils/optimizationEngine";
import { ModeToggle } from "@/components/ModeToggle";

const Index = () => {
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  const handleOptimize = (data: any) => {
    const result = solveTransportationProblem(data);
    setOptimizationResult(result);
    setShowResults(true);
    
    // Scroll to results
    setTimeout(() => {
      document.getElementById("results-section")?.scrollIntoView({ 
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  };

  const handleReset = () => {
    setShowResults(false);
    
    // Scroll back to form
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="container mx-auto p-4 md:p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Medical Supply Distribution Optimizer</h1>
          <ModeToggle />
        </div>
        
        <p className="mb-8 text-muted-foreground max-w-3xl">
          Optimize the distribution of medical supplies from multiple supply centers to various hospitals.
          This tool uses linear programming to minimize transportation costs while meeting each hospital's demand.
        </p>
        
        <div className="space-y-12">
          {/* Input Form Section */}
          <section>
            <InputForm onSubmit={handleOptimize} />
          </section>
          
          {/* Results Section */}
          {showResults && (
            <section id="results-section" className="py-4">
              <ResultsDisplay 
                result={optimizationResult}
                onReset={handleReset}
              />
            </section>
          )}
          
          {/* Dashboard Section */}
          <section className="py-4">
            <Dashboard result={optimizationResult} />
          </section>
        </div>
      </main>
      
      <footer className="bg-slate-50 dark:bg-slate-800/30 border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Medical Supply Distribution Optimizer &copy; {new Date().getFullYear()}</p>
          <p className="mt-1">Powered by mathematical optimization algorithms</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
