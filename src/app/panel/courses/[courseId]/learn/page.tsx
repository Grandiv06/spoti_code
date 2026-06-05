import CourseLearningClient from "./CourseLearningClient";

// Since we are using static export (output: "export"), dynamic routes need generateStaticParams.
// Keep this list aligned with the course ids used by panel links and mock API data.
export function generateStaticParams() {
  return [
    { courseId: "html" },
    { courseId: "css" },
    { courseId: "javascript" },
    { courseId: "react" },
    { courseId: "nextjs" },
    { courseId: "typescript" },
  ];
}

export default function CourseLearningPage() {
  return <CourseLearningClient />;
}
