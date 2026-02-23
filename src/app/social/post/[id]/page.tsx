import PostDetailClient from "./PostDetailClient";

const POST_IDS = Array.from({ length: 30 }, (_, i) => `post-${i + 1}`);

export function generateStaticParams() {
  return POST_IDS.map((id) => ({ id }));
}

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <PostDetailClient params={params} />;
}
