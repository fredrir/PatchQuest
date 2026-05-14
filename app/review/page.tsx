import type { Metadata } from "next";
import { ReviewClient } from "./ReviewClient";

export const metadata: Metadata = {
  title: "Mistake review",
  description: "Revisit the challenges you've previously missed.",
};

export default function ReviewPage() {
  return <ReviewClient />;
}
