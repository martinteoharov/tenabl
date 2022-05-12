import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { UserModel } from "./UserModel";

@Entity('session')
export class SessionModel {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('timestamp')
    started!: Date;

    @ManyToOne(() => UserModel, user => user.id)
    user!: UserModel;

    @Column()
    refresh_token!: string;
}
