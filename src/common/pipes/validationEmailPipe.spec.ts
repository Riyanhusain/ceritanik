import { ValidationEmployeePipe } from './validationEmployeePipe.pipe';
import { BadRequestException } from '@nestjs/common';

describe('ValidationEmployeePipe', () => {
  let validationEmailPipe: ValidationEmployeePipe;
  let mockDatabaseService: any;

  beforeEach(() => {
    mockDatabaseService = {
      users: {
        findUnique: jest.fn(),
      },
    };
    validationEmailPipe = new ValidationEmployeePipe(mockDatabaseService);
  });

  it('should be defined', () => {
    expect(validationEmailPipe).toBeDefined();
  });

  it('should throw BadRequestException if email is already in use', async () => {
    const mockValue = { email: 'test@example.com' };
    mockDatabaseService.users.findUnique.mockResolvedValue({
      email: 'test@example.com',
    });

    await expect(
      validationEmailPipe.transform(mockValue, { type: 'body' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should return value if email is not in use', async () => {
    const mockValue = { email: 'test@example.com' };
    mockDatabaseService.users.findUnique.mockResolvedValue(null);

    const result = await validationEmailPipe.transform(mockValue, {
      type: 'body',
    });

    expect(result).toEqual(mockValue);
  });

  it('should return value if metadata type is not body', async () => {
    const mockValue = { email: 'test@example.com' };

    const result = await validationEmailPipe.transform(mockValue, {
      type: 'custom',
    });

    expect(result).toEqual(mockValue);
  });
});
