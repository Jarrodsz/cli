import arg from 'arg';

import { getTemplate } from './get-template';

import type { Args, RawOptions } from '../types';

export async function parseArgumentsIntoOptions(
    rawArgs: Args
): Promise<RawOptions> {
    const args = arg(
        {
            '--git': Boolean,
            '--husky': Boolean,
            '--install': Boolean,
            '--template': String,
            '--yes': Boolean,
            '-g': '--git',
            '-h': '--husky',
            '-i': '--install',
            '-t': '--template',
            '-y': '--yes'
        },
        {
            argv: rawArgs.slice(2)
        }
    );

    const rawTemplate = args['--template'];
    const template = await getTemplate(rawTemplate);

    const project = args._[0];

    return {
        git: args['--husky'] || args['--git'] || false,
        husky: args['--husky'] || false,
        install: args['--husky'] || args['--install'] || false,
        project,
        skipPrompts: args['--yes'] || false,
        template
    };
}
