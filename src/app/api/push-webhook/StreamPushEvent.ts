//NOTE: to get the ts types copy the object from the terminal and paste in json to ts tool
//https://jsonformatter.org/
//https://transform.tools/json-to-typescript
export interface StreamPushEvent {
  message: Message;
  channel: Channel;
  user: User;
}

export interface Message {
  id: string;
  text: string;
  html: string;
  type: string;
  user: User;
  attachments: any[];
  latest_reactions: any[];
  own_reactions: any[];
  reply_count: number;
  deleted_reply_count: number;
  cid: string;
  created_at: string;
  updated_at: string;
  shadowed: boolean;
  mentioned_users: any[];
  silent: boolean;
  pinned: boolean;
  pinned_at: any;
  pinned_by: any;
  pin_expires: any;
}

export interface User {
  id: string;
  role: string;
  created_at: string;
  updated_at: string;
  last_active: string;
  banned: boolean;
  online: boolean;
  image: string;
  name: string;
}

export interface Channel {
  id: string;
  type: string;
  cid: string;
  last_message_at: string;
  created_at: string;
  updated_at: string;
  created_by: CreatedBy;
  frozen: boolean;
  disabled: boolean;
  members: Member[];
  auto_translation_language: string;
  member_count: number;
  config: Config;
  name: string;
}

export interface CreatedBy {
  id: string;
  role: string;
  created_at: string;
  updated_at: string;
  last_active: string;
  banned: boolean;
  online: boolean;
  name: string;
  image: string;
}

export interface Member {
  user_id: string;
  user: User2;
  created_at: string;
  updated_at: string;
  banned: boolean;
  shadow_banned: boolean;
  role: string;
  channel_role: string;
}

export interface User2 {
  id: string;
  role: string;
  created_at: string;
  updated_at: string;
  last_active?: string;
  banned: boolean;
  online: boolean;
  language?: string;
  first_name?: string;
  staff_user?: boolean;
  dashboard_user?: boolean;
  last_name?: string;
  name?: string;
  image?: string;
}

export interface Config {
  created_at: string;
  updated_at: string;
  name: string;
  typing_events: boolean;
  read_events: boolean;
  connect_events: boolean;
  search: boolean;
  reactions: boolean;
  replies: boolean;
  quotes: boolean;
  mutes: boolean;
  uploads: boolean;
  url_enrichment: boolean;
  custom_events: boolean;
  push_notifications: boolean;
  reminders: boolean;
  mark_messages_pending: boolean;
  message_retention: string;
  max_message_length: number;
  automod: string;
  automod_behavior: string;
  commands: string[];
}
