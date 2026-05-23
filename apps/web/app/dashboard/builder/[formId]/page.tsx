"use client";

import { useParams } from "next/navigation";
import BuilderLayout from "~/components/builder/BuilderLayout";

export default function BuilderPage() {
  const params = useParams<{ formId: string }>();
  return <BuilderLayout formId={params.formId} />;
}
