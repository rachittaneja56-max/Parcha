import BuilderLayout from "~/components/builder/BuilderLayout";
import { api } from "~/trpc/server";

export default async function BuilderPage({ 
  params,
  searchParams,
}: { 
  params: Promise<{ formId: string }>;
  searchParams: Promise<{ view?: string }>;
}) {
  const { formId } = await params;
  const resolvedParams = await searchParams;
  const view = resolvedParams?.view;
  
  const [initialForm, initialResponses] = await Promise.all([
    api.form.getFormById.query({ formId }).catch(() => null),
    api.response.getResponses.query({ formId }).catch(() => []),
  ]);

  return (
    <BuilderLayout 
      formId={formId} 
      initialView={(view === 'analytics' || view === 'settings') ? view : 'build'} 
      initialForm={initialForm}
      initialResponses={initialResponses}
    />
  );
}
