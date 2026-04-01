import os from 'node:os';

export const collectDeviceInfo = () => ({
  hostname: os.hostname(),
  platform: os.platform(),
  arch: os.arch(),
  cpus: os.cpus().length,
  totalMemoryGb: Math.round((os.totalmem() / 1024 / 1024 / 1024) * 10) / 10,
});
