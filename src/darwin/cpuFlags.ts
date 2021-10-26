import { nextTick } from '../common';
import { execCmd } from '../common/exec';

export const darwinCpuFlags = async () => {
  let result = '';
  const stdout = (await execCmd('sysctl machdep.cpu.features')).toString();
  const lines = stdout.split('\n');
  if (lines.length > 0 && lines[0].indexOf('machdep.cpu.features:') !== -1) {
    result = lines[0].split(':')[1].trim().toLowerCase();
  }
  return result;
};

export const cpuFlags = async () => {
  await nextTick();
  return darwinCpuFlags();
};
