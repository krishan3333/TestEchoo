// app/api/contests/route.ts
import { NextResponse } from "next/server";

// Define an interface for the raw contest data from the API
interface RawCodingContest {
  name: string;
  url: string;
  start_time: string;
  end_time: string;
  site: string;
  // Add other properties if they exist
}

// Define an interface for the formatted contest data you return
interface FormattedContest {
  id: string;
  title: string;
  category: "coding" | "gaming" | "design"; // Use specific categories
  status: "live" | "upcoming";
  timeLeft: string | null;
  startsIn: string | null;
  url: string;
  theme: string;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");

  try {
    let contests: (FormattedContest | null)[] = []; // Initialize as potentially null for filtering

    if (category === "coding") {
      const resp = await fetch("https://kontests.net/api/v1/all");
      // Type assertion: tell TypeScript we expect an array of RawCodingContest
      const data = (await resp.json()) as RawCodingContest[];

      // Use the RawCodingContest type for 'c'
      contests = data.map((c: RawCodingContest, idx: number): FormattedContest | null => {
        // Determine live vs upcoming
        const start = new Date(c.start_time);
        const end = new Date(c.end_time);
        const now = new Date();

        let status: "live" | "upcoming";
        let timeLeft: string | null = null;
        let startsIn: string | null = null;

        if (start <= now && now <= end) {
          status = "live";
          // time left until end
          const diff = end.getTime() - now.getTime();
          const hrs = Math.floor(diff / (1000 * 60 * 60));
          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          timeLeft = `${hrs}h ${mins}m`;
        } else if (now < start) {
          status = "upcoming";
          // time until start
          const diff = start.getTime() - now.getTime();
          const hrs = Math.floor(diff / (1000 * 60 * 60));
          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          startsIn = `${hrs}h ${mins}m`;
        } else {
          // contest already ended — return null to filter out
          return null;
        }

        // Return object conforming to FormattedContest
        return {
          id: `coding-${idx}-${c.name.replace(/\s+/g, '-')}`, // Create a safer ID
          title: c.name,
          category: "coding",
          status,
          timeLeft,
          startsIn,
          url: c.url,
          theme: c.site, // using site as “theme” placeholder
        };
      })
      // Use the FormattedContest type (or null) for 'c' in the filter
      .filter((c: FormattedContest | null): c is FormattedContest => c !== null);

    } else if (category === "gaming") {
      // placeholder mock - ensure these match FormattedContest type
      contests = [
        {
          id: "g-live-1",
          title: "Valorant Grand Live",
          category: "gaming",
          status: "live",
          timeLeft: "2h 30m",
          startsIn: null, // Ensure all fields are present
          url: "https://example.com/g-live-1",
          theme: "FPS",
        },
        {
          id: "g-up-1",
          title: "NextGen Esports 2025",
          category: "gaming",
          status: "upcoming",
          timeLeft: null, // Ensure all fields are present
          startsIn: "5h 20m",
          url: "https://example.com/g-up-1",
          theme: "Strategy",
        },
      ];
    } else if (category === "design") {
      // placeholder mock - ensure these match FormattedContest type
      contests = [
        {
          id: "d-live-1",
          title: "UIU Contest Live",
          category: "design",
          status: "live",
          timeLeft: "1h 45m",
          startsIn: null,
          url: "https://example.com/d-live-1",
          theme: "UI/UX",
        },
        {
          id: "d-up-1",
          title: "DesignX 2025",
          category: "design",
          status: "upcoming",
          timeLeft: null,
          startsIn: "3h 50m",
          url: "https://example.com/d-up-1",
          theme: "Brand Design",
        },
      ];
    } else {
         // Handle case where category is not coding/gaming/design or is missing
         contests = []; // Return empty array if category is invalid/not provided
    }

    // Return only non-null contests
    return NextResponse.json({ contests });
  } catch (err) {
    // It's good practice to type the error as well, though 'unknown' is safest initially
    console.error("Error fetching contests:", err);
    // You can check the error type if needed: if (err instanceof Error) { ... }
    return NextResponse.json({ contests: [], error: "Failed to fetch" }, { status: 500 });
  }
}