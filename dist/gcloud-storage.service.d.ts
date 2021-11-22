/// <reference types="node" />
import { Storage, Bucket } from '@google-cloud/storage';
import { GCloudStorageOptions, GCloudStoragePerRequestOptions } from './gcloud-storage.interface';
export interface UploadedFileMetadata {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: string;
    storageUrl?: string;
}
export declare class GCloudStorageService {
    private readonly options;
    private readonly logger;
    storage: Storage;
    bucket: Bucket;
    constructor(options: GCloudStorageOptions);
    upload(fileMetadata: UploadedFileMetadata, perRequestOptions?: Partial<GCloudStoragePerRequestOptions>): Promise<string>;
    getStorageUrl(filename: string, perRequestOptions?: Partial<GCloudStoragePerRequestOptions>): string;
    listFile: (bucket?: string) => Promise<import("@google-cloud/storage/build/src/file").File[]>;
    delete: (fileName: any, bucket?: string) => Promise<[import("teeny-request").Response<any>]>;
    exists: (fileName: any, bucket?: string) => Promise<[boolean]>;
}
