import CourseLearningClient from "./CourseLearningClient";

// Since we are using static export (output: "export"), dynamic routes need generateStaticParams.
// Here we mock the available course IDs.
export function generateStaticParams() {
  return [
    { courseId: "1" },
    { courseId: "2" },
    { courseId: "3" },
  ];
}

export default function CourseLearningPage() {
  return <CourseLearningClient />;
}
