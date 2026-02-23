import PanelProfileClient from "./PanelProfileClient";

const USER_IDS = Array.from({ length: 10 }, (_, i) => `user-${i + 1}`);

export function generateStaticParams() {
  return USER_IDS.map((id) => ({ id }));
}

export default function PanelProfilePage({ params }: { params: Promise<{ id: string }> }) {
  return <PanelProfileClient params={params} />;
}
