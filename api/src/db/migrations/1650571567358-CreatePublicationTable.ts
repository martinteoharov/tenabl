import {MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePublicationTable1650574559759 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "publication",
            columns: [
                {
                    name: "id",
                    type: "varchar",
                    isPrimary: true
                },
                {
                    name: "publisher",
                    type: "varchar",
                },
                {
                    name: "url",
                    type: "varchar",
                }
            ]
        }), true)
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("publication");    // Revert changes if needed
    }
}

