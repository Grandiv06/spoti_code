import ProfilePageClient from "./ProfilePageClient";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProfilePageClient key={id} userId={id} />;
}
