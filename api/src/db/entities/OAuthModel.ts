import { Entity, OneToOne, JoinColumn, Column, PrimaryColumn } from "typeorm";
import { UserModel } from "./UserModel";

@Entity('oauth')
export class OAuthModel {

    @PrimaryColumn()
    public id!: string

    @OneToOne(() => UserModel)
    @JoinColumn()
    user!: string;

    @Column()
    google_auth_sub!: string;

    @Column()
    github_auth_username!: string;
}
