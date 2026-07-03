export type PanelDashboardOverviewDto = {
  user: {
    id: string;
    fullName: string;
    phone: string;
  };
  enrolledCoursesCount: number;
  myCommentsCount: number;
  acceptedCommentsCount: number;
  waitingCommentsCount: number;
  hasActiveOrder: boolean;
  labels: {
    welcomeTitle: string;
    welcomeSubtitle: string;
    enrolledCourses: string;
    myComments: string;
    acceptedComments: string;
    waitingComments: string;
    activeOrder: string;
    activeOrderYes: string;
    activeOrderNo: string;
  };
};

export type PanelMyCourseDto = {
  id: string;
  courseId: string;
  progress: number;
  progressPercent: number;
  course: {
    id: string;
    title: string;
    name: string;
    thumbnail: string;
    cover: string;
    teacher: {
      id: string;
      fullName: string;
      name: string;
      avatar: string;
    };
  };
};

export type PanelTransactionDto = {
  id: string;
  type: string;
  description: string;
  amount: number;
  status: string;
  createdAt: string;
  paymentMethod: string;
  trackingCode: string;
  productTitle: string;
};

export type PanelMyCommentDto = {
  id: string;
  content: string;
  project: string;
  courseId: string;
  courseTitle: string;
  createdAt: string;
};
