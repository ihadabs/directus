import type { ConditionGeoIntersectsBBoxNode } from '@directus/data';
import { randomIdentifier } from '@directus/random';
import { expect, test } from 'vitest';
import type { GeoJSONGeometry } from 'wellknown';
import type { AbstractSqlQueryConditionNode } from '../../../../types/modifiers/filter/index.js';
import { parameterIndexGenerator } from '../../../param-index-generator.js';
import { convertGeoCondition } from './geo.js';

test('geo', () => {
	const idGen = parameterIndexGenerator();
	const randomCollection = randomIdentifier();
	const randomField = randomIdentifier();

	const gisValue: GeoJSONGeometry = {
		type: 'MultiPolygon',
		coordinates: [
			[
				[
					[102.0, 2.0],
					[103.0, 2.0],
					[103.0, 3.0],
					[102.0, 3.0],
					[102.0, 2.0],
				],
			],
			[
				[
					[100.0, 0.0],
					[101.0, 0.0],
					[101.0, 1.0],
					[100.0, 1.0],
					[100.0, 0.0],
				],
				[
					[100.2, 0.2],
					[100.2, 0.8],
					[100.8, 0.8],
					[100.8, 0.2],
					[100.2, 0.2],
				],
			],
		],
	};

	const con: ConditionGeoIntersectsBBoxNode = {
		type: 'condition-geo-intersects-bbox',
		target: {
			type: 'primitive',
			field: randomField,
		},
		operation: 'intersects_bbox',
		compareTo: gisValue,
	};

	const expectedWhere: AbstractSqlQueryConditionNode = {
		type: 'condition',
		condition: {
			type: 'condition-geo',
			target: {
				type: 'primitive',
				table: randomCollection,
				column: randomField,
			},
			operation: 'intersects_bbox',
			compareTo: {
				type: 'value',
				parameterIndex: 0,
			},
		},
		negate: false,
	};

	expect(convertGeoCondition(con, randomCollection, idGen, false)).toStrictEqual({
		where: expectedWhere,
		parameters: [gisValue],
	});
});
