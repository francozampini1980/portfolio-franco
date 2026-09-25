import { getCompanyLogos } from "@/lib/content";
import { LogosEditor } from "@/components/admin/LogosEditor";

export default async function AdminEmpresasPage() {
  const items = await getCompanyLogos();
  return <LogosEditor items={items} />;
}
