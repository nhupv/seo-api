import { Injectable } from '@nestjs/common';
import { ConsoleService, createSpinner } from 'nestjs-console';
import { Role } from 'src/roles/role.enum';
import { UsersService } from '../users.service';

@Injectable()
export class UsersCommand {
  constructor(
    private readonly consoleService: ConsoleService,
    private readonly userService: UsersService,
  ) {
    const cli = this.consoleService.getCli();

    this.consoleService.createCommand(
      {
        command: 'create:user-admin <username> <password>',
        description: 'Create new admin user!',
      },
      this.createAdminUserCommand.bind(this),
      cli,
    );

    this.consoleService.createCommand(
      {
        command: 'create:user-super-user <username> <password>',
        description: 'Create new super user.',
      },
      this.createSuperUserCommand.bind(this),
      cli,
    );
  }

  async createAdminUserCommand(email: string, password: string): Promise<void> {
    const spin = createSpinner();
    try {
      const user = await this.userService.create({
        username: email,
        password,
        email,
        age: 12,
        roles: [Role.Admin],
        fido_user: null,
      });
      spin.succeed('Created user');
    } catch (e) {
      spin.fail('Created  failed with error');
      console.log(e);
    }
  }

  async createSuperUserCommand(email: string, password: string): Promise<void> {
    const spin = createSpinner();
    const user = await this.userService.create({
      username: email,
      password,
      email,
      age: 12,
      roles: [Role.SuperUser],
      fido_user: null,
    });
    spin.succeed('Created super user.');
  }
}
