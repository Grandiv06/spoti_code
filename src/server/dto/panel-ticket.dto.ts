export type PanelTicketMessageDto = {
  id: string;
  sender: string;
  senderType: string;
  senderName: string;
  message: string;
  text: string;
  body: string;
  timestamp: string;
  createdAt: string;
  attachments?: Array<{
    name: string;
    url: string;
    size: number;
    type: string;
  }>;
};

export type PanelTicketDto = {
  id: string;
  title: string;
  subject: string;
  category: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  messages: PanelTicketMessageDto[];
  attachments: [];
  timeline: [];
};
