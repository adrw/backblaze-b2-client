# cloudron-backblaze-b2-storage

Cloudron storage interface support of Backblaze B2.

## Plan

-   [x] Copy over Cloudron storage interface
-   [ ] Use [yakovkhalinsky/backblaze-b2](https://github.com/yakovkhalinsky/backblaze-b2) client to implement B2 interface with inspiration from other users of the library
    -   [gnalck/ghost-storage-b2](https://github.com/gnalck/ghost-storage-b2/blob/master/index.js)
-   [x] Publish on NPM

## Resources

-   [Cloudron Forum Post](https://forum.cloudron.io/topic/1886/is-it-possible-to-implement-custom-backup-providers/8)
-   [Cloudron storage interface](https://git.cloudron.io/cloudron/box/blob/master/src/storage/interface.js)
-   [Cloudron s3 storage implementation](https://git.cloudron.io/cloudron/box/blob/master/src/storage/s3.js)
-   [Recommended Backblaze B2 node client](https://github.com/yakovkhalinsky/backblaze-b2)
