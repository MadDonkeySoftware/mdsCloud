import { Command } from 'commander';
import { extendBaseCommand } from '../extend-base-command';

describe('extendBaseCommand.ts test', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('Adds the env option to the command', async () => {
    // Arrange
    const mockCommand = {
      addOption: jest.fn(),
    } as Partial<Command>;

    // Act
    extendBaseCommand(mockCommand as Command);

    // Assert
    expect(mockCommand.addOption).toHaveBeenCalledTimes(1);
    expect(mockCommand.addOption).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'The environment to utilize for this operation',
        envVar: 'MDS_ENV',
        flags: '--env <envName>',
      }),
    );
  });
});
