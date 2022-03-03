import {Entity, PrimaryColumn, OneToOne, JoinColumn, Column} from "typeorm";
import {User} from "./User";

@Entity()
export class Password {

    @PrimaryColumn()
    @OneToOne(() => User)
    @JoinColumn()
    user: string;

    @Column()
    hash: string;

}