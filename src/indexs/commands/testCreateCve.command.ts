import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ConsoleService, createSpinner } from 'nestjs-console';
@Injectable()
export class TestCreateCveCommand {
  constructor(
    private readonly consoleService: ConsoleService,
    private readonly elasticSearch: ElasticsearchService,
  ) {
    const cli = this.consoleService.getCli();

    this.consoleService.createCommand(
      {
        command: 'insert:cve-index',
        description: 'Add new record to cve index.',
      },
      this.createCve.bind(this),
      cli,
    );
  }

  async createCve() {
    const spin = createSpinner();
    try {
      await this.elasticSearch.index({
        index: process.env.CVE_INDEX,
        body: {
          id: 'CVE-1999-0003',
          iso_time: '2000-02-04T17:00:00+00:00',
          date: '2000-02-04T00:00:00+07:00',
          name: 'CVE-1999-0003',
          description:
            'DO NOT USE THIS CANDIDATE NUMBER.  ConsultIDs: None.  Reason: this candidate is solely about a configuration that does not directly introduce security vulnerabilities, so it is more appropriate to cover under the Common Configuration Enumeration (CCE).  Notes: the former description is: "A POP service is running.',
          status: 'Entry',
          url: 'https://cve.mitre.org/cgi-bin/cvename.cgi?name=1999-0003',
          reference: [],
          bot_code: '192.168.128.2',
          bot_ip: 'Mitre_bot',
        },
      });
      spin.succeed(`Created new cve record.`);
    } catch (e) {
      console.log(JSON.stringify(e));
      spin.fail(`Fail to create cve record.`);
    }
  }
}
