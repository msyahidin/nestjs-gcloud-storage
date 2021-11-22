"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var GCloudStorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GCloudStorageService = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const storage_1 = require("@google-cloud/storage");
const gcloud_storage_constant_1 = require("./gcloud-storage.constant");
const utils_1 = require("./utils");
let GCloudStorageService = GCloudStorageService_1 = class GCloudStorageService {
    constructor(options) {
        this.options = options;
        this.logger = new common_1.Logger(GCloudStorageService_1.name);
        this.bucket = null;
        this.listFile = (bucket = this.options.defaultBucketname) => __awaiter(this, void 0, void 0, function* () {
            const [files] = yield this.storage.bucket(bucket).getFiles();
            return files;
        });
        this.delete = (fileName, bucket = this.options.defaultBucketname) => __awaiter(this, void 0, void 0, function* () {
            return this.storage.bucket(bucket).file(fileName).delete();
        });
        this.exists = (fileName, bucket = this.options.defaultBucketname) => __awaiter(this, void 0, void 0, function* () {
            return this.storage.bucket(bucket).file(fileName).exists();
        });
        this.logger.log(`GCloudStorageService.options ${options}`);
        this.storage = new storage_1.Storage({ keyFilename: options.keyFilename });
        const bucketName = this.options.defaultBucketname;
        this.bucket = this.storage.bucket(bucketName);
    }
    upload(fileMetadata, perRequestOptions = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const filename = utils_1.uuid();
            const gcFilename = perRequestOptions && perRequestOptions.prefix ? path_1.join(perRequestOptions.prefix, filename) : filename;
            const gcFile = this.bucket.file(gcFilename);
            perRequestOptions = Object.assign(Object.assign({}, this.options), perRequestOptions);
            const writeStreamOptions = perRequestOptions && perRequestOptions.writeStreamOptions;
            const { predefinedAcl = 'publicRead' } = perRequestOptions;
            const streamOpts = Object.assign({ predefinedAcl: predefinedAcl }, writeStreamOptions);
            const contentType = fileMetadata.mimetype;
            if (contentType) {
                streamOpts.metadata = { contentType };
            }
            return new Promise((resolve, reject) => {
                gcFile
                    .createWriteStream(streamOpts)
                    .on('error', (error) => reject(error))
                    .on('finish', () => resolve(this.getStorageUrl(gcFilename, perRequestOptions)))
                    .end(fileMetadata.buffer);
            });
        });
    }
    getStorageUrl(filename, perRequestOptions = null) {
        if (perRequestOptions && perRequestOptions.storageBaseUri) {
            return path_1.join(perRequestOptions.storageBaseUri, filename);
        }
        return 'https://storage.googleapis.com/' + path_1.join(perRequestOptions.defaultBucketname, filename);
    }
};
GCloudStorageService = GCloudStorageService_1 = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(gcloud_storage_constant_1.GCLOUD_STORAGE_MODULE_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], GCloudStorageService);
exports.GCloudStorageService = GCloudStorageService;
