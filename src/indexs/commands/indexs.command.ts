import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ConsoleService, createSpinner } from 'nestjs-console';
import { IndexsService } from '../indexs.service';

@Injectable()
export class IndexCommand {
  constructor(
    private readonly consoleService: ConsoleService,
    private readonly indexService: IndexsService,
    private readonly elasticSearch: ElasticsearchService,
  ) {
    const cli = this.consoleService.getCli();

    this.consoleService.createCommand(
      {
        command: 'index:createInDB <name> <field> <path> <title>',
        description: 'Add new index in database.',
      },
      this.createIndexInDB.bind(this),
      cli,
    );

    this.consoleService.createCommand(
      {
        command: 'index:createOnNode',
        description: 'Create cve index on Node.',
      },
      this.createIndexOnNode.bind(this),
      cli,
    );
  }

  async createIndexOnNode() {
    const spin = createSpinner();
    const { body } = await this.elasticSearch.indices.exists({
      index: process.env.CVE_INDEX,
    });
    if (body) {
      spin.fail('Index has existed on Node');
      return;
    }
    await this.elasticSearch.indices.create({
      index: process.env.CVE_INDEX,
      body: {
        mappings: {
          _doc: {
            properties: {
              name: { type: 'text' },
              description: { type: 'text' },
              id: { type: 'keyword' },
              date: { type: 'date' },
              iso_time: { type: 'date' },
              status: { type: 'keyword' },
              url: { type: 'keyword' },
              reference: { type: 'nested' },
              bot_ip: { type: 'keyword' },
              bot_code: { type: 'keyword' },
            },
          },
        },
      },
    });
    spin.succeed(
      `Created new index with name ${process.env.CVE_INDEX} on Node.`,
    );
  }

  async createIndexInDB(
    name: string,
    field: string,
    path: string,
    title: string,
  ): Promise<void> {
    const spin = createSpinner();
    const indexExisted = await this.indexService.findByName(name);
    if (indexExisted) {
      spin.fail('Index alreadly existed in database');
      return;
    }
    const { body } = await this.elasticSearch.indices.exists({ index: name });
    if (!body) {
      spin.fail('Index not found in Node');
      return;
    }
    const index = await this.indexService.create({
      name,
      search_field: field,
      title,
      path,
      created_by: null,
    });
    spin.succeed('Created index in database.');
  }
}
