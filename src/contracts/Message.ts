export type RawMessage = string;

export interface SerializedMessage {
  id: string; // uuid
  createdBy: string; // uuid
  channelId: string; // uuid
  content: string;
  createdAt: string;
  updatedAt: string;
  mentions: string;
}