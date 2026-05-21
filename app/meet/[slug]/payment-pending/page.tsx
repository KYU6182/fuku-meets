import MeetPaymentStatusPage from "@/components/MeetPaymentStatusPage";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function MeetPaymentPendingPage({ params }: PageProps) {
  const { slug } = await params;
  return <MeetPaymentStatusPage slug={slug} mode="pending" />;
}
