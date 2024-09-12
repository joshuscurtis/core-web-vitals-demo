import React from "react";
import { Eye, RotateCw, Sliders } from "lucide-react";
import DemoCard from "./DemoCard";
import LCPDemo from "./LCPDemo";
import CLSDemo from "./CLSDemo";
import BadINPButton from "./BadInpButton";
import FloatingMetricsWidget from "./FloatingWidget";
import { CWVMetrics, Thresholds } from "../types";

interface MainContentProps {
  lcpDelay: number;
  setLcpDelay: (delay: number) => void;
  clsDelay: number;
  setClsDelay: (delay: number) => void;
  clsSeverity: number;
  setClsSeverity: (severity: number) => void;
  showClsSkeleton: boolean;
  setShowClsSkeleton: (show: boolean) => void;
  cwvMetrics: CWVMetrics;
  key: number;
  MAX_DELAY: number;
  THRESHOLDS: Thresholds;
}

const MainContent: React.FC<MainContentProps> = ({
  lcpDelay,
  setLcpDelay,
  clsDelay,
  setClsDelay,
  clsSeverity,
  setClsSeverity,
  showClsSkeleton,
  setShowClsSkeleton,
  cwvMetrics,
  key,
  MAX_DELAY,
  THRESHOLDS,
}) => (
  <main className="py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        <DemoCard
          title="LCP Demo"
          gradientClasses="from-teal-600 to-blue-600"
          icon={<Eye className="w-6 h-6" />}
        >
          <LCPDemo key={`lcp-${key}`} delay={lcpDelay} />
          <div className="mt-6 space-y-4">
            <label className="block text-gray-200">
              <div className="flex items-center mb-2">
                <Sliders className="w-5 h-5 mr-2" />
                <span>LCP Delay: {lcpDelay}ms</span>
              </div>
              <input
                type="range"
                min="0"
                max={MAX_DELAY}
                value={lcpDelay}
                onChange={(e) => setLcpDelay(Number(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </label>
          </div>
        </DemoCard>

        <DemoCard
          title="CLS Demo"
          gradientClasses="from-purple-600 to-pink-600"
          icon={<RotateCw className="w-6 h-6" />}
        >
          <CLSDemo 
            key={`cls-${key}`} 
            delay={clsDelay} 
            showSkeleton={showClsSkeleton} 
            severity={clsSeverity}
          />
          <div className="mt-6 space-y-4">
            <label className="block text-gray-200">
              <div className="flex items-center mb-2">
                <Sliders className="w-5 h-5 mr-2" />
                <span>CLS Delay: {clsDelay}ms</span>
              </div>
              <input
                type="range"
                min="0"
                max={MAX_DELAY}
                value={clsDelay}
                onChange={(e) => setClsDelay(Number(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </label>
            <label className="block text-gray-200">
              <div className="flex items-center mb-2">
                <Sliders className="w-5 h-5 mr-2" />
                <span>CLS Severity: {clsSeverity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={clsSeverity}
                onChange={(e) => setClsSeverity(Number(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </label>
            <label className="flex items-center text-gray-200">
              <input
                type="checkbox"
                checked={showClsSkeleton}
                onChange={(e) => setShowClsSkeleton(e.target.checked)}
                className="form-checkbox h-5 w-5 text-purple-500 rounded focus:ring-purple-400 border-gray-500 bg-gray-700"
              />
              <span className="ml-2">Show Skeleton</span>
            </label>
          </div>
        </DemoCard>
      </div>

      <DemoCard
        title="INP Demo"
        gradientClasses="from-indigo-600 to-purple-600"
        icon={<RotateCw className="w-6 h-6" />}
      >
        <div className="space-y-4">
          <BadINPButton
            testId="inp-button-low"
            delay={50}
            label="Good INP (50ms)"
          />
          <BadINPButton
            testId="inp-button-med"
            delay={300}
            label="Needs Improvement INP (300ms)"
          />
          <BadINPButton
            testId="inp-button-high"
            delay={600}
            label="Poor INP (600ms)"
          />
        </div>
        <p className="mt-4 text-sm text-gray-300 max-w-md text-center mx-auto">
          These buttons demonstrate different levels of INP. When clicked,
          they will freeze the UI for the specified duration before
          responding.
        </p>
      </DemoCard>

      <FloatingMetricsWidget metrics={cwvMetrics} thresholds={THRESHOLDS} />

      <div className="mt-12 text-center">
        <p className="text-gray-300">
          Adjust parameters using URL:
          <code className="bg-gray-700 px-3 py-1 rounded-full ml-2 text-sm">
            ?lcpDelay=3000&clsDelay=2000&clsSkeleton=true&clsSeverity=75
          </code>
        </p>
      </div>
    </div>
  </main>
);

export default MainContent;