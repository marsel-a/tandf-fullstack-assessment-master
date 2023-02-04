import {MigrationInterface, QueryRunner} from "typeorm";

export class newFieldsInAppointment1675510507117 implements MigrationInterface {
    name = 'newFieldsInAppointment1675510507117'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" ADD "patientName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD "description" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "patientName"`);
    }

}
