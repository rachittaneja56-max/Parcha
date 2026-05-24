import BuilderLayout from "~/components/builder/BuilderLayout";

export default async function BuilderPage({ params }: { params: Promise<{ formId: string }> }) {
  const { formId } = await params;
  return <BuilderLayout formId={formId} />;
}
