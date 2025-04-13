
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-full">
        {/* Sidebar for larger screens */}
        <aside className={cn(
          "fixed inset-y-0 z-50 flex w-72 flex-col bg-card shadow-sm transition-transform lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex h-20 items-center border-b px-6">
            <h2 className="text-xl font-bold">FlowFinance</h2>
          </div>
          <Navbar closeSidebar={() => setSidebarOpen(false)} />
          <div className="mt-auto p-6 lg:hidden">
            <button
              onClick={() => setSidebarOpen(false)}
              className="flex items-center text-muted-foreground hover:text-foreground"
            >
              <X className="mr-2 h-4 w-4" />
              Close Sidebar
            </button>
          </div>
        </aside>

        {/* Content area */}
        <div className="flex flex-1 flex-col">
          {/* Mobile header */}
          <header className="flex h-16 items-center border-b bg-card px-6 lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="mr-4 text-muted-foreground hover:text-foreground lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-lg font-bold">FlowFinance</h2>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
