import CommunityDetailPage from "@/components/CommunityDetailPage";

export default async function MeetDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CommunityDetailPage slug={slug} />;
}
