# A Catch with MongoDB in Cluster Mode

Whatever name you give in `member[...].host` in `rs.initiate(...)`, a corresponding record needs to be created in `/etc/hosts` (or the platforms equivalent)- else and error occurs where connection cannot be made.
