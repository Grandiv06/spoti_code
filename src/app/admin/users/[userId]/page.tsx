import UserDetailView from "./UserDetailView";
import { initialUsersData } from "../_components/types";

export function generateStaticParams() {
  return [
    ...initialUsersData.map((user) => ({
      userId: user.id,
    })),
    {
      userId: "ebb268b1-22b3-4ab3-a646-8eff36588899",
    },
  ];
}

interface PageProps {
  params: {
    userId: string;
  };
}

export default async function UserDetailPage({ params }: PageProps) {
  return <UserDetailView userId={params.userId} />;
}
