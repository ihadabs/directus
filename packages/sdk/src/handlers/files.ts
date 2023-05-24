/**
 * Files handler
 */

import { ItemsHandler } from '../items';
import { Transport } from '../transport';
import { DefaultType, FileType, ItemInput, OneItem } from '../types';

export type FileItem<T = DefaultType> = FileType & T;

export class FilesHandler<T = DefaultType> extends ItemsHandler<FileItem<T>> {
	constructor(transport: Transport) {
		super('directus_files', transport);
	}

	async import(body: { url: string; data?: ItemInput<T> }): Promise<OneItem<NonNullable<T>>> {
		const response = await this.transport.post(`/files/import`, body);
		return response.data as OneItem<NonNullable<T>>;
	}
}