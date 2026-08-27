import { ComingSoon } from "@/components/coming-soon";

export default function CustomsPage() {
  return (
    <ComingSoon
      title="Customs"
      note="Customs clearance documents/status per shipment need the document_docs bucket wired to a specific customs workflow. Tell me which countries' customs rules to model and I'll build it."
    />
  );
}
