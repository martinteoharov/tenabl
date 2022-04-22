import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserTable1646845615618 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE user ADD first_name varchar(255)`); // Add first_name column
        await queryRunner.query(`ALTER TABLE user ADD last_name varchar(255)`); // Add last_name column
        await queryRunner.query(`ALTER TABLE user ADD accepted_terms varchar(255)`); // Add accepted_terms column
    }

    public async down(queryRunner: QueryRunner): Promise<void> { // Undo migration
        await queryRunner.query(`ALTER TABLE user DROP COLUMN first_name`);
        await queryRunner.query(`ALTER TABLE user DROP COLUMN last_name`);
        await queryRunner.query(`ALTER TABLE user DROP COLUMN accepted_terms`);
    }

}
