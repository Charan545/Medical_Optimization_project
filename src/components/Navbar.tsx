
import { Hospital, Truck, BarChart } from "lucide-react";

const Navbar = () => {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4">
        <div className="flex items-center space-x-2">
          <Truck className="h-6 w-6" />
          <h1 className="text-xl font-bold">MedFlow Supply Optimizer</h1>
        </div>
        
        <nav>
          <ul className="flex space-x-6">
            <li className="flex items-center space-x-1 opacity-90 hover:opacity-100 transition-opacity">
              <Truck size={18} />
              <span>Optimizer</span>
            </li>
            <li className="flex items-center space-x-1 opacity-90 hover:opacity-100 transition-opacity">
              <Hospital size={18} />
              <span>Hospital Status</span>
            </li>
            <li className="flex items-center space-x-1 opacity-90 hover:opacity-100 transition-opacity">
              <BarChart size={18} />
              <span>Analytics</span>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
