# 2020-05-04 Update: Active Development Stopped

[Backblaze announced today an S3 compatible API for B2 cloud storage](https://www.backblaze.com/blog/backblaze-b2-s3-compatible-api/), the lack thereof was the primary motivation for this project. Since their new S3 compatible API is robust and working great for my Cloudron instance, I won't be continuing work on this repo.

Anyone else is free to fork or contribute as they see fit.

- adrw

# Backblaze B2 Typescript Node.js Client Library

A thicker client for Backblaze B2 that includes the raw API as well as abstracted functions that provide richer client experince without having to think through every individual API call.

[![npm](https://img.shields.io/npm/v/backblaze-b2-client.svg?label=backblaze-b2-client)](https://www.npmjs.com/package/backblaze-b2-client)

See the examples directory for integration samples including an example implementation of Cloudron storage interface to support Backblaze B2.

## Plan

- [x] Copy over Cloudron storage interface
- [ ] Use [yakovkhalinsky/backblaze-b2](https://github.com/yakovkhalinsky/backblaze-b2) and [gideo-llc/backblaze-b2-upload-any](https://github.com/gideo-llc/backblaze-b2-upload-any) client to implement B2 interface (with inspiration from other users of the library)
  - [gnalck/ghost-storage-b2](https://github.com/gnalck/ghost-storage-b2/blob/master/index.js)
  - [UbuntuOpenStore/openstore-api](https://github.com/UbuntuOpenStore/openstore-api/blob/919c8c3c29e5f8a4764f2aa9514f43d6bacc3462/src/utils/upload.js)
- [x] Publish on NPM

## Resources

- [Cloudron Forum Post](https://forum.cloudron.io/topic/1886/is-it-possible-to-implement-custom-backup-providers/8)
- [Cloudron storage interface](https://git.cloudron.io/cloudron/box/blob/master/src/storage/interface.js)
- [Cloudron s3 storage implementation](https://git.cloudron.io/cloudron/box/blob/master/src/storage/s3.js)
- [Recommended Backblaze B2 node client](https://github.com/yakovkhalinsky/backblaze-b2)
