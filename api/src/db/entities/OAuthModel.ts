import { Entity, OneToOne, JoinColumn, Column, PrimaryGeneratedColumn } from "typeorm";
import { UserModel } from "./UserModel";

@Entity('oauth')
export class OAuthModel {

    @PrimaryGeneratedColumn()
    public id!: number

    @OneToOne(() => UserModel)
    @JoinColumn()
    user!: string;

    @Column()
    googleAuthToken!: string;

    @Column()
    googleTokenType!: string;

    @Column()
    googleRenewToken!: string;

    @Column({ type: 'timestamp', nullable: true })
    googleExpiration!: Date;
}