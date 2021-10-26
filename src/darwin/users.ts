import { nextTick } from '../common';
import { execCmd } from '../common/exec';
import { UserData } from '../common/types';

const parseUsersDarwin = (lines: string[]): UserData[] => {
  const result: UserData[] = [];
  const result_who: UserData[] = [];
  const result_w: any = {};
  let who_line: any = [];

  let is_whopart = true;
  lines.forEach(function (line) {
    if (line === '---') {
      is_whopart = false;
    } else {
      const l = line.replace(/ +/g, ' ').split(' ');

      // who part
      if (is_whopart) {
        result_who.push({
          user: l[0],
          tty: l[1],
          date: ('' + new Date().getFullYear()) + '-' + ('0' + ('JANFEBMARAPRMAYJUNJULAUGSEPOCTNOVDEC'.indexOf(l[2].toUpperCase()) / 3 + 1)).slice(-2) + '-' + ('0' + l[3]).slice(-2),
          time: l[4],
          ip: null,
          command: null
        });
      } else {
        // w part
        // split by w_pos
        result_w.user = l[0];
        result_w.tty = l[1];
        result_w.ip = (l[2] !== '-') ? l[2] : '';
        result_w.command = l.slice(5, 1000).join(' ');
        // find corresponding 'who' line
        who_line = result_who.filter(function (obj) {
          return (obj.user === result_w.user && (obj.tty.substring(3, 1000) === result_w.tty || obj.tty === result_w.tty));
        });
        if (who_line.length === 1) {
          result.push({
            user: who_line[0].user,
            tty: who_line[0].tty,
            date: who_line[0].date,
            time: who_line[0].time,
            ip: result_w.ip,
            command: result_w.command
          });
        }
      }
    }
  });
  return result;
};

export const darwinUsers = async () => {
  let result: UserData[] = [];
  const stdout = await execCmd('who; echo "---"; w -ih');
  // lines / split
  const lines = stdout.toString().split('\n');
  result = parseUsersDarwin(lines);
  return result;
};

export const users = async () => {
  await nextTick();
  return darwinUsers();
};
