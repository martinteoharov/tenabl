-- -rsync /common /frontend/src/common
settings {
    nodaemon = true
}
sync {
    default.rsync,
    source = '/common',
    target = '/frontend/src/common',
    delay = 0,
    delete = true
}