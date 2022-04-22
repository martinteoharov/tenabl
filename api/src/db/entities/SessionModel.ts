import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, Timestamp, OneToMany, ManyToMany, ManyToOne } from "typeorm";
import { UserModel } from "./UserModel";

@Entity('session')
export class SessionModel {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column("timestamp")
    started!: Date;

    @ManyToOne(() => UserModel, user => user.id)
    user!: UserModel;

    @Column()
    refreshToken!: string;
}