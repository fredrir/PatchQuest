import type { Metadata } from "next";
import { GAME_MODE_BY_SLUG } from "@/domain/gameMode";
import { PracticeClient } from "./PracticeClient";

interface PageProps {
  params: Promise<{ mode: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { mode } = await params;
  const meta = GAME_MODE_BY_SLUG[mode];
  return {
    title: meta?.title ?? "Practice",
    description: meta?.description,
  };
}

export default async function PracticeModePage({ params }: PageProps) {
  const { mode } = await params;
  return <PracticeClient slug={mode} />;
}
