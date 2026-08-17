import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      // Mock stats fallback
      return NextResponse.json({
        foundersJoined: 342,
        ideasSubmitted: 189,
        hackathonsHeld: 28,
        startupsFormed: 19,
        activeMentors: 45,
      });
    }

    const { data, error } = await supabase
      .from("live_community_stats")
      .select("*")
      .eq("id", "global")
      .single();

    if (error || !data) {
      return NextResponse.json({
        foundersJoined: 342,
        ideasSubmitted: 189,
        hackathonsHeld: 28,
        startupsFormed: 19,
        activeMentors: 45,
      });
    }

    return NextResponse.json({
      foundersJoined: data.founders_joined,
      ideasSubmitted: data.ideas_submitted,
      hackathonsHeld: data.hackathons_held,
      startupsFormed: data.startups_formed,
      activeMentors: data.active_mentors,
    });
  } catch {
    return NextResponse.json({
      foundersJoined: 342,
      ideasSubmitted: 189,
      hackathonsHeld: 28,
      startupsFormed: 19,
      activeMentors: 45,
    });
  }
}
