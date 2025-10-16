; // Assuming Friends component is here
// import Fr
import ContestsPage from "./contests/page";

export default function DashboardPage() {
  return (
    <div className="flex flex-col lg:flex-row p-4 gap-6">
      <div className="lg:w-1/3">
        {/* <Friends /> */}
      </div>
      <div className="lg:w-2/3">
        {/* We pass empty searchParams because none are needed on the main dashboard view */}
        <ContestsPage searchParams={{}} />
      </div>
    </div>
  );
}