import _ from 'lodash';
import { type Chat, type Conversation } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import { type GetConversations, type GetChat, type GetChats } from 'wasp/server/operations';
export const getChats: GetChats<void, Chat[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  return context.entities.Chat.findMany({
    where: {
      user: {
        id: context.user.id,
      },
    },
    orderBy: { id: 'desc' },
  });
};

type GetConversationPayload = {
  chatId: number;
};

export const getConversations: GetConversations<GetConversationPayload, Conversation[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  let conversation = null;
  try {
    conversation = context.entities.Conversation.findMany({
      where: { chatId: args.chatId, userId: context.user.id },
      orderBy: { id: 'asc' },
    });
    return conversation;
  } catch (error) {
    console.error('Error while fetching conversations:', error);
    return [];
  }
};

type getChatFromUUIDPayload = {
  chatUUID: string | null | undefined;
};

export const getChatFromUUID: GetChat<getChatFromUUIDPayload, Chat> = async (args: any, context: any) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  let chat = null;
  chat = await context.entities.Chat.findFirst({
    where: {
      uuid: args.chatUUID,
      userId: context.user.id,
    },
  });
  return chat;
};

type GetChatPayload = {
  chatId: number;
};

export const getChat: GetChat<GetChatPayload, Chat> = async (args: any, context: any) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  let chat = null;
  chat = await context.entities.Chat.findFirstOrThrow({
    where: {
      id: args.chatId,
      userId: context.user.id,
    },
  });
  return chat;
};
