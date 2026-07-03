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
