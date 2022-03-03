import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity('user')
export class UserModel {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    username!: string;

    @Column()
    email!: string;

}