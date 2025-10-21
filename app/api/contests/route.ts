// app/api/contests/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");

  try {
    let contests = [];

    if (category === "coding") {
      const resp = await fetch("https://kontests.net/api/v1/all");
      const data = await resp.json();

      // Map / filter to your UI schema
      contests = data.map((c: any, idx: number) => {
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
          // contest already ended — you might filter them out
          return null;
        }

        return {
          id: `coding-${idx}-${c.name}`,
          title: c.name,
          category: "coding",
          status,
          timeLeft,
          startsIn,
          url: c.url,
          theme: c.site, // using site as “theme” placeholder
        };
      })
      .filter((c: any) => c !== null);
    } else if (category === "gaming") {
      // placeholder mock
      contests = [
        {
          id: "g-live-1",
          title: "Valorant Grand Live",
          category: "gaming",
          status: "live",
          timeLeft: "2h 30m",
          url: "https://example.com/g-live-1",
          theme: "FPS",
        },
        // add more mocks...
        {
          id: "g-up-1",
          title: "NextGen Esports 2025",
          category: "gaming",
          status: "upcoming",
          startsIn: "5h 20m",
          url: "https://example.com/g-up-1",
          theme: "Strategy",
        },
      ];
    } else if (category === "design") {
      // placeholder mock
      contests = [
        {
          id: "d-live-1",
          title: "UIU Contest Live",
          category: "design",
          status: "live",
          timeLeft: "1h 45m",
          url: "https://example.com/d-live-1",
          theme: "UI/UX",
        },
        {
          id: "d-up-1",
          title: "DesignX 2025",
          category: "design",
          status: "upcoming",
          startsIn: "3h 50m",
          url: "https://example.com/d-up-1",
          theme: "Brand Design",
        },
      ];
    }

    return NextResponse.json({ contests });
  } catch (err) {
    console.error("Error fetching contests:", err);
    return NextResponse.json({ contests: [], error: "Failed to fetch" }, { status: 500 });
  }
}
