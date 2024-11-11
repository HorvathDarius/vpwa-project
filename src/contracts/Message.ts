export type RawMessage = string;

export interface SerializedMessage {
  id: string; // uuid
  userID: string; // uuid
  channelID: string; // uuid
  content: string;
  status: string; // idk if we put it here, not in requirements
  sentAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}