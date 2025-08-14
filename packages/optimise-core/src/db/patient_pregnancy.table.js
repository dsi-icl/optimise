import { PregnancyCore } from '../core/demographic';
import { tableMove, tableCopyBack } from '../utils/db-mover';

export const TABLE_NAME = 'PATIENT_PREGNANCY';
export const PRIORITY = 2;
export default async (dbcon, version) => {
    switch (version) {
        case 1:
        case 2:
        case 3:
            await tableMove(TABLE_NAME, version);
            await dbcon().schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.integer('patient').notNullable().references('id').inTable('PATIENTS').onDelete('CASCADE');
                table.text('startDate').notNullable();
                table.integer('outcome').nullable().references('id').inTable('PREGNANCY_OUTCOMES');
                table.text('outcomeDate').nullable();
                table.integer('meddra').nullable().references('id').inTable('ADVERSE_EVENT_MEDDRA');
                table.text('createdTime').notNullable().defaultTo(dbcon().fn.now());
                table.integer('createdByUser').notNullable().references('id').inTable('USERS');
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['patient', 'startDate', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
            });
            await tableCopyBack(TABLE_NAME);
            break;
        case 16:
            await dbcon().schema.table(TABLE_NAME, (table) => {
                table.dropForeign('patient');
                table.foreign('patient').references('id').inTable('PATIENTS').onDelete('CASCADE');
            });
            break;
        case 17:
            await dbcon().schema.table(TABLE_NAME, (table) => {
                table.dropForeign('patient');
                table.foreign('patient').references('id').inTable('PATIENTS').onDelete('CASCADE');
            });
            break;
        case 18:
            await dbcon().schema.table(TABLE_NAME, (table) => {
                table.dropForeign('patient');
                table.foreign('patient').references('id').inTable('PATIENTS').onDelete('CASCADE');
            });
            break;
        case 20:
            await dbcon().schema.table(TABLE_NAME, (table) => {
                table.dropForeign('outcome');
                table.foreign('outcome').references('id').inTable('PREGNANCY_OUTCOMES').onDelete('CASCADE');
            });
            break;
        case 22: {
            await tableMove(TABLE_NAME, version);
            await dbcon().schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.integer('pregnancyNumber').nullable();
                table.integer('patient').notNullable().references('id').inTable('PATIENTS').onDelete('CASCADE');
                table.text('startDate').notNullable();
                table.integer('outcome').nullable().references('id').inTable('PREGNANCY_OUTCOMES');
                table.text('outcomeDate').nullable();
                table.integer('meddra').nullable().references('id').inTable('ADVERSE_EVENT_MEDDRA');
                table.text('createdTime').notNullable().defaultTo(dbcon().fn.now());
                table.integer('createdByUser').notNullable().references('id').inTable('USERS');
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['patient', 'startDate', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
            });
            await tableCopyBack(TABLE_NAME);
            break;
        }
        case 23: {
            const oldData = await dbcon()(TABLE_NAME).select();
            const patientMap = {};
            for (const record of oldData) {
                if (record.deleted !== '-')
                    continue;
                if (!patientMap[record.patient])
                    patientMap[record.patient] = [];
                patientMap[record.patient].push(record);
            }
            const visitTypes = await dbcon()('AVAILABLE_VISIT_TYPES').where({
                deleted: '-'
            });
            const remoteVisitType = visitTypes.find(v => v.name === 'Clinical Visit');
            const pregEntryTypes = await dbcon()('AVAILABLE_PREGNANCY_ENTRY_TYPES').where({
                deleted: '-'
            });
            const baselinePregEntryType = pregEntryTypes.find(v => v.name === 'Baseline');
            const termPregEntryType = pregEntryTypes.find(v => v.name === 'Term');

            const outcomeTypes = (await dbcon()('PREGNANCY_OUTCOMES').where({
                value: 'Incomplete prior pregnancy record'
            }))[0];

            const pregnanciesTuples = Object.entries(patientMap);
            for (const [patientId, pregnanciesUnordered] of pregnanciesTuples) {
                const pregnancies = pregnanciesUnordered.sort((a, b) => {
                    const aDate = parseInt(a.startDate);
                    const bDate = parseInt(b.startDate);
                    return aDate - bDate;
                });

                let pregnancyNumber = 0;
                let lastPregnancyProcessed = -1;
                let lastPregnancyOutcomed = false;

                for (const pregnancy of pregnancies) {
                    const entriesForPregnancy = await dbcon()('PREGNANCY_ENTRY').where({
                        pregnancyId: pregnancy.id,
                        deleted: '-'
                    });

                    if (!lastPregnancyOutcomed && lastPregnancyProcessed !== -1) {
                        const priorDay = new Date(parseInt(pregnancy.startDate) - 24 * 60 * 60 * 1000);
                        await PregnancyCore.editPregnancy({ id: 0 }, {
                            id: lastPregnancyProcessed,
                            outcome: outcomeTypes.id,
                            outcomeDate: priorDay.getTime()
                        });
                        await createVisitAndPregEntryCombo(dbcon, patientId, `${priorDay.getTime()}`, remoteVisitType?.id ?? 0, lastPregnancyProcessed, termPregEntryType?.id ?? 3);
                    }

                    lastPregnancyProcessed = pregnancy.id;
                    lastPregnancyOutcomed = false;

                    if (pregnancy.outcomeDate)
                        lastPregnancyOutcomed = true;

                    if (entriesForPregnancy?.length === 0) {
                        await createVisitAndPregEntryCombo(dbcon, patientId, pregnancy.startDate, remoteVisitType?.id ?? 0, pregnancy.id, baselinePregEntryType?.id ?? 1);
                        if (pregnancy.outcomeDate)
                            await createVisitAndPregEntryCombo(dbcon, patientId, pregnancy.outcomeDate, remoteVisitType?.id ?? 0, pregnancy.id, termPregEntryType?.id ?? 3);
                    }
                    else if (entriesForPregnancy?.length === 1) {
                        const entry = entriesForPregnancy[0];
                        if (entry.type === termPregEntryType?.id) {
                            if (!pregnancy.outcomeDate) {
                                // Lets make this entry a baseline entry
                                await PregnancyCore.editPregnancyEntry({ id: 0 }, {
                                    id: entry.id,
                                    type: parseInt(baselinePregEntryType?.id ?? 1)
                                });
                            }
                            else {
                                // We are missing the baseline entry
                                await createVisitAndPregEntryCombo(dbcon, patientId, pregnancy.startDate, remoteVisitType?.id ?? 0, pregnancy.id, baselinePregEntryType?.id ?? 1);
                            }
                        }
                    }
                    // else {
                    // Pregnancy has entries, so we can determine the pregnancy number
                    await dbcon()(TABLE_NAME)
                        .where({ id: pregnancy.id })
                        .update({ pregnancyNumber: pregnancyNumber++ });
                    // }
                }
            };
            break;
        }
        default:
            break;
    }
};

const createVisitAndPregEntryCombo = async (dbcon, patientId, visitDate, visitTypeId, pregnancyId, pregnancyTypeId) => {
    const [{ id: newVisitId }] = await dbcon()('VISITS').insert({
        patient: patientId,
        visitDate: visitDate,
        type: visitTypeId,
        createdTime: dbcon().fn.now(),
        createdByUser: 0,
        deleted: '-'
    }, ['id']);

    await dbcon()('VISIT_DATA').insert({
        visit: parseInt(newVisitId),
        field: 0,
        value: 'Pregnancy',
        createdTime: dbcon().fn.now(),
        createdByUser: 0,
        deleted: '-'
    });

    await dbcon()('PREGNANCY_ENTRY').insert({
        pregnancyId,
        recordedDuringVisit: parseInt(newVisitId),
        type: pregnancyTypeId,
        createdTime: dbcon().fn.now(),
        createdByUser: 0,
        deleted: '-'
    });
};
