import { Schema } from "effect";

export const MessageId = Schema.String.pipe(Schema.brand("MessageId"));

export const Message = Schema.Struct({
  id: MessageId,
  body: Schema.String,
  createdAt: Schema.DateTimeUtc,
  readAt: Schema.NullOr(Schema.DateTimeUtc),
});

export type Message = typeof Message.Type;
