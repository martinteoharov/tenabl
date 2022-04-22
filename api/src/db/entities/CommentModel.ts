import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { UserModel } from "./UserModel";
import { PublicationModel } from "./PublicationModel";

@Entity('comment')
export class CommentModel {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => UserModel, user => user.id)
    user!: UserModel;

    @ManyToOne(() => PublicationModel, publication => publication.id)
    publication!: PublicationModel;

    @Column()
    body!: string;
}
