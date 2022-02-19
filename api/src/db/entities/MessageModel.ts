import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('messages')
export class MessageModel {
    @PrimaryGeneratedColumn()
    public id!: number

    @Column()
    public name!: string

    @Column()
    public post!: string
}
