export interface NotificationContextType {
  handleNotification: (content: string, type: "info" | "success" | "warning" | "error") => void;
}
