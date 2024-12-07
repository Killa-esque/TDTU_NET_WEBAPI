import { useNotification } from "@/contexts/NotificationContext";

// Biến global để lưu notification context
let notificationService: ReturnType<typeof useNotification> | null = null;

// Hàm này sẽ được gọi để lưu lại notification context
export const setNotificationService = (service: ReturnType<typeof useNotification>) => {
  notificationService = service;
};

// Hàm này dùng để gọi thông báo ở bất kỳ đâu trong app
export const notify = (message: string, type: "info" | "success" | "warning" | "error") => {
  if (notificationService) {
    notificationService.handleNotification(message, type);
  } else {
    console.error("Notification service is not initialized.");
  }
};
