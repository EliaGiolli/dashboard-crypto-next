import About from "../components/layout/About";
import ChartView from "../components/layout/ChartView";
import CallToAction from "../components/layout/CallToAction";

export default function Home() {
  return (
    <main className="bg-slate-400 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <About />
      <ChartView />
      <CallToAction />
    </main>
  );
}
