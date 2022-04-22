import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { PublicationModel } from "./PublicationModel";
import { UserModel } from "./UserModel";

@Entity('review')
export class ReviewModel {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => UserModel, user => user.id)
    user!: UserModel;

    @ManyToOne(() => PublicationModel, publication => publication.id)
    publication!: PublicationModel;

    @Column({ type: 'jsonb' })
    body!: JSON;
}
