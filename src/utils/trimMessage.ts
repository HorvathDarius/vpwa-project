// Helper function to trim message to 50 characters
export const trimMessage = (message: string): string => {
  return message.length > 50 ? `${message.substring(0, 50)}...` : message;
};
