
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Scraping_tasksDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const scraping_tasks = await db.scraping_tasks.create(
            {
                id: data.id || undefined,

        scheduled_time: data.scheduled_time
        ||
        null
            ,

        status: data.status
        ||
        null
            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return scraping_tasks;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const scraping_tasksData = data.map((item, index) => ({
                id: item.id || undefined,

                scheduled_time: item.scheduled_time
            ||
            null
            ,

                status: item.status
            ||
            null
            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const scraping_tasks = await db.scraping_tasks.bulkCreate(scraping_tasksData, { transaction });

        return scraping_tasks;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const scraping_tasks = await db.scraping_tasks.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.scheduled_time !== undefined) updatePayload.scheduled_time = data.scheduled_time;

        if (data.status !== undefined) updatePayload.status = data.status;

        updatePayload.updatedById = currentUser.id;

        await scraping_tasks.update(updatePayload, {transaction});

        return scraping_tasks;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const scraping_tasks = await db.scraping_tasks.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of scraping_tasks) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of scraping_tasks) {
                await record.destroy({transaction});
            }
        });

        return scraping_tasks;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const scraping_tasks = await db.scraping_tasks.findByPk(id, options);

        await scraping_tasks.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await scraping_tasks.destroy({
            transaction
        });

        return scraping_tasks;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const scraping_tasks = await db.scraping_tasks.findOne(
            { where },
            { transaction },
        );

        if (!scraping_tasks) {
            return scraping_tasks;
        }

        const output = scraping_tasks.get({plain: true});

        return output;
    }

    static async findAll(filter, options) {
        const limit = filter.limit || 0;
        let offset = 0;
        let where = {};
        const currentPage = +filter.page;

        const user = (options && options.currentUser) || null;

        offset = currentPage * limit;

        const orderBy = null;

        const transaction = (options && options.transaction) || undefined;

        let include = [];

        if (filter) {
            if (filter.id) {
                where = {
                    ...where,
                    ['id']: Utils.uuid(filter.id),
                };
            }

            if (filter.scheduled_timeRange) {
                const [start, end] = filter.scheduled_timeRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    scheduled_time: {
                    ...where.scheduled_time,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    scheduled_time: {
                    ...where.scheduled_time,
                            [Op.lte]: end,
                    },
                };
                }
            }

            if (filter.active !== undefined) {
                where = {
                    ...where,
                    active: filter.active === true || filter.active === 'true'
                };
            }

            if (filter.status) {
                where = {
                    ...where,
                status: filter.status,
            };
            }

            if (filter.createdAtRange) {
                const [start, end] = filter.createdAtRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                        ['createdAt']: {
                            ...where.createdAt,
                            [Op.gte]: start,
                        },
                    };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                        ['createdAt']: {
                            ...where.createdAt,
                            [Op.lte]: end,
                        },
                    };
                }
            }
        }

        const queryOptions = {
            where,
            include,
            distinct: true,
            order: filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction: options?.transaction,
            logging: console.log
        };

        if (!options?.countOnly) {
            queryOptions.limit = limit ? Number(limit) : undefined;
            queryOptions.offset = offset ? Number(offset) : undefined;
        }

        try {
            const { rows, count } = await db.scraping_tasks.findAndCountAll(queryOptions);

            return {
                rows: options?.countOnly ? [] : rows,
                count: count
            };
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    }

    static async findAllAutocomplete(query, limit, offset) {
        let where = {};

        if (query) {
            where = {
                [Op.or]: [
                    { ['id']: Utils.uuid(query) },
                    Utils.ilike(
                        'scraping_tasks',
                        'status',
                        query,
                    ),
                ],
            };
        }

        const records = await db.scraping_tasks.findAll({
            attributes: [ 'id', 'status' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['status', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.status,
        }));
    }

};

