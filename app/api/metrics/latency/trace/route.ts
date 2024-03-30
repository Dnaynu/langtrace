import { authOptions } from "@/lib/auth/options";
import { TraceService } from "@/lib/services/trace_service";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/login");
  }

  try {
    const projectId = req.nextUrl.searchParams.get("projectId") as string;
    const traceService = new TraceService();
    const totalTracesPerDay: any =
      await traceService.GetTotalTracePerDayPerProject(
        projectId,
        7 // last 7 days
      );
    const { averageLatencies, p99Latencies, p95Latencies } =
      await traceService.GetAverageTraceLatenciesPerDayPerProject(projectId);
    return NextResponse.json(
      {
        totalTracesPerDay,
        averageLatencies,
        p99Latencies,
        p95Latencies,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(JSON.stringify({ error }), {
      status: 400,
    });
  }
}
