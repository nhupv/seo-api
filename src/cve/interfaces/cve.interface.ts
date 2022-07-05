export interface Cve {
  id: string;
  url: string;
  description: string;
  status: string;
  name: string;
  date: Date;
  iso_time: Date;
  bot_code: string;
  bot_ip: string;
  reference: Array<any>;
}
export const CVE_INDEX = process.env.CVE_INDEX;
