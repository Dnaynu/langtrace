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
    if (!projectId) {
      return NextResponse.json(
        JSON.stringify({ message: "projectId is required" }),
        {
          status: 400,
        }
      );
    }

    const traceService = new TraceService();
    const totalTracesPerHour: any =
      await traceService.GetTotalTracePerHourPerProject(projectId, 168); // last 7 days in hours
    const { averageLatencies, p99Latencies, p95Latencies } =
      await traceService.GetAverageTraceLatenciesPerHourPerProject(projectId);
    return NextResponse.json(
      {
        totalTracesPerHour,
        averageLatencies,
        p99Latencies,
        p95Latencies,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(JSON.stringify({ message: error }), {
      status: 400,
    });
  }
}
