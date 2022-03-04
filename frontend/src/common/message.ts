import * as t from 'io-ts'

// Message is both a constant and a type, selected based on context

export const Message = t.type({
    name: t.string,
    post: t.string
})

export type Message = t.TypeOf<typeof Message>

export const MessageList = t.array(Message)