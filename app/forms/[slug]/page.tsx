import FormPage from "@/components/FormPage";
import { getFormBySlug } from "@/lib/data/forms";

export default async function DynamicFormPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <FormPage form={getFormBySlug(slug)} />;
}
