import IconProfilePage from "@/components/IconProfilePage";
import { icons } from "@/lib/data/icons";

export default async function IconDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const icon = icons.find((item) => item.slug === slug) ?? icons[0];
  return <IconProfilePage icon={icon} />;
}
