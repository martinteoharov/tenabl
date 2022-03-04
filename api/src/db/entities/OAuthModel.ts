import {Entity, PrimaryColumn, OneToOne, JoinColumn, Column, Timestamp} from "typeorm";
import {UserModel} from "./UserModel";

@Entity('password')
export class OAuthModel {

    @PrimaryColumn()
    @OneToOne(() => UserModel)
    @JoinColumn()
    user!: string;

    @Column()
    google_auth_token!: string;

    @Column()
    google_token_type!: string;

    @Column()
    google_renew_token!: string;

    @Column({ type: 'timestamp', nullable: true })
    google_expiration!: Date;
}