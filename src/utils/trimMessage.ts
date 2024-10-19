export const trimMessage = (message: string): string => {
  return message.length > 50 ? `${message.substring(0, 50)}...` : message;
};
