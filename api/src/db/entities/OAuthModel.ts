import { Entity, OneToOne, JoinColumn, Column, PrimaryGeneratedColumn } from "typeorm";
import { UserModel } from "./UserModel";

@Entity('oauth')
export class OAuthModel {

    @PrimaryGeneratedColumn()
    public id!: string

    @OneToOne(() => UserModel)
    @JoinColumn()
    user!: string;

    @Column({ type: 'varchar', nullable: true })
    google_auth_sub!: string | null | undefined;

    @Column({ type: 'varchar', nullable: true })
    github_auth_username!: string | null | undefined;
}
