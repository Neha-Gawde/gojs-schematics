// import Diagram from '@/components/diagram';
import BasicSchematic from '@/components/basicSchematic';
// import TestSchematics from '@/components/testSchematics';
export default function Home() {
  return (
    <main className="p-4 bg-white">
      <h1 className="text-xl font-bold mb-4 text-black">GoJS + Next.js Example</h1>
      {/* <Diagram /> */}
      <BasicSchematic />
      {/* <TestSchematics /> */}
    </main>
  );
}
