import HomePageClient from "@/components/HomePageClient";
import { getPublishedHomeForServer } from "@/lib/cmsServer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  const initialCms = await getPublishedHomeForServer();
  return <HomePageClient initialCms={initialCms} />;
}
