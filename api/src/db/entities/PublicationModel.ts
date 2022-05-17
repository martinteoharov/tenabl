import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('publication')
export class PublicationModel {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    publisher!: string;

    @Column()
    url!: string;

    @Column()
    title!: string;

    @Column()
    description!: string;
}
