import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../src/user/user.service';
import { beforeEach, describe, it } from 'node:test';
import { User } from '../src/user/user.model';
import { expect } from 'chai';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService]
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).to.exist;
  })
})