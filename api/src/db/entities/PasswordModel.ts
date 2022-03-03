import {Entity, PrimaryColumn, OneToOne, JoinColumn, Column} from "typeorm";
import {UserModel} from "./UserModel";

@Entity('password')
export class PasswordModel {

    @PrimaryColumn()
    @OneToOne(() => UserModel)
    @JoinColumn()
    user!: string;

    @Column()
    hash!: string;

}