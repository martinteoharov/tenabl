import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('user')
export class UserModel {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column()
    username!: string;

    @Column()
    email!: string;

    @Column()
    acceptedTerms!: boolean;
}