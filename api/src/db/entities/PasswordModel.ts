import { Entity, OneToOne, JoinColumn, Column, PrimaryGeneratedColumn } from "typeorm";
import { UserModel } from "./UserModel";

@Entity('password')
export class PasswordModel {

    @PrimaryGeneratedColumn()
    public id!: number

    @OneToOne(() => UserModel)
    @JoinColumn()
    user!: string;

    @Column()
    hash!: string;
}