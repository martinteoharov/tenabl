import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserTable1646845615618 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE user ADD firstName varchar(255)`); // Add first_name column
        await queryRunner.query(`ALTER TABLE user ADD lastName varchar(255)`); // Add last_name column
        await queryRunner.query(`ALTER TABLE user ADD acceptedTerms varchar(255)`); // Add accepted_terms column
    }

    public async down(queryRunner: QueryRunner): Promise<void> { // Undo migration
        await queryRunner.query(`ALTER TABLE user DROP COLUMN firstName`);
        await queryRunner.query(`ALTER TABLE user DROP COLUMN lastName`);
        await queryRunner.query(`ALTER TABLE user DROP COLUMN acceptedTerms`);
    }

}
