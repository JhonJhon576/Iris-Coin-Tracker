
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Data_sourcesDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const data_sources = await db.data_sources.create(
            {
                id: data.id || undefined,

        url: data.url
        ||
        null
            ,

        description: data.description
        ||
        null
            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return data_sources;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const data_sourcesData = data.map((item, index) => ({
                id: item.id || undefined,

                url: item.url
            ||
            null
            ,

                description: item.description
            ||
            null
            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const data_sources = await db.data_sources.bulkCreate(data_sourcesData, { transaction });

        return data_sources;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const data_sources = await db.data_sources.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.url !== undefined) updatePayload.url = data.url;

        if (data.description !== undefined) updatePayload.description = data.description;

        updatePayload.updatedById = currentUser.id;

        await data_sources.update(updatePayload, {transaction});

        return data_sources;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const data_sources = await db.data_sources.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of data_sources) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of data_sources) {
                await record.destroy({transaction});
            }
        });

        return data_sources;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const data_sources = await db.data_sources.findByPk(id, options);

        await data_sources.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await data_sources.destroy({
            transaction
        });

        return data_sources;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const data_sources = await db.data_sources.findOne(
            { where },
            { transaction },
        );

        if (!data_sources) {
            return data_sources;
        }

        const output = data_sources.get({plain: true});

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

                if (filter.url) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'data_sources',
                            'url',
                            filter.url,
                        ),
                    };
                }

                if (filter.description) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'data_sources',
                            'description',
                            filter.description,
                        ),
                    };
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
            const { rows, count } = await db.data_sources.findAndCountAll(queryOptions);

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
                        'data_sources',
                        'url',
                        query,
                    ),
                ],
            };
        }

        const records = await db.data_sources.findAll({
            attributes: [ 'id', 'url' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['url', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.url,
        }));
    }

};

