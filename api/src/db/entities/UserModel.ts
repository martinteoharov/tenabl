import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('user')
export class UserModel {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    first_name!: string;

    @Column()
    last_name!: string;

    @Column()
    username!: string;

    @Column()
    email!: string;

    @Column()
    accepted_terms!: boolean;
}
