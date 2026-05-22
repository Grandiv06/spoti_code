import { initialUsersData } from "../_components/types";
import UserDetailView from "./UserDetailView";

export function generateStaticParams() {
  return initialUsersData.map((u) => ({
    userId: u.id,
  }));
}

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default async function UserDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <UserDetailView userId={resolvedParams.userId} />;
}
