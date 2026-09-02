import { getAllCases } from "@/lib/content";
import { CasesList } from "@/components/admin/CasesList";

export default async function AdminCasosPage() {
  const cases = await getAllCases();
  return <CasesList cases={cases} />;
}
