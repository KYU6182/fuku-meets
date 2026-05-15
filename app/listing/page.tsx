import FormPage from "@/components/FormPage";
import { getFormBySlug } from "@/lib/data/forms";

export default function ListingPage() {
  return <FormPage form={getFormBySlug("listing")} />;
}
