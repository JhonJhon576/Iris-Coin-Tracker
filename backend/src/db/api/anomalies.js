
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class AnomaliesDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const anomalies = await db.anomalies.create(
            {
                id: data.id || undefined,

        description: data.description
        ||
        null
            ,

        detected_at: data.detected_at
        ||
        null
            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return anomalies;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const anomaliesData = data.map((item, index) => ({
                id: item.id || undefined,

                description: item.description
            ||
            null
            ,

                detected_at: item.detected_at
            ||
            null
            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const anomalies = await db.anomalies.bulkCreate(anomaliesData, { transaction });

        return anomalies;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const anomalies = await db.anomalies.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.description !== undefined) updatePayload.description = data.description;

        if (data.detected_at !== undefined) updatePayload.detected_at = data.detected_at;

        updatePayload.updatedById = currentUser.id;

        await anomalies.update(updatePayload, {transaction});

        return anomalies;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const anomalies = await db.anomalies.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of anomalies) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of anomalies) {
                await record.destroy({transaction});
            }
        });

        return anomalies;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const anomalies = await db.anomalies.findByPk(id, options);

        await anomalies.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await anomalies.destroy({
            transaction
        });

        return anomalies;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const anomalies = await db.anomalies.findOne(
            { where },
            { transaction },
        );

        if (!anomalies) {
            return anomalies;
        }

        const output = anomalies.get({plain: true});

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

                if (filter.description) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'anomalies',
                            'description',
                            filter.description,
                        ),
                    };
                }

            if (filter.detected_atRange) {
                const [start, end] = filter.detected_atRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    detected_at: {
                    ...where.detected_at,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    detected_at: {
                    ...where.detected_at,
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
            const { rows, count } = await db.anomalies.findAndCountAll(queryOptions);

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
                        'anomalies',
                        'description',
                        query,
                    ),
                ],
            };
        }

        const records = await db.anomalies.findAll({
            attributes: [ 'id', 'description' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['description', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.description,
        }));
    }

};

