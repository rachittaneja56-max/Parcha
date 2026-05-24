import { RespondentTerminal } from "~/components/respondent/RespondentTerminal";

export default async function FormRespondentPage({ params }: { params: Promise<{ formId: string }> }) {
  const { formId } = await params;
  return (
    <main className="h-screen w-screen overflow-hidden bg-[#050B14]">
      <RespondentTerminal formId={formId} />
    </main>
  );
}
