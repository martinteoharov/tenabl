import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { UserModel } from "./UserModel";

@Entity('review')
export class ReviewModel {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => UserModel, user => user.id)
    user!: UserModel;

    @Column()
    url!: string;

    @Column()
    review!: string;
}
