import { notification } from "antd";

export function openNotificationError(error) {
  notification.error({
    message: "Error",
    description: error,
  });
}

export function openNotification(message) {
  notification.success({
    message: "Success",
    description: message,
  });
}
