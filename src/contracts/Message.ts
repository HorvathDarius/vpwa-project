export type RawMessage = string;

export interface SerializedMessage {
  id: number;
  createdBy: number;
  channelId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  mentions: number;
}
