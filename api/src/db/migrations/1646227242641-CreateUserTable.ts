import {MigrationInterface, QueryRunner, Table, TableIndex, TableColumn, TableForeignKey } from "typeorm";


export class CreateUserTable1646227242641 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "user",
            columns: [
                {
                    name: "id",
                    type: "varchar",
                    isPrimary: true
                },
                {
                    name: "username",
                    type: "varchar",
                },
                {
                    name: "email",
                    type: "varchar",
                }
            ]
        }), true)
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("user");    // Revert changes if needed
    }

}
