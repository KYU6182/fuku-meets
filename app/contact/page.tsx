import FormPage from "@/components/FormPage";
import { getFormBySlug } from "@/lib/data/forms";

export default function ContactPage() {
  return <FormPage form={getFormBySlug("contact")} />;
}
