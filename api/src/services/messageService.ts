import { Connection } from "typeorm"
import { Message } from "../common/message"
import { MessageModel } from "../db/entities/MessageModel"

export interface MessageService {
    postMesage(msg: Message): Promise<void>
    getMessages(): Promise<Message[]>
}

export function getMessageService(conn: Connection): MessageService {
    const repo = conn.getRepository(MessageModel)
    return {
        async postMesage({ name, post }) {
            const model = new MessageModel()
            model.name = name
            model.post = post
            await repo.save(model)
        },
        async getMessages() {
            return await repo.find({ order: { 'id': 'ASC' }})
        }
    }
}
