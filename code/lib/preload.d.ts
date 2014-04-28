declare var preloader: Preloader;
declare class Preloader {
    preload(manifest: any, callback: (files: any) => void): void;
}
